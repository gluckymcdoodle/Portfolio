import random

def get_words(filename="words.txt"):
    categories = {}  #to store categories
    with open(filename, "r") as file:  #open the file in read mode
        category = None  #current category
        for line in file:  #read the file and strip spaces, convert to lowercase
            line = line.strip().lower()
            if line.endswith(":"):  #if the line ends with ':', then it's a category
                category = line[:-1]  #remove ':' and label as a category
                categories[category] = []  #create a list for this category
            elif category and line:
                categories[category].append(line)
    return categories

def show_word(word, guessed):  #display the word with _ for unguessed letters
    return " ".join(letter if letter in guessed else "_" for letter in word)

def valid_guess(guessed):  #loop until a valid guess is provided
    while True:
        guess = input("Guess a letter: ").lower()  #convert input to lowercase
        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input! Please enter a single letter.")
        elif guess in guessed:
            print(f"You've already guessed '{guess}'. Try a different letter.")
        else:
            return guess  #return valid guess

def main(categories):
    print("Welcome to the Hangman Game!")
    print("Select a category:")
    category_list = list(categories.keys())
    for i, category in enumerate(category_list, start=1): #print the categories as a numbered list
        print(f"{i}. {category.capitalize()}")
    
    while True:
        try: #choice of the category, whatever number entered is for the corresponding category, any non number or number more than the categories is error
            choice = int(input("Enter the number of your category choice: "))
            if 1 <= choice <= len(category_list):
                picked_c = category_list[choice - 1]
                break
            else:
                print("Invalid choice. Please enter a number from the list.")
        except ValueError:
            print("Invalid input! Enter a valid number.")
    
    print(f"\nYou selected '{picked_c.capitalize()}'.") #once a category is chosen, get a reandom word from the category
    word = random.choice(categories[picked_c])
    guessed = set()
    false_guess = 0
    max_guess = 6  #max allowed wrong guesses
    
    print(f"\nThe word is {len(word)} letters long.")
    while false_guess < max_guess: #ui statements
        print(f"\nCurrent word: {show_word(word, guessed)}")
        print(f"Tried letters: {', '.join(sorted(guessed)) if guessed else 'None'}")
        print(f"Tries left: {max_guess - false_guess}")
        print("-" * 80)
        
        guess = valid_guess(guessed)
        guessed.add(guess) #any valid guess is added to the list of guesses
        
        if guess in word: #if in the word, then update game accordingly otherwise update game for incorrect guess
            print(f"Good guess! The letter '{guess}' is in the word.")
            if all(letter in guessed for letter in word):
                print(f"\nCongratulations! You've guessed the word: {word}")
                break
        else:
            false_guess += 1
            print(f"Sorry, the letter '{guess}' is not in the word.")
    else:
        print(f"\nGame Over! The correct word was: {word}")
    
    if input("Play again? (y/n): ").lower() == "y": #once the game is over, ask to play again, if yes repeat the game
        main(categories)
    else:
        print("Thanks for playing! Try again soon.") #otherwise end game

if __name__ == "__main__":
    categories = get_words()  #load words from file
    main(categories)  #run the game
