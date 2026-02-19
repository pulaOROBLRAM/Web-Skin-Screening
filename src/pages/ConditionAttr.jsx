
  const DISEASES = {
    INFLAMMATORY: {
      "Acne": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [9.0, 7.5, 9.5, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
      },
      "Acne_Keloidalis_Nuchae": {
        attributes: [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [4.0, 0, 7.0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },  
      "Atopic_Dermatitis": {
        attributes: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        weights: [0, 0, 0, 9.5, 8.0, 8.5, 0, 0, 0, 0, 0, 0]
      },
      "Contact_Dermatitis": {
        attributes: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 9.0, 8.5, 9.5, 0, 0, 0]
      },
      "Seborrheic_Dermatitis": {
        attributes: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        weights: [0, 0, 0, 0, 5.0, 0, 0, 0, 0, 0, 0, 0]
      },
      "Psoriasis": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 10.0, 8.0, 9.0] 
      }
    },

    INFECTIOUS: {
      "Cellulitis": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [9.0, 8.5, 9.5, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
      },

      "Folliculitis": {
        attributes: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        weights: [0, 0, 0, 9.5, 8.0, 9.0, 0, 0, 0, 0, 0, 0] 
      },  
      "Impetigo": {
        attributes: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 10.0, 9.0, 8.5, 0, 0, 0] 
      },
      "Ringworm": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 10.0, 8.5, 12.0] 
      },

      "Boils": {
        attributes: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [4.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
      },
      "Cold_Sores": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 0, 4.0, 3.0, 0, 0, 0] 
      },
      "Molluscum_Contagiosum": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 0, 0, 5.0, 0, 0, 0] 
      },
      "Warts": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 0, 0, 5.0, 0, 0, 0] 
      }
    },

    AUTOIMMUNE: {
      "Vitiligo": {
        attributes: [1, 0, 0, 1, 0, 0],
        weights: [9.5, 0, 0, 4.2, 0, 0] 
      },
      "Lupus": {
        attributes: [0, 1, 1, 0, 1, 1],
        weights: [0, 8.5, 7.2, 0, 5.8, 6.5]  
      },
      "Drug_Induced_Pigmentation": {  
        attributes: [0, 0, 1, 1, 1, 0],
        weights: [0, 0, 6.8, 5.5, 3.2, 0] 
      },
      "Lichen_related_diseases": {
        attributes: [0, 1, 1, 1, 1, 1],
        weights: [0, 7.0, 5.2, 4.5, 5.5, 4.8]  
      }
    },

    BENIGN_GROWTH: {
      "Cyst": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [10.0, 8.5, 9.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      "Epidermoid_Cyst": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [10.0, 8.5, 9.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      "Lipoma": {
        attributes: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        weights: [0, 0, 0, 9.5, 9.0, 8.5, 0, 0, 0, 0, 0, 0]
      },
      "Keloids": {
        attributes: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        weights: [0, 0, 0, 0, 0, 0, 10.0, 9.0, 8.5, 0, 0, 0]
      },
      "Dermatofibroma": {
        attributes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        weights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 10.0, 9.0, 8.0]
      },
      "Digital_Mucous_Cyst": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weights: [6.0, 5.0, 4.0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },

    PIGMENTARY: {
      "Age_Spots": {
        attributes: [1, 1, 0],
        weights: [9.0, 7.0, 0]
      },
      "Dyschromia": {
        attributes: [0, 1, 1],
        weights: [0, 5.0, 8.0]
      },
      "Melasma": {
        attributes: [0, 1, 1],
        weights: [0, 4.0, 9.5]
      },
      "Hyperpigmentation": {
        attributes: [0, 1, 0],
        weights: [0, 6.0, 0]
      },
      "Varicose_Veins": {
        attributes: [0, 0, 0],
        weights: [0, 0, 0]
      }
    },

    SKIN_CANCER: {
      "Melanoma": {
        attributes: [1, 1, 1, 0, 0, 0, 0, 0, 0],
        weights: [10.0, 9.5, 9.5, 0, 0, 0, 0, 0, 0]
      },
      "Basal_Cell_Cancer": {
        attributes: [0, 0, 0, 1, 1, 1, 0, 0, 0],
        weights: [0, 0, 0, 10.0, 8.5, 9.5, 0, 0, 0]
      },
      "Squamous_Cell_Cancer": {
        attributes: [0, 0, 0, 0, 0, 0, 1, 1, 1],
        weights: [0, 0, 0, 0, 0, 0, 10.0, 8.5, 9.0]
      },
      "Actinic_Keratosis": {
        attributes: [0, 0, 0, 0, 0, 0, 1, 0, 1],
        weights: [0, 0, 0, 0, 0, 0, 7.0, 0, 8.0]
      }
    },

    ENVIRONMENTAL: {
      "Poison_Ivy": {
        attributes: [1, 1, 0],
        weights: [9.5, 9.0, 0]
      },
      "Razor_Bumps": {
        attributes: [0, 0, 0],
        weights: [0, 0, 0]
      },
      "Dry_Skin": {
        attributes: [0, 0, 1],
        weights: [0, 0, 9.5]
      },
      "Hyperhidrosis": {
        attributes: [0, 0, 0],
        weights: [0, 0, 0]
      },
      "Sun_damage": {
        attributes: [0, 0, 1],
        weights: [0, 0, 6.0]
      }
    }
  };

  export { DISEASES };