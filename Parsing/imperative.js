import {Endings} from "./endings.js";

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

export function fillImperative(stems, conjugation) {
    let tenses = [];

    let activeTenses = fillImperativeAct(stems[1], conjugation);
    tenses = tenses.concat(activeTenses);

    return tenses;
}