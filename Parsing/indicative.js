import {Endings} from '../endings.js';
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

export function fillIndCont(stem, differentFirstStem = stem, differentLastStem = stem, differentFirst = Endings.Tenses.PRES_ACT[0], differentMiddle = "", differentLast = differentMiddle) {
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

export function fillIndComp(wordStems, act_endings, pass_endings = act_endings, gender) {
    let actTenses = fillIndCompAct(wordStems[2], act_endings);
    let passTenses = fillIndCompPass(wordStems[3], pass_endings, gender);

    let tenses = actTenses.concat(passTenses);
    return tenses;
}