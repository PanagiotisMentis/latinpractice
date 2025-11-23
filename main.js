import parseDictionary from "./parsing.js";
import {Endings} from "./endings.js";

let globalEntries = [];

const dictUrl =
    "https://raw.githubusercontent.com/CeleryMan15/words/refs/heads/main/DICTLINE.txt";

const mainMenu = document.getElementById("study_words_menu");
const verbsScreen = document.getElementById("verbs_screen")
const nounsScreen = document.getElementById("nouns_screen");
const resultsScreen = document.getElementById("results_screen") 

const studyWordSubmitButton = document.getElementById("submit_word_search_input");
studyWordSubmitButton.addEventListener ("click", submitStudyWord);

const beginPracticingButton = document.getElementById("begin_practicing_button");
beginPracticingButton.addEventListener("click", showNextStudyScreen);

const studyWordsUl = document.getElementById("study_words_list");
const wordSearchBox = document.getElementById("word_search_box");
const wordSuggestions = document.getElementById("suggestions");

const resultsWordsUl = document.getElementById("results_words_list");

const submitVerbsButton = document.getElementById("check_verbs_button");
submitVerbsButton.addEventListener("click", checkVerbForms);
const nextWordVerbsButton = document.getElementById("next_word_verbs_button");
nextWordVerbsButton.addEventListener("click", showNextStudyScreen);

const returnMainMenuButton = document.getElementById("return_main_menu_button");
returnMainMenuButton.addEventListener("click", returnMainMenu);

const verbStudyWord = document.getElementById("verb_study_word_principle_parts");
const selectGenderDropdown = document.getElementById("select_gender_dropdown");
const selectPersonDropdown = document.getElementById("select_person_dropdown");
const selectNumberDropdown = document.getElementById("select_number_dropdown");

const nounStudyWord = document.getElementById("noun_study_word_principle_parts");

const submitNounsButton = document.getElementById("check_nouns_button");
submitNounsButton.addEventListener("click", checkNounForms);
const nextWordNounsButton = document.getElementById("next_word_nouns_button");
nextWordNounsButton.addEventListener("click", showNextStudyScreen);

let suggestions = [];
let entrySuggestions = [];

let studyWords = [];
let availableStudyWords = [];

let currentStudyWord;

wordSearchBox.addEventListener('keydown', (e) => {
    const searchInput = wordSearchBox.value.toLowerCase();
    wordSuggestions.innerHTML = '';

    let displayedSuggestions = [];

    if (e.key == "Enter") {
        submitStudyWord();
    }

    if (searchInput) {
        for (let i = 0; i < suggestions.length; i++) {
            if (suggestions[i].toLowerCase().includes(searchInput) && displayedSuggestions.length <= 10) {
                displayedSuggestions.push(suggestions[i]);
            }
        }

        for (let i = 0; i < displayedSuggestions.length; i++) {
            const suggestionDiv = document.createElement("input");

            suggestionDiv.classList.add("word_suggestion");
            suggestionDiv.type = "submit";
            suggestionDiv.value = displayedSuggestions[i];

            suggestionDiv.onclick = function() {
                wordSearchBox.value = displayedSuggestions[i];
                for (let j = 0; j < displayedSuggestions.length; j++) { //Delete all created buttons
                    wordSuggestions.firstElementChild.remove();
                }
                studyWordSubmitButton.focus();
            };

            wordSuggestions.appendChild(suggestionDiv); // Add button as a viewable option
        }
        wordSuggestions.style.display = 'block'; // Line up suggestions vertically
    }
    else {
        wordSuggestions.style.display = "none"; //Don't show suggestions if we don't need to
    }
});

function handleRemoveStudyWord(studyWordElement, index) {
    studyWordElement.onmouseover = function () {
        if (studyWordElement.childElementCount == 0) { // If the element has no child icon
            trashIcon = document.createElement("i"); // Add trash icon
            trashIcon.classList.add("bi", "bi-trash");
            studyWordElement.appendChild(trashIcon);
            studyWordElement.style.color = "grey";
        }
    }

    studyWordElement.onmouseleave = function () {
        studyWordElement.firstElementChild.remove(); //Remove the existing trash icon
        studyWordElement.style.color = "";
    }

    studyWordElement.onclick = function () {
        studyWordElement.remove(); // Remove the word from the study words list
        let nIndex = studyWords.indexOf(entrySuggestions[index]);
        availableStudyWords.splice(nIndex, 1);
        studyWords.splice(nIndex, 1);
    }
}

