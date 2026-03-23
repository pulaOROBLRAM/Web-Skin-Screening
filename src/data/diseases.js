export const DISEASES = {
  RASH_OR_REDNESS: {
    "Psoriasis": {
      // Basic Info
      prevalence: "common",
      demographics: ["adults 20-60yrs"],
      
      // Clinical Attributes (each scored 0-10)
      attributes: {
        lesionForm: { value: ["plaque", "patch"], weight: 8 },
        surface: { value: ["scaly", "silvery"], weight: 9 },
        color: { value: ["red", "pink"], weight: 6 },
        border: { value: ["well-defined"], weight: 8 },
        distribution: { value: ["elbows", "knees", "scalp"], weight: 9 },
        sensation: { value: ["itchy"], weight: 5 },
        triggers: { value: ["stress", "infection"], weight: 4 },
        associatedFindings: { value: ["nail pitting", "joint pain"], weight: 8 }
      },
      
      // Location Mapping (for Q4)
      locationCategories: {
        a: { value: ["scalp"], weight: 9 },  // Face/scalp
        c: { value: ["elbows", "knees", "lower back"], weight: 10 }, // Body
        d: { value: ["multiple"], weight: 7 } // Widespread
      },
      
      // Assessment Mapping (for Q1-Q3)
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 }, // Rash or redness
        q2: { value: ["a", "d"], weight: 8 }, // Itchy or Both
        q3: { value: ["a", "b", "c", "d"], weight: 7 }, // All patterns
        q4: { value: ["a", "c", "d"], weight: 9 } // Location match
      },
      
      // Normalized total weight (sum of all weights = 100)
      totalWeight: 100,
      
      // Scoring function (to be used by diagnosis engine)
      calculateMatch: (answers) => {
        // This would calculate weighted match percentage
        // based on user answers vs disease attributes
        return 0; // Placeholder
      }
    },

    "Acne": {
      prevalence: "very common",
      demographics: ["adolescents", "young adults"],
      
      attributes: {
        lesionForm: { value: ["papule", "pustule", "nodule", "cyst"], weight: 9 },
        surface: { value: ["inflamed", "pus-filled"], weight: 8 },
        color: { value: ["red", "pink"], weight: 7 },
        border: { value: ["ill-defined", "erythematous"], weight: 5 },
        distribution: { value: ["face", "chest", "back", "shoulders"], weight: 9 },
        sensation: { value: ["tender", "painful"], weight: 6 },
        triggers: { value: ["hormones", "stress", "diet", "comedogenic products"], weight: 7 },
        associatedFindings: { value: ["blackheads", "whiteheads", "scarring"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 10 },
        c: { value: ["chest", "back", "shoulders"], weight: 9 },
        d: { value: ["multiple"], weight: 7 }
      },
      
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 }, // Rash or redness
        q2: { value: ["b", "d"], weight: 7 }, // Painful or Both
        q3: { value: ["a", "c"], weight: 6 }, // Getting worse or Comes and goes
        q4: { value: ["a", "c", "d"], weight: 8 } // Face or Body or Multiple
      },
      
      totalWeight: 100
    },
    
    "Dermatitis": {
      prevalence: "very common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["rash", "redness"], weight: 8 },
        surface: { value: ["dry", "scaly", "weeping"], weight: 8 },
        color: { value: ["red", "pink"], weight: 7 },
        border: { value: ["ill-defined"], weight: 6 },
        distribution: { value: ["face", "hands", "flexural areas"], weight: 8 },
        sensation: { value: ["itchy"], weight: 9 },
        triggers: { value: ["irritants", "allergens", "stress"], weight: 7 },
        associatedFindings: { value: ["dry skin"], weight: 6 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 7 },
        b: { value: ["hands"], weight: 8 },
        c: { value: ["elbow creases", "knee creases"], weight: 8 },
        d: { value: ["multiple"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 },
        q2: { value: ["a", "d"], weight: 9 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["a", "b", "c", "d"], weight: 7 }
      },
      
      totalWeight: 100
    },
    
    "Atopic_Dermatitis": {
      prevalence: "very common",
      demographics: ["children", "allergy history"],
      
      attributes: {
        lesionForm: { value: ["patch", "plaque"], weight: 7 },
        surface: { value: ["dry", "scaly", "thickened"], weight: 8 },
        color: { value: ["red"], weight: 5 },
        border: { value: ["ill-defined"], weight: 7 },
        distribution: { value: ["elbow creases", "knee creases", "neck", "face"], weight: 9 },
        sensation: { value: ["intensely itchy"], weight: 10 },
        triggers: { value: ["dry skin", "irritants", "stress"], weight: 6 },
        associatedFindings: { value: ["asthma", "allergies"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face", "neck"], weight: 8 },
        c: { value: ["elbow creases", "knee creases"], weight: 10 },
        d: { value: ["multiple"], weight: 7 }
      },
      
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 },
        q2: { value: ["a"], weight: 10 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["a", "c", "d"], weight: 8 }
      },
      
      totalWeight: 100
    },
    
    "Seborrheic_Dermatitis": {
      prevalence: "very common",
      demographics: ["adults 30-60yrs"],
      
      attributes: {
        lesionForm: { value: ["patch", "plaque"], weight: 7 },
        surface: { value: ["greasy", "scaly", "yellowish"], weight: 9 },
        color: { value: ["red", "yellowish-red"], weight: 7 },
        border: { value: ["ill-defined"], weight: 6 },
        distribution: { value: ["scalp", "eyebrows", "sides of nose", "chest"], weight: 9 },
        sensation: { value: ["mildly itchy"], weight: 5 },
        triggers: { value: ["stress", "cold weather"], weight: 5 },
        associatedFindings: { value: ["dandruff"], weight: 7 }
      },
      
      locationCategories: {
        a: { value: ["scalp", "eyebrows", "sides of nose"], weight: 10 },
        c: { value: ["chest"], weight: 8 }
      },
      
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 },
        q2: { value: ["a"], weight: 8 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["a", "c"], weight: 9 }
      },
      
      totalWeight: 100
    },
    
    "Rosacea": {
      prevalence: "common",
      demographics: ["adults 30-50yrs", "fair skin"],
      
      attributes: {
        lesionForm: { value: ["patch", "papule", "pustule"], weight: 8 },
        surface: { value: ["smooth", "red"], weight: 6 },
        color: { value: ["red", "pink"], weight: 7 },
        border: { value: ["ill-defined"], weight: 5 },
        distribution: { value: ["cheeks", "nose", "chin", "forehead"], weight: 10 },
        sensation: { value: ["burning", "stinging"], weight: 8 },
        triggers: { value: ["sun", "spicy food", "alcohol"], weight: 8 },
        associatedFindings: { value: ["flushing", "visible blood vessels"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["cheeks", "nose", "chin", "forehead"], weight: 10 }
      },
      
      assessmentMapping: {
        q1: { value: ["a"], weight: 10 },
        q2: { value: ["a", "b", "d"], weight: 8 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["a"], weight: 10 }
      },
      
      totalWeight: 100
    },
    
    "Contact_Dermatitis": {
      prevalence: "very common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["rash", "blisters", "redness"], weight: 8 },
        surface: { value: ["weeping", "crusted"], weight: 7 },
        color: { value: ["red"], weight: 5 },
        border: { value: ["sharp", "linear"], weight: 9 },
        distribution: { value: ["exposed areas", "contact site"], weight: 9 },
        sensation: { value: ["intensely itchy"], weight: 9 },
        triggers: { value: ["poison ivy", "nickel", "chemicals"], weight: 8 },
        associatedFindings: { value: ["exposure history"], weight: 9 }
      },
      
      locationCategories: {
        a: { value: ["face", "neck"], weight: 7 },
        b: { value: ["hands"], weight: 8 },
        c: { value: ["arms", "legs", "trunk"], weight: 7 },
        d: { value: ["multiple", "widespread"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["a", "c"], weight: 9 },
        q2: { value: ["a"], weight: 9 },
        q3: { value: ["a", "b", "c", "d"], weight: 8 },
        q4: { value: ["a", "b", "c", "d"], weight: 8 }
      },
      
      totalWeight: 100
    }
  },

  GROWTH_OR_LUMP: {
    "Warts": {
      prevalence: "very common",
      demographics: ["children", "young adults"],
      
      attributes: {
        lesionForm: { value: ["papule", "nodule"], weight: 8 },
        surface: { value: ["rough", "cauliflower-like"], weight: 9 },
        color: { value: ["skin-colored", "gray"], weight: 6 },
        border: { value: ["well-defined"], weight: 7 },
        distribution: { value: ["hands", "feet", "face"], weight: 8 },
        sensation: { value: ["asymptomatic", "tender"], weight: 5 },
        triggers: { value: ["HPV virus"], weight: 7 },
        associatedFindings: { value: ["black dots"], weight: 9 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 7 },
        b: { value: ["hands", "feet"], weight: 10 },
        c: { value: ["knees"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["b"], weight: 10 },
        q2: { value: ["b", "c"], weight: 7 },
        q3: { value: ["a", "b", "d"], weight: 7 },
        q4: { value: ["a", "b", "c"], weight: 9 }
      },
      
      totalWeight: 100
    },
    
    "Seborrheic_Keratosis": {
      prevalence: "very common",
      demographics: ["older adults >40yrs"],
      
      attributes: {
        lesionForm: { value: ["papule", "plaque"], weight: 8 },
        surface: { value: ["warty", "stuck-on", "waxy"], weight: 10 },
        color: { value: ["tan", "brown", "black"], weight: 7 },
        border: { value: ["sharp", "well-defined"], weight: 8 },
        distribution: { value: ["trunk", "face", "arms"], weight: 7 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["aging"], weight: 5 },
        associatedFindings: { value: ["horn cysts"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 7 },
        c: { value: ["trunk", "arms"], weight: 8 },
        d: { value: ["multiple"], weight: 8 }
      },
      
      assessmentMapping: {
        q1: { value: ["b"], weight: 10 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["a", "b"], weight: 7 },
        q4: { value: ["a", "c", "d"], weight: 8 }
      },
      
      totalWeight: 100
    },
    
    "Skin_Tags": {
      prevalence: "very common",
      demographics: ["middle-aged", "overweight"],
      
      attributes: {
        lesionForm: { value: ["papule", "pedunculated"], weight: 10 },
        surface: { value: ["smooth", "soft"], weight: 8 },
        color: { value: ["flesh-colored", "brown"], weight: 6 },
        border: { value: ["well-defined", "stalk"], weight: 9 },
        distribution: { value: ["neck", "axillae", "groin"], weight: 9 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["obesity", "aging"], weight: 5 },
        associatedFindings: { value: ["acanthosis nigricans"], weight: 7 }
      },
      
      locationCategories: {
        a: { value: ["neck"], weight: 10 },
        c: { value: ["axillae", "groin"], weight: 9 },
        d: { value: ["multiple"], weight: 8 }
      },
      
      assessmentMapping: {
        q1: { value: ["b"], weight: 10 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["a", "b"], weight: 6 },
        q4: { value: ["a", "c", "d"], weight: 9 }
      },
      
      totalWeight: 100
    },
    
    "Moles": {
      name: "Moles (Nevi)",
      prevalence: "very common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["macule", "papule"], weight: 8 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["tan", "brown", "skin-colored"], weight: 6 },
        border: { value: ["round", "well-defined"], weight: 8 },
        distribution: { value: ["anywhere"], weight: 5 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["genetics", "sun"], weight: 4 },
        associatedFindings: { value: ["uniform color", "symmetrical"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 6 },
        b: { value: ["hands", "feet"], weight: 6 },
        c: { value: ["trunk", "arms", "legs"], weight: 7 },
        d: { value: ["multiple"], weight: 7 }
      },
      
      assessmentMapping: {
        q1: { value: ["b", "d"], weight: 8 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["b"], weight: 8 },
        q4: { value: ["a", "b", "c", "d"], weight: 7 }
      },
      
      totalWeight: 100
    },
    
    "Cysts": {
      prevalence: "common",
      demographics: ["adults"],
      
      attributes: {
        lesionForm: { value: ["nodule", "lump"], weight: 9 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["flesh-colored"], weight: 5 },
        border: { value: ["well-defined", "round"], weight: 8 },
        distribution: { value: ["face", "scalp", "back", "chest"], weight: 7 },
        sensation: { value: ["asymptomatic", "tender"], weight: 5 },
        triggers: { value: ["genetics", "acne"], weight: 4 },
        associatedFindings: { value: ["central punctum"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face", "scalp"], weight: 8 },
        c: { value: ["back", "chest"], weight: 7 }
      },
      
      assessmentMapping: {
        q1: { value: ["b"], weight: 10 },
        q2: { value: ["c", "b"], weight: 6 },
        q3: { value: ["a", "b"], weight: 6 },
        q4: { value: ["a", "c"], weight: 8 }
      },
      
      totalWeight: 100
    }
  },

  BLISTERS_OR_SORES: {
    "Herpes_Simplex": {
      prevalence: "very common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["vesicles", "blisters", "sores"], weight: 9 },
        surface: { value: ["vesicular", "crusted"], weight: 7 },
        color: { value: ["clear fluid", "red base"], weight: 5 },
        border: { value: ["grouped", "clustered"], weight: 9 },
        distribution: { value: ["lips", "mouth", "genitals"], weight: 9 },
        sensation: { value: ["painful", "tingling"], weight: 8 },
        triggers: { value: ["stress", "illness", "sun"], weight: 7 },
        associatedFindings: { value: ["recurrent", "prodrome"], weight: 9 }
      },
      
      locationCategories: {
        a: { value: ["lips", "mouth"], weight: 10 },
        c: { value: ["genitals"], weight: 9 }
      },
      
      assessmentMapping: {
        q1: { value: ["c"], weight: 10 },
        q2: { value: ["b"], weight: 9 },
        q3: { value: ["a", "b", "c", "d"], weight: 8 },
        q4: { value: ["a", "c"], weight: 9 }
      },
      
      totalWeight: 100
    },
    
    "Herpes_Zoster": {
      name: "Herpes Zoster (Shingles)",
      prevalence: "common",
      demographics: ["older adults >50yrs"],
      
      attributes: {
        lesionForm: { value: ["vesicles", "blisters"], weight: 8 },
        surface: { value: ["vesicular", "crusted"], weight: 6 },
        color: { value: ["clear", "red base"], weight: 5 },
        border: { value: ["dermatomal", "unilateral"], weight: 10 },
        distribution: { value: ["chest", "back", "face", "one side"], weight: 10 },
        sensation: { value: ["severe pain", "burning"], weight: 9 },
        triggers: { value: ["aging", "stress"], weight: 6 },
        associatedFindings: { value: ["prior chickenpox"], weight: 7 }
      },
      
      locationCategories: {
        a: { value: ["face (trigeminal)"], weight: 8 },
        c: { value: ["chest", "back"], weight: 10 }
      },
      
      assessmentMapping: {
        q1: { value: ["c"], weight: 10 },
        q2: { value: ["b"], weight: 9 },
        q3: { value: ["a", "b", "d"], weight: 8 },
        q4: { value: ["a", "c"], weight: 9 }
      },
      
      totalWeight: 100
    },
    
    "Impetigo": {
      prevalence: "common",
      demographics: ["children 2-5yrs"],
      
      attributes: {
        lesionForm: { value: ["sores", "blisters", "crusts"], weight: 8 },
        surface: { value: ["honey-colored crust", "weeping"], weight: 10 },
        color: { value: ["golden-yellow", "red"], weight: 9 },
        border: { value: ["ill-defined"], weight: 5 },
        distribution: { value: ["face", "nose", "mouth", "extremities"], weight: 7 },
        sensation: { value: ["mildly itchy"], weight: 4 },
        triggers: { value: ["bacteria", "broken skin"], weight: 6 },
        associatedFindings: { value: ["contagious"], weight: 7 }
      },
      
      locationCategories: {
        a: { value: ["face", "nose", "mouth"], weight: 9 },
        b: { value: ["hands"], weight: 6 },
        c: { value: ["extremities"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["c"], weight: 10 },
        q2: { value: ["a", "b"], weight: 6 },
        q3: { value: ["a", "d"], weight: 8 },
        q4: { value: ["a", "b", "c"], weight: 7 }
      },
      
      totalWeight: 100
    },
    
    "Contact_Dermatitis_Acute": {
      name: "Contact Dermatitis (Acute)",
      prevalence: "very common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["vesicles", "blisters"], weight: 9 },
        surface: { value: ["weeping", "oozing"], weight: 7 },
        color: { value: ["red"], weight: 5 },
        border: { value: ["linear", "geometric"], weight: 9 },
        distribution: { value: ["exposed areas"], weight: 8 },
        sensation: { value: ["intensely itchy"], weight: 8 },
        triggers: { value: ["poison ivy", "plants"], weight: 8 },
        associatedFindings: { value: ["exposure history"], weight: 9 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 7 },
        b: { value: ["hands"], weight: 8 },
        c: { value: ["arms", "legs"], weight: 7 },
        d: { value: ["widespread"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["c"], weight: 9 },
        q2: { value: ["a"], weight: 9 },
        q3: { value: ["a", "b", "c", "d"], weight: 8 },
        q4: { value: ["a", "b", "c", "d"], weight: 8 }
      },
      
      totalWeight: 100
    }
  },

  CHANGE_IN_COLOR_ONLY: {
    "Vitiligo": {
      prevalence: "common",
      demographics: ["all ages"],
      
      attributes: {
        lesionForm: { value: ["macule", "patch"], weight: 9 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["depigmented", "chalk-white"], weight: 10 },
        border: { value: ["well-defined", "sharp"], weight: 9 },
        distribution: { value: ["face", "hands", "body folds"], weight: 7 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["autoimmune"], weight: 5 },
        associatedFindings: { value: ["leukotrichia"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face", "periorificial"], weight: 8 },
        b: { value: ["hands"], weight: 7 },
        c: { value: ["body folds"], weight: 7 },
        d: { value: ["generalized"], weight: 6 }
      },
      
      assessmentMapping: {
        q1: { value: ["d"], weight: 10 },
        q2: { value: ["c"], weight: 9 },
        q3: { value: ["a", "b", "d"], weight: 7 },
        q4: { value: ["a", "b", "c", "d"], weight: 7 }
      },
      
      totalWeight: 100
    },
    
    "Melasma": {
      prevalence: "common",
      demographics: ["women", "pregnancy"],
      
      attributes: {
        lesionForm: { value: ["macule", "patch"], weight: 8 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["brown", "gray-brown"], weight: 9 },
        border: { value: ["ill-defined"], weight: 8 },
        distribution: { value: ["cheeks", "forehead", "upper lip", "nose"], weight: 10 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["sun", "hormones", "pregnancy"], weight: 8 },
        associatedFindings: { value: ["worsens with sun"], weight: 7 }
      },
      
      locationCategories: {
        a: { value: ["cheeks", "forehead", "upper lip", "nose"], weight: 10 }
      },
      
      assessmentMapping: {
        q1: { value: ["d"], weight: 10 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["a"], weight: 10 }
      },
      
      totalWeight: 100
    },
    
    "Tinea_Versicolor": {
      prevalence: "common",
      demographics: ["adolescents", "young adults"],
      
      attributes: {
        lesionForm: { value: ["macule", "patch"], weight: 8 },
        surface: { value: ["fine scaly"], weight: 9 },
        color: { value: ["hypopigmented", "hyperpigmented", "pink", "brown"], weight: 8 },
        border: { value: ["ill-defined"], weight: 6 },
        distribution: { value: ["upper trunk", "chest", "back", "shoulders"], weight: 10 },
        sensation: { value: ["mildly itchy"], weight: 4 },
        triggers: { value: ["heat", "humidity", "sweating"], weight: 7 },
        associatedFindings: { value: ["KOH positive"], weight: 9 }
      },
      
      locationCategories: {
        c: { value: ["upper trunk", "chest", "back", "shoulders"], weight: 10 }
      },
      
      assessmentMapping: {
        q1: { value: ["d"], weight: 10 },
        q2: { value: ["a"], weight: 6 },
        q3: { value: ["a", "b", "c", "d"], weight: 7 },
        q4: { value: ["c"], weight: 10 }
      },
      
      totalWeight: 100
    },
    
    "Cafe_au_lait_spots": {
      prevalence: "common",
      demographics: ["present from birth/childhood"],
      
      attributes: {
        lesionForm: { value: ["macule", "patch"], weight: 9 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["light brown", "café-au-lait"], weight: 9 },
        border: { value: ["well-defined"], weight: 8 },
        distribution: { value: ["anywhere"], weight: 5 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["genetic"], weight: 4 },
        associatedFindings: { value: ["neurofibromatosis if multiple"], weight: 8 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 5 },
        b: { value: ["extremities"], weight: 5 },
        c: { value: ["trunk"], weight: 6 },
        d: { value: ["multiple"], weight: 8 }
      },
      
      assessmentMapping: {
        q1: { value: ["d"], weight: 10 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["a", "b"], weight: 7 },
        q4: { value: ["a", "b", "c", "d"], weight: 7 }
      },
      
      totalWeight: 100
    },
    
    "Lentigo": {
      prevalence: "very common",
      demographics: ["older adults"],
      
      attributes: {
        lesionForm: { value: ["macule", "patch"], weight: 8 },
        surface: { value: ["smooth"], weight: 7 },
        color: { value: ["brown", "tan"], weight: 8 },
        border: { value: ["well-defined"], weight: 7 },
        distribution: { value: ["sun-exposed areas", "face", "hands", "arms"], weight: 9 },
        sensation: { value: ["asymptomatic"], weight: 6 },
        triggers: { value: ["sun exposure", "aging"], weight: 7 },
        associatedFindings: { value: ["sun-damaged skin"], weight: 6 }
      },
      
      locationCategories: {
        a: { value: ["face"], weight: 9 },
        b: { value: ["hands", "arms"], weight: 8 }
      },
      
      assessmentMapping: {
        q1: { value: ["d"], weight: 10 },
        q2: { value: ["c"], weight: 8 },
        q3: { value: ["a", "b", "d"], weight: 7 },
        q4: { value: ["a", "b"], weight: 9 }
      },
      
      totalWeight: 100
    }
  }
};

// Diagnosis Engine Function
export const diagnoseDisease = (userAnswers, diseases = DISEASES) => {
  const results = [];
  
  // Flatten all diseases into single array with category info
  const allDiseases = [];
  Object.keys(diseases).forEach(category => {
    Object.keys(diseases[category]).forEach(diseaseName => {
      allDiseases.push({
        name: diseaseName,
        category,
        ...diseases[category][diseaseName]
      });
    });
  });
  
  // Calculate match score for each disease
  allDiseases.forEach(disease => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Check Q1 match
    const q1Match = disease.assessmentMapping.q1.value.includes(userAnswers.q1);
    const q1Score = q1Match ? disease.assessmentMapping.q1.weight : 0;
    totalScore += q1Score;
    maxPossibleScore += disease.assessmentMapping.q1.weight;
    
    // Check Q2 match
    const q2Match = disease.assessmentMapping.q2.value.includes(userAnswers.q2);
    const q2Score = q2Match ? disease.assessmentMapping.q2.weight : 0;
    totalScore += q2Score;
    maxPossibleScore += disease.assessmentMapping.q2.weight;
    
    // Check Q3 match
    const q3Match = disease.assessmentMapping.q3.value.includes(userAnswers.q3);
    const q3Score = q3Match ? disease.assessmentMapping.q3.weight : 0;
    totalScore += q3Score;
    maxPossibleScore += disease.assessmentMapping.q3.weight;
    
    // Check Q4 match (location)
    const q4Match = disease.assessmentMapping.q4.value.includes(userAnswers.q4);
    const q4Score = q4Match ? disease.assessmentMapping.q4.weight : 0;
    totalScore += q4Score;
    maxPossibleScore += disease.assessmentMapping.q4.weight;
    
    // Calculate percentage
    const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    results.push({
      name: disease.name,
      category: disease.category,
      matchPercentage,
      prevalence: disease.prevalence,
      demographics: disease.demographics,
      keyFeatures: {
        lesionForm: disease.attributes.lesionForm.value,
        distribution: disease.attributes.distribution.value,
        sensation: disease.attributes.sensation.value
      }
    });
  });
  
  // Sort by match percentage (highest first)
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

// Compatibility helper for modules expecting attributes import
export const attributes = DISEASES;
