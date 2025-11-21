//------------------------WORD FORMATIONS-----------------------------
//Data parsing and word inflections code here

//INFLECTIONS WHITAKERS FORMATTING
//Parts...Type...Declension...x...Declension...Person...x...x...length(str)...ending...x...Simplicity (frequency)


//BE CAREFUL FOR IO VERBS

const GLOBAL_VOWELS = "aeiou";


function replaceFrom(string, indexStart, indexEnd, existingSubStr, replacementSubStr) {
    let str = string;

    str = str.substring(0, indexStart) +
        str.substring(indexStart, indexEnd).replace(existingSubStr, replacementSubStr);

    return str;
}

function isVowel(char) {
    let vowels = GLOBAL_VOWELS;
    let isVowel = vowels.indexOf(char) > 0; // If char appeasr in vowel string at some point, 
    // make it true; otherwise, make it false.
    return isVowel;
}

function matchGenderEnding(gender, plural, accusative) {
    let ending = "";
    let index = 0;

    if (accusative) {
        plural == true ? index = 8 : index = 3;
    }
    else {
        plural == true ? index = 5 : index = 0;
    }

    gender == "M" ? ending = Endings.Nouns.SECOND[index] : null;
    gender == "F" ? ending = Endings.Nouns.FIRST[index] : null;
    gender == "N" ? ending = Endings.Nouns.SECOND_NEUTER[index] : null;

    return ending;
}

function getGenderEndingArray(gender) {
    let endings = [];

    gender == "M" ? endings = Endings.Nouns.SECOND : null;
    gender == "F" ? endings = Endings.Nouns.FIRST : null;
    gender == "N" ? endings = Endings.Nouns.SECOND_NEUTER : null;

    return endings;
}

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

//---------------INDICATIVE CONTINUING---------------

function fillIndContAct(
    stem, 
    differentFirstStem = stem, 
    differentLastStem = stem, 
    differentFirst = Endings.Tenses.PRES_ACT[0], 
    differentMiddle = "", 
    differentLast = differentMiddle
) {
    let tenses = [];

    tenses.push(differentFirstStem + differentFirst); // First person sing active
    for (let i = 1; i < Endings.Tenses.PRES_ACT.length - 1; i++) { // Active
        let tense = stem + differentMiddle + Endings.Tenses.PRES_ACT[i];
        tenses.push(tense);
    }
    //Third person plural active
    let lastTenseAct = differentLastStem + differentLast + Endings.Tenses.PRES_ACT[Endings.Tenses.PRES_ACT.length - 1];

    lastTenseAct = lastTenseAct.substring(0, lastTenseAct.length - 6) +
        lastTenseAct.substring(lastTenseAct.length - 6, lastTenseAct.length).replace("int", "iunt");

    tenses.push(lastTenseAct);

    return tenses;
}

function fillIndContPass(stem, differentFirstStem = stem, differentLastStem = stem, differentFirst = Endings.Tenses.PRES_ACT[0], differentMiddle = "", differentLast = differentMiddle) {
    let tenses = [];

    //First person sing passive
    tenses.push(differentFirstStem + differentFirst.replace("am", "a") + Endings.Tenses.PRES_PASS[0]);
    for (let i = 1; i < Endings.Tenses.PRES_PASS.length - 1; i++) { // Passive
        let tense = stem + differentMiddle + Endings.Tenses.PRES_PASS[i];
        tenses.push(tense.replace("int", "iunt"));
    }
    //Third person plural passive
    let lastTensePass = differentLastStem + differentLast + Endings.Tenses.PRES_PASS[Endings.Tenses.PRES_PASS.length - 1];

    lastTensePass = lastTensePass.substring(0, lastTensePass.length - 6) +
        lastTensePass.substring(lastTensePass.length - 6, lastTensePass.length).replace("int", "iunt");

    tenses.push(lastTensePass);

    return tenses;
}

function fillIndCont(stem, differentFirstStem = stem, differentLastStem = stem, differentFirst = Endings.Tenses.PRES_ACT[0], differentMiddle = "", differentLast = differentMiddle) {
    let actTenses = fillIndContAct(stem, differentFirstStem, differentLastStem, differentFirst, differentMiddle, differentLast);
    let passTenses = fillIndContPass(stem, differentFirstStem, differentLastStem, differentFirst, differentMiddle, differentLast);

    let tenses = actTenses.concat(passTenses);
    return tenses;
}

function fillPresent(wordStems, conjugation) {
    let presTenses = [];
    let presStem = wordStems[1];

    if (!isVowel(presStem[presStem.length])) { // If NOT vowel and needs filler "a". too long for ternary
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? presStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    }

    presTenses = fillIndCont(presStem, wordStems[0], undefined, undefined, undefined, undefined);
    return presTenses;
}

function fillImperfect(wordStems, conjugation) {
    let imperfTenses = [];
    let imperfStem = wordStems[1]; //Otherwise, verb has no second principle part, so no imperf?

    if (!isVowel(imperfStem[imperfStem.length])) {
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? imperfStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
        conjugation == 4 ? imperfStem += "e" : null; //INFINITIVE STEM + "e"
    }

    imperfTenses = fillIndCont(imperfStem, undefined, undefined, "bam", "ba");
    return imperfTenses;
}

