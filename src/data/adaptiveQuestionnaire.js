// src/data/adaptiveQuestionnaire.js
import { DISEASES } from './diseases.js';

// Adaptive Questionnaire System - Updated with comprehensive coverage
export const ADAPTIVE_QUESTIONS = {
  // Initial branching question
  q1: {
    id: "q1",
    text: "What best describes your primary skin concern?",
    options: {
      a: { text: "Rash, redness, or scaly patches", nextQuestion: "rash" },
      b: { text: "Growth, lump, or bump", nextQuestion: "growth" },
      c: { text: "Blisters, sores, or ulcers", nextQuestion: "blister" },
      d: { text: "Change in skin color only (no texture change)", nextQuestion: "color" }
    }
  },

  // ==================== RASH/REDNESS BRANCH ====================
  rash: {
    q2: {
      id: "q2",
      text: "What best describes the surface texture?",
      options: {
        a: { text: "Silvery, thick scales that flake off", nextQuestion: "rash_silvery" },
        b: { text: "Greasy, yellowish scales", nextQuestion: "rash_greasy" },
        c: { text: "Dry, rough, or cracked", nextQuestion: "rash_dry" },
        d: { text: "Wet, weeping, or oozing", nextQuestion: "rash_wet" },
        e: { text: "Inflamed or pus-filled bumps", nextQuestion: "rash_bumps" },
        f: { text: "Ring-shaped with clear center", nextQuestion: "rash_ring" }
      }
    }
  },

  // Silvery scales - Psoriasis
  rash_silvery: {
    q3: {
      id: "q3",
      text: "Where are these silvery scales located?",
      options: {
        a: { text: "Elbows and knees", disease: "Psoriasis" },
        b: { text: "Scalp", disease: "Psoriasis" },
        c: { text: "Lower back", disease: "Psoriasis" },
        d: { text: "Nails (pitting or discoloration)", disease: "Psoriasis" },
        e: { text: "Multiple areas", disease: "Psoriasis" }
      }
    }
  },

  // Greasy scales - Seborrheic Dermatitis
  rash_greasy: {
    q3: {
      id: "q3",
      text: "Where are these greasy, yellowish scales located?",
      options: {
        a: { text: "Scalp", disease: "Seborrheic_Dermatitis" },
        b: { text: "Eyebrows", disease: "Seborrheic_Dermatitis" },
        c: { text: "Sides of nose", disease: "Seborrheic_Dermatitis" },
        d: { text: "Chest (sternal area)", disease: "Seborrheic_Dermatitis" },
        e: { text: "Behind ears", disease: "Seborrheic_Dermatitis" }
      }
    }
  },

  // Dry patches - Atopic Dermatitis, Contact Dermatitis, etc.
  rash_dry: {
    q3: {
      id: "q3",
      text: "What best describes the shape or pattern?",
      options: {
        a: { text: "Ring-shaped with clear center", disease: "Ringworm" },
        b: { text: "Round but solid patch", nextQuestion: "rash_dry_location" },
        c: { text: "Irregular shape", nextQuestion: "rash_dry_location" },
        d: { text: "Linear or geometric pattern", disease: "Contact_Dermatitis" }
      }
    },
    rash_dry_location: {
      q4: {
        id: "q4",
        text: "Where are these dry, rough patches located?",
        options: {
          a: { text: "Elbow creases or behind knees", nextQuestion: "rash_dry_atopic" },
          b: { text: "Face and neck", nextQuestion: "rash_dry_atopic" },
          c: { text: "Hands", nextQuestion: "rash_dry_contact" },
          d: { text: "Widespread", nextQuestion: "rash_dry_general" },
          e: { text: "Scalp (with dandruff)", disease: "Seborrheic_Dermatitis" }
        }
      }
    },
    rash_dry_atopic: {
      q5: {
        id: "q5",
        text: "Do you have a history of allergies, asthma, or hay fever?",
        options: {
          a: { text: "Yes", disease: "Atopic_Dermatitis" },
          b: { text: "No", disease: "Dermatitis" }
        }
      }
    },
    rash_dry_contact: {
      q5: {
        id: "q5",
        text: "Did this appear after contact with something new?",
        options: {
          a: { text: "Yes, after new soap, detergent, or lotion", disease: "Contact_Dermatitis" },
          b: { text: "Yes, after new jewelry or metal", disease: "Contact_Dermatitis" },
          c: { text: "Yes, after poison ivy or plants", disease: "Contact_Dermatitis_Acute" },
          d: { text: "No, no clear trigger", disease: "Dermatitis" }
        }
      }
    },
    rash_dry_general: {
      q5: {
        id: "q5",
        text: "How long have you had this?",
        options: {
          a: { text: "Since childhood", disease: "Atopic_Dermatitis" },
          b: { text: "Developed recently", disease: "Dermatitis" },
          c: { text: "Comes and goes with stress", disease: "Dermatitis" }
        }
      }
    }
  },

  // Ringworm branch
  rash_ring: {
    q3: {
      id: "q3",
      text: "What best describes the ring-shaped lesion?",
      options: {
        a: { text: "Single ring with raised border and clear center", disease: "Ringworm" },
        b: { text: "Multiple rings that may overlap", disease: "Ringworm" },
        c: { text: "Ring shape with scaling on the edge", disease: "Ringworm" },
        d: { text: "Bullseye pattern (target-like)", nextQuestion: "rash_ring_lyme" }
      }
    },
    rash_ring_lyme: {
      q4: {
        id: "q4",
        text: "Have you had a tick bite or been in wooded areas recently?",
        options: {
          a: { text: "Yes, and I've had flu-like symptoms", disease: "Lyme_Disease" },
          b: { text: "Yes, but no other symptoms", nextQuestion: "rash_ring_fungal" },
          c: { text: "No", disease: "Ringworm" }
        }
      },
      rash_ring_fungal: {
        q5: {
          id: "q5",
          text: "Where is the ring-shaped rash located?",
          options: {
            a: { text: "Body, arms, or legs", disease: "Ringworm" },
            b: { text: "Feet (athlete's foot)", disease: "Ringworm" },
            c: { text: "Groin area (jock itch)", disease: "Ringworm" },
            d: { text: "Scalp with hair loss", disease: "Ringworm" }
          }
        }
      }
    }
  },

  // Wet lesions
  rash_wet: {
    q3: {
      id: "q3",
      text: "What best describes the weeping/oozing area?",
      options: {
        a: { text: "Honey-colored crusts around mouth/nose", disease: "Impetigo" },
        b: { text: "In a straight line or geometric pattern", disease: "Contact_Dermatitis_Acute" },
        c: { text: "Clustered blisters on lips or genitals", disease: "Herpes_Simplex" },
        d: { text: "Widespread with no pattern", disease: "Contact_Dermatitis" }
      }
    }
  },

  // Inflamed bumps
  rash_bumps: {
    q3: {
      id: "q3",
      text: "What best describes these bumps?",
      options: {
        a: { text: "Small red bumps with blackheads or whiteheads", nextQuestion: "rash_acne_age" },
        b: { text: "Red bumps on cheeks, nose, chin (no blackheads)", nextQuestion: "rash_rosacea" },
        c: { text: "Pus-filled bumps on face and chest", nextQuestion: "rash_acne_age" },
        d: { text: "Firm, red bumps that may have a dimple", disease: "Molluscum_Contagiosum" },
        e: { text: "Small red bumps with silvery scales", disease: "Psoriasis_Guttate" }
      }
    },
    rash_acne_age: {
      q4: {
        id: "q4",
        text: "What is your age range?",
        options: {
          a: { text: "Under 20", disease: "Acne" },
          b: { text: "20-30", disease: "Acne" },
          c: { text: "30-40", nextQuestion: "rash_acne_adult" },
          d: { text: "Over 40", nextQuestion: "rash_acne_adult" }
        }
      },
      rash_acne_adult: {
        q5: {
          id: "q5",
          text: "Do you have any of these?",
          options: {
            a: { text: "Hormonal changes (pregnancy, menopause)", disease: "Acne" },
            b: { text: "Redness and flushing", disease: "Rosacea" },
            c: { text: "None of the above", disease: "Acne" }
          }
        }
      }
    },
    rash_rosacea: {
      q4: {
        id: "q4",
        text: "Do you experience facial flushing with:",
        options: {
          a: { text: "Spicy foods or alcohol", disease: "Rosacea" },
          b: { text: "Sun exposure", disease: "Rosacea" },
          c: { text: "No specific triggers", disease: "Rosacea" }
        }
      }
    }
  },

  // ==================== GROWTH/LUMP BRANCH ====================
  growth: {
    q2: {
      id: "q2",
      text: "What best describes the growth?",
      options: {
        a: { text: "Rough, cauliflower-like surface", nextQuestion: "growth_wart" },
        b: { text: "Waxy, stuck-on appearance", nextQuestion: "growth_keratosis" },
        c: { text: "Soft, flesh-colored, on a stalk", nextQuestion: "growth_skin_tag" },
        d: { text: "Smooth, round lump under skin", nextQuestion: "growth_cyst" },
        e: { text: "Flat or slightly raised, uniform color", nextQuestion: "growth_mole" },
        f: { text: "Firm, dome-shaped with central dimple", disease: "Molluscum_Contagiosum" },
        g: { text: "Red, inflamed, or pus-filled bumps (pimples)", nextQuestion: "rash_bumps" }
      }
    }
  },

  growth_wart: {
    q3: {
      id: "q3",
      text: "Where is it located?",
      options: {
        a: { text: "Hands or feet", disease: "Warts" },
        b: { text: "Face", disease: "Warts" },
        c: { text: "Knees", disease: "Warts" },
        d: { text: "Genital area", disease: "Warts" }
      }
    }
  },

  growth_keratosis: {
    q3: {
      id: "q3",
      text: "What is your age?",
      options: {
        a: { text: "Over 40", disease: "Seborrheic_Keratosis" },
        b: { text: "Under 40", nextQuestion: "growth_keratosis_young" }
      }
    },
    growth_keratosis_young: {
      q4: {
        id: "q4",
        text: "Has this growth changed recently?",
        options: {
          a: { text: "Yes, it's growing or changing color", disease: "Seborrheic_Keratosis" },
          b: { text: "No, stable", disease: "Moles" }
        }
      }
    }
  },

  growth_skin_tag: {
    q3: {
      id: "q3",
      text: "Where is it located?",
      options: {
        a: { text: "Neck", disease: "Skin_Tags" },
        b: { text: "Underarms", disease: "Skin_Tags" },
        c: { text: "Groin", disease: "Skin_Tags" },
        d: { text: "Eyelids", disease: "Skin_Tags" }
      }
    }
  },

  growth_cyst: {
    q3: {
      id: "q3",
      text: "Does it have a small central opening?",
      options: {
        a: { text: "Yes", disease: "Cysts" },
        b: { text: "No", disease: "Cysts" },
        c: { text: "Painful and red", disease: "Cysts_Abscess" }
      }
    }
  },

  growth_mole: {
    q3: {
      id: "q3",
      text: "What is the color?",
      options: {
        a: { text: "Tan or brown, uniform", nextQuestion: "growth_mole_uniform" },
        b: { text: "Flesh-colored", disease: "Moles" },
        c: { text: "Multiple colors or irregular", disease: "Suspicious_Mole" },
        d: { text: "Blue or black", disease: "Suspicious_Mole" }
      }
    },
    growth_mole_uniform: {
      q4: {
        id: "q4",
        text: "Is the mole:",
        options: {
          a: { text: "Round with smooth edges", disease: "Moles" },
          b: { text: "Irregular shape or jagged edges", disease: "Suspicious_Mole" },
          c: { text: "Has it changed recently?", disease: "Suspicious_Mole" }
        }
      }
    }
  },

  // ==================== BLISTER/SORES BRANCH ====================
  blister: {
    q2: {
      id: "q2",
      text: "What best describes the blisters or sores?",
      options: {
        a: { text: "Clustered blisters on lips or genitals", nextQuestion: "blister_herpes" },
        b: { text: "Painful blisters in a band on one side", disease: "Herpes_Zoster" },
        c: { text: "Honey-colored crusts", disease: "Impetigo" },
        d: { text: "Blisters in a line after touching something", disease: "Contact_Dermatitis_Acute" },
        e: { text: "Large blisters with clear fluid", nextQuestion: "blister_autoimmune" },
        f: { text: "Single, painful, pus-filled lump or sore", disease: "Cysts_Abscess" }
      }
    },
    blister_herpes: {
      q3: {
        id: "q3",
        text: "Do you get these recurrently?",
        options: {
          a: { text: "Yes, they come back", disease: "Herpes_Simplex" },
          b: { text: "No, first time", disease: "Herpes_Simplex" }
        }
      }
    },
    blister_autoimmune: {
      q3: {
        id: "q3",
        text: "Are there blisters in your mouth?",
        options: {
          a: { text: "Yes", disease: "Pemphigus_Vulgaris" },
          b: { text: "No", disease: "Bullous_Pemphigoid" }
        }
      }
    }
  },

  // ==================== COLOR CHANGE BRANCH ====================
  color: {
    q2: {
      id: "q2",
      text: "What color change do you see?",
      options: {
        a: { text: "White, chalky patches", nextQuestion: "color_white" },
        b: { text: "Brown patches", nextQuestion: "color_brown" },
        c: { text: "Light spots (lighter than skin)", nextQuestion: "color_light" },
        d: { text: "Dark spots (darker than skin)", nextQuestion: "color_dark" },
        e: { text: "Red or pink patches", nextQuestion: "color_pink" }
      }
    }
  },

  color_white: {
    q3: {
      id: "q3",
      text: "Are the white patches:",
      options: {
        a: { text: "Well-defined with sharp borders", nextQuestion: "color_vitiligo" },
        b: { text: "Poorly defined, on upper chest/back", disease: "Tinea_Versicolor" },
        c: { text: "Present since birth", disease: "Nevus_Depigmentosus" }
      }
    },
    color_vitiligo: {
      q4: {
        id: "q4",
        text: "Is there white hair in the patches?",
        options: {
          a: { text: "Yes", disease: "Vitiligo" },
          b: { text: "No", disease: "Vitiligo" }
        }
      }
    }
  },

  color_brown: {
    q3: {
      id: "q3",
      text: "Where are the brown patches located?",
      options: {
        a: { text: "Cheeks, forehead, upper lip (butterfly pattern)", nextQuestion: "color_melasma" },
        b: { text: "Sun-exposed areas (face, hands, arms)", disease: "Lentigo" },
        c: { text: "Anywhere, present since birth", disease: "Cafe_au_lait_spots" },
        d: { text: "Scaly, irregular patches", disease: "Seborrheic_Keratosis" }
      }
    },
    color_melasma: {
      q4: {
        id: "q4",
        text: "Are you pregnant or taking birth control?",
        options: {
          a: { text: "Yes", disease: "Melasma" },
          b: { text: "No", disease: "Melasma" }
        }
      }
    }
  },

  color_light: {
    q3: {
      id: "q3",
      text: "Where are the light spots located?",
      options: {
        a: { text: "Upper chest, back, shoulders", disease: "Tinea_Versicolor" },
        b: { text: "Face, hands, body folds", disease: "Vitiligo" },
        c: { text: "Anywhere, after sun exposure", disease: "Idiopathic_Guttate_Hypomelanosis" }
      }
    }
  },

  color_dark: {
    q3: {
      id: "q3",
      text: "Where are the dark spots located?",
      options: {
        a: { text: "Sun-exposed areas", disease: "Lentigo" },
        b: { text: "Anywhere, multiple", disease: "Cafe_au_lait_spots" },
        c: { text: "After skin injury or inflammation", disease: "Post_Inflammatory_Hyperpigmentation" }
      }
    }
  },

  color_pink: {
    q3: {
      id: "q3",
      text: "Are the pink patches:",
      options: {
        a: { text: "Scaly with fine flakes", disease: "Tinea_Versicolor" },
        b: { text: "Smooth and slightly raised", disease: "Granuloma_Annulare" },
        c: { text: "With a herald patch (single large patch)", disease: "Pityriasis_Rosea" },
        d: { text: "Ring-shaped with a clearer center", disease: "Ringworm" }
      }
    }
  }
};

