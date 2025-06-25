import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey =  "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

// Define types to match the frontend data structure
type EducationItem = {
    institution: string;
    degree: string;
    year: string;
};

type ExperienceItem = {
    company: string;
    position: string;
    duration: string;
    description: string;
};

type ProjectItem = {
    name: string;
    description: string;
    technologies: string;
};

type LinkItem = {
    platform: string;
    url: string;
};

type PersonalInfo = {
    name: string;
    phone: string;
    email: string;
};

export async function generateResume({
    personalInfo,
    education,
    experience,
    projects,
    links,
    skills,
    extraCurricular,
}: {
    personalInfo: PersonalInfo;
    education: EducationItem[];
    experience: ExperienceItem[];
    projects: ProjectItem[];
    links: LinkItem[];
    skills: string;
    extraCurricular?: string;
}): Promise<{
    sections: { title: string; content: string | string[] }[];
    summary: string;
}> {
    try {
        // Format the education items for the prompt
        const formattedEducation = education.map(item =>
            `- ${item.degree} from ${item.institution} (${item.year})`
        ).join("\n");

        // Format the experience items for the prompt
        const formattedExperience = experience.map(item =>
            `- ${item.position} at ${item.company} (${item.duration})\n  Description: ${item.description}`
        ).join("\n");

        // Format the project items for the prompt
        const formattedProjects = projects.length > 0
            ? projects.map(item =>
                `- ${item.name}\n  Technologies: ${item.technologies}\n  Description: ${item.description}`
            ).join("\n")
            : "None provided";

        // Format the link items for the prompt
        const formattedLinks = links.length > 0
            ? links.map(item => `- ${item.platform}: ${item.url}`).join("\n")
            : "None provided";

        const prompt = `
            Generate an ATS-friendly resume for ${personalInfo.name} based on the following details:
            
            Personal Information:
            - Name: ${personalInfo.name}
            - Phone: ${personalInfo.phone}
            - Email: ${personalInfo.email}
            
            Professional Links:
            ${formattedLinks}
            
            Education:
            ${formattedEducation}
            
            Professional Experience:
            ${formattedExperience}
            
            Projects:
            ${formattedProjects}
            
            Skills:
            ${skills}
            
            Extra Curricular Activities:
            ${extraCurricular || "None provided"}

            Create a resume that will pass ATS screening and highlight the candidate's qualifications effectively.
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
            
            Focus on creating bullet points that emphasize achievements and use action verbs. Make sure the structure is clean and ATS-friendly.
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