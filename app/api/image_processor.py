import logging
from io import BytesIO
import numpy as np
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    tf = None
    TF_AVAILABLE = False

from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)


def validate_image(image_data) -> bool:
    try:
        img = Image.open(BytesIO(image_data))
        img.verify()
        return True
    except (UnidentifiedImageError, IOError) as e:
        logger.error(f"Invalid image: {e}")
        return False


def preprocess_image(image_data, preprocess_mode='efficientnet'):
    if not validate_image(image_data):
        raise ValueError('Invalid image data')

    img = Image.open(BytesIO(image_data)).convert('RGB').resize((224, 224))

    if TF_AVAILABLE:
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        mode = preprocess_mode
        if mode == 'efficientnet':
            return tf.keras.applications.efficientnet.preprocess_input(tf.cast(img_array, tf.float32))
        if mode == 'resnet_v2':
            return tf.keras.applications.resnet_v2.preprocess_input(tf.cast(img_array, tf.float32))
        if mode == 'scale01':
            return tf.cast(img_array, tf.float32) / 255.0
        return tf.cast(img_array, tf.float32)

    # Fallback: return numpy array scaled to [0,1]
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, 0)
    return arr
