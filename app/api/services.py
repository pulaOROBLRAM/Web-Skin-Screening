import numpy as np
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    tf = None
    TF_AVAILABLE = False
import logging
import os
import threading
from app.api.model_loader import load_model, resolve_signature_input_key
from app.api.image_processor import preprocess_image, validate_image
from app.api.class_loader import load_class_names

logger = logging.getLogger(__name__)

# OUTPUT PROCESSOR - Extract and normalize model predictions

class OutputProcessor:
    """Handles extraction and normalization of predictions from various model output formats."""

    @staticmethod
    def extract_probabilities(raw_output):
        """Convert various TensorFlow output formats to a probability array."""
        if isinstance(raw_output, np.ndarray):
            probs = raw_output
        elif isinstance(raw_output, dict):
            tensor = None
            for key in ('probabilities', 'predictions', 'outputs', 'output_0', 'Identity'):
                if key in raw_output:
                    tensor = raw_output[key]
                    break
            if tensor is None:
                tensor = next(iter(raw_output.values()))
            # If tensor-like, attempt to extract numpy array
            try:
                probs = tensor.numpy()
            except Exception:
                probs = np.array(tensor)
        elif TF_AVAILABLE and tf is not None and tf.is_tensor(raw_output):
            probs = raw_output.numpy()
        else:
            raise ValueError("Unsupported model output type")

        # Flatten if shape is (1, num_classes)
        if probs.ndim == 2 and probs.shape[0] == 1:
            probs = probs[0]
        return probs


 
# MODEL WRAPPER - Encapsulate model loading and inference
 
class ModelWrapper:
    """Wraps model loading and prediction with lazy initialization and thread safety."""

    def __init__(self, model_path):
        self._model_path = model_path
        self._model = None
        self._model_loaded = False
        self._lock = threading.Lock()
        self._signature_input_key = None

    def _ensure_loaded(self):
        """Load model on first access (thread-safe)."""
        if self._model_loaded:
            return
        
        with self._lock:
            if self._model_loaded:  # Double-check locking
                return
            
            if not TF_AVAILABLE:
                logger.warning("TensorFlow not available — running in mock prediction mode")
                self._model = None
                self._model_loaded = True
                return
            
            try:
                self._model = load_model(self._model_path)
                self._signature_input_key = resolve_signature_input_key(self._model)
                self._model_loaded = True
                logger.info(f"Model loaded from {self._model_path}")
            except Exception as e:
                logger.error(f"Model load failed: {e}", exc_info=True)
                self._model = None
                self._model_loaded = True

    def predict(self, processed_img):
        """Run inference on preprocessed image."""
        self._ensure_loaded()
        
        # Mock mode: return uniform predictions
        if self._model is None:
            logger.debug("Model not available, returning mock predictions")
            return None
        
        # Real prediction
        if TF_AVAILABLE and isinstance(self._model, tf.keras.Model):
            return self._model.predict(processed_img, verbose=0)
        
        # SavedModel signature
        key = self._signature_input_key or 'inputs'
        try:
            return self._model(**{key: processed_img})
        except TypeError:
            for alt in ('input_1', 'input', 'image', 'images', 'x'):
                try:
                    return self._model(**{alt: processed_img})
                except TypeError:
                    continue
        
        return self._model(processed_img)

    def is_available(self):
        """Check if model is available."""
        self._ensure_loaded()
        return self._model is not None


 
# PREDICTION SERVICE - Orchestrate prediction pipeline
 
class PredictionService:
    """Orchestrates the prediction pipeline: validation → preprocessing → inference → result formatting."""

    def __init__(self, model_path='saved_model/third', 
                 class_indices_path='saved_model/third/class_indices.json',
                 labels_txt_path='saved_model/third/labels.txt',
                 preprocess_mode: str = 'efficientnet'):
        self.logger = logging.getLogger(__name__)
        self._model_wrapper = ModelWrapper(model_path)
        self._output_processor = OutputProcessor()
        self.class_names = self._load_class_names(class_indices_path, labels_txt_path)
        self.preprocess_mode = preprocess_mode

      
    # Private helper methods
      
    def _load_class_names(self, json_path, labels_txt_path):
        """Delegate to class_loader module."""
        return load_class_names(json_path, labels_txt_path)

    def _validate_image(self, image_data):
        """Delegate to image_processor module."""
        return validate_image(image_data)

    def preprocess_image(self, image_data):
        """Delegate to image_processor module with configured preprocess mode."""
        return preprocess_image(image_data, preprocess_mode=self.preprocess_mode)

      
    # Public API
      
    def predict(self, image_data):
        """
        Execute full prediction pipeline: validate image → preprocess → infer → format result.
        
        Returns:
            dict: {
                "success": bool,
                "predictions": {"ClassName": float, ...},
                "top_prediction": str,
                "confidence": float,
                "error": str (if success=False),
                "message": str (if success=False)
            }
        """
        try:
            if not image_data:
                raise ValueError("Empty image data provided")

            # Step 1: Validate
            if not self._validate_image(image_data):
                raise ValueError("Invalid image format")

            # Step 2: Preprocess
            processed_img = self.preprocess_image(image_data)

            # Step 3: Infer
            raw_output = self._model_wrapper.predict(processed_img)
            
            # Step 4: Extract probabilities
            if raw_output is None:
                # Mock mode: uniform distribution
                size = len(self.class_names) if self.class_names else 2
                preds = np.ones((size,), dtype=float) / float(size)
            else:
                preds = self._output_processor.extract_probabilities(raw_output)

            # Step 5: Format result
            result = {
                "success": True,
                "predictions": {self.class_names[i]: float(p) for i, p in enumerate(preds)},
                "top_prediction": self.class_names[np.argmax(preds)],
                "confidence": float(np.max(preds))
            }
            return result

        except Exception as e:
            self.logger.error(f"Prediction error: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e),
                "message": "Error analyzing image. Please try again."
            }