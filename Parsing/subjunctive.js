import {Endings} from "../endings.js";
import * as Indicative from "./indicative.js";

//---------------SUBJUNCTIVE---------------

export function fillSubjunctiveAct(stem, modifier) {
    let tenses = [];

    tenses.push(stem + modifier + "m");
    for (let i = 1; i < Endings.Tenses.PRES_ACT.length; i++) {
        let tense = stem + modifier + Endings.Tenses.PRES_ACT[i];
        tenses.push(tense);
    }

    return tenses;
}

export function fillSubjunctiveContPass(stem, modifier) {
    let tenses = [];

    tenses.push(stem + modifier + "r");
    for (let i = 1; i < Endings.Tenses.PRES_ACT.length; i++) {
        let tense = stem + modifier + Endings.Tenses.PRES_PASS[i];
        tenses.push(tense);
    }

    return tenses;
}

export function fillSubjunctiveCont(stem, modifier) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stem, modifier);
    let passTenses = fillSubjunctiveContPass(stem, modifier);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

export function fillSubjunctivePerfect(stems, modifier, gender) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stems[2], modifier);
    let passTenses = Indicative.fillIndCompPass(stems[3], Endings.Tenses.PERFECT_SUBJUNCT_PASS, gender);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}

export function fillSubjunctivePluperfect(stems, modifier, gender) {
    let tenses = [];

    let actTenses = fillSubjunctiveAct(stems[2] + "i", modifier);
    let passTenses = Indicative.fillIndCompPass(stems[3], Endings.Tenses.PLUPERF_SUBJUNCT_PASS, gender);

    tenses = tenses.concat(actTenses);
    tenses = tenses.concat(passTenses);

    return tenses;
}