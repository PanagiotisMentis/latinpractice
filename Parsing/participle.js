import {Endings} from "../endings.js";
import * as Utility from "./parsingUtility.js";

//------------------PARTICIPLES--------------------

export function fillParticiplePresent(stem, conjugation, gender) {
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

export function fillParticiplePerfect(stem, genderEndings) {
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

export function fillParticipleFutureAct(stem, genderEndings) {
    let cases = [];
    for (let i = 0; i < genderEndings.length; i++) {
        let nCase = stem + "ur" + genderEndings[i];
        cases.push(nCase);
    }

    return cases;
}

export function fillParticipleGerundive(stem, genderEndings) {
    let cases = [];

    for (let i = 0; i < genderEndings.length; i++) {
        let nCase = stem + genderEndings[i];
        cases.push(nCase);
    }

    return cases;
}

//MAKE REPLACEFROM() funct
export function fillParticipleFuture(stems, genderEndings, nomStem) {
    let cases = [];

    nomStem = Utility.replaceFrom(nomStem, nomStem.length - 1, nomStem.length, "s", "d");

    let activeCases = fillParticipleFutureAct(stems[3], genderEndings);
    let gerundiveCases = fillParticipleGerundive(nomStem, genderEndings);

    cases = cases.concat(activeCases);
    cases = cases.concat(gerundiveCases);

    return cases;
}