function addStudyWordListElement(studyWordElement, index) {
    studyWordElement.type = "submit";
    studyWordElement.classList.add("list-group-item", "study-list-element");
    studyWordElement.innerHTML = suggestions[index] + " - " + entrySuggestions[index].definition;
    studyWordsUl.appendChild(studyWordElement);
}

function addResultsWordListElement(resultsWordElement, index, incorrect) {
    resultsWordElement.classList.add("list-group-item");
    resultsWordElement.type = "submit";
    resultsWordElement.innerHTML = studyWords[index].displayText + " - " + studyWords[index].definition;

    incorrect ? resultsWordElement.classList.add("results-list-incorrect") : resultsWordElement.classList.add("results-list-correct");

    resultsWordsUl.appendChild(resultsWordElement);
}

function handleRevisitAnswers(resultsWordElement, entry) {
    resultsWordElement.onmouseover = function () {
        if (resultsWordElement.childElementCount == 0) {
            let originalText = resultsWordElement.innerHTML;
            resultsWordElement.innerHTML = "<i class='bi bi-arrow-right' style='color: black'></i>  " + originalText;
            resultsWordElement.style.color = "grey";
        }
    }

    resultsWordElement.onmouseleave = function () {
        resultsWordElement.firstElementChild.remove();
        resultsWordElement.style.color = "";
    }
    resultsWordElement.onclick = function () {
        currentStudyWord = entry;
        entry.wordType == "N" ? showNounScreen() : showVerbScreen();
    }
}

function fillResultsList() {
    for (let i = 0; i < resultsWordsUl.children.length; i++) {
        resultsWordsUl.removeChild(resultsWordsUl.lastChild);
    }

    for (let i = 0; i < studyWords.length; i++) {
        const resultsWordElement = document.createElement("li");
        addResultsWordListElement(resultsWordElement, i, studyWords[i].incorrect);
        handleRevisitAnswers(resultsWordElement, studyWords[i]);
    }
}

function submitStudyWord() {
    let index = suggestions.indexOf(wordSearchBox.value);
    studyWords.push(entrySuggestions[index]);
    availableStudyWords.push(entrySuggestions[index]);

    const studyWordElement = document.createElement("li");
    addStudyWordListElement(studyWordElement, index);
    handleRemoveStudyWord(studyWordElement, index);

    wordSearchBox.focus();
    wordSearchBox.value = ""; //MUST KEEP AT END OF FUNCTION
}

function resetAllInputs() {
    let inputForms = document.getElementsByTagName("input");
    for (let i = 0; i < inputForms.length; i++) {
        inputForms[i].value = "";
        inputForms[i].style.backgroundColor = "";
        inputForms[i].readOnly = false;
        selectGenderDropdown.disabled = false;
        selectPersonDropdown.disabled = false;
        selectNumberDropdown.disabled = false;
    }
}

function fillPreviousVerbType(formClass, i) {
    var allForms = document.getElementsByClassName(formClass);
    for (let j = 0; j < allForms.length; j++) {
        if (currentStudyWord.userAnswers[i][j] != null) {
            allForms.item(j).value += currentStudyWord.userAnswers[i][j];
        }
    }
}

function fillPreviousVerbForms() {
    const formClassNames = [
        "indicative_continuing", 
        "indicative_completed", 
        "subjunctive", 
        "imperative", 
        "infinitive", 
        "participle"
    ];

    for (let i = 0; i < currentStudyWord.userAnswers.length; i++) {
        fillPreviousVerbType(formClassNames[i], i);
    }
    checkVerbForms();
}

function clearVerbScreen() {
    verbsScreen.hidden = false;
    mainMenu.hidden = true;
    nounsScreen.hidden = true;
    resultsScreen.hidden = true;

    resetAllInputs();
    if (availableStudyWords.length > 0) {
        submitVerbsButton.hidden = false;
        nextWordVerbsButton.hidden = true;
    }
    else {
        fillPreviousVerbForms();
    }

    verbStudyWord.innerHTML = currentStudyWord.verbTenses[0] + ", " + currentStudyWord.verbTenses[120] + ", " + currentStudyWord.verbTenses[36] + ", " + currentStudyWord.verbTenses[156] + " (" + currentStudyWord.conjugation + ")";
}

