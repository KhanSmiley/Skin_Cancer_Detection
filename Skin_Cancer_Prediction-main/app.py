from flask import Flask, request, render_template, jsonify
import mysql.connector
import tensorflow as tf
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import tempfile
import numpy as np
import cv2
import pandas as pd
from flask_mail import Mail, Message

# Initialize Flask app
app = Flask(__name__, static_folder='assets/static', template_folder='assets/templates')

global model
model_path = "model/scr_skin_cnn_efficientNetB1.h5"  
model = tf.keras.models.load_model(model_path)

# MySQL connection configuration
db_config = {
    'user': 'root',  
    'password': 'root',  
    'host': 'localhost',  
    'database': 'alliance',  # your database
}

# Connect to MySQL
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Create a table for appointments if not exists
cursor.execute('''
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255),
    email VARCHAR(255),
    phoneNumber VARCHAR(20),
    preferredDateTime DATETIME,
    reason TEXT,
    doctor VARCHAR(255)
)
''')

app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='allianceskincarecenter@gmail.com',  # Replace with your email
    MAIL_PASSWORD='vytw mqjr oveq izbf',        # Replace with your email password
)

class_labels = [
    "melanocytic_nevi",
    "melanoma",
    "vascular_lesions",
    "dermatofibroma",
    "benign_keratosis_like_lesions",
    "basal_cell_carcinoma",
    "actinic_keratoses",
]

mail = Mail(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload")
def upload():
    return render_template("upload.html")

@app.route("/near")
def near():
    return render_template("near.html")

@app.route("/aboutus")
def about_us():
    return render_template("aboutus.html")

@app.route("/form")
def form():
    return render_template("form.html")


@app.route('/submit-appointment', methods=['POST'])
def submit_appointment():
    # Get form data
    fullName = request.form['fullName']
    email = request.form['email']
    phoneNumber = request.form['phoneNumber']
    preferredDateTime = datetime.fromisoformat(request.form['preferredDateTime'])
    reason = request.form.get('reason', '') 
    doctor = request.form['doctor']

    # Insert into database
    insert_query = '''
    INSERT INTO appointments (fullName, email, phoneNumber, preferredDateTime, reason, doctor)
    VALUES (%s, %s, %s, %s, %s, %s)
    '''
    cursor.execute(insert_query, (fullName, email, phoneNumber, preferredDateTime, reason, doctor))
    conn.commit()

    # Send confirmation email
    subject = "Appointment Confirmation"
    body = f"Hello {fullName},\n\nYour appointment with {doctor} on {preferredDateTime} has been confirmed."
    
    message = Message(
        subject, 
        recipients=[email], 
        body=body, 
        sender=('Alliance Skin Care Center', 'allianceskincarecenter@gmail.com')  # Specifying the sender
    )
    mail.send(message)

    return render_template(
        'invoice.html',
        fullName=fullName,
        email=email,
        phoneNumber=phoneNumber,
        preferredDateTime=preferredDateTime,
        reason=reason,
        doctor=doctor
    ), 201


@app.route("/prediction", methods=["POST"])
def prediction():
    img = request.files["img"]
    img_path = "img.jpg"
    img.save(img_path)
    
    image = cv2.imread(img_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = np.reshape(image, (1, 224, 224, 3))

    pred = model.predict(image)
    pred_idx = np.argmax(pred)
    pred_class = class_labels[pred_idx]
    
    is_cancerous = bool(pred_idx == 1) 

    return jsonify({
        "success": True,
        "prediction": pred_class,
        "cancerous": is_cancerous  
    })

# Start the Flask server
if __name__ == "__main__":
    app.run(debug=True)
