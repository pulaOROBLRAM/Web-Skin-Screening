export const DISEASES = {
  RASH_OR_REDNESS: {
    "Acne": {
      q1: { a: 10 }, // Rash/redness - papules, pustules, inflammatory lesions
      q2: { b: 8, c: 10 }, // Painful/tender (b=8 for tenderness, c=10 for pain)
      q3: { a: 10, b: 7 }, // Chronic/relapsing (a=10), waxes/wanes with hormones (b=7)
      q4: { a: 10, b: 8 } // Scarring (a=10), oily skin/seborrhea (b=8)
    },
    "Dermatitis": {
      q1: { a: 10 }, // Rash/redness - patches, plaques, inflammation
      q2: { a: 10 }, // Intensely itchy/pruritic (a=10)
      q3: { a: 10, b: 8, d: 5 }, // Acute flares (a=10), chronic/relapsing (b=8), triggers (d=5)
      q4: { b: 10, d: 6 } // Dry skin/xerosis (b=10), environmental triggers (d=6)
    },
    "Ringworm": {
      q1: { a: 10 }, // Rash/redness - annular lesions with central clearing
      q2: { a: 8 }, // Itchy/pruritic (a=8)
      q3: { a: 10, d: 8 }, // Acute onset (a=10), persistent without treatment (d=8)
      q4: { a: 10, d: 5 } // Spreading/expanding border (a=10), contact with animals (d=5)
    },
    "Psoriasis": {
      q1: { a: 10 },
      q2: { d: 10 },
      q3: { a: 7, b: 4, c: 10, d: 6 },
      q4: { a: 4, b: 6, c: 10, d: 2 }
    },
    "Atopic_Dermatitis": {
      q1: { a: 10 },
      q2: { a: 10 },
      q3: { a: 7, b: 5, c: 10, d: 6 },
      q4: { b: 10, d: 6 }
    },
    "Seborrheic_Dermatitis": {
      q1: { a: 10 },
      q2: { a: 10 },
      q3: { a: 8, b: 6, c: 10, d: 5 },
      q4: { d: 10 }
    },
    "Rosacea": {
      q1: { a: 10 },
      q2: { a: 7, b: 8, d: 10 },
      q3: { a: 9, b: 5, c: 10, d: 6 },
      q4: { d: 10 }
    },
    "Lupus": {
      q1: { a: 10 },
      q2: { a: 6, c: 10 },
      q3: { a: 10, b: 5, c: 9, d: 4 },
      q4: { a: 9, b: 8, c: 10, d: 1 }
    }
  },

  GROWTH_OR_LUMP: {
    "Molluscum Contagiosum": {
      q1: { b: 10 }, // Growth/lump - dome-shaped papules
      q2: { d: 8 }, // Usually asymptomatic (d=8), mildly itchy if inflamed (a=4)
      q3: { c: 10, d: 7 }, // Persistent (c=10), self-limited over months (d=7)
      q4: { b: 10, d: 6 } // Umbilicated lesions (b=10), children/immunocompromised (d=6)
    },
    "Warts": {
      q1: { b: 10 }, // Growth/lump - verrucous papules/nodules
      q2: { d: 8, c: 6 }, // Usually asymptomatic (d=8), tender with pressure (c=6)
      q3: { c: 10, d: 8 }, // Persistent (c=10), can resolve spontaneously (d=8)
      q4: { a: 10, d: 7 } // Rough/cauliflower surface (a=10), black dots (d=7)
    },
    "Seborrheic_Keratosis": {
      q1: { b: 10 },
      q2: { c: 10 },
      q3: { a: 8, b: 10 },
      q4: { b: 3, d: 10 }
    },
    "Basal_Cell_Carcinoma": {
      q1: { b: 10 },
      q2: { c: 10 },
      q3: { a: 10, b: 6 },
      q4: { d: 10 }
    },
    "Melanoma": {
      q1: { b: 10 },
      q2: { c: 10 },
      q3: { a: 10, d: 8 },
      q4: { b: 8, c: 7, d: 6 }
    },
    "Skin_Tags": {
      q1: { b: 10 },
      q2: { c: 10 },
      q3: { a: 5, b: 10 },
      q4: { d: 10 }
    }
  },

  BLISTERS_OR_SORES: {
    "Herpes_Simplex": {
      q1: { c: 10 },
      q2: { b: 10 },
      q3: { a: 6, b: 5, c: 10, d: 8 },
      q4: { a: 8, b: 9, d: 6 }
    },
    "Herpes_Zoster": {
      q1: { c: 10 },
      q2: { b: 10 },
      q3: { a: 9, b: 4, d: 10 },
      q4: { a: 10, b: 9, d: 5 }
    },
    "Contact_Dermatitis": {
      q1: { c: 10 },
      q2: { a: 10 },
      q3: { a: 8, b: 4, c: 6, d: 10 },
      q4: { d: 10 }
    },
    "Pemphigus_Vulgaris": {
      q1: { c: 10 },
      q2: { b: 10 },
      q3: { a: 10 },
      q4: { a: 7, b: 10, d: 6 }
    },
    "Bullous_Pemphigoid": {
      q1: { c: 10 },
      q2: { a: 10 },
      q3: { a: 8, b: 5, c: 10, d: 7 },
      q4: { b: 8, d: 10 }
    }
  },

  CHANGE_IN_COLOR_ONLY: {
    "Vitiligo": {
      q1: { d: 10 }, // Change in color - depigmented macules/patches
      q2: { d: 10 }, // Asymptomatic (d=10) - no sensation
      q3: { c: 10, d: 8 }, // Progressive (c=10), stable periods (d=8)
      q4: { b: 10, d: 6 } // Well-defined white patches (b=10), autoimmune associations (d=6)
    },
    "Melasma": {
      q1: { d: 10 },
      q2: { c: 10 },
      q3: { a: 7, b: 9, c: 8, d: 5 },
      q4: { d: 10 }
    },
    "Tinea_Versicolor": {
      q1: { d: 10 },
      q2: { a: 10 },
      q3: { a: 8, b: 6, c: 10, d: 5 },
      q4: { d: 10 }
    },
    "Cafe_au_lait_spots": {
      q1: { d: 10 },
      q2: { c: 10 },
      q3: { a: 6, b: 10 },
      q4: { b: 4, d: 10 }
    },
    "Lentigo": {
      q1: { d: 10 },
      q2: { c: 10 },
      q3: { a: 6, b: 10, d: 5 },
      q4: { d: 10 }
    }
  }
};