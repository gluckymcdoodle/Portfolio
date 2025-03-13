import java.io.*;
import java.util.*;

public class HangmanGame {
    
    // Load words from file into categories
    public static Map<String, List<String>> getWords(String filename) {
        Map<String, List<String>> categories = new HashMap<>(); //to store categories, using hashmap because its easier to map categories with words
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) { //open the file in read mode
            String category = null; //init current category
            String line;
            while ((line = br.readLine()) != null) { //read the file and strip spaces, convert to lowercase
                line = line.trim().toLowerCase();
                if (line.endsWith(":")) { //if the line ends with ':', then it's a category
                    category = line.substring(0, line.length() - 1); //remove ':' and label as a category
                    categories.put(category, new ArrayList<>()); //create a list for this category
                } else if (category != null && !line.isEmpty()) {
                    categories.get(category).add(line);
                }
            }
        } catch (IOException e) { //error check for fiule not reading properly !!!
            System.out.println("Error reading file.... " + e.getMessage());
        }
        return categories;
    }

    //display the word with _ for unguessed letters yeah buddy
    public static String showWord(String word, Set<Character> guessed) {
        StringBuilder display = new StringBuilder();
        for (char letter : word.toCharArray()) {
            display.append(guessed.contains(letter) ? letter : "_").append(" ");
        }
        return display.toString().trim();
    }

    //loop until a valid guess is provided, error check for invalid inputss
    public static char validGuess(Set<Character> guessed, Scanner scanner) {
        while (true) {
            System.out.print("Guess a letter: ");
            String input = scanner.next().toLowerCase();
            if (input.length() != 1 || !Character.isLetter(input.charAt(0))) { //length isnt one, or not a letter
                System.out.println("Invalid input! Please enter a single letter.");
            } else if (guessed.contains(input.charAt(0))) {
                System.out.println("You've already guessed '" + input + "'. Try a different letter.");
            } else {
                return input.charAt(0); //return valid guess
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<String, List<String>> categories = getWords("words.txt"); //load words.txt
        
        if (categories.isEmpty()) {
            System.out.println("No words found. Ensure the file format is correct.");
            return;
        }
        
        System.out.println("Welcome to the Hangman Game!");
        System.out.println("Select a category:");
        
        List<String> categoryList = new ArrayList<>(categories.keySet());
        for (int i = 0; i < categoryList.size(); i++) { //print the categories as a numbered list
            System.out.println((i + 1) + ". " + categoryList.get(i).substring(0, 1).toUpperCase() + categoryList.get(i).substring(1));
        }
        
        String pickedCategory;
        while (true) { //enter category check errors for trash inputs
            try {
                System.out.print("Enter the number of your category choice: ");
                int choice = Integer.parseInt(scanner.next());
                if (choice >= 1 && choice <= categoryList.size()) {
                    pickedCategory = categoryList.get(choice - 1);
                    break;
                } else {
                    System.out.println("Invalid choice. Please enter a number from the list.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input! Enter a valid number.");
            }
        }
        //you selected this category
        System.out.println("\nYou selected '" + pickedCategory.substring(0, 1).toUpperCase() + pickedCategory.substring(1) + "'.");
        List<String> words = categories.get(pickedCategory);
        String word = words.get(new Random().nextInt(words.size())); //randomly select a word
        Set<Character> guessed = new HashSet<>();
        int falseGuesses = 0; //init incorrect guesses
        final int maxGuesses = 6; //maximum allowed incorrect guesses
        
        System.out.println("\nThe word is " + word.length() + " letters long.");
        while (falseGuesses < maxGuesses) { //as long as you havent lost yet, keep going and print out menu stuff
            System.out.println("\nCurrent word: " + showWord(word, guessed));
            System.out.println("Tried letters: " + (guessed.isEmpty() ? "None" : guessed));
            System.out.println("Tries left: " + (maxGuesses - falseGuesses));
            System.out.println("-".repeat(80));
            
            char guess = validGuess(guessed, scanner);
            guessed.add(guess);
            
            if (word.indexOf(guess) >= 0) { // If the guessed letter is in the word
                System.out.println("Good guess! The letter '" + guess + "' is in the word.");
                if (word.chars().allMatch(c -> guessed.contains((char) c))) { //if you guess the entire word, then you win!
                    System.out.println("\nCongratulations! You've guessed the word: " + word);
                    break; //end game with win, then play again message
                }
            } else {
                falseGuesses++; //incorrect !
                System.out.println("Sorry, the letter '" + guess + "' is not in the word.");
            }
        }
        
        if (falseGuesses == maxGuesses) { //reached max guesses
            System.out.println("\nGame Over! The correct word was: " + word);
        }
        
        System.out.print("Play again? (y/n): ");
        if (scanner.next().toLowerCase().startsWith("y")) {
            main(args); //if y, restart main to play again
        } else {
            System.out.println("Thanks for playing! Try again soon."); //otherwise end 
        }
        
        scanner.close();// yep
    }
}