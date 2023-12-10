const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/ocr", upload.array("files"), async (req, res) => {
    try {
        const image = req.files[0];
        if (image) {
            const subscriptionKey = process.env.SUB_KEY;
            const endpoint = process.env.END_POINT;

 
            const ocrUrl = `${endpoint}/vision/v3.1/ocr`;

            // Set up the headers for the OCR request
            const headers = {
                "Content-Type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key": subscriptionKey,
            };


            // Make a POST request to the Azure Computer Vision API for OCR
            const response = await axios.post(ocrUrl, image.buffer, {
                headers: headers,
                params: {
                    language: "en", // Set the language for OCR
                    detectOrientation: "true", // Detect text orientation
                },
            });

            // Extract the recognized text from the response
            const recognizedText = response.data.regions.map(region =>
                region.lines.map(line =>
                    line.words.map(word => word.text).join(" ")
                ).join("\n")
            ).join("\n");

            res.status(200).json({ recognizedText });
        }
        else{
             res.status(400).json({message:"Image Not Found"});
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


app.post("/link/ocr", upload.array("files"), async (req, res) => {
    try {
        const {link} = req.body;
        if (link) {
            const subscriptionKey = "8eb6ba7e8de0400a9f5d6bd41be7c337";
            const endpoint = "https://myvision-293.cognitiveservices.azure.com/";

            const ocrUrl = `${endpoint}/vision/v3.1/ocr`;

            // Set up the headers for the OCR request
            const headers = {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey,
            };


            // Make a POST request to the Azure Computer Vision API for OCR
            const response = await axios.post(ocrUrl, {url:link}, {
                headers: headers,
                params: {
                    language: "en", // Set the language for OCR
                    detectOrientation: "true", // Detect text orientation
                },
            });

            // Extract the recognized text from the response
            const recognizedText = response.data.regions.map(region =>
                region.lines.map(line =>
                    line.words.map(word => word.text).join(" ")
                ).join("\n")
            ).join("\n");

            res.status(200).json({ recognizedText });
        }
        else{
             res.status(400).json({message:"Image Not Found"});
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
