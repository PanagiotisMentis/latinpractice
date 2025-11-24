import {Endings} from './endings.js';
import * as Utility from './parsingUtility.js';

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

//Indicative Completed

function fillIndCompAct(stem, endings) {
    let tenses = [];

    for (let i = 0; i < Endings.Tenses.PERFECT_ACT.length; i++) { // Active
        let tense = stem + endings[i];
        tenses.push(tense);
    }
    return tenses;
}

//Used by a niche case (Subjunctive Perfect/Pluperfect)in parsing.js
export function fillIndCompPass(stem, endings, gender) {
    let tenses = [];
    let genderEndingSing = Utility.matchGenderEnding(gender, false);
    let genderEndingPl = Utility.matchGenderEnding(gender, true);

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

export function fillPresent(wordStems, conjugation) {
    let presTenses = [];
    let presStem = wordStems[1];

    if (!Utility.isVowel(presStem[presStem.length])) { // If NOT vowel and needs filler "a". too long for ternary
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? presStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
    }

    presTenses = fillIndCont(presStem, wordStems[0], undefined, undefined, undefined, undefined);
    return presTenses;
}

export function fillImperfect(wordStems, conjugation) {
    let imperfTenses = [];
    let imperfStem = wordStems[1]; //Otherwise, verb has no second principle part, so no imperf?

    if (!Utility.isVowel(imperfStem[imperfStem.length])) {
        Endings.Infinitives.PRES_ACT[conjugation - 1] != null ? imperfStem += Endings.Infinitives.PRES_ACT[conjugation - 1][0] : null;
        conjugation == 4 ? imperfStem += "e" : null; //INFINITIVE STEM + "e"
    }

    imperfTenses = fillIndCont(imperfStem, undefined, undefined, "bam", "ba");
    return imperfTenses;
}

export function fillFuture(wordStems, conjugation) {
    let futureTenses = [];
    let futureStem = wordStems[1];

    if (!Utility.isVowel(futureStem[futureStem]).length) {
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

export function fillPerfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.PERFECT_ACT, Endings.Tenses.PERFECT_PASS, gender);
    return tenses;
}

export function fillPluperfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.PLUPERF_ACT, undefined, gender);
    return tenses;
}

export function fillFuturePerfect(wordStems, gender) {
    let tenses = fillIndComp(wordStems, Endings.Tenses.FUTPERF_ACT, undefined, gender);
    tenses[11] = tenses[11].replace("erint", "erunt");

    return tenses;
}