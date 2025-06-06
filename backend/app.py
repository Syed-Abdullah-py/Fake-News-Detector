from flask import Flask, request
from PyPDF2 import PdfReader
import fake_news_detector
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

@app.route('/pdf', methods=['POST'])
def newsPdf():
    try:
        pdf_file = io.BytesIO(request.data)
        reader = PdfReader(pdf_file)
        # Keep the extracted text as-is, preserving spaces
        extracted_text = "\n".join((page.extract_text() or '') for page in reader.pages)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return "Error reading PDF file.", 400

    print(extracted_text)
    label = fake_news_detector.fake_news_detect(extracted_text)
    return str(label)



@app.route('/text', methods=['POST'])
def newsText():
    try:
        extracted_text = request.data.decode('utf-8').strip()
    except Exception as e:
        print(f"Error decoding text input: {e}")
        return "Invalid text input.", 400

    if not extracted_text:
        return "Empty text input.", 400
    
    label = fake_news_detector.fake_news_detect(extracted_text)
    return str(label)

if __name__ == '__main__':
    app.run(debug=True)
