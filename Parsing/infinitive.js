import {Endings} from './endings.js';
import * as Utility from './parsingUtility.js';

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
    let passTense = stems[3] + Utility.matchGenderEnding(gender, plural) + " esse";

    tenses.push(actTense);
    tenses.push(passTense);

    return tenses;
}

function fillInfinitiveFuture(stem, gender, plural) {
    let tenses = [];
    let genderEnding = Utility.matchGenderEnding(gender, plural);

    let actTense = stem + "ur" + genderEnding + " esse";
    let passTense = stem + genderEnding + " iri";

    tenses.push(actTense);
    tenses.push(passTense);

    return tenses;
}

//----------------INFINITIVES------------------------
export function fillInfinitive(wordStems, conjugation, gender) {
    let tenses = [];

    let present = fillInfinitivePresent(wordStems[1], conjugation);
    let perfect = fillInfinitivePerfect(wordStems, gender);
    let future = fillInfinitiveFuture(wordStems[3], gender);

    tenses = tenses.concat(present);
    tenses = tenses.concat(perfect);
    tenses = tenses.concat(future);

    return tenses;
}