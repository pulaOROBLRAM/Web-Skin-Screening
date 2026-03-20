export const attributes = {
  RASH_OR_REDNESS: {
    "Acne": {
      lesionForm: ["papule", "pustule", "nodule", "cyst", "comedone"],
      surface: ["oily", "inflamed", "non-inflamed"],
      color: ["red", "skin-colored", "white", "black", "yellowish"],
      border: ["ill-defined", "erythematous"],
      distribution: ["face", "chest", "upper back", "shoulders", "neck"],
      configuration: ["solitary", "clustered", "scattered"],
      sensation: ["painful", "tender", "asymptomatic"],
      chronicity: ["chronic", "relapsing", "waxes and wanes"],
      triggers: ["hormonal changes", "stress", "menstruation", "comedogenic cosmetics", "diet"],
      associatedFindings: ["seborrhea", "scarring", "hyperpigmentation", "oily skin"],
      demographics: ["adolescents", "young adults", "can persist into adulthood"],
      morphology: ["open comedones (blackheads)", "closed comedones (whiteheads)", "inflammatory papules", "pustules", "nodules", "cysts"]
    },
    "Dermatitis": {
      lesionForm: ["patch", "plaque", "papule", "vesicle (acute)"],
      surface: ["dry", "scaly", "lichenified", "weeping (acute)", "crusted"],
      color: ["red", "erythematous", "pink", "brownish (chronic)"],
      border: ["ill-defined", "poorly demarcated"],
      distribution: ["flexural surfaces", "face", "hands", "generalized", "localized"],
      configuration: ["diffuse", "confluent", "discrete"],
      sensation: ["itchy", "intensely pruritic"],
      chronicity: ["acute", "subacute", "chronic", "relapsing"],
      triggers: ["irritants", "allergens", "dry skin", "stress", "weather changes"],
      associatedFindings: ["xerosis", "excoriations", "lichenification", "fissures"],
      demographics: ["all ages", "atopic individuals"],
      morphology: ["acute: vesicles, weeping", "subacute: crusts, scales", "chronic: lichenification, fissures"],
      types: ["atopic dermatitis", "contact dermatitis", "seborrheic dermatitis", "stasis dermatitis"]
    },
    "Ringworm": {
      lesionForm: ["patch", "plaque", "annular lesion"],
      surface: ["scaly", "raised border", "clearing center"],
      color: ["red", "erythematous", "brownish"],
      border: ["active", "raised", "well-defined", "advancing"],
      distribution: ["body (tinea corporis)", "scalp (tinea capitis)", "feet (tinea pedis)", "groin (tinea cruris)"],
      configuration: ["annular", "circular", "polycyclic", "concentric rings"],
      sensation: ["itchy", "pruritic"],
      chronicity: ["acute", "persistent without treatment"],
      triggers: ["dermatophyte fungi", "contact with infected humans/animals", "warm moist environments"],
      associatedFindings: ["central clearing", "scale", "kerion (inflamed)", "hair loss"],
      demographics: ["all ages", "more common in warm climates"],
      morphology: ["annular plaque with raised border", "central clearing", "scaly", "may have pustules"],
      types: ["tinea corporis", "tinea capitis", "tinea pedis", "tinea cruris", "tinea manuum", "tinea unguium"]
    },
    "Psoriasis": {
      lesionForm: ["plaque", "patch"],
      surface: ["scaly", "silvery"],
      color: ["red", "pink", "silvery-white"],
      border: ["well-defined", "sharp"],
      distribution: ["extensor surfaces", "scalp", "elbows", "knees", "lumbosacral"],
      configuration: ["discrete", "coalescing", "annular"],
      sensation: ["itchy", "burning"],
      chronicity: ["chronic", "relapsing"],
      triggers: ["stress", "infection", "trauma", "medications"],
      associatedFindings: ["nail pitting", "onycholysis", "joint pain", "auspitz sign"],
      demographics: ["bimodal: 20-30yrs, 50-60yrs", "equal gender"],
      morphology: ["well-demarcated", "raised", "thickened"]
    },
    "Atopic_Dermatitis": {
      lesionForm: ["patch", "plaque", "papule"],
      surface: ["dry", "lichenified", "excoriated", "scaly"],
      color: ["red", "erythematous", "brownish"],
      border: ["ill-defined", "poorly demarcated"],
      distribution: ["flexural surfaces", "antecubital", "popliteal", "neck", "face"],
      configuration: ["diffuse", "confluent"],
      sensation: ["intensely itchy", "pruritic"],
      chronicity: ["chronic", "relapsing", "remitting"],
      triggers: ["dry skin", "irritants", "allergens", "stress", "weather change"],
      associatedFindings: ["xerosis", "keratosis pilaris", "dermatographism", "white dermographism"],
      demographics: ["infants", "children", "personal/family atopy history"],
      morphology: ["lichenification", "excoriations", "fissures"]
    },
    "Seborrheic_Dermatitis": {
      lesionForm: ["patch", "plaque"],
      surface: ["greasy", "oily", "scaly", "yellowish-crust"],
      color: ["erythematous", "yellowish-red", "pink"],
      border: ["ill-defined", "poorly demarcated"],
      distribution: ["scalp", "eyebrows", "nasolabial folds", "ears", "chest", "upper back"],
      configuration: ["confluent", "annular", "petaloid"],
      sensation: ["mildly itchy", "pruritic"],
      chronicity: ["chronic", "relapsing", "seasonal variation"],
      triggers: ["stress", "cold weather", "oily skin", "immunosuppression"],
      associatedFindings: ["dandruff", "blepharitis", "malassezia yeast"],
      demographics: ["infants (cradle cap)", "adults 30-60yrs", "more common in males"],
      morphology: ["superficial", "non-scarring"]
    },
    "Rosacea": {
      lesionForm: ["patch", "papule", "pustule", "plaque"],
      surface: ["smooth", "telangiectatic"],
      color: ["red", "erythematous", "violaceous"],
      border: ["ill-defined", "blending"],
      distribution: ["central face", "cheeks", "nose", "chin", "forehead"],
      configuration: ["diffuse", "confluent"],
      sensation: ["burning", "stinging", "rarely itchy"],
      chronicity: ["chronic", "relapsing", "progressive"],
      triggers: ["sun exposure", "heat", "spicy foods", "alcohol", "exercise", "emotions"],
      associatedFindings: ["telangiectasias", "flushing", "phymatous changes", "ocular symptoms"],
      demographics: ["adults 30-50yrs", "fair skin", "celtic ancestry"],
      morphology: ["superficial vascular dilation", "inflammatory papules", "pustules"]
    },
    "Lupus": {
      lesionForm: ["patch", "plaque", "discoid"],
      surface: ["scaly", "atrophic", "follicular plugging"],
      color: ["red", "violaceous", "hyperpigmented", "hypopigmented"],
      border: ["well-defined", "sharp", "active border"],
      distribution: ["malar area", "photosensitive areas", "scalp", "ears", "chest"],
      configuration: ["discoid", "annular", "polycyclic"],
      sensation: ["asymptomatic", "mildly itchy"],
      chronicity: ["chronic", "relapsing", "progressive scarring"],
      triggers: ["sun exposure", "UV light", "stress", "medications"],
      associatedFindings: ["photosensitivity", "oral ulcers", "arthritis", "serositis", "antinuclear antibodies"],
      demographics: ["women 20-40yrs", "more common in African American, Hispanic"],
      morphology: ["follicular plugging", "atrophy", "scarring", "dyspigmentation"]
    }
  },

  GROWTH_OR_LUMP: {
    "Molluscum Contagiosum": {
      lesionForm: ["papule", "nodule"],
      surface: ["smooth", "waxy", "umbilicated", "pearly"],
      color: ["skin-colored", "pink", "white", "translucent"],
      border: ["well-defined", "sharp"],
      distribution: ["face", "trunk", "extremities", "genitals", "flexural areas"],
      configuration: ["solitary", "grouped", "clustered", "linear (koebner)"],
      sensation: ["asymptomatic", "mildly itchy", "tender if inflamed"],
      chronicity: ["self-limited", "months to years", "can persist in immunocompromised"],
      triggers: ["poxvirus infection", "direct contact", "fomites", "swimming pools", "atopic dermatitis"],
      associatedFindings: ["umbilication", "dermatitis surrounding lesions", "giant molluscum"],
      demographics: ["children 1-10yrs", "sexually active adults", "immunocompromised"],
      morphology: ["dome-shaped", "umbilicated center", "flesh-colored", "waxy", "2-5mm"],
      diagnosis: ["clinical", "central plug on histology", "Henderson-Patterson bodies"]
    },
    "Warts": {
      lesionForm: ["papule", "nodule", "plaque"],
      surface: ["rough", "verrucous", "papillomatous", "hyperkeratotic", "cauliflower-like"],
      color: ["skin-colored", "gray", "brown", "yellowish"],
      border: ["well-defined", "sharp"],
      distribution: ["hands", "fingers", "feet", "face", "knees", "genitals"],
      configuration: ["solitary", "grouped", "coalescing", "mosaic (plantar)"],
      sensation: ["asymptomatic", "tender with pressure", "painful on feet"],
      chronicity: ["persistent", "can resolve spontaneously", "recalcitrant"],
      triggers: ["HPV infection", "direct contact", "trauma", "immunosuppression", "wet environments"],
      associatedFindings: ["black dots (thrombosed capillaries)", "koebner phenomenon", "bleeding with paring"],
      demographics: ["children", "young adults", "immunocompromised"],
      morphology: ["exophytic", "endophytic", "filiform", "flat-topped", "mosaic"],
      subTypes: ["verruca vulgaris (common wart)", "verruca plantaris (plantar wart)", "verruca plana (flat wart)", "verruca filiformis", "condyloma acuminatum (genital wart)"],
      diagnosis: ["clinical", "dermatoscopy", "paring sign", "HPV typing"]
    },
    "Seborrheic_Keratosis": {
      lesionForm: ["papule", "plaque", "patch"],
      surface: ["warty", "verrucous", "stuck-on appearance", "cerebriform", "fissured"],
      color: ["tan", "brown", "black", "flesh-colored"],
      border: ["sharp", "well-defined", "pseudocorn"],
      distribution: ["trunk", "face", "scalp", "extremities", "sparing palms/soles"],
      configuration: ["solitary", "multiple", "discrete"],
      sensation: ["asymptomatic", "occasionally itchy"],
      chronicity: ["progressive increase in size and number with age"],
      triggers: ["aging", "genetic", "sun exposure", "pregnancy"],
      associatedFindings: ["horn cysts", "milia-like cysts", "Leser-Trélat sign (sudden multiple)"],
      demographics: ["older adults >40yrs", "equal gender"],
      morphology: ["exophytic", "pedunculated", "flat", "elevated"],
      variants: ["acanthotic", "hyperkeratotic", "adenoid", "irritated", "clonal"]
    },
    "Basal_Cell_Carcinoma": {
      lesionForm: ["papule", "nodule", "plaque", "ulcer"],
      surface: ["pearly", "smooth", "telangiectatic", "crusted", "erosive"],
      color: ["flesh-colored", "pink", "red", "brown", "black (pigmented)"],
      border: ["rolled", "well-defined", "translucent", "thread-like"],
      distribution: ["sun-exposed areas", "face", "nose", "ears", "scalp", "shoulders"],
      configuration: ["solitary", "multifocal"],
      sensation: ["asymptomatic", "rarely tender or itchy"],
      chronicity: ["slowly progressive", "months to years"],
      triggers: ["cumulative UV exposure", "fair skin", "genetics", "immunosuppression"],
      associatedFindings: ["telangiectasias", "ulceration", "bleeding", "rodent ulcer"],
      demographics: ["older adults", "fair skin", "male predominance"],
      morphology: ["nodular", "superficial", "morpheaform", "infiltrative", "pigmented", "micronodular"],
      highRiskFeatures: [">2cm", "H-zone of face", "perineural invasion", "recurrent", "aggressive subtype"]
    },
    "Melanoma": {
      lesionForm: ["macule", "patch", "papule", "nodule", "plaque"],
      surface: ["smooth", "verrucous", "erosive", "ulcerated", "bleeding"],
      color: ["multiple colors", "brown", "black", "red", "white", "blue", "pink"],
      border: ["irregular", "notched", "ill-defined", "fuzzy"],
      distribution: ["any site", "back (men)", "legs (women)", "acral", "mucosal"],
      configuration: ["solitary", "satellite lesions"],
      sensation: ["asymptomatic", "pruritic", "tender"],
      chronicity: ["progressive", "changing over weeks to months"],
      triggers: ["intermittent intense sun exposure", "sunburn history", "genetics", "numerous nevi"],
      associatedFindings: ["ABCDE criteria", "regression", "satellitosis", "lymphadenopathy"],
      demographics: ["adults", "fair skin", "increasing incidence with age"],
      morphology: ["superficial spreading", "nodular", "lentigo maligna", "acral lentiginous"],
      prognosis: ["depth (Breslow)", "ulceration", "mitotic rate", "lymph node involvement"]
    },
    "Skin_Tags": {
      lesionForm: ["papule", "pedunculated growth"],
      surface: ["smooth", "soft", "wrinkled"],
      color: ["flesh-colored", "hyperpigmented", "brown"],
      border: ["well-defined", "pedunculated base"],
      distribution: ["neck", "axillae", "groin", "inframammary", "eyelids"],
      configuration: ["solitary", "multiple", "clustered"],
      sensation: ["asymptomatic", "can be irritated by friction"],
      chronicity: ["increase with age and weight gain"],
      triggers: ["obesity", "insulin resistance", "pregnancy", "aging"],
      associatedFindings: ["acanthosis nigricans", "type 2 diabetes", "metabolic syndrome"],
      demographics: ["middle-aged and elderly", "obese individuals"],
      morphology: ["pedunculated", "sessile", "filiform"],
      histology: ["fibrovascular core", "acanthosis", "hyperkeratosis"]
    }
  },

  BLISTERS_OR_SORES: {
    "Herpes_Simplex": {
      lesionForm: ["vesicle", "pustule", "erosion", "ulcer", "crust"],
      surface: ["vesicular", "umbilicated", "crusted"],
      color: ["clear fluid", "yellow pus", "erythematous base"],
      border: ["erythematous halo", "grouped"],
      distribution: ["perioral", "genital", "fingers", "buttocks", "mucosal"],
      configuration: ["grouped", "clustered", "herpetiform"],
      sensation: ["painful", "burning", "tingling prodrome"],
      chronicity: ["recurrent", "episodic"],
      triggers: ["stress", "illness", "fever", "sun exposure", "menstruation", "trauma"],
      associatedFindings: ["lymphadenopathy", "fever", "malaise (primary)", "positive Tzanck smear"],
      demographics: ["all ages", "increasing prevalence with age"],
      morphology: ["umbilicated vesicles", "coalescent", "ruptured vesicles"],
      types: ["HSV-1 (oral)", "HSV-2 (genital)", "neonatal", "disseminated"]
    },
    "Herpes_Zoster": {
      lesionForm: ["vesicle", "pustule", "bullae", "crust", "ulcer"],
      surface: ["vesicular", "hemorrhagic", "necrotic"],
      color: ["clear", "hemorrhagic", "erythematous base"],
      border: ["dermatomal", "sharp midline cut-off"],
      distribution: ["dermatomal", "thoracic", "trigeminal", "lumbar", "sacral"],
      configuration: ["linear", "dermatomal", "unilateral"],
      sensation: ["severe pain", "burning", "allodynia", "dysesthesia"],
      chronicity: ["acute", "post-herpetic neuralgia"],
      triggers: ["VZV reactivation", "aging", "immunosuppression", "stress"],
      associatedFindings: ["prodromal pain", "fever", "malaise", "headache", "ophthalmic involvement"],
      demographics: ["older adults >50yrs", "immunocompromised"],
      morphology: ["grouped vesicles on erythematous base", "dermatomal distribution"],
      complications: ["post-herpetic neuralgia", "dissemination", "ophthalmic", "Ramsay Hunt"]
    },
    "Contact_Dermatitis": {
      lesionForm: ["vesicle", "bulla", "papule", "patch", "plaque"],
      surface: ["vesicular", "weeping", "crusted", "scaly"],
      color: ["erythematous", "red"],
      border: ["ill-defined", "linear streaks", "geometric pattern"],
      distribution: ["exposed areas", "contact sites", "linear streaks"],
      configuration: ["linear", "geometric", "patterned", "diffuse"],
      sensation: ["intensely itchy", "burning", "stinging"],
      chronicity: ["acute", "subacute", "chronic with repeated exposure"],
      triggers: ["allergens (poison ivy, nickel)", "irritants (soap, chemicals)"],
      associatedFindings: ["edema", "oozing", "crusting", "lichenification"],
      demographics: ["all ages", "occupational risk"],
      morphology: ["acute: vesicles/bullae", "subacute: crusts/scales", "chronic: lichenification"],
      types: ["allergic contact dermatitis", "irritant contact dermatitis"]
    },
    "Pemphigus_Vulgaris": {
      lesionForm: ["vesicle", "bulla", "erosion", "ulcer"],
      surface: ["flaccid bullae", "erosions", "denuded skin"],
      color: ["clear fluid", "hemorrhagic crust", "erythematous base"],
      border: ["ill-defined", "irregular"],
      distribution: ["oral mucosa", "scalp", "face", "chest", "upper back", "flexural"],
      configuration: ["widespread", "disseminated"],
      sensation: ["painful", "burning"],
      chronicity: ["chronic", "progressive", "relapsing"],
      triggers: ["autoimmune", "certain medications", "genetic predisposition"],
      associatedFindings: ["positive Nikolsky sign", "mucosal involvement (often first)", "weight loss", "secondary infection"],
      demographics: ["adults 40-60yrs", "more common in Jewish, Mediterranean descent"],
      morphology: ["flaccid bullae", "easily ruptured", "denuded areas"],
      diagnosis: ["Tzanck smear", "direct immunofluorescence", "desmoglein antibodies"]
    },
    "Bullous_Pemphigoid": {
      lesionForm: ["bulla", "vesicle", "urticarial plaque", "erosion"],
      surface: ["tense bullae", "smooth", "clear fluid"],
      color: ["clear", "hemorrhagic", "erythematous base"],
      border: ["well-defined", "tense"],
      distribution: ["flexural areas", "axillae", "groin", "inner thighs", "abdomen"],
      configuration: ["grouped", "disseminated"],
      sensation: ["itchy", "pruritic", "mild burning"],
      chronicity: ["chronic", "self-limited (months to years)", "relapsing"],
      triggers: ["autoimmune", "medications", "neurologic disease"],
      associatedFindings: ["negative Nikolsky sign", "urticarial phase", "eosinophilia"],
      demographics: ["elderly >60yrs"],
      morphology: ["tense bullae", "urticarial plaques", "eczematous lesions"],
      diagnosis: ["direct immunofluorescence", "BP180/BP230 antibodies", "biopsy"]
    }
  },

  CHANGE_IN_COLOR_ONLY: {
    "Vitiligo": {
      lesionForm: ["macule", "patch"],
      surface: ["smooth", "normal texture", "non-scaly"],
      color: ["depigmented", "chalk-white", "ivory"],
      border: ["well-defined", "sharp", "hyperpigmented border", "serrated"],
      distribution: ["periorificial (eyes, mouth)", "acral (hands, feet)", "flexural", "generalized", "segmental"],
      configuration: ["symmetrical", "segmental", "focal", "generalized"],
      sensation: ["asymptomatic"],
      chronicity: ["progressive", "stable", "can repigment"],
      triggers: ["autoimmune", "oxidative stress", "trauma (koebner)", "emotional stress"],
      associatedFindings: ["leukotrichia", "autoimmune thyroid disease", "halo nevi"],
      demographics: ["all ages", "any race", "onset <20yrs in half"],
      morphology: ["well-demarcated white patches", "koebner phenomenon", "confetti-like depigmentation"],
      types: ["segmental", "non-segmental (generalized)", "focal", "acrofacial", "universal"]
    },
    "Melasma": {
      lesionForm: ["macule", "patch"],
      surface: ["smooth", "normal texture"],
      color: ["hyperpigmented", "brown", "gray-brown"],
      border: ["ill-defined", "irregular", "reticulated"],
      distribution: ["face: centrofacial", "malar", "mandibular"],
      configuration: ["symmetrical", "confluent", "reticulated"],
      sensation: ["asymptomatic"],
      chronicity: ["chronic", "worsens with sun", "improves with winter"],
      triggers: ["sun exposure", "pregnancy", "oral contraceptives", "hormonal", "cosmetics"],
      associatedFindings: ["worsens with UV", "hormonal influence"],
      demographics: ["women of reproductive age", "Fitzpatrick skin III-V", "Latina, Asian, Middle Eastern"],
      morphology: ["reticulated hyperpigmentation", "confluent patches"],
      types: ["epidermal", "dermal", "mixed"]
    },
    "Tinea_Versicolor": {
      lesionForm: ["macule", "patch"],
      surface: ["fine scaly", "pityriasiform"],
      color: ["hypopigmented", "hyperpigmented", "pink", "brown"],
      border: ["ill-defined", "confluent"],
      distribution: ["upper trunk", "chest", "back", "shoulders", "neck"],
      configuration: ["confluent", "reticulated", "discrete"],
      sensation: ["mildly itchy", "often asymptomatic"],
      chronicity: ["chronic", "recurrent", "seasonal variation"],
      triggers: ["heat", "humidity", "sweating", "oily skin", "immunosuppression"],
      associatedFindings: ["positive KOH (spaghetti and meatballs)", "malassezia yeast"],
      demographics: ["adolescents", "young adults", "living in tropical climates"],
      morphology: ["fine scaling", "confluent macules", "reticulated pattern"],
      diagnosis: ["KOH preparation", "wood's lamp (yellow-green fluorescence)"]
    },
    "Cafe_au_lait_spots": {
      lesionForm: ["macule", "patch"],
      surface: ["smooth", "normal texture"],
      color: ["light brown", "café-au-lait", "homogeneous"],
      border: ["well-defined", "smooth", "regular"],
      distribution: ["anywhere", "trunk", "extremities"],
      configuration: ["solitary", "multiple", "scattered"],
      sensation: ["asymptomatic"],
      chronicity: ["present at birth or early childhood", "stable", "may enlarge with child"],
      triggers: ["genetic", "neurofibromatosis", "other syndromes"],
      associatedFindings: ["neurofibromatosis type 1 (>5 spots)", "McCune-Albright syndrome", "Legius syndrome"],
      demographics: ["present from birth/early childhood", "all races"],
      morphology: ["uniform pigmentation", "oval", "smooth borders"],
      syndromes: ["NF1: axillary freckling, Lisch nodules, neurofibromas", "McCune-Albright: polyostotic fibrous dysplasia"]
    },
    "Lentigo": {
      lesionForm: ["macule", "patch"],
      surface: ["smooth", "normal texture"],
      color: ["brown", "tan", "dark brown"],
      border: ["well-defined", "regular", "slightly irregular"],
      distribution: ["sun-exposed areas", "face", "hands", "arms", "chest", "shoulders"],
      configuration: ["solitary", "multiple", "scattered"],
      sensation: ["asymptomatic"],
      chronicity: ["slowly progressive", "increase with age"],
      triggers: ["chronic sun exposure", "aging", "genetic"],
      associatedFindings: ["sun-damaged skin", "actinic changes"],
      demographics: ["older adults", "fair skin"],
      morphology: ["small", "circular", "oval", "uniform color"],
      types: ["solar lentigo", "lentigo simplex", "PUVA lentigo", "ink-spot lentigo"]
    }
  }
};

// Helper function to get disease names by index
export const diseaseIndexMap = {
  "0": "Acne",
  "1": "Dermatitis", 
  "2": "Molluscum Contagiosum",
  "3": "Ringworm",
  "4": "Vitiligo",
  "5": "Warts"
};

// Helper to get attributes by index
export function getDiseaseAttributesByIndex(index) {
  const diseaseName = diseaseIndexMap[index];
  
  // Search through all categories to find the disease
  for (const category of Object.values(attributes)) {
    if (category[diseaseName]) {
      return category[diseaseName];
    }
  }
  return null;
}