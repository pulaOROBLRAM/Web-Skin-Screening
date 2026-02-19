# SkinSight AI
### Advanced AI-Powered Skin Health Assessment

**SkinSight AI** is a state-of-the-art full-stack application designed to empower individuals in their skin health journey. By leveraging advanced machine learning algorithms and computer vision, it provides instant, preliminary assessments of various skin conditions through image analysis and interactive questionnaires.

> **Disclaimer:** This tool is for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 🌟 Key Features

*   **🔍 Instant AI Analysis**: Upload a photo of a skin concern to receive immediate probability-based assessments for common conditions.
*   **📝 Interactive Self-Assessment**: A guided medical questionnaire refines the AI's analysis by factoring in symptoms, duration, and pain levels.
*   **🩺 Comprehensive Results**: View detailed reports combining visual analysis with symptom data, including severity indicators and recommended next steps.
*   **🎨 Modern & Responsive UI**: Features a sleek, glassmorphism-inspired design with smooth animations, ensuring a seamless experience across desktop and mobile devices.
*   **🔒 Privacy-First**: Built with security in mind to ensure user data and images are handled with care.

---

## 🛠️ Technology Stack

**Frontend**
*   **React.js**: For building a dynamic and responsive user interface.
*   **Vite**: Next-generation frontend tooling for fast builds and hot module replacement.
*   **CSS3**: Custom glassmorphism styling, animations, and responsive layouts.
*   **React Router**: Seamless client-side navigation.

**Backend**
*   **Python / FastAPI**: High-performance backend framework for handling API requests and ML inference.
*   **PyTorch / TensorFlow / JAX**: (Depending on specific model implementation) Powering the deep learning models for image classification.
*   **Uvicorn**: Lightning-fast ASGI server implementation.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v14+)
*   Python (v3.8+)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/risingkap/wssv-1.git
    cd wssv-1
    ```

2.  **Frontend Setup**
    ```bash
    npm install
    # Start the development server
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    # Create and activate virtual environment (optional but recommended)
    python -m venv venv
    .\venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt

    # Run the server
    python run.py
    ```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Developed with ❤️ by the SkinSight AI Team.*
