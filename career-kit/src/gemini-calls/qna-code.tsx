import { GoogleGenerativeAI } from "@google/generative-ai";

// Remove the fs import that's causing the Node.js compatibility error
// import fs from "node:fs"; 

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
};

const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "`Generate a coding problem about {Strings}. \n      Include the following:\n      1. A title for the problem\n      2. A detailed description of the problem\n      3. 3-4 example test cases with inputs and expected outputs\n      4. A brief explanation of the concept and approach to solve it\n      \n      Format your response as a JSON object with fields: title, description, testCases (array of objects with input and output), and explanation." },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"title\": \"Longest Substring Without Repeating Characters\",\n  \"description\": \"Given a string `s`, find the length of the longest substring without repeating characters. A substring is a contiguous sequence of characters within a string.  For example, in the string \\\"abcabcbb\\\", the substrings \\\"abc\\\", \\\"bca\\\", \\\"cab\\\", \\\"abc\\\" are all valid substrings. However, we are interested in the longest substring *without* repeating characters. In this case, \\\"abc\\\" is the longest such substring, with a length of 3.\",\n  \"testCases\": [\n    {\n      \"input\": \"abcabcbb\",\n      \"output\": 3\n    },\n    {\n      \"input\": \"bbbbb\",\n      \"output\": 1\n    },\n    {\n      \"input\": \"pwwkew\",\n      \"output\": 3\n    },\n    {\n      \"input\": \"\",\n      \"output\": 0\n    }\n\n  ],\n  \"explanation\": \"This problem can be efficiently solved using a sliding window approach.  Maintain two pointers, `start` and `end`, representing the beginning and end of the current substring being considered.  Use a set or dictionary to keep track of characters encountered within the current window. Iterate through the string, expanding the window by incrementing the `end` pointer.  If a character is encountered that's already in the set (i.e., a repeating character), shrink the window by incrementing the `start` pointer until the repeating character is removed from the window. Keep track of the maximum window size encountered throughout the process, which represents the length of the longest substring without repeating characters.  The time complexity of this solution is O(n), where n is the length of the string, because each character is visited at most twice.\"\n}\n```" },
            ],
        },
    ],
});

export async function GenerateQuestion(topic : string) {
    try {
        const Prompt = `Generate a coding problem about ${topic}. 
        Include the following:
        1. A title for the problem
        2. A detailed description of the problem
        3. 3-4 example test cases with inputs and expected outputs
        4. A brief explanation of the concept and approach to solve it
        
        Format your response as a JSON object with fields: title, description, testCases (array of objects with input and output), and explanation.`;

        const result = await chatSession.sendMessage(Prompt);
        const resultText = result.response.text();

        // Check if response contains code block with JSON
        const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/) ||
            resultText.match(/```\n([\s\S]*?)\n```/) ||
            resultText.match(/{[\s\S]*?}/);

        if (jsonMatch) {
            // Extract just the JSON part
            const jsonString = jsonMatch[1] || jsonMatch[0];
            try {
                return JSON.parse(jsonString);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.log("Failed to parse:", jsonString);
                // Return a fallback object
                return {
                    title: "Error parsing response",
                    description: "There was an error parsing the AI response. Please try again.",
                    testCases: [],
                    explanation: ""
                };
            }
        } else {
            // Try to parse the whole text as JSON
            try {
                return JSON.parse(resultText);
            } catch (parseError) {
                console.error("Not JSON format:", parseError);
                // Return a fallback object
                return {
                    title: "Error parsing response",
                    description: "The AI response was not in the expected format. Please try again.",
                    testCases: [],
                    explanation: ""
                };
            }
        }
    } catch (error) {
        console.error("Error in GenerateQuestion:", error);
        return null;
    }
}