export const CATEGORY_QUESTIONS = {
  INFLAMMATORY: [
    // Acne
    { id: 1, text: "Are there plugged pores (blackheads/whiteheads)?", options: ["Yes", "Not at all"], attribute: 'acne_plugged_pores' },
    { id: 2, text: "Does the severity flare up based on your hormonal cycle?", options: ["Yes", "Not at all"], attribute: 'acne_hormonal' },
    { id: 3, text: "Do you notice 'cysts' that feel deep and painful under the skin?", options: ["Yes", "Not at all"], attribute: 'acne_cysts' },
    // Atopic Dermatitis
    { id: 4, text: "Did this start in childhood and does it itch before it appears red?", options: ["Yes", "Not at all"], attribute: 'atopic_childhood_itch' },
    { id: 5, text: "Does your skin feel excessively dry even when no rash is present?", options: ["Yes", "Not at all"], attribute: 'atopic_dry' },
    { id: 6, text: "Do you have a personal or family history of asthma/allergies?", options: ["Yes", "Not at all"], attribute: 'atopic_history' },
    // Contact Dermatitis
    { id: 7, text: "Did you recently use a new soap, perfume, or wear new jewelry?", options: ["Yes", "Not at all"], attribute: 'contact_new' },
    { id: 8, text: "Did the rash appear within 48 hours of using a specific product?", options: ["Yes", "Not at all"], attribute: 'contact_48h' },
    { id: 9, text: "Is the rash strictly limited to the area where a substance touched you?", options: ["Yes", "Not at all"], attribute: 'contact_limited' },
    // Psoriasis
    { id: 10, text: "If you peel a scale, do you see tiny pinpoints of blood?", options: ["Yes", "Not at all"], attribute: 'psoriasis_auspitz' },
    { id: 11, text: "Do you have stiff or painful joints (especially in the mornings)?", options: ["Yes", "Not at all"], attribute: 'psoriasis_joints' },
    { id: 12, text: "Are there changes in your fingernails, like tiny pits or yellowing?", options: ["Yes", "Not at all"], attribute: 'psoriasis_nails' }
  ],
  
  INFECTIOUS: [
    // Cellulitis
    { id: 1, text: "Is the area hot to the touch and spreading rapidly?", options: ["Yes", "Not at all"], attribute: 'cellulitis_hot' },
    { id: 2, text: "Is the area of redness expanding if you track it with a pen?", options: ["Yes", "Not at all"], attribute: 'cellulitis_expanding' },
    { id: 3, text: "Are you experiencing 'red streaks' leading away from the site?", options: ["Yes", "Not at all"], attribute: 'cellulitis_streaks' },
    // Folliculitis
    { id: 4, text: "Is there a hair coming out of the center of each red bump?", options: ["Yes", "Not at all"], attribute: 'folliculitis_hair' },
    { id: 5, text: "Have you recently used a public hot tub or heated pool?", options: ["Yes", "Not at all"], attribute: 'folliculitis_hottub' },
    { id: 6, text: "Did the bumps appear shortly after shaving or waxing?", options: ["Yes", "Not at all"], attribute: 'folliculitis_shaving' },
    // Impetigo
    { id: 7, text: "Did this start as a small blister that turned into a golden crust?", options: ["Yes", "Not at all"], attribute: 'impetigo_crust' },
    { id: 8, text: "Did the area start as fluid-filled blisters that popped?", options: ["Yes", "Not at all"], attribute: 'impetigo_popped' },
    { id: 9, text: "Is the rash spreading to other parts of your body via touch?", options: ["Yes", "Not at all"], attribute: 'impetigo_touch' },
    // Ringworm
    { id: 10, text: "Is the edge of the red circle more scaly or raised than the center?", options: ["Yes", "Not at all"], attribute: 'ringworm_edge' },
    { id: 11, text: "Have you been in contact with a new pet or a stray animal?", options: ["Yes", "Not at all"], attribute: 'ringworm_pet' },
    { id: 12, text: "Does the 'ring' have a clear center with a scaly perimeter?", options: ["Yes", "Not at all"], attribute: 'ringworm_center' }
  ],
  
  BENIGN_GROWTH: [
    // Epidermoid Cyst
    { id: 1, text: "Is there a tiny black dot (punctum) in the center of the lump?", options: ["Yes", "Not at all"], attribute: 'cyst_punctum' },
    { id: 2, text: "Does the lump occasionally turn red and become painful?", options: ["Yes", "Not at all"], attribute: 'cyst_inflamed' },
    { id: 3, text: "If it drains, is the material thick and foul-smelling?", options: ["Yes", "Not at all"], attribute: 'cyst_smell' },
    // Lipoma
    { id: 4, text: "Can you easily wiggle or slide the lump under your skin?", options: ["Yes", "Not at all"], attribute: 'lipoma_wiggle' },
    { id: 5, text: "Does the lump feel 'doughy' or soft when you press on it?", options: ["Yes", "Not at all"], attribute: 'lipoma_doughy' },
    { id: 6, text: "Is the growth completely painless, even when squeezed?", options: ["Yes", "Not at all"], attribute: 'lipoma_painless' },
    // Keloid
    { id: 7, text: "Has the scar grown larger than the original injury site?", options: ["Yes", "Not at all"], attribute: 'keloid_growth' },
    { id: 8, text: "Did this start from a minor injury like a piercing or acne scar?", options: ["Yes", "Not at all"], attribute: 'keloid_injury' },
    { id: 9, text: "Does the scar feel hard, rubbery, or intensely itchy?", options: ["Yes", "Not at all"], attribute: 'keloid_texture' },
    // Dermatofibroma
    { id: 10, text: "When you pinch the skin, does the bump 'sink' inward?", options: ["Yes", "Not at all"], attribute: 'dermatofibroma_sink' },
    { id: 11, text: "Is the bump very firm, almost like a hard button?", options: ["Yes", "Not at all"], attribute: 'dermatofibroma_firm' },
    { id: 12, text: "Does it have a darker 'halo' of pigment around the edge?", options: ["Yes", "Not at all"], attribute: 'dermatofibroma_halo' }
  ],
  
  SKIN_CANCER: [
    // Melanoma
    { id: 1, text: "Has this mole changed in shape, size, or color recently?", options: ["Yes", "Not at all"], attribute: 'melanoma_change' },
    { id: 2, text: "Is one half of the mole a different shape than the other?", options: ["Yes", "Not at all"], attribute: 'melanoma_symmetry' },
    { id: 3, text: "Are there multiple colors (black, blue, red) within one mole?", options: ["Yes", "Not at all"], attribute: 'melanoma_color' },
    // Basal Cell Cancer
    { id: 4, text: "Does the spot look like a 'pimple' that just won't go away?", options: ["Yes", "Not at all"], attribute: 'basal_pimple' },
    { id: 5, text: "Do you see tiny 'spider veins' on the surface of the bump?", options: ["Yes", "Not at all"], attribute: 'basal_veins' },
    { id: 6, text: "Does the center of the bump look sunken or ulcerated?", options: ["Yes", "Not at all"], attribute: 'basal_sunken' },
    // Squamous Cell Cancer
    { id: 7, text: "Does it look like a persistent, scaly patch that sometimes bleeds?", options: ["Yes", "Not at all"], attribute: 'squamous_scaly' },
    { id: 8, text: "Is the growth tender or painful when you press on it?", options: ["Yes", "Not at all"], attribute: 'squamous_tender' },
    { id: 9, text: "Is the growth located on a high-sun area like the ear or lip?", options: ["Yes", "Not at all"], attribute: 'squamous_sun' }
  ],
  
  AUTOIMMUNE: [
    { id: 1, text: "Is there white patches where skin has lost color?", options: ["Yes", "Not at all"], attribute: 'pigment_loss' },
    { id: 2, text: "Does the skin feel rough, scaly, or thickened?", options: ["Yes", "Not at all"], attribute: 'rough_scaly' },
    { id: 3, text: "Does the spot have uneven borders or multiple colors?", options: ["Yes", "Not at all"], attribute: 'uneven_shape' },
    { id: 4, text: "Is it getting bigger, spreading, or changing shape?", options: ["Yes", "Not at all"], attribute: 'changing_shape' },
    { id: 5, text: "Is the area itchy or causing discomfort?", options: ["Yes", "Not at all"], attribute: 'itchy' },
    { id: 6, text: "Does it feel painful or tender?", options: ["Yes", "Not at all"], attribute: 'painful' }
  ],
  
  PIGMENTARY: [
    { id: 1, text: "Is the spot flat and brown, appearing in sun-exposed areas?", options: ["Yes", "Not at all"], attribute: 'flat_brown' },
    { id: 2, text: "Has the spot been present for many years without much change?", options: ["Yes", "Not at all"], attribute: 'long_term' },
    { id: 3, text: "Does the pigmentation look patchy or like a mask on the face?", options: ["Yes", "Not at all"], attribute: 'mask_like' }
  ],
  
  ENVIRONMENTAL: [
    { id: 1, text: "Did this appear after contact with plants or outdoor brush?", options: ["Yes", "Not at all"], attribute: 'plant_contact' },
    { id: 2, text: "Are you experiencing intense itching with a linear rash pattern?", options: ["Yes", "Not at all"], attribute: 'linear_itch' },
    { id: 3, text: "Does the skin feel extremely dry or cracked recently?", options: ["Yes", "Not at all"], attribute: 'extreme_dry' }
  ],

  DEFAULT: [
    { id: 1, text: "Does it feel itchy?", options: ["Yes", "Not at all"], attribute: 'itchy' },
    { id: 2, text: "Is it painful?", options: ["Yes", "Not at all"], attribute: 'painful' },
    { id: 3, text: "Is it changing?", options: ["Yes", "Not at all"], attribute: 'changing' }
  ]
};

