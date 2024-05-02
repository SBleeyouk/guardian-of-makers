const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const recorder = require('node-record-lpcm16');
const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });
const { getGeminiAnswer } = require('./gemini-pro-vision.js');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;  // Path to the uploaded file
    const fileData = fs.readFileSync(filePath);
    const base64Image = Buffer.from(fileData).toString('base64');
    const promptType = req.body.promptType || 'default';

    const client = new speech.SpeechClient();
    const Answerclient = new textToSpeech.TextToSpeechClient();

    let RecordedPrompt = '';

    const speechRequest = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
        interimResults: false,
    };

    const recording = recorder.record({
        sampleRateHertz: 16000,
        threshold: 0,
        verbose: false,
        recordProgram: 'rec', // 'arecord' or 'sox' are also common
        silence: '10.0',
    }).stream();

    recording.on('error', console.error);

    const recognizeStream = client.streamingRecognize(speechRequest)
        .on('error', console.error)
        .on('data', data => {
            if (data.results[0] && data.results[0].alternatives[0]) {
                RecordedPrompt += data.results[0].alternatives[0].transcript + ' ';
            }
        });

    recording.pipe(recognizeStream);

    try {
        const answer = await getGeminiAnswer(base64Image, promptType, RecordedPrompt);
        console.log("Processed Answer:", answer);

        // Text-to-Speech request and file creation
        const textToSpeechRequest = {
            input: {text: answer},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };
        
        const [response] = await Answerclient.synthesizeSpeech(textToSpeechRequest);
        const writeFile = fs.promises.writeFile;
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');

        res.json({ message: 'Image processed successfully', answer: answer, audioFile: 'output.mp3' });
    } catch (error) {
        console.error("Error during file processing:", error);
        res.status(500).send({ error: 'Failed to process the image or text-to-speech conversion' });
    } finally {
        recognizeStream.end(); // Properly end the recognize stream
        recording.unpipe(recognizeStream); // Disconnect the recording stream
        recording.end(); // Properly end the recording stream
        fs.unlinkSync(filePath); // Clean up the file
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
