import {Endings} from "./endings.js";
import * as Utility from "./Parsing/parsingUtility.js";
import * as Indicative from "./Parsing/indicative.js";
import * as Infinitive from "./Parsing/infinitive.js";

class Entry {
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

//------------------------WORD FORMATIONS-----------------------------
//Data parsing and word inflections code here

//INFLECTIONS WHITAKERS FORMATTING
//Parts...Type...Declension...x...Declension...Person...x...x...length(str)...ending...x...Simplicity (frequency)


//BE CAREFUL FOR IO VERBS

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

function fillPresent(wordStems, conjugation) {
    let presTenses = [];
    let presStem = wordStems[1];

    if (!Utility.isVowel(presStem[presStem.length])) { // If NOT vowel and needs filler "a". too long for ternary
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? presStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    }

    presTenses = Indicative.fillIndCont(presStem, wordStems[0], undefined, undefined, undefined, undefined);
    return presTenses;
}

function fillImperfect(wordStems, conjugation) {
    let imperfTenses = [];
    let imperfStem = wordStems[1]; //Otherwise, verb has no second principle part, so no imperf?

    if (!Utility.isVowel(imperfStem[imperfStem.length])) {
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? imperfStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
        conjugation == 4 ? imperfStem += "e" : null; //INFINITIVE STEM + "e"
    }

    imperfTenses = Indicative.fillIndCont(imperfStem, undefined, undefined, "bam", "ba");
    return imperfTenses;
}

function fillFuture(wordStems, conjugation) {
    let futureTenses = [];
    let futureStem = wordStems[1];

    if (!Utility.isVowel(futureStem[futureStem]).length) {
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? futureStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    }

    if (conjugation == 1 || conjugation == 2) {

        futureTenses = Indicative.fillIndCont(futureStem, undefined, undefined, "bo", "bi", "bu");
    }
    else {
        futureTenses = Indicative.fillIndCont(futureStem, undefined, undefined, "am", "e");
        futureTenses[7] = futureTenses[7].replace("iris", "eris");
        //just do as normal, then add "u" at end if 4th conjugation
    }

    return futureTenses;
}

function fillPerfect(wordStems, gender) {
    let tenses = Indicative.fillIndComp(wordStems, Endings.Tenses.PERFECT_ACT, Endings.Tenses.PERFECT_PASS, gender);
    return tenses;
}

function fillPluperfect(wordStems, gender) {
    let tenses = Indicative.fillIndComp(wordStems, Endings.Tenses.PLUPERF_ACT, undefined, gender);
    return tenses;
}

function fillFuturePerfect(wordStems, gender) {
    let tenses = Indicative.fillIndComp(wordStems, Endings.Tenses.FUTPERF_ACT, undefined, gender);
    tenses[11] = tenses[11].replace("erint", "erunt");

    return tenses;
}

//---------------SUBJUNCTIVE---------------

function fillSubjunctiveAct(stem, modifier) {
    let tenses = [];

    tenses.push(stem + modifier + "m");
    for (let i = 1; i < Endings.Tenses.PRES_ACT.length; i++) {
        let tense = stem + modifier + Endings.Tenses.PRES_ACT[i];
        tenses.push(tense);
    }

    return tenses;
}

function fillSubjunctiveContPass(stem, modifier) {
    let tenses = [];

    tenses.push(stem + modifier + "r");
    for (let i = 1; i < Endings.Tenses.PRES_ACT.length; i++) {
        let tense = stem + modifier + Endings.Tenses.PRES_PASS[i];
        tenses.push(tense);
    }

    return tenses;
}

function fillSubjunctiveCont(stem, modifier) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stem, modifier);
    let passTenses = fillSubjunctiveContPass(stem, modifier);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

function fillSubjunctivePerfect(stems, modifier, gender) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stems[2], modifier);
    let passTenses = Indicative.fillIndCompPass(stems[3], Endings.Tenses.PERFECT_SUBJUNCT_PASS, gender);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

function fillSubjunctivePluperfect(stems, modifier, gender) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stems[2] + "i", modifier);
    let passTenses = Indicative.fillIndCompPass(stems[3], Endings.Tenses.PLUPERF_SUBJUNCT_PASS, gender);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

function fillSubjunctive(wordStems, conjugation, gender) {
    let tenses = [];
    let presentModifier = Endings.Subjunctives.PRESENT_MODS[conjugation - 1];

    let present = fillSubjunctiveCont(wordStems[1], presentModifier);
    let imperfect = fillSubjunctiveCont(wordStems[1], Endings.Infinitives.PRES_ACT[conjugation - 1]);
    let perfect = fillSubjunctivePerfect(wordStems, "eri", gender);
    let pluperfect = fillSubjunctivePluperfect(wordStems, "sse", gender)

    tenses = tenses.concat(present);
    tenses = tenses.concat(imperfect);
    tenses = tenses.concat(perfect);
    tenses = tenses.concat(pluperfect);

    return tenses;
}

//------------------PARTICIPLES--------------------

