from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

def test_server_status():
    """Test if the API server is up and running."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Skin Lesion Classification API",
        "status": "active"
    }

def test_predict_rejects_documents():
    """Test if the model correctly rejects files that are not images (like PDFs or Text files)."""
    # Simulate a fake text file
    fake_doc = io.BytesIO(b"this is a text document")
    
    response = client.post(
        "/predict",
        files={"file": ("document.txt", fake_doc, "text/plain")}
    )
    
    # It should correctly reject it with Error 400
    assert response.status_code == 400
    assert response.json() == {"detail": "File must be an image"}

def test_predict_accepts_images():
    """Test if the prediction gateway correctly processes an image header."""
    # Simulate a fake image upload
    fake_image = io.BytesIO(b"fake image bytes")
    
    response = client.post(
        "/predict",
        files={"file": ("test_photo.jpg", fake_image, "image/jpeg")}
    )
    
    assert response.status_code != 400
