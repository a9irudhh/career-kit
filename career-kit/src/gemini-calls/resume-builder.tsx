import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

export async function generateResume({
    schooling,
    professionalExp,
    skills,
    projects,
    extraCurricular,
}: {
    schooling: string;
    professionalExp: string;
    skills: string;
    projects: string;
    extraCurricular: string;
}): Promise<{
    sections: { title: string; content: string | string[] }[];
    summary: string;
}> {
    try {
        const prompt = `
            Generate an ATS-friendly resume based on the following details:
            - Education: ${schooling}
            - Professional Experience: ${professionalExp}
            - Skills: ${skills}
            - Projects: ${projects}
            - Extra Curricular Activities: ${extraCurricular}

            Format the response as a JSON object with the following structure:
            {
                "summary": "A brief professional summary based on the provided details.",
                "sections": [
                    {
                        "title": "Section Title (e.g., Education, Professional Experience, etc.)",
                        "content": ["List of bullet points for this section OR a paragraph"]
                    }
                ]
            }
        `;

        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        });

        const resultText = await response.response.text();
        if (!resultText) {
            throw new Error("Empty response from AI");
        }

        console.log("Raw AI Response:", resultText);

        const jsonMatch =
            resultText.match(/```json\n([\s\S]*?)\n```/) ||
            resultText.match(/```\n([\s\S]*?)\n```/) ||
            resultText.match(/{[\s\S]*?}/);

        if (jsonMatch) {
            let jsonString = jsonMatch[1] || jsonMatch[0];

            jsonString = jsonString.replace(/```json|```/g, "").trim();

            console.log("Cleaned JSON:", jsonString);

            return JSON.parse(jsonString);
        } else {
            throw new Error("Invalid AI response format");
        }
    } catch (error) {
        console.error("Error generating resume:", error);
        return {
            summary: "The AI response was not in the expected format. Please try again.",
            sections: [],
        };
    }
}