function fillParticiplePresent(stem, conjugation, gender) {
    let cases = [];
    let conjugationMod;
    Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? conjugationMod = Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    conjugationMod == "i" ? conjugationMod += "e" : null;

    cases.push(stem + conjugationMod + "ns");
    for (let i = 1; i < Endings.Nouns.THIRD.length; i++) {
        let nCase = stem + conjugationMod + "nt" + Endings.Nouns.THIRD[i];
        cases.push(nCase);
    }

    for (let i = 0; i < Endings.Nouns.THIRD.length; i++) {
        cases.push("XXXX");
    }

    cases[6] = cases[6].substring(0, cases[6].length - 3) +
        cases[6].substring(cases[6].length - 3, cases[6].length).replace("um", "ium");

    if (gender == "N") { //The neuter nominative and accusative endings are the same
        cases[3] = cases[0]; // and the plural nominative and accusative endings end in the letter A - HI PAWS
        cases[5] = cases[5].substring(0, cases[5].length - 3) +
            cases[5].substring(cases[5].length - 3, cases[5].length).replace("tes", "tia");
        cases[8] = cases[5];
    }

    return cases;
}

function fillParticiplePerfect(stem, genderEndings) {
    let cases = [];

    for (let i = 0; i < genderEndings.length; i++) {
        cases.push("XXXX");
    }

    for (let i = 0; i < genderEndings.length; i++) {
        let nCase = stem + genderEndings[i];
        cases.push(nCase);
    }

    return cases;
}

function fillParticipleFutureAct(stem, genderEndings) {
    let cases = [];
    for (let i = 0; i < genderEndings.length; i++) {
        let nCase = stem + "ur" + genderEndings[i];
        cases.push(nCase);
    }

    return cases;
}

function fillParticipleGerundive(stem, genderEndings) {
    let cases = [];

    for (let i = 0; i < genderEndings.length; i++) {
        let nCase = stem + genderEndings[i];
        cases.push(nCase);
    }

    return cases;
}

//MAKE REPLACEFROM() funct
function fillParticipleFuture(stems, genderEndings, nomStem) {
    let cases = [];

    nomStem = Utility.replaceFrom(nomStem, nomStem.length - 1, nomStem.length, "s", "d");

    let activeCases = fillParticipleFutureAct(stems[3], genderEndings);
    let gerundiveCases = fillParticipleGerundive(nomStem, genderEndings);

    cases = cases.concat(activeCases);
    cases = cases.concat(gerundiveCases);

    return cases;
}

function fillParticiple(wordStems, conjugation, gender = "M") {
    let cases = [];
    let genderEndings = Utility.getGenderEndingArray(gender);

    let present = fillParticiplePresent(wordStems[1], conjugation, gender);
    let perfect = fillParticiplePerfect(wordStems[3], genderEndings);

    cases = cases.concat(present); //To quickly get gerundive stem from present nominative case
    let future = fillParticipleFuture(wordStems, genderEndings, cases[0]);

    cases = cases.concat(perfect);
    cases = cases.concat(future);

    return cases;
}


//----------------INFINITIVES------------------------
function fillInfinitive(wordStems, conjugation, gender) {
    let tenses = [];

    let present = Infinitive.fillInfinitivePresent(wordStems[1], conjugation);
    let perfect = Infinitive.fillInfinitivePerfect(wordStems, gender);
    let future = Infinitive.fillInfinitiveFuture(wordStems[3], gender);

    tenses = tenses.concat(present);
    tenses = tenses.concat(perfect);
    tenses = tenses.concat(future);

    return tenses;
}

//------------------IMPERATIVES--------------------

function fillImperativeAct(stem, conjugation) {
    let tenses = [];
    let conjugationMod;
    Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? conjugationMod = Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;

    let sing = stem + conjugationMod;
    conjugationMod == "e" ? conjugationMod = "i" : null;
    let plural = stem + conjugationMod + "te";

    tenses.push(sing);
    tenses.push(plural);

    return tenses;
}

function fillImperative(stems, conjugation) {
    let tenses = [];

    let activeTenses = fillImperativeAct(stems[1], conjugation);
    tenses = tenses.concat(activeTenses);

    return tenses;
}

function fillVerbEndings(wordStems, conjugation, gender) {
    let verbTenses = [];

    // These depend on second principle part, so inflections are more complicated. // ---INDICATIVE CONTINUING
    verbTenses = verbTenses.concat(fillPresent(wordStems, conjugation)); // Present Act and Pass
    verbTenses = verbTenses.concat(fillImperfect(wordStems, conjugation)); // Imperf Act and Pass
    verbTenses = verbTenses.concat(fillFuture(wordStems, conjugation)); // Future Act and Pass

    // These only depend on third principle part, so we can use standard endings. // ---INDICATIVE COMPLETED
    verbTenses = verbTenses.concat(fillPerfect(wordStems, gender)); // Perfect Act and Pass
    verbTenses = verbTenses.concat(fillPluperfect(wordStems, gender)); // Pluperfect Act and Pass
    verbTenses = verbTenses.concat(fillFuturePerfect(wordStems, gender)); // Future Perfect Act and Pass

    verbTenses = verbTenses.concat(fillSubjunctive(wordStems, conjugation, gender)); // Subjucntive
    verbTenses = verbTenses.concat(fillInfinitive(wordStems, conjugation, gender)); // Infinitive
    verbTenses = verbTenses.concat(fillParticiple(wordStems, conjugation, gender)); // Participles
    verbTenses = verbTenses.concat(fillImperative(wordStems, conjugation)) // Imperative

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