const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getGeminiAnswer(base64Image, promptType = 'default', recordedPrompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    let prompt;
    if (promptType === 'default') {
        prompt = "Given a tool, generate a safety warning for children. Describe the potential hazard and provide safety instructions. For example, if the tool is a soldering iron, the warning should be about the heat, turning it off when not in use, and storing it safely. If you can't detect safety issue, reponse 'You're Doing Great!'"
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
