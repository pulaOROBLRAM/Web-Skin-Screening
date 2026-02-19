import json
import os
import logging
import numpy as np
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    tf = None
    TF_AVAILABLE = False

logger = logging.getLogger(__name__)


def _load_custom_model(arch_path, weights_path):
    from tensorflow.keras.applications import EfficientNetB0
    from tensorflow.keras import layers, models

    with open(arch_path, 'r') as f:
        arch_info = json.load(f)

    base_model = EfficientNetB0(
        weights='imagenet',
        include_top=False,
        input_shape=tuple(arch_info['input_shape'])
    )
    base_model.trainable = arch_info.get('base_trainable', False)

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(arch_info.get('dropout_rate', 0.2)),
        layers.Dense(arch_info.get('dense_units', 128), activation='relu'),
        layers.Dropout(arch_info.get('dropout_rate', 0.2)),
        layers.Dense(arch_info.get('num_classes', 2), activation='softmax')
    ])

    model.load_weights(weights_path)

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    return model


def resolve_signature_input_key(model_obj):
    if not TF_AVAILABLE or model_obj is None:
        return 'inputs'
    try:
        if isinstance(model_obj, tf.keras.Model):
            return None
    except Exception:
        pass
    try:
        sig = getattr(model_obj, 'structured_input_signature', None)
        if sig and isinstance(sig, tuple) and len(sig) == 2:
            arg_dict = sig[1]
            if isinstance(arg_dict, dict) and arg_dict:
                return sorted(arg_dict.keys())[0]
    except Exception:
        pass
    return 'inputs'


def load_model(model_path):
    """Attempt multiple strategies to load a model. Returns a TF Keras model, a signature function, or raises."""
    if not TF_AVAILABLE:
        raise RuntimeError("TensorFlow not available in this environment")

    # Keras full model
    try:
        return tf.keras.models.load_model(model_path)
    except Exception as e:
        logger.warning(f"Keras load failed: {e}")

    # custom arch + weights
    try:
        arch_path = os.path.join(model_path, 'model_architecture.json')
        weights_path = os.path.join(model_path, 'model_weights.h5')
        if os.path.exists(arch_path) and os.path.exists(weights_path):
            return _load_custom_model(arch_path, weights_path)
    except Exception as e:
        logger.warning(f"Custom model load failed: {e}")

    # config.json + weights
    try:
        cfg = os.path.join(model_path, 'config.json')
        if os.path.exists(cfg):
            with open(cfg) as f:
                config = json.load(f)
            model = tf.keras.models.model_from_config(config)
            model.load_weights(os.path.join(model_path, 'weights.h5'))
            return model
    except Exception as e:
        logger.warning(f"Config load failed: {e}")

    # SavedModel
    try:
        loaded = tf.saved_model.load(model_path)
        if hasattr(loaded, 'signatures') and 'serving_default' in loaded.signatures:
            return loaded.signatures['serving_default']
        raise ValueError('No serving signature found')
    except Exception as e:
        logger.error(f"All load attempts failed: {e}")
        raise