export const BASE_QUESTIONS = {
  1: { id: 1, text: "Does it feel itchy?", options: ["Yes", "Not at all"], attribute: 'itchy' },
  2: { id: 2, text: "Does it hurt or feel sore when you touch it?", options: ["Yes", "Not at all"], attribute: 'painful' },
  3: { id: 3, text: "Does it look like a ring or circle on the skin?", options: ["Yes", "Not at all"], attribute: 'ring_shape' },
  4: { id: 4, text: "Have you noticed the spot getting darker, bigger, or changing shape?", options: ["Yes", "Not at all"], attribute: 'changing_shape' },
  5: { id: 5, text: "Do you see small blisters filled with clear fluid?", options: ["Yes", "Not at all"], attribute: 'blisters' },
  6: { id: 6, text: "Does the skin feel rough, scaly, or flaky?", options: ["Yes", "Not at all"], attribute: 'rough_scaly' },
  7: { id: 7, text: "Does the spot look uneven in shape or have more than one color?", options: ["Yes", "Not at all"], attribute: 'uneven_shape' },
  8: { id: 8, text: "Does it look like a small bump that sticks up from the skin?", options: ["Yes", "Not at all"], attribute: 'bump' },
  9: { id: 9, text: "Does it look smooth and shiny, or as if it's sitting on top of the skin like a sticker?", options: ["Yes", "Not at all"], attribute: 'shiny_sticker' }
};

