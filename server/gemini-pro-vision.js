const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getGeminiAnswer(base64Image, promptType = 'default', recordedPrompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    let prompt;
    if (promptType === 'default') {
        prompt = "The kid is making arduino product. Is there any safety issue here? If everything is fine, just response 'You're doing Great'"
    } else if (promptType === 'idea') {
        prompt = "List up Arduino items in the picture. Then, suggest five different products that I can make with Arduino items in this picture.";
    } else if (promptType === 'question') {
        prompt = recordedPrompt;
    }

    const imageParts = [{
        inlineData: {
            data: base64Image,
            mimeType: "image/jpeg",
        }
    }];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text;
}

module.exports.getGeminiAnswer = getGeminiAnswer;
