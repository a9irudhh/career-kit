import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [{ text: "You're an AI assistant focused on answering questions about jobs and careers only. Politely reject any other topic." }],
    },
    {
      role: "model",
      parts: [{ text: "Understood! I'm here to help with job and career related questions." }],
    },
  ],
});

export async function getChatbotResponse(userMessage: string): Promise<string> {
  try {
    const result = await chatSession.sendMessage(userMessage);
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Sorry, I couldn't process your request. Please try again.";
  }
}
