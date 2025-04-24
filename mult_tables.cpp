#include <mpi.h> 

#include <iostream> 

#include <set> 

#include <vector> 

#include <algorithm> 

 

// Set to store values 

std::set<int> localSet; 

 

int calcValueFromIdx(int idx, uint64_t chunkLen) 

{ 

    int row = 0; 

    int pos = idx; 

    int curN = chunkLen; 

 

    while (pos >= curN) 

    { 

        row++; 

        pos -= curN; 

        curN--; 

    } 

 

    int col = chunkLen - curN + pos; 

    return (row + 1) * (col + 1); 

} 

 

int main(int argc, char **argv) 

{ 

    int my_rank, p; 

    double max_time; 

    MPI_Init(&argc, &argv); 

    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank); 

    MPI_Comm_size(MPI_COMM_WORLD, &p); 

 

    if (argc < 2) 

    { 

        if (my_rank == 0) 

            std::cerr << "Usage: " << argv[0] << " <n>" << std::endl; 

        MPI_Finalize(); 

        return 1; 

    } 

 

    double time = -MPI_Wtime(); 

 

    uint64_t n = std::stoi(argv[1]); 

    uint64_t globalElems = n * (n + 1) / 2; 

 

    int baseElems = globalElems / p; 

    int remainder = globalElems % p; 

 

    int numElems = baseElems + (my_rank < remainder ? 1 : 0); 

    int startIdx = my_rank * baseElems + std::min(my_rank, remainder); 

 

    for (int i = 0; i < numElems; ++i) 

    { 

        int val = calcValueFromIdx(startIdx + i, n); 

        localSet.insert(val); 

    } 

 

    // Convert the set into a vector for MPI communication 

    std::vector<int> localVec(localSet.begin(), localSet.end()); 

 

    // Tree-style merging: processes merge their vectors in rounds 

    int step = 1; 

    while (step < p) { 

        if (my_rank % (2 * step) == 0) { 

            int partner = my_rank + step; 

            if (partner < p) { 

                // Receive partner's vector and merge 

                int partnerSize; 

                MPI_Recv(&partnerSize, 1, MPI_INT, partner, my_rank+1, MPI_COMM_WORLD, MPI_STATUS_IGNORE); 

                std::vector<int> recvVec(partnerSize); 

                MPI_Recv(recvVec.data(), partnerSize, MPI_INT, partner, my_rank+2, MPI_COMM_WORLD, MPI_STATUS_IGNORE); 

                 

                // Create merged vector 

                std::vector<int> mergedVec; 

                mergedVec.reserve(localVec.size() + recvVec.size()); 

                 

                // Since vectors are already sorted, use set_union to merge them and remove duplicates 

                std::set_union(localVec.begin(), localVec.end(), recvVec.begin(), recvVec.end(), std::back_inserter(mergedVec)); 

 

                // Update local vector 

                localVec = std::move(mergedVec); 

            } 

        } else { 

            // Send local vector to the partner and exit 

            int partner = my_rank - step; 

            int localSize = localVec.size(); 

 

            MPI_Send(&localSize, 1, MPI_INT, partner, partner+1, MPI_COMM_WORLD); 

            MPI_Send(localVec.data(), localSize, MPI_INT, partner, partner+2, MPI_COMM_WORLD); 

 

            break; 

        } 

        step *= 2; 

    } 

 

    time += MPI_Wtime(); 

 

    MPI_Reduce (&time, &max_time, 1, MPI_DOUBLE, MPI_MAX, 0, MPI_COMM_WORLD); 

 

    // Print the number of unique values 

    if (my_rank == 0) 

    { 

        std::cout << "Number of unique values: " << localVec.size() << std::endl; 

        std::cout << "Time: " << max_time << " seconds" << std::endl; 

    } 

 

    MPI_Finalize(); 

    return 0; 

} 