function fillPreviousNounForms() {
    var allForms = document.getElementsByClassName("noun_form");
    for (let i = 0; i < currentStudyWord.userAnswers.length; i++) {
        for (let j = 0; j < allForms.length; j++) {
            if (currentStudyWord.userAnswers[i][j] != null) {
                allForms.item(j).value += currentStudyWord.userAnswers[i][j];
            }
        }
    }
    checkNounForms(); // Fill forms with previous answers, then re-check
}

function clearNounScreen() {
    nounsScreen.hidden = false;
    verbsScreen.hidden = true;
    mainMenu.hidden = true;
    resultsScreen.hidden = true;

    resetAllInputs();
    if (availableStudyWords.length > 0) {
        submitNounsButton.hidden = false;
        nextWordNounsButton.hidden = true;
    }
    else {
        fillPreviousNounForms();
    }

    nounStudyWord.innerHTML = currentStudyWord.nounCases[0] + ", " + currentStudyWord.nounCases[1] + " (" + currentStudyWord.gender + ")";
}

function showVerbScreen() {
    clearVerbScreen();
}

function showNounScreen() {
    clearNounScreen();
}

function displayCurrentStudyWord() {
    if (currentStudyWord.wordType == "N" && currentStudyWord.nounCases[0] != null) {
        showNounScreen();
    }
    else if (currentStudyWord.wordType == "V" && currentStudyWord.verbTenses != null) {
        showVerbScreen();
    }
}

function pickRandomStudyWord() {
    let pickedEntry = availableStudyWords[Math.floor(Math.random() * availableStudyWords.length)];
    currentStudyWord = pickedEntry;
    displayCurrentStudyWord();
}

function returnMainMenu() {
    resetAvailableWords();
    resultsScreen.hidden = true;
    verbsScreen.hidden = true;
    nounsScreen.hidden = true;
    mainMenu.hidden = false;
}

function resetAvailableWords() {
    for (let i = 0; i < studyWords.length; i++) {
        availableStudyWords.push(studyWords[i]);
    }
}

function displayResultsScreen() {
    fillResultsList();
    mainMenu.hidden = true;
    verbsScreen.hidden = true;
    nounsScreen.hidden = true;
    resultsScreen.hidden = false;
}

function showNextStudyScreen() {
    availableStudyWords.length > 0 ? pickRandomStudyWord() : displayResultsScreen();
}

function checkVerbTenses(startIndex, endIndex, forms, verbTenses, indexMod) {
    let incorrectAnswers = [];

    for (let i = startIndex; i < endIndex; i += 6) { // Check Indicative Continuings
        let j = Math.round((i / 6) - 0.34 - indexMod); // - 0.34 to ensure that it rounds down
        forms[j] != verbTenses[i] ? incorrectAnswers.push(j) : null;
    }

    return incorrectAnswers;
}

function checkInfinitiveTenses(forms, verbTenses) {
    let incorrectAnswers = [];

    for (let i = 120; i < 126; i++) { // Check Infinitives
        let j = i - 120;
        forms[j] != verbTenses[i] ? incorrectAnswers.push(j) : null;
    }

    return incorrectAnswers;
}

function checkParticipleCases(forms, verbTenses) {
    let incorrectAnswers = [];

    for (let i = 126; i < 186; i += 10) { // Check Participles
        let j = ((i + 4) / 10) - 13;
        forms[j] != verbTenses[i] ? incorrectAnswers.push(j) : null;
    }

    return incorrectAnswers;
}

function combineIncorrects(continuingIncorrects, completedIncorrects, subjunctiveIncorrects, infinitiveIncorrects, participleIncorrects) {
    let incorrectAnswers = [];

    incorrectAnswers = incorrectAnswers.concat(continuingIncorrects);
    incorrectAnswers = incorrectAnswers.concat(completedIncorrects);
    incorrectAnswers = incorrectAnswers.concat(subjunctiveIncorrects);
    incorrectAnswers = incorrectAnswers.concat(infinitiveIncorrects);
    incorrectAnswers = incorrectAnswers.concat(participleIncorrects);
    
    return incorrectAnswers;
}

function displayIncorrectImperativeAnswers(incorrects, verbTenses, pluralModifier) {
    var allForms = document.getElementsByClassName("imperative");
    if (incorrects.includes(0)) {
        allForms[0].style.backgroundColor = "#FF7F7F";
        allForms[0].value += " *" + verbTenses[verbTenses.length - pluralModifier]; // display actual answer from entry.verbTenses     
    }
    else {
        allForms[0].style.backgroundColor = "#8AFF92"; // Mark as green for correct
    }
}

