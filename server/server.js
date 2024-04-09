const express = require('express')
const app = express()

const { getGeminiAnswer } = require('./gemini-pro-vision.js');

app.get('/get-answer', async (req, res) => {
    try {
        const answer = await getGeminiAnswer();
        res.send({ answer: answer });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while fetching the answer' });
    }
});

app.listen(5000, ()=> {console.log("Server started on port 5000")})
//app.listen(8000)