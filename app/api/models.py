from pydantic import BaseModel
from typing import Dict, Optional

class PredictionResponse(BaseModel):
    success: bool = True
    predictions: Optional[Dict[str, float]] = None
    top_prediction: Optional[str] = None
    confidence: Optional[float] = None
    error: Optional[str] = None
    message: Optional[str] = None