function displayIncorrectParticipleAnswers(incorrects, verbTenses) {
    var allForms = document.getElementsByClassName("participle");
    for (let i = 0; i < 6; i++) {
        if(incorrects.includes(i)) {
            allForms[i].style.backgroundColor = "#FF7F7F";
            allForms[i].value += " *" + verbTenses[(i*10) + 126]; // display actual answer from entry.verbTenses     
        }
        else {
            allForms[i].style.backgroundColor = "#8AFF92"; // Mark as green for correct
        }
    }
}

function displayIncorrectInfinitiveAnswers(incorrects, verbTenses) {
    var allForms = document.getElementsByClassName("infinitive");
    for (let i = 0; i < 6; i++) {
        if(incorrects.includes(i)) {
            allForms[i].style.backgroundColor = "#FF7F7F";
            allForms[i].value += " *" + verbTenses[i + 120]; // display actual answer from entry.verbTenses     
        }
        else {
            allForms[i].style.backgroundColor = "#8AFF92"; // Mark as green for correct
        }
    }
}

function displayIncorrectVerbAnswers(formName, finalIndex, startIndexModifier, incorrects, verbTenses) {
    var allForms = document.getElementsByClassName(formName); // Get all input fields from tense
    for (let i = 0; i < finalIndex; i++) { // Indexes match amount of inputs for each word type.
        if (incorrects.includes(i)) { // (If any of these indexes were flagged as incorrect earlier)
            allForms[i].style.backgroundColor = "#FF7F7F";
            allForms[i].value += " *" + verbTenses[(i * 6) + startIndexModifier]; // display actual answer from entry.verbTenses
        }
        else {
            allForms[i].style.backgroundColor = "#8AFF92"; // Mark as green for correct
        }

        //Enable button to continue and disable all other interactions on page.
        allForms[i].readOnly = true;
        submitVerbsButton.hidden = true;
        nextWordVerbsButton.hidden = false;

        selectGenderDropdown.disabled = true;
        selectPersonDropdown.disabled = true;
        selectNumberDropdown.disabled = true;
    }
}

function removeAvailableStudyWord() {
    const index = availableStudyWords.indexOf(currentStudyWord);
    if (index > -1) { // only splice array when item is found
        availableStudyWords.splice(index, 1); // 2nd parameter means remove one item only
    }
}

function checkVerbAnswers(person, number, formsIndicativeContinuing, formsIndicativeCompleted, formsSubjunctive, formsInfinitive, formsParticiple, formsImperative) {
    let startIndex = 0;
    let numberImperativeModifier = 2;
    let verbTenses = currentStudyWord.verbTenses;

    if (number == "Sing") {
        startIndex = Number(person) - 1;
    }
    else {
        startIndex = 3 + Number(person) - 1;
        numberImperativeModifier = 1;
    }

    let continuingIncorrects = checkVerbTenses(startIndex, 36, formsIndicativeContinuing, verbTenses, 0);

    let completedIncorrects = checkVerbTenses(36, 72, formsIndicativeCompleted, verbTenses, 6);
    let subjunctiveIncorrects = checkVerbTenses(72, 120, formsSubjunctive, verbTenses, 12);
    
    let infinitiveIncorrects = checkInfinitiveTenses(formsInfinitive, verbTenses);
    let participleIncorrects = checkParticipleCases(formsParticiple, verbTenses);

    let incorrectAnswers = combineIncorrects(continuingIncorrects, completedIncorrects, subjunctiveIncorrects, infinitiveIncorrects, participleIncorrects);
    let imperativeIncorrects = [];
    formsImperative[0] != verbTenses[186] ? incorrectAnswers.push(formsImperative[0]) && imperativeIncorrects.push(0) : null;

    currentStudyWord.incorrect = incorrectAnswers.length > 0;

    displayIncorrectVerbAnswers("indicative_continuing", 6, startIndex, continuingIncorrects, verbTenses);
    displayIncorrectVerbAnswers("indicative_completed", 6, startIndex + 36 , completedIncorrects, verbTenses);
    displayIncorrectVerbAnswers("subjunctive", 8, startIndex + 72, subjunctiveIncorrects, verbTenses);

    displayIncorrectInfinitiveAnswers(infinitiveIncorrects, verbTenses);
    displayIncorrectParticipleAnswers(participleIncorrects, verbTenses);

    displayIncorrectImperativeAnswers(imperativeIncorrects, verbTenses, numberImperativeModifier);

    removeAvailableStudyWord();
}

