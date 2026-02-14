import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

console.log("Testing Gemini API (gemini-pro)...");

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Changed to gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Sending prompt...");
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (error.status) console.error("Status:", error.status);
    }
}

test();
