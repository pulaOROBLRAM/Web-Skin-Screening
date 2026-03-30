export const DISEASES = {
  //RASH/REDNESS BRANCH  
  "Psoriasis": {
    id: "Psoriasis",
    displayName: "Psoriasis",
    category: "RASH_OR_REDNESS",
    texture: ["rough", "crust"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 90
  },

  "Seborrheic_Dermatitis": {
    id: "Seborrheic_Dermatitis",
    displayName: "Seborrheic Dermatitis",
    category: "RASH_OR_REDNESS",
    texture: ["crust", "oozing"],
    elevation: ["flat", "raised"],
    ages: ["infant", "adult", "senior"],
    confidence: 95
  },

  "Ringworm": {
    id: "Ringworm",
    displayName: "Ringworm",
    category: "RASH_OR_REDNESS",
    texture: ["rough", "crust"],
    elevation: ["flat", "raised"],
    ages: ["child", "teen", "adult"],
    confidence: 95
  },


  "Lyme_Disease": {
    id: "Lyme_Disease",
    displayName: "Lyme Disease",
    category: "RASH_OR_REDNESS",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 95,
    warning: "Seek medical attention immediately"
  },

  "Atopic_Dermatitis": {
    id: "Atopic_Dermatitis",
    displayName: "Atopic Dermatitis",
    category: "RASH_OR_REDNESS",
    texture: ["rough", "oozing", "crust"],
    elevation: ["flat", "raised"],
    ages: ["infant", "child", "teen", "adult"],
    confidence: 95
  },

  "Contact_Dermatitis": {
    id: "Contact_Dermatitis",
    displayName: "Contact Dermatitis",
    category: "RASH_OR_REDNESS",
    texture: ["rough", "oozing"],
    elevation: ["flat", "raised"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 90
  },

  "Contact_Dermatitis_Acute": {
    id: "Contact_Dermatitis_Acute",
    displayName: "Acute Contact Dermatitis",
    category: "RASH_OR_REDNESS",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 92
  },

  "Impetigo": {
    id: "Impetigo",
    displayName: "Impetigo",
    category: "RASH_OR_REDNESS",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["infant", "child", "teen"],
    confidence: 95
  },

  "Acne": {
    id: "Acne",
    displayName: "Acne",
    category: "RASH_OR_REDNESS",
    texture: ["smooth", "crust", "oozing"],
    elevation: ["raised"],
    ages: ["teen", "adult"],
    confidence: 95
  },

  "Rosacea": {
    id: "Rosacea",
    displayName: "Rosacea",
    category: "RASH_OR_REDNESS",
    texture: ["smooth", "rough"],
    elevation: ["flat", "raised"],
    ages: ["adult", "senior"],
    confidence: 92
  },

  "Psoriasis_Guttate": {
    id: "Psoriasis_Guttate",
    displayName: "Guttate Psoriasis",
    category: "RASH_OR_REDNESS",
    texture: ["rough", "crust"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult"],
    confidence: 85
  },

  "Molluscum_Contagiosum": {
    id: "Molluscum_Contagiosum",
    displayName: "Molluscum Contagiosum",
    category: "RASH_OR_REDNESS",
    texture: ["smooth"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult"],
    confidence: 92
  },

  "Dermatitis": {
    id: "Dermatitis",
    displayName: "Dermatitis",
    category: "RASH_OR_REDNESS",
    texture: ["rough"],
    elevation: ["flat", "raised"],
    ages: ["infant", "child", "teen", "adult", "senior"],
    confidence: 75
  },

  // GROWTH/LUMP BRANCH  
  "Warts": {
    id: "Warts",
    displayName: "Warts",
    category: "GROWTH_OR_LUMP",
    texture: ["rough"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult"],
    confidence: 95
  },

  "Genital_Warts": {
    id: "Genital_Warts",
    displayName: "Genital Warts (HPV)",
    category: "GROWTH_OR_LUMP",
    texture: ["rough"],
    elevation: ["raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 95,
    warning: "Consult a healthcare provider; potential STI and malignancy risk"
  },


  "Seborrheic_Keratosis": {
    id: "Seborrheic_Keratosis",
    displayName: "Seborrheic Keratosis",
    category: "GROWTH_OR_LUMP",
    texture: ["rough", "crust"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 95
  },

  "Skin_Tags": {
    id: "Skin_Tags",
    displayName: "Skin Tags",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 95
  },

  "Cysts": {
    id: "Cysts",
    displayName: "Cysts",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth"],
    elevation: ["raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 90
  },

  "Cysts_Abscess": {
    id: "Cysts_Abscess",
    displayName: "Infected Cyst / Abscess",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth", "oozing"],
    elevation: ["raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 85
  },

  "Moles": {
    id: "Moles",
    displayName: "Moles",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth"],
    elevation: ["flat", "raised"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 90
  },

  "Suspicious_Mole": {
    id: "Suspicious_Mole",
    displayName: "Suspicious Mole",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth", "rough", "crust"],
    elevation: ["flat", "raised"],
    ages: ["adult", "senior"],
    confidence: 95,
    warning: "Consult a dermatologist immediately to rule out Melanoma"
  },

  //BLISTER/SORES BRANCH  
  "Herpes_Simplex": {
    id: "Herpes_Simplex",
    displayName: "Cold Sores / Herpes",
    category: "BLISTERS_OR_SORES",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 95
  },

  "Herpes_Zoster": {
    id: "Herpes_Zoster",
    displayName: "Shingles",
    category: "BLISTERS_OR_SORES",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 95
  },

  "Pemphigus_Vulgaris": {
    id: "Pemphigus_Vulgaris",
    displayName: "Pemphigus Vulgaris",
    category: "BLISTERS_OR_SORES",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 85,
    warning: "Seek medical attention"
  },

  "Bullous_Pemphigoid": {
    id: "Bullous_Pemphigoid",
    displayName: "Bullous Pemphigoid",
    category: "BLISTERS_OR_SORES",
    texture: ["oozing", "crust"],
    elevation: ["raised"],
    ages: ["senior"],
    confidence: 80,
    warning: "Seek medical attention"
  },

  //COLOR CHANGE BRANCH  
  "Vitiligo": {
    id: "Vitiligo",
    displayName: "Vitiligo",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 95
  },

  "Tinea_Versicolor": {
    id: "Tinea_Versicolor",
    displayName: "Tinea Versicolor",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth", "rough"],
    elevation: ["flat"],
    ages: ["teen", "adult"],
    confidence: 92
  },

  "Nevus_Depigmentosus": {
    id: "Nevus_Depigmentosus",
    displayName: "Nevus Depigmentosus",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["infant", "child"],
    confidence: 85
  },

  "Melasma": {
    id: "Melasma",
    displayName: "Melasma",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["adult", "senior"],
    confidence: 95
  },

  "Lentigo": {
    id: "Lentigo",
    displayName: "Age Spots / Lentigo",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["adult", "senior"],
    confidence: 90
  },

  "Cafe_au_lait_spots": {
    id: "Cafe_au_lait_spots",
    displayName: "Café au Lait Spots",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["infant", "child", "teen", "adult", "senior"],
    confidence: 85
  },

  "Post_Inflammatory_Hyperpigmentation": {
    id: "Post_Inflammatory_Hyperpigmentation",
    displayName: "Post-Inflammatory Hyperpigmentation",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["infant", "child", "teen", "adult", "senior"],
    confidence: 88
  },

  "Idiopathic_Guttate_Hypomelanosis": {
    id: "Idiopathic_Guttate_Hypomelanosis",
    displayName: "Idiopathic Guttate Hypomelanosis",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["adult", "senior"],
    confidence: 88
  },

  "Granuloma_Annulare": {
    id: "Granuloma_Annulare",
    displayName: "Granuloma Annulare",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth", "rough"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult"],
    confidence: 80
  },

  "Pityriasis_Rosea": {
    id: "Pityriasis_Rosea",
    displayName: "Pityriasis Rosea",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["rough", "crust"],
    elevation: ["flat", "raised"],
    ages: ["child", "teen", "adult"],
    confidence: 88
  },

  "Dyschromia": {
    id: "Dyschromia",
    displayName: "Dyschromia / Pigmentation Disorder",
    category: "CHANGE_IN_COLOR_ONLY",
    texture: ["smooth"],
    elevation: ["flat"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 80
  },

  // NEW CLINICAL PATHWAYS ADDED 
  "Folliculitis": {
    id: "Folliculitis",
    displayName: "Folliculitis",
    category: "RASH_OR_REDNESS",
    texture: ["smooth", "oozing"],
    elevation: ["raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 90
  },

  "Lipoma": {
    id: "Lipoma",
    displayName: "Lipoma",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth"],
    elevation: ["raised"],
    ages: ["adult", "senior"],
    confidence: 95
  },

  "Keloids": {
    id: "Keloids",
    displayName: "Keloids",
    category: "GROWTH_OR_LUMP",
    texture: ["smooth", "rough"],
    elevation: ["raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 95
  },

  "Cellulitis": {
    id: "Cellulitis",
    displayName: "Cellulitis",
    category: "RASH_OR_REDNESS",
    texture: ["smooth", "oozing"],
    elevation: ["flat", "raised"],
    ages: ["infant", "child", "teen", "adult", "senior"],
    confidence: 95,
    warning: "Seek medical attention immediately"
  },

  "Boils": {
    id: "Boils",
    displayName: "Boils (Furuncles)",
    category: "GROWTH_OR_LUMP", // Even though it's pus, clinically it is a localized growth/lump
    texture: ["smooth", "oozing"],
    elevation: ["raised"],
    ages: ["child", "teen", "adult", "senior"],
    confidence: 95,
    warning: "Applying warm compresses can help; avoid popping. If severe, see a doctor."
  },

  "Lupus": {
    id: "Lupus",
    displayName: "Lupus (Cutaneous / Systemic)",
    category: "RASH_OR_REDNESS",
    texture: ["smooth", "rough"],
    elevation: ["flat", "raised"],
    ages: ["teen", "adult", "senior"],
    confidence: 85,
    warning: "May require rheumatology or dermatology evaluation"
  }
};

// Helper function to get disease by ID
export const getDiseaseById = (id) => {
  return DISEASES[id] || null;
};