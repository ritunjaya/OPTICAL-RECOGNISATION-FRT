import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = "https://future-ocr-server.azurewebsites.net"

function App() {
  const [image, setImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleUpload = async () => {
    try {
      if (!image) {
        alert('Please select an image before uploading.');
        return;
      }

      const formData = new FormData();
      formData.append('files', image);

      const response = await axios.post(`${BACKEND_URL}/ocr`, formData);

      // Handle the OCR response, set recognized text to state
      setRecognizedText(response.data.recognizedText);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadContainer}>
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
        <button onClick={handleUpload} style={styles.uploadButton}>Upload and OCR</button>
      </div>
      <div style={styles.resultContainer}>
        { recognizedText ? (
          <div>
            <div style={styles.imageContainer}>
              <img src={(URL.createObjectURL(image)) || imageUrl} alt="uploadedImage" style={styles.uploadedImage} />
            </div>
            <div style={styles.textContainer}>
              <h3>Recognized Text:</h3>
              <p>{recognizedText}</p>
            </div>
          </div>
        ) : (
          <div>
          <div style={styles.textContainer}>
            <h3>Upload a Picture</h3>
          </div>
        </div>
        )}
      </div>
    </div>

  );
}


const styles = {
  container: {
    display: 'flex',
    margin: '30px',
  },
  uploadContainer: {
    marginRight: '20px',
    
  },
  fileInput: {
    display: 'block',
  },
  uploadButton: {
    display: 'block',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  resultContainer: {
    flex: '1',
  },
  imageContainer: {
    marginBottom: '20px',
  },
  uploadedImage: {
    maxWidth: '100%',
    height: 'auto',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  textContainer: {
    textAlign: 'left',
  },
};


export default App;
