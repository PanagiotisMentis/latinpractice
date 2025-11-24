import {Endings} from "../endings.js";
import * as Indicative from "./indicative.js";

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

export function fillSubjunctive(wordStems, conjugation, gender) {
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