// ==================== ADAPTIVE DIAGNOSIS ENGINE ====================
// Dynamically resolves disease info from DISEASES — no hardcoded confidence/warning in options

export const diagnoseAdaptive = (answers) => {
  const results = [];

  // Traverse the adaptive question tree
  const traverse = (node, answer) => {
    if (!node || !answer) return null;

    let question;

    if (node.options) {
      question = node;
    } else {
      const questionKeys = Object.keys(node).filter(key => key.startsWith('q'));
      if (questionKeys.length === 0) return null;
      question = node[questionKeys[0]];
    }

    const option = question.options[answer];
    if (!option) return null;

    // If option resolves to a disease, look it up dynamically from DISEASES
    if (option.disease) {
      const diseaseId = option.disease;
      const diseaseData = DISEASES[diseaseId] || {};
      results.push({
        id: diseaseId,
        name: diseaseData.displayName || diseaseId,
        category: diseaseData.category || null,
        confidence: diseaseData.confidence || 80,
        warning: diseaseData.warning || null,
        texture: diseaseData.texture || [],
        elevation: diseaseData.elevation || [],
        ages: diseaseData.ages || []
      });
      return diseaseId;
    }

    // If option has nextQuestion, continue traversal
    if (option.nextQuestion) {
      const nextNode = ADAPTIVE_QUESTIONS[option.nextQuestion];
      if (nextNode) {
        let nextQuestionId;
        if (nextNode.id) {
          nextQuestionId = nextNode.id;
        } else {
          const nextQuestionKeys = Object.keys(nextNode).filter(key => key.startsWith('q'));
          if (nextQuestionKeys.length > 0) {
            nextQuestionId = nextNode[nextQuestionKeys[0]].id;
          }
        }
        const nextAnswer = answers[nextQuestionId];
        if (nextAnswer) {
          return traverse(nextNode, nextAnswer);
        }
      }
    }

    return null;
  };

  traverse(ADAPTIVE_QUESTIONS.q1, answers.q1);

  if (results.length === 0) {
    return diagnoseDisease(answers);
  }

  return results;
};
