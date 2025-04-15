


import { GoogleGenerativeAI } from "@google/generative-ai";

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
});


export async function generateCareerRoadmap(jobTitle: string, level: string, timeRange: string): Promise<string> {
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    };

    // Handle custom timeframe
    let timeframe;
    if (timeRange.startsWith('CUSTOM-')) {
        const months = timeRange.replace('CUSTOM-', '');
        // Convert months to a more natural format
        const years = Math.floor(parseInt(months) / 12);
        const remainingMonths = parseInt(months) % 12;

        if (years > 0 && remainingMonths > 0) {
            timeframe = `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        } else if (years > 0) {
            timeframe = `${years} year${years > 1 ? 's' : ''}`;
        } else {
            timeframe = `${months} month${parseInt(months) > 1 ? 's' : ''}`;
        }
    } else {
        // Handle predefined timeframes
        const timeframeMap = {
            "1-YEAR": "1 year",
            "2-YEARS": "2 years",
            "3-YEARS": "3 years",
            "5-YEARS": "5 years",
        };
        
        timeframe = timeframeMap[timeRange] || "2 years";
    }

    // Create the prompt with the timeframe parameter
    const prompt = `
    Create a detailed career roadmap for someone pursuing a role as a ${jobTitle} who is currently at a ${level} level, with a timeframe of ${timeframe}.

    Format the response as clean, well-structured HTML with inline CSS styling that makes it visually appealing and ready to render directly in a web application.

    Structure the roadmap with these sections:
    1. Career Path Overview: High-level summary with progression milestones for the next ${timeframe}
    2. Skills Development Roadmap: Timeline with stages appropriate for a ${timeframe} plan, showing technical skills, soft skills, projects, and resources
    3. Key Technologies: Essential technologies/tools to master within this timeframe
    4. Industry Certifications: Relevant certifications achievable in ${timeframe}
    5. Learning Resources: Recommended books, courses, communities
    6. Salary Expectations: Expected compensation at different stages

    Use this styling:
    - Modern color scheme with primary color #3b82f6 (blue)
    - Responsive design principles with clean typography
    - Visual elements like progress bars, cards, and timelines
    - Clear sections with appropriate spacing and headings 
    - Properly style lists and tables for readability 
    - Use icons wherever replated 
    

    Include realistic industry trends and common challenges people face. The HTML should be complete and render beautifully without external CSS. also add js to make the page interactive
    
    Don't include sample HTML comments or placeholder text in your response.
    `;

    try {
        const result = await chatSession.sendMessage(prompt)
        const response = await result.response;
        let text = response.text();

        // Clean up any code blocks if present
        if (text.includes("```html")) {
            text = text.replace(/```html\n/, "").replace(/\n```/, "");
        }

        // Remove any placeholder comments or JSX comments
        text = text.replace(/\{\/\*.*?\*\/\}/g, '');
        text = text.replace(/<!-- .*? -->/g, '');

        return text;
    } catch (error) {
        console.error("Error generating roadmap:", error);
        return `<div class="error">Failed to generate roadmap. Please try again later.</div>`;
    }
}
