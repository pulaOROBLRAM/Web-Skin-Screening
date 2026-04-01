export const ADAPTIVE_QUESTIONS = {
    q1: {
        id: "q1",
        text: "Looking at your skin, which of these best matches what you see? Pick the closest one.",
        options: {
            a: {
                text: "Flat, smooth area that's a different color than the rest of my skin",
                nextQuestion: "color_only"
            },
            b: {
                text: "Raised bumps, pimples, or solid lumps",
                nextQuestion: "raised"
            },
            c: {
                text: "Dry, rough, scaly, or flaky patch of skin",
                nextQuestion: "rough_texture"
            },
            d: {
                text: "Blisters, sores, or open areas (wet or crusty)",
                nextQuestion: "open_sores"
            },
            e: {
                text: "I'm not sure how to describe it",
                nextQuestion: "unsure"
            }
        }
    },

    // STEP 2A: Color only (no texture change)
    color_only: {
        q2: {
            id: "q2",
            text: "What color is the flat area?",
            options: {
                a: { text: "White or lighter than my normal skin", nextQuestion: "color_white" },
                b: { text: "Brown or darker than my normal skin", nextQuestion: "color_brown" },
                c: { text: "Pink or red", nextQuestion: "color_pink" },
                d: { text: "Yellowish", nextQuestion: "color_yellow" },
                e: { text: "Purple or dark red", nextQuestion: "color_purple" }
            }
        }
    },

    color_white: {
        q3: {
            id: "q3",
            text: "Can you see a clear edge where the white patch starts and your normal skin begins?",
            options: {
                a: { text: "Yes, very clear border", disease: "Vitiligo" },
                b: { text: "No, the edge is blurry or faded", nextQuestion: "color_white_blurry" }
            }
        }
    },

    color_white_blurry: {
        q4: {
            id: "q4",
            text: "Where is it located?",
            options: {
                a: { text: "On my chest, back, or shoulders", disease: "Tinea_Versicolor" },
                b: { text: "On my face", nextQuestion: "color_white_face" },
                c: { text: "On my arms or legs", disease: "Idiopathic_Guttate_Hypomelanosis" }
            }
        }
    },

    color_white_face: {
        q5: {
            id: "q5",
            text: "Do you have a history of eczema or allergies?",
            options: {
                a: { text: "Yes", disease: "Pityriasis_Alba" },
                b: { text: "No", disease: "Vitiligo" }
            }
        }
    },

    color_brown: {
        q3: {
            id: "q3",
            text: "Where did the dark spot appear?",
            options: {
                a: { text: "On my face in a mask-like pattern on cheeks, forehead, or upper lip", nextQuestion: "color_brown_hormonal" },
                b: { text: "Where the sun hits like face, back of hands, or arms", disease: "Lentigo" },
                c: { text: "Where I had a pimple, cut, or rash before", disease: "Post_Inflammatory_Hyperpigmentation" },
                d: { text: "I have had it since birth", disease: "Cafe_au_lait_spots" }
            }
        }
    },

    color_brown_hormonal: {
        q4: {
            id: "q4",
            text: "Are you pregnant, taking birth control pills, or going through hormone therapy?",
            options: {
                a: { text: "Yes", disease: "Melasma" },
                b: { text: "No", disease: "Melasma" }
            }
        }
    },

    color_pink: {
        q3: {
            id: "q3",
            text: "Is the pink area scaly or flaky?",
            options: {
                a: { text: "Yes, it has fine flakes", disease: "Tinea_Versicolor" },
                b: { text: "No, it is smooth", disease: "Granuloma_Annulare" }
            }
        }
    },

    color_yellow: {
        q3: {
            id: "q3",
            text: "Is the yellow color only on your skin, or also in your eyes?",
            options: {
                a: { text: "Only on my skin", disease: "Xanthelasma" },
                b: { text: "Also in my eyes", disease: "Jaundice_Warning" }
            }
        }
    },

    color_purple: {
        q3: {
            id: "q3",
            text: "Does the purple area feel firm or hard?",
            options: {
                a: { text: "Yes, it feels firm", disease: "Lichen_Planus" },
                b: { text: "No, it feels like normal skin", nextQuestion: "color_purple_soft" }
            }
        }
    },

    color_purple_soft: {
        q4: {
            id: "q4",
            text: "Have you bumped or injured that area recently?",
            options: {
                a: { text: "Yes", disease: "Bruise" },
                b: { text: "No", disease: "Vasculitis_Warning" }
            }
        }
    },

    // STEP 2B: Raised bumps or lumps
    raised: {
        q2: {
            id: "q2",
            text: "What does the bump feel like when you touch it?",
            options: {
                a: { text: "Small and pimple-like (size of a pencil eraser or smaller)", nextQuestion: "raised_small" },
                b: { text: "Medium (size of a pea)", nextQuestion: "raised_medium" },
                c: { text: "Large (bigger than a pea)", nextQuestion: "raised_large" },
                d: { text: "Has a stalk or stem attaching it to my skin", disease: "Skin_Tags" }
            }
        }
    },

    raised_small: {
        q3: {
            id: "q3",
            text: "Does it have a blackhead or whitehead, or feel like an inflamed pimple?",
            options: {
                a: { text: "Yes, it has a whitehead/blackhead", nextQuestion: "raised_acne" },
                b: { text: "It has no head, but it is red, painful, or feels like a pimple", nextQuestion: "raised_acne" },
                c: { text: "No, it is skin-colored or brown and painless", nextQuestion: "raised_small_no_head" }
            }
        }
    },

    raised_acne: {
        q4: {
            id: "q4",
            text: "What is your age?",
            options: {
                a: { text: "Under 30", disease: "Acne" },
                b: { text: "30 or older", nextQuestion: "raised_acne_adult" }
            }
        }
    },

    raised_acne_adult: {
        q5: {
            id: "q5",
            text: "Do you also get facial flushing or redness that comes and goes?",
            options: {
                a: { text: "Yes", disease: "Rosacea" },
                b: { text: "No", disease: "Acne" }
            }
        }
    },

    raised_small_no_head: {
        q4: {
            id: "q4",
            text: "Does it have a tiny dent or dimple in the center?",
            options: {
                a: { text: "Yes", disease: "Molluscum_Contagiosum" },
                b: { text: "No", nextQuestion: "raised_small_firm" }
            }
        }
    },

    raised_small_firm: {
        q5: {
            id: "q5",
            text: "Is it itchy?",
            options: {
                a: { text: "Yes", disease: "Hives" },
                b: { text: "No", disease: "Moles" }
            }
        }
    },

    raised_medium: {
        q3: {
            id: "q3",
            text: "Does the bump feel sore, red, or tender (like deep cystic acne or a boil)?",
            options: {
                a: { text: "Yes, it started recently and hurts", disease: "Acne" }, // or Boils explicitly if we want to add to DISEASES
                b: { text: "No, it is painless and feels like a rubbery lump under the skin", nextQuestion: "raised_medium_move" }
            }
        }
    },

    raised_medium_move: {
        q4: {
            id: "q4",
            text: "Can you move it around under your skin, or is it stuck in place?",
            options: {
                a: { text: "I can move it around", disease: "Lipoma" },
                b: { text: "It is stuck in place", nextQuestion: "raised_medium_stuck" }
            }
        }
    },

    raised_medium_stuck: {
        q5: {
            id: "q5",
            text: "Does it have a small dark dot or pore on top?",
            options: {
                a: { text: "Yes", disease: "Cysts" },
                b: { text: "No", nextQuestion: "raised_medium_worry" }
            }
        }
    },

    raised_medium_worry: {
        q6: {
            id: "q6",
            text: "Has it changed in size, shape, or color in the last few months?",
            options: {
                a: { text: "Yes", disease: "Suspicious_Mole_Warning" },
                b: { text: "No", disease: "Moles" }
            }
        }
    },

    raised_large: {
        q3: {
            id: "q3",
            text: "Does it look like a wart (rough, cauliflower-like surface)?",
            options: {
                a: { text: "Yes", nextQuestion: "raised_large_wart" },
                b: { text: "No", nextQuestion: "raised_large_other" }
            }
        }
    },

    raised_large_wart: {
        q4: {
            id: "q4",
            text: "Where is it located?",
            options: {
                a: { text: "On my hands or feet", disease: "Warts" },
                b: { text: "On my face or knees", disease: "Warts" },
                c: { text: "In my genital area", disease: "Genital_Warts" }
            }
        }
    },

    raised_large_other: {
        q4: {
            id: "q4",
            text: "Does it look like it is stuck on top of my skin, like melted wax?",
            options: {
                a: { text: "Yes", disease: "Seborrheic_Keratosis" },
                b: { text: "No", disease: "Suspicious_Mole_Warning" }
            }
        }
    },

    // STEP 2C: Rough or bumpy texture
    rough_texture: {
        q2: {
            id: "q2",
            text: "Does the rough area have a clear shape?",
            options: {
                a: { text: "Yes, it looks like a ring (clear center, raised edge)", nextQuestion: "rough_ring" },
                b: { text: "Yes, it is a solid round or oval patch", nextQuestion: "rough_patch" },
                c: { text: "No, it has an irregular or weird shape", nextQuestion: "rough_irregular" }
            }
        }
    },

    rough_ring: {
        q3: {
            id: "q3",
            text: "Is the ring red and itchy?",
            options: {
                a: { text: "Yes", disease: "Ringworm" },
                b: { text: "No", disease: "Granuloma_Annulare" }
            }
        }
    },

    rough_patch: {
        q3: {
            id: "q3",
            text: "Where is it located?",
            options: {
                a: { text: "On my elbows or knees", disease: "Psoriasis" },
                b: { text: "On my scalp", disease: "Psoriasis" },
                c: { text: "In the creases of my arms or behind my knees", nextQuestion: "rough_patch_allergy" },
                d: { text: "On my hands", nextQuestion: "rough_patch_hands" }
            }
        }
    },

    rough_patch_allergy: {
        q4: {
            id: "q4",
            text: "Do you have asthma, hay fever, or food allergies?",
            options: {
                a: { text: "Yes", disease: "Atopic_Dermatitis" },
                b: { text: "No", disease: "Contact_Dermatitis" }
            }
        }
    },

    rough_patch_hands: {
        q4: {
            id: "q4",
            text: "Do you wash your hands a lot or use chemicals at work?",
            options: {
                a: { text: "Yes", disease: "Contact_Dermatitis" },
                b: { text: "No", disease: "Dermatitis" }
            }
        }
    },

    rough_irregular: {
        q3: {
            id: "q3",
            text: "Is the area hot, swollen, or painful to touch?",
            options: {
                a: { text: "Yes", disease: "Cellulitis_Warning" },
                b: { text: "No", nextQuestion: "rough_irregular_dry" }
            }
        }
    },

    rough_irregular_dry: {
        q4: {
            id: "q4",
            text: "Is your skin generally dry, or did this appear suddenly?",
            options: {
                a: { text: "My skin is usually dry", disease: "Xerosis" },
                b: { text: "It appeared after using new soap or lotion", disease: "Contact_Dermatitis" },
                c: { text: "It appeared for no clear reason", disease: "Dermatitis" }
            }
        }
    },

    // STEP 2D: Blisters, sores, or open areas
    open_sores: {
        q2: {
            id: "q2",
            text: "What do the sores look like?",
            options: {
                a: { text: "Small blisters filled with clear fluid", nextQuestion: "sores_blisters" },
                b: { text: "Crusted over with honey-colored or yellow crust", disease: "Impetigo" },
                c: { text: "Open sore that won't heal", nextQuestion: "sores_nonhealing" },
                d: { text: "Single painful bump filled with pus", disease: "Boils" }
            }
        }
    },

    sores_blisters: {
        q3: {
            id: "q3",
            text: "Are the blisters in a cluster or group?",
            options: {
                a: { text: "Yes, they are together in a bunch", nextQuestion: "sores_blisters_cluster" },
                b: { text: "No, they are spread out", nextQuestion: "sores_blisters_spread" }
            }
        }
    },

    sores_blisters_cluster: {
        q4: {
            id: "q4",
            text: "Where are they located?",
            options: {
                a: { text: "On my lips or around my mouth", disease: "Herpes_Simplex" },
                b: { text: "On my genitals", disease: "Herpes_Simplex" },
                c: { text: "In a band or line on one side of my body", disease: "Herpes_Zoster" }
            }
        }
    },

    sores_blisters_spread: {
        q4: {
            id: "q4",
            text: "Did they appear after touching something new like a plant or chemical?",
            options: {
                a: { text: "Yes", disease: "Contact_Dermatitis_Acute" },
                b: { text: "No", nextQuestion: "sores_blisters_autoimmune" }
            }
        }
    },

    sores_blisters_autoimmune: {
        q5: {
            id: "q5",
            text: "Do you also have blisters inside your mouth?",
            options: {
                a: { text: "Yes", disease: "Pemphigus_Vulgaris_Warning" },
                b: { text: "No", disease: "Bullous_Pemphigoid" }
            }
        }
    },

    sores_nonhealing: {
        q3: {
            id: "q3",
            text: "How long has it been there without healing?",
            options: {
                a: { text: "More than 3 weeks", disease: "Nonhealing_Ulcer_Warning" },
                b: { text: "Less than 3 weeks", disease: "Ulcer" }
            }
        }
    },

    // STEP 3: Unsure path
    unsure: {
        q2: {
            id: "q2",
            text: "Can you look at it closely? What stands out most?",
            options: {
                a: { text: "The color is different from my normal skin", nextQuestion: "color_only" },
                b: { text: "The texture feels different (rough, bumpy, or scaly)", nextQuestion: "rough_texture" },
                c: { text: "It is raised like a bump", nextQuestion: "raised" },
                d: { text: "It is open, wet, or crusty", nextQuestion: "open_sores" }
            }
        }
    }
};

export function diagnoseAdaptive(answers) {
    if (!answers || Object.keys(answers).length === 0) return [];

    let nextContainerId = 'q1';
    let finalDisease = null;

    while (nextContainerId) {
        const container = ADAPTIVE_QUESTIONS[nextContainerId];
        if (!container) break;

        const questionKeys = Object.keys(container).filter(k => k.startsWith('q'));
        const question = questionKeys.length > 0 ? container[questionKeys[0]] : container;

        if (!question || !question.id) break;

        const answerNode = answers[question.id];
        if (!answerNode) break;

        const option = question.options ? question.options[answerNode] : null;
        if (!option) break;

        if (option.disease) {
            finalDisease = option.disease;
            break; // Reached the diagnosis endpoint
        } else if (option.nextQuestion) {
            nextContainerId = option.nextQuestion;
        } else {
            break; // Dead end
        }
    }

    if (finalDisease) {
        return [{
            id: finalDisease,
            matchPercentage: 100, // Based entirely on strict clinical presentation
            source: 'clinical'
        }];
    }

    return [];
}