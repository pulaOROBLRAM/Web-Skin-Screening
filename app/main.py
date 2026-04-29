from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.api.services import PredictionService
from app.api.models import PredictionResponse
from typing import List
import json
import os

app = FastAPI(
    title="Skin Lesion Classification API",
    description="API for classifying skin lesion images using deep learning",
    version="1.0.0"
)

# Configure CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000",  
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:5174",  # Vite fallback port
    "http://localhost:5175",  # Current active port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "https://web-skin-screening-mxlr9wfpc-pulaoroblrams-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=origins,
    max_age=3600,
)

# Initialize the prediction service
prediction_service = PredictionService()

@app.get("/")
async def root():
    """Root endpoint returning API information."""
    return {
        "message": "Skin Lesion Classification API",
        "status": "active"
    }

@app.get("/classes")
async def get_classes():
    try:
        with open('app/model/class_indices.json', 'r') as f:
            classes = json.load(f)
        return {"classes": list(classes.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the file
        contents = await file.read()
        
        # Get predictions
        predictions = prediction_service.predict(contents)
        
        if not predictions.get("success"):
            raise HTTPException(status_code=400, detail=predictions.get("message", "Prediction failed"))
        
        return PredictionResponse(**predictions)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 