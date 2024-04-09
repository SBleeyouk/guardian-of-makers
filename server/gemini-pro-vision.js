const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        }
    };
}

async function getGeminiAnswer() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = "List up arudino items in the picture. Then, suggest five different products that I can make with arudino items in this picture. Also, explain step-by-step instruction to build first suggested item.";

    const imageParts = [fileToGenerativePart("./img/arduino-sample.jpeg", "image/jpeg")];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text
}

module.exports.getGeminiAnswer = getGeminiAnswer;