export const getQuestionsForCategory = (category) => {
  return CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS.DEFAULT;
};

export const getTopPrediction = (predictions) => {
  if (!predictions) return '';
  
  if (Array.isArray(predictions) && predictions.length > 0) {
    return predictions[0]?.condition || '';
  } else if (predictions.top_prediction) {
    return predictions.top_prediction;
  } else if (typeof predictions === 'string') {
    return predictions;
  } else if (predictions.predictions && typeof predictions.predictions === 'object') {
    const predArray = Object.entries(predictions.predictions);
    if (predArray.length > 0) {
      return predArray.sort((a, b) => b[1] - a[1])[0][0];
    }
  }
  
  return '';
};

export const getTargetCategory = (topPredictionCondition) => {
  if (!topPredictionCondition) return 'DEFAULT';

  const condition = topPredictionCondition.toLowerCase();

  const categories = {
    INFLAMMATORY: ['acne', 'dermatitis', 'psoriasis', 'eczema', 'rosacea'],
    INFECTIOUS: ['molluscum', 'ringworm', 'warts', 'tinea', 'fungal', 'cellulitis', 'impetigo', 'boils', 'folliculitis', 'herpes', 'sores', 'bacterial'],
    AUTOIMMUNE: ['vitiligo', 'lupus', 'lichen'],
    SKIN_CANCER: ['cancer', 'melanoma', 'carcinoma', 'keratosis', 'basal', 'squamous', 'malignant', 'lesion'],
    PIGMENTARY: ['pigmentary', 'melasma', 'hyperpigmentation', 'age spots', 'sunspots', 'dyschromia'],
    ENVIRONMENTAL: ['environmental', 'poison', 'razor', 'dry skin', 'sun damage', 'burn']
  };

  

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => condition.includes(keyword))) {
      return category;
    }
  }
  
  return 'DEFAULT';
  
};


export const getPersonalizedQuestions = (predictions) => {
  const topPrediction = getTopPrediction(predictions);
  const category = getTargetCategory(topPrediction);
  const questions = getQuestionsForCategory(category);
  
  console.log('Personalized Assessment:', {
    topPrediction,
    category,
    questionCount: questions.length
  });
  
  return {
    questions,
    category,
    topPrediction
  };
};

export default CATEGORY_QUESTIONS;