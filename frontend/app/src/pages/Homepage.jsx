import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../css/Homepage.css';

export default function Homepage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [news, setNews] = useState("-1");
  const [loading, setLoading] = useState(false);


  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setTextInput('');
    } else {
      alert('Only PDF files are allowed.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    disabled: !!textInput
  });

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setPdfFile(null);
  };

  const handleSubmit = async () => {
    if (pdfFile) {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/pdf', {
          method: 'POST',
          body: pdfFile
        });
        const text = await response.text();
        setNews(text)

      } catch (error) {
        console.error('Error while submitting data: ', error)
      } finally {
        setLoading(false);
      }
    } 
    
    else if (textInput.trim()) {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/text', {
          method: 'POST',
          body: textInput
        });
        const text = await response.text();
        setNews(text)
      } catch (error) {
        console.error('Error while submitting data: ', error)
      } finally {
        setLoading(false);
      }
    } 
    
    else {
      alert('Please upload a PDF or enter text.');
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setTextInput('');
    setNews("-1");
  };

  const showPopup = news === "0" || news === "1";

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Analyzing... Please wait.</p>
        </div>
      )}
      <div className="centered-box">
        <h1>Fake News Detector</h1>
        <hr />
        <h2>Submit PDF or Text</h2>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${textInput ? 'disabled' : ''}`}
        >
          <input {...getInputProps()} />
          {pdfFile ? (
            <p>{pdfFile.name}</p>
          ) : (
            <p>{isDragActive ? 'Drop your PDF here...' : 'Drag & drop a PDF here, or click to select a file'}</p>
          )}
        </div>

        {pdfFile && (
          <button className="remove-button" onClick={handleReset}>
            Remove PDF
          </button>
        )}

        <textarea
          value={textInput}
          onChange={handleTextChange}
          disabled={!!pdfFile}
          placeholder="Or type something here..."
        />

        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {news === "0" ? (
              <>
                <h2>🚨 Fake News Alert! 🚨</h2>
                <p>💣🗞️ This article contains suspicious or misleading content. Think twice before trusting it!</p>
              </>
            ) : (
              <>
                <h2>✅ Valid News Detected! ✅</h2>
                <p>👏🎯🧠 This news seems reliable and trustworthy. Good job verifying!</p>
              </>
            )}
            <button onClick={handleReset}>👍 Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}
