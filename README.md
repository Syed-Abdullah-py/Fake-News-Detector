📰 Fake News Detector
A full-stack web application that allows users to input news articles and determine their authenticity using machine learning. The frontend is built with React and Vite, while the backend utilizes Flask and a trained ML model for classification.

📁 Project Structure
backend/: Contains the Flask application and the trained machine learning model.
frontend/app/: Houses the React-Vite frontend application.

🚀 Getting Started
Prerequisites
Python 3.7+

Node.js 14+ and npm

1. Clone the Repository
> git clone https://github.com/Syed-Abdullah-py/Fake-News-Detector.git
> cd Fake-News-Detector

3. Set Up the Backend
Navigate to the backend directory and install the required Python packages:
> cd backend

4. Start the Flask server:
> python app.py
By default, the backend runs on http://localhost:5000.

5. Set Up the Frontend
Open a new terminal window, navigate to the frontend/app directory, and install the necessary npm packages:
> cd frontend/app
> npm install

Start the React-Vite development server:
> npm run dev
The frontend will typically run on http://localhost:5173.

🔗 Connecting Frontend and Backend
Ensure that the frontend communicates with the backend at http://localhost:5000. If the backend is hosted elsewhere or on a different port, update the API endpoints in your React application accordingly.

🧪 Usage
Open your browser and navigate to http://localhost:5173.

Enter the news article text you wish to verify.

Submit the text to receive a classification indicating whether the news is real or fake.

🛠️ Technologies Used
Frontend: React, Vite

Backend: Flask, scikit-learn

Machine Learning: Pre-trained model saved as model.pkl