function fillFuture(wordStems, conjugation) {
    let futureTenses = [];
    let futureStem = wordStems[1];

    if (!isVowel(futureStem[futureStem]).length) {
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? futureStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    }

    if (conjugation == 1 || conjugation == 2) {

        futureTenses = fillIndCont(futureStem, undefined, undefined, "bo", "bi", "bu");
    }
    else {
        futureTenses = fillIndCont(futureStem, undefined, undefined, "am", "e");
        futureTenses[7] = futureTenses[7].replace("iris", "eris");
        //just do as normal, then add "u" at end if 4th conjugation
    }

    return futureTenses;
}

//---------------INDICATIVE COMPLETED---------------

function fillIndCompAct(stem, endings) {
    let tenses = [];

    for (let i = 0; i < Endings.Tenses.PERFECT_ACT.length; i++) { // Active
        let tense = stem + endings[i];
        tenses.push(tense);
    }
    return tenses;
}

function fillIndCompPass(stem, endings, gender) {
    let tenses = [];
    let genderEndingSing = matchGenderEnding(gender, false);
    let genderEndingPl = matchGenderEnding(gender, true);

    for (let i = 0; i < Endings.Tenses.PERFECT_PASS.length - 3; i++) { //Passive (2 part)
        let tense = stem + genderEndingSing + " " + endings[i];
        tenses.push(tense);
    }

    for (let i = 3; i < Endings.Tenses.PERFECT_PASS.length; i++) { //Passive (2 part)
        let tense = stem + genderEndingPl + " " + endings[i];
        tenses.push(tense);
    }
    return tenses;
}

function fillIndComp(wordStems, act_endings, pass_endings = act_endings, gender) {
    let actTenses = fillIndCompAct(wordStems[2], act_endings);
    let passTenses = fillIndCompPass(wordStems[3], pass_endings, gender);

    let tenses = actTenses.concat(passTenses);
    return tenses;
}

function fillPerfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.PERFECT_ACT, Endings.Tenses.PERFECT_PASS, gender);
    return tenses;
}

function fillPluperfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.PLUPERF_ACT, undefined, gender);
    return tenses;
}

function fillFuturePerfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.FUTPERF_ACT, undefined, gender);
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
    let passTenses = fillIndCompPass(stems[3], Endings.Tenses.PERFECT_SUBJUNCT_PASS, gender);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

function fillSubjunctivePluperfect(stems, modifier, gender) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stems[2] + "i", modifier);
    let passTenses = fillIndCompPass(stems[3], Endings.Tenses.PLUPERF_SUBJUNCT_PASS, gender);

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

//---------------INFINITIVE--------------- (only depends on gender and number?)

function fillInfinitivePresent(stem, conjugation) {
    let tenses = [];

    let presentInflect = Endings.Infinitives.PRES_ACT[conjugation - 1];

    let actTense, passTense;

    if (presentInflect != null) {
        actTense = stem + presentInflect;
        passTense = stem + presentInflect.replace("re", "ri");
    }

    tenses.push(actTense);
    tenses.push(passTense);

    return tenses;
}

function fillInfinitivePerfect(stems, gender, plural) {
    let tenses = [];

    let actTense = stems[2] + "isse";
    let passTense = stems[3] + matchGenderEnding(gender, plural) + " esse";

    tenses.push(actTense);
    tenses.push(passTense);

    return tenses;
}

function fillInfinitiveFuture(stem, gender, plural) {
    let tenses = [];
    let genderEnding = matchGenderEnding(gender, plural);

    let actTense = stem + "ur" + genderEnding + " esse";
    let passTense = stem + genderEnding + " iri";

    tenses.push(actTense);
    tenses.push(passTense);

    return tenses;
}

function fillInfinitive(wordStems, conjugation, gender) {
    let tenses = [];

    let present = fillInfinitivePresent(wordStems[1], conjugation);
    let perfect = fillInfinitivePerfect(wordStems, gender);
    let future = fillInfinitiveFuture(wordStems[3], gender);

    tenses = tenses.concat(present);
    tenses = tenses.concat(perfect);
    tenses = tenses.concat(future);

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

//MAKE REPLACEFROM() function

function fillParticipleFuture(stems, genderEndings, nomStem) {
    let cases = [];

    nomStem = replaceFrom(nomStem, nomStem.length - 1, nomStem.length, "s", "d");

    let activeCases = fillParticipleFutureAct(stems[3], genderEndings);
    let gerundiveCases = fillParticipleGerundive(nomStem, genderEndings);

    cases = cases.concat(activeCases);
    cases = cases.concat(gerundiveCases);

    return cases;
}

function fillParticiple(wordStems, conjugation, gender = "M") {
    let cases = [];
    let genderEndings = getGenderEndingArray(gender);

    let present = fillParticiplePresent(wordStems[1], conjugation, gender);
    let perfect = fillParticiplePerfect(wordStems[3], genderEndings);

    cases = cases.concat(present); //To quickly get gerundive stem from present nominative case
    let future = fillParticipleFuture(wordStems, genderEndings, cases[0]);

    cases = cases.concat(perfect);
    cases = cases.concat(future);

    return cases;
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
export function parseDictionary(dictionary) {
    let choppedDict = dictionary.split("\n");

    for (let i = 0; i < choppedDict.length; i++) { //Loop through every entry
        let entry = parseEntryLine(choppedDict[i]);
        globalEntries.push(entry);
        addEntrySuggestion(entry);
    }
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