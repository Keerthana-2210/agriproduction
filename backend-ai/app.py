from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Agri-AI Prediction Service is running..."

@app.route('/predict-yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json
        # Inputs: soilPh, moisture, temperature, humidity, n, p, k
        # We'll use a simple mock formula for now to simulate a model
        # Real ML models would load a .pkl or .h5 file here
        
        soil_ph = data.get('soilPh', 6.5)
        moisture = data.get('moisture', 40)
        temp = data.get('temperature', 25)
        n = data.get('n', 50)
        p = data.get('p', 50)
        k = data.get('k', 50)

        # Mock logic: Yield is higher if pH is near 6.5 and moisture is near 50
        base_yield = 100 # tons per hectare
        ph_factor = 1.0 - abs(6.5 - soil_ph) * 0.1
        moisture_factor = 1.0 - abs(50 - moisture) * 0.005
        npk_factor = (n + p + k) / 150 # Normalized to 1.0

        predicted_yield = base_yield * ph_factor * moisture_factor * npk_factor
        predicted_yield = max(0, predicted_yield + random.uniform(-5, 5))

        return jsonify({
            'predicted_yield': round(predicted_yield, 2),
            'unit': 'tons/hectare',
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/predict-spoilage', methods=['POST'])
def predict_spoilage():
    try:
        data = request.json
        # Inputs: storage_temperature, storage_humidity, crop_type
        temp = data.get('temperature', 25)
        humidity = data.get('humidity', 60)
        
        # Mock logic: Spoilage risk increases if temp > 30 or humidity > 75
        risk_score = 0
        if temp > 30:
            risk_score += (temp - 30) * 2
        if humidity > 75:
            risk_score += (humidity - 75) * 1.5
            
        if risk_score > 20:
            risk_level = "High"
            alert = "Warning: High risk of fungal growth and spoilage. Decrease temperature and humidity immediately."
        elif risk_score > 10:
            risk_level = "Medium"
            alert = "Caution: Sub-optimal storage conditions. Monitor closely."
        else:
            risk_level = "Low"
            alert = "Storage conditions are optimal. No immediate risk."

        return jsonify({
            'risk_level': risk_level,
            'risk_score': round(risk_score, 2),
            'alert': alert,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
