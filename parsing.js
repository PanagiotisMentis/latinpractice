import {Endings} from "./endings.js";
import {Entry} from "./Parsing/entry.js";
import * as Utility from "./Parsing/parsingUtility.js";
import * as Indicative from "./Parsing/indicative.js";
import * as Subjunctive from "./Parsing/subjunctive.js";
import * as Participle from "./Parsing/participle.js";
import * as Infinitive from "./Parsing/infinitive.js";
import * as Imperative from "./Parsing/imperative.js";

//------------------------WORD FORMATIONS-----------------------------
//Data parsing and word inflections code here

//INFLECTIONS WHITAKERS FORMATTING
//Parts...Type...Declension...x...Declension...Person...x...x...length(str)...ending...x...Simplicity (frequency)
let suggestions = [];
let entrySuggestions = [];

function fillNounEndings(wordStems, declension, gender) {
    let nounCases = [];

    for (let i = 0; i < wordStems.length; i++) {
        if (i == 0 && wordStems[i] != "") { //ternary since only checking declension a few times.
            //Fill these endings for only the nominative singular (first in declensions)
            declension == 1 ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.FIRST[i]) : null;
            declension == 2 && gender == "M" ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.SECOND[i]) : null;
            declension == 2 && gender == "N" ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.SECOND_NEUTER[i]) : null;
            declension == 3 ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.THIRD[i]) : null;
        }
        else if (wordStems[i] != "") {
            for (let j = 1; j < 10; j++) {
                //Fill these endings for the rest of the declensions
                declension == 1 ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.FIRST[j]) : null;
                declension == 2 && gender == "M" ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.SECOND[j]) : null;
                declension == 2 && gender == "N" ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.SECOND_NEUTER[j]) : null;
                declension == 3 ? nounCases.push(wordStems[i].toLowerCase() + Endings.Nouns.THIRD[j]) : null;
            }
        }
    }

    return nounCases;
}

//------------------IMPERATIVES--------------------

function fillVerbEndings(wordStems, conjugation, gender) {
    let verbTenses = [];

    // These depend on second principle part, so inflections are more complicated. // ---INDICATIVE CONTINUING
    verbTenses = verbTenses.concat(Indicative.fillPresent(wordStems, conjugation)); // Present Act and Pass
    verbTenses = verbTenses.concat(Indicative.fillImperfect(wordStems, conjugation)); // Imperf Act and Pass
    verbTenses = verbTenses.concat(Indicative.fillFuture(wordStems, conjugation)); // Future Act and Pass

    // These only depend on third principle part, so we can use standard endings. // ---INDICATIVE COMPLETED
    verbTenses = verbTenses.concat(Indicative.fillPerfect(wordStems, gender)); // Perfect Act and Pass
    verbTenses = verbTenses.concat(Indicative.fillPluperfect(wordStems, gender)); // Pluperfect Act and Pass
    verbTenses = verbTenses.concat(Indicative.fillFuturePerfect(wordStems, gender)); // Future Perfect Act and Pass

    verbTenses = verbTenses.concat(Subjunctive.fillSubjunctive(wordStems, conjugation, gender)); // Subjucntive
    verbTenses = verbTenses.concat(Infinitive.fillInfinitive(wordStems, conjugation, gender)); // Infinitive
    verbTenses = verbTenses.concat(Participle.fillParticiple(wordStems, conjugation, gender)); // Participles
    verbTenses = verbTenses.concat(Imperative.fillImperative(wordStems, conjugation)) // Imperative

    return verbTenses;
}

function fillEndings(entry) {
    if (entry.wordType == "N") {
        entry.nounCases = fillNounEndings(entry.wordStems, entry.declension, entry.gender);
    }
    else if (entry.wordType == "V") {
        entry.verbTenses = fillVerbEndings(entry.wordStems, entry.conjugation, entry.gender);
    }
}

//----------------PARSE DICTIONARY------------------

function addEntrySuggestion(entry) {
    if (entry.wordType == "N" && entry.nounCases[0] != null) {
        entrySuggestions.push(entry);
        entry.displayText = entry.nounCases[0] + ", " + entry.nounCases[1] + " (" + entry.gender + ")";
        suggestions.push(entry.displayText);
    }
    else if (entry.wordType == "V" && entry.verbTenses != null) {
        entrySuggestions.push(entry);
        entry.displayText = entry.verbTenses[0] + ", " + entry.verbTenses[120] + ", " + entry.verbTenses[36] + ", " + entry.verbTenses[156] + " (" + entry.conjugation + ")";
        suggestions.push(entry.displayText);
    }
}

//make entry an object
export default function parseDictionary(dictionary) {
    let entries = [];
    let choppedDict = dictionary.split("\n");

    for (let i = 0; i < choppedDict.length; i++) { //Loop through every entry
        let entry = parseEntryLine(choppedDict[i]);
        entries.push(entry);
        addEntrySuggestion(entry);
    }

    return [entries, suggestions, entrySuggestions];
}

function determineEntryConjugation(entryString, variation) {
    let conjugation = null;
    if (parseInt(entryString[83]) == 3 && variation == 4) {
        conjugation = 4;
    }
    else {
        conjugation = parseInt(entryString[83]);

    }
    return conjugation
}

function parseEntryLine(entryString) {
    let entry = new Entry(); // Define empty entry object from class

    entry.dictEntry = entryString; // Full entry
    entry.wordType = entry.dictEntry[76]; // wordType

    entry.variation = parseInt(entry.dictEntry[85]); // Variation (same index for both nouns and verbs)
    if (entry.wordType == "N") { // If word is noun type
        entry.declension = parseInt(entry.dictEntry[83]); // Noun declension
        entry.gender = entry.dictEntry[87]; // Noun gender
    }
    else { // If word is not noun type (e.g. word is a verb), define verb conjugation based on variation 
        entry.conjugation = determineEntryConjugation(entry.dictEntry, entry.variation);
    }
    entry.definition = entry.dictEntry.slice(110); // Entry definition
    entry.wordStems = getWordStems(entry.dictEntry); // Entry stems from first four columns

    fillEndings(entry); // Use all entry properties to fill every possible word form

    return entry; // Return an entry object with all necessary properties
}

function getWordStems(entryString) {
    let stems = [];
    let tempWord = "";

    for (let i = 0; i <= 57; i += 19) { //splits stems every 19 characters I am a genius
        for (let j = i; j < i + 19; j++) {
            if (entryString[j] == " ") {
                break;
            }
            tempWord += entryString[j];
        }
        stems.push(tempWord);
        tempWord = "";
    }

    return stems;
}