function saveCurrentStudyWordForms(forms) {
    currentStudyWord.userAnswers = [];
    for (let i = 0; i < forms.length; i++) {
        currentStudyWord.userAnswers.push([]);
        for (let j = 0; j < forms[i].length; j++) {
            currentStudyWord.userAnswers[i].push(forms[i][j]);
        }
    }

}

function checkVerbForms() {
    const formsIndicativeContinuing = collect_forms("indicative_continuing");
    const formsIndicativeCompleted = collect_forms("indicative_completed");
    const formsSubjunctive = collect_forms("subjunctive");
    const formsImperative = collect_forms("imperative");
    const formsInfinitive = collect_forms("infinitive");
    const formsParticiple = collect_forms("participle");

    saveCurrentStudyWordForms([formsIndicativeContinuing, formsIndicativeCompleted, formsSubjunctive, formsImperative, formsInfinitive, formsParticiple]);
    
    currentStudyWord.gender = selectGenderDropdown.value;
    fillEndings(currentStudyWord);
    checkVerbAnswers(selectPersonDropdown.value, selectNumberDropdown.value, formsIndicativeContinuing, formsIndicativeCompleted, formsSubjunctive, formsInfinitive, formsParticiple, formsImperative);
}

function displayIncorrectNounAnswers(formName, incorrects) {
    var allForms = document.getElementsByClassName(formName);
    for (let i = 0; i < Endings.Nouns.FIRST.length; i++) { //Change loop max to Endings.Nouns.FIRST.length.
        if (incorrects.includes(i)) {
            allForms[i].style.backgroundColor = "#FF7F7F";
            allForms[i].value += " *" + currentStudyWord.nounCases[i];
        }
        else {
            allForms[i].style.backgroundColor = "#8AFF92";
        }

        allForms[i].readOnly = true;
        submitNounsButton.hidden = true;
        nextWordNounsButton.hidden = false;
    }
}

function checkNounAnswers(nounForms) {
    let incorrectAnswers = [];
    for (let i = 0; i < currentStudyWord.nounCases.length; i++) {
        nounForms[i] != currentStudyWord.nounCases[i] ? incorrectAnswers.push(i) : null;
    }
    return incorrectAnswers;
}

function checkNounForms() {
    const formsNoun = collect_forms("noun_form");

    let incorrectAnswers = checkNounAnswers(formsNoun);
    currentStudyWord.incorrect = incorrectAnswers.length > 0;

    displayIncorrectNounAnswers("noun_form", incorrectAnswers);
    saveCurrentStudyWordForms([formsNoun]);

    removeAvailableStudyWord();
}

function collect_forms(formClass) {
    var finalForms = [];
    var allForms = document.getElementsByClassName(formClass); 
    for (let i = 0; i < allForms.length; i++) {
        if (allForms[i].value !== "") {
            finalForms.push(allForms[i].value);
        }
        else {
            finalForms.push(undefined);
        }
    }
    return finalForms;
}

function initUI() {
    mainMenu.hidden = true;
    verbsScreen.hidden = true;
    nounsScreen.hidden = true;
    resultsScreen.hidden = true;
    selectGenderDropdown.disabled = false;
    selectPersonDropdown.disabled = false;
    selectNumberDropdown.disabled = false;
}

//------------------------WORD FORMATIONS-----------------------------
//Data parsing and word inflections code here

//INFLECTIONS WHITAKERS FORMATTING
//Parts...Type...Declension...x...Declension...Person...x...x...length(str)...ending...x...Simplicity (frequency)


//BE CAREFUL FOR IO VERBS

async function getDictionary() {
    let data = await fetch(dictUrl); // Wait until URL data is fetched.
    let globalDictionary = await data.text(); // Wait until text is loaded from URL data.

    let parsedData = parseDictionary(globalDictionary); // Parse all dictionary data into useable word forms.
    globalEntries = parsedData[0];
    suggestions = parsedData[1];
    entrySuggestions = parsedData[2];

    mainMenu.hidden = false; //Finally display GUI for users.
}

initUI();
getDictionary();