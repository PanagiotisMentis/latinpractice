import {Endings} from '../endings.js';

const GLOBAL_VOWELS = "aeiou";

export function replaceFrom(string, indexStart, indexEnd, existingSubStr, replacementSubStr) {
    let str = string;

    str = str.substring(0, indexStart) +
        str.substring(indexStart, indexEnd).replace(existingSubStr, replacementSubStr);

    return str;
}

export function isVowel(char) {
    let vowels = GLOBAL_VOWELS;
    let isVowel = vowels.indexOf(char) > 0; // If char appeasr in vowel string at some point, 
    // make it true; otherwise, make it false.
    return isVowel;
}

export function matchGenderEnding(gender, plural, accusative) {
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

export function getGenderEndingArray(gender) {
    let endings = [];

    gender == "M" ? endings = Endings.Nouns.SECOND : null;
    gender == "F" ? endings = Endings.Nouns.FIRST : null;
    gender == "N" ? endings = Endings.Nouns.SECOND_NEUTER : null;

    return endings;
}