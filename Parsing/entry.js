export class Entry {
    constructor(
        dictEntry, 
        definition, 
        wordType, 
        conjugation, 
        declension, 
        gender, 
        variation, 
        wordStems, 
        nounCases, 
        verbTenses, 
        displayText, 
        incorrect, 
        userAnswers
    ) {
        this.dictEntry = dictEntry; // Full string entry
        this.definition = definition; // String definition

        this.wordType = wordType; // Character for type (eg. noun or verb)
        this.conjugation = conjugation; // Integer for verb conjugation
        this.declension = declension; // Integer for noun declension.
        this.gender = gender; // Character for noun gender
        this.variation = variation; // Integer for word variation (same position in entry string for both noun and verb)
        
        this.wordStems = wordStems; // Key pieces of words to form principle parts
        this.nounCases = nounCases; // All possible noun forms
        this.verbTenses = verbTenses; // All possible verb forms
        this.displayText = displayText; // Principle parts to display for user when selecting study words

        this.incorrect = incorrect; // Boolean for if user submit all correct word forms
        this.userAnswers = userAnswers; // 2D array: array of user inputted answers per element of word form group array
                                        // (E.g. userAnswers[0][1] gives the second user answer for the present tense if verb) 
    }
}