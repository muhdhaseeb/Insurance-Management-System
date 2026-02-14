import Message from "../models/Message.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Fallback logic for offline mode or API failures
const getFallbackResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi")) return "Hello! How can I help you with your insurance today?";
    if (msg.includes("policy") || msg.includes("plan")) return "You can view all our available plans on the 'Policies' page. We offer Life, Health, Travel, and Auto insurance.";
    if (msg.includes("claim")) return "To file a claim, please go to the 'Claims' tab in your dashboard. It's a quick and easy process.";
    if (msg.includes("contact") || msg.includes("support")) return "You can reach our support team at support@insurance-sys.com or call 1-800-INSURE.";
    if (msg.includes("travel")) return "Our Travel Protection Plus plan covers lost luggage, delays, and medical emergencies abroad. Would you like to know more?";
    if (msg.includes("life")) return "Family Life Secure provides high-value coverage to protect your loved ones. Check the details in the Policies section.";
    if (msg.includes("health")) return "Health Pro Max includes dental, vision, and comprehensive care. It's one of our most popular plans.";
    return "I'm currently operating in offline mode. Please check the 'Policies' or 'Claims' sections for more details, or try again later.";
};

export const chat = async (req, res) => {
    const { message } = req.body;

    try {
        // 1. Save user message
        try {
            await Message.create({
                user: req.user.id,
                text: message,
                sender: "user"
            });
        } catch (dbErr) {
            console.error("Failed to save user message:", dbErr);
        }

        // 2. Try Gemini API
        let responseText = "";
        try {
            // Check if key is present (even if it might be invalid)
            if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            // Reverted to gemini-1.5-flash as the error was key-related
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "You are a warm, friendly, and empathetic insurance AI assistant for TalentFlow. Your goal is to make insurance feel simple and human. Use helpful analogies, greet users kindly, and guide them through our premium products (Health Pro Max, Family Life Secure, Travel Protection Plus) with a supportive tone. Be concise but very approachable."
            });

            // Fetch history safely
            let chatContext = [];
            try {
                const history = await Message.find({ user: req.user.id })
                    .sort({ createdAt: -1 })
                    .limit(6);

                chatContext = history.reverse().map(m => ({
                    role: m.sender === "user" ? "user" : "model",
                    parts: [{ text: m.text || "" }]
                }));
            } catch (histErr) {
                console.warn("Context fetch failed:", histErr);
            }

            const chatSession = model.startChat({
                history: chatContext.slice(0, -1),
                generationConfig: { maxOutputTokens: 200 },
            });

            const result = await chatSession.sendMessage(message);
            responseText = result.response.text();

        } catch (apiError) {
            console.error("Gemini API Error (Back to Fallback):", apiError.message);
            responseText = getFallbackResponse(message || "") + " (Offline Mode)";
        }

        // 3. Save bot response
        try {
            await Message.create({
                user: req.user.id,
                text: responseText,
                sender: "bot"
            });
        } catch (dbErr) {
            console.error("Failed to save bot message:", dbErr);
        }

        res.json({ success: true, reply: responseText });

    } catch (err) {
        console.error("Chat System Critical Error:", err);
        res.json({ success: true, reply: "I'm having trouble connecting to the server. Please try again later." });
    }
};

export const getHistory = async (req, res) => {
    try {
        const messages = await Message.find({ user: req.user.id }).sort({ createdAt: 1 });
        res.json({ success: true, data: messages });
    } catch (err) {
        res.json({ success: true, data: [] });
    }
};
