import json
import os
import logging

logger = logging.getLogger(__name__)


def load_class_names(json_path, labels_txt_path):
    # Try json
    try:
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if isinstance(data, dict):
                keys = list(data.keys())
                if all(str(k).isdigit() for k in keys):
                    pairs = sorted(((int(k), v) for k, v in data.items()), key=lambda x: x[0])
                    return [name for _, name in pairs]
                else:
                    indices = [int(v) for v in data.values()]
                    size = max(indices) + 1 if indices else 0
                    names = [None] * size
                    for name, idx in data.items():
                        names[int(idx)] = name
                    return [n for n in names if n is not None]
    except Exception as e:
        logger.warning(f"Failed to parse class indices JSON: {e}")

    try:
        if os.path.exists(labels_txt_path):
            index_to_name = {}
            with open(labels_txt_path, 'r', encoding='utf-8') as f:
                for line in f:
                    raw = line.strip()
                    if not raw:
                        continue
                    parts = raw.split(maxsplit=1)
                    if parts and parts[0].isdigit():
                        idx = int(parts[0])
                        name = parts[1].strip() if len(parts) > 1 else str(idx)
                        index_to_name[idx] = name
                    else:
                        index_to_name[len(index_to_name)] = raw

            if index_to_name:
                return [name for _, name in sorted(index_to_name.items(), key=lambda x: x[0])]
    except Exception as e:
        logger.error(f"Failed to load class names from labels.txt: {e}")

    raise RuntimeError("No valid class label source found. Provide class_indices.json or labels.txt.")
