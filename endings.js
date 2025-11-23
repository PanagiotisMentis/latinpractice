export class Endings {
    static Nouns = class {
        static FIRST = ["a", "ae", "ae", "am", "a", "ae", "arum", "is", "as", "is"];
        static SECOND = ["us", "i", "o", "um", "o", "i", "orum", "is", "os", "is"];
        static SECOND_NEUTER = ["um", "i", "o", "um", "o", "a", "orum", "is", "a", "is"];
        static THIRD = ["", "is", "i", "em", "e", "es", "um", "ibus", "es", "ibus"];
    }
    static Tenses = class {
        static PRES_ACT = ["o", "s", "t", "mus", "tis", "nt"];
        static PRES_PASS = ["r", "ris", "tur", "mur", "mini", "ntur"];

        //We can use so many arrays here because there are no modifications
        static PERFECT_ACT = ["i", "isti", "it", "imus", "istis", "erunt"];
        static PLUPERF_ACT = ["eram", "eras", "erat", "eramus", "eratis", "erant"];
        static FUTPERF_ACT = ["ero", "eris", "erit", "erimus", "eritis", "erint"];

        static PERFECT_PASS = ["sum", "es", "est", "sumus", "estis", "sunt"];
        static PERFECT_SUBJUNCT_PASS = ["sim", "sis", "sint", "simus", "sitis", "sint"];
        static PLUPERF_SUBJUNCT_PASS = ["essem", "esses", "esset", "essemus", "essetis", "essent"];
    }
    static Infinitives = class {
        static PRES_ACT = ["are", "ere", "ere", "ire"];
    }
    static Subjunctives = class {
        static PRESENT_MODS = ["e", "ea", "a", "ia"];
    }

}