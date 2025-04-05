


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
    history: [
        {
            role: "user",
            parts: [
                { text: "Create a detailed career roadmap for someone pursuing a role as a [Data Scientist] who is currently at a [BEGINNER] level. \n\nPlease format the entire response using HTML tags with inline CSS styling that makes it visually appealing, organized, and ready to be rendered in a web application.\n\nStructure the roadmap with the following sections:\n\n1. **Career Path Overview**: A high-level summary of the [JOB TITLE] career path with progression milestones.\n\n2. **Skills Development Roadmap**: Organize this as a timeline with 3-5 stages. For each stage:\n   - Timeline point (0-6 months, 6-12 months, etc.)\n   - Required technical skills to develop\n   - Required soft skills to develop\n   - Projects/deliverables to build at this stage\n   - Resources for learning (courses, books, tutorials)\n\n3. **Key Technologies**: Create a visually distinctive section showing the essential technologies/tools to master, with icons if possible.\n\n4. **Industry Certifications**: List relevant certifications with difficulty level, estimated preparation time, and importance rating.\n\n5. **Learning Resources**: Organized by category (Books, Online Courses, YouTube Channels, Communities) with brief descriptions.\n\nFormat your response with appealing HTML and CSS that includes:\n- A modern color scheme with primary color #3b82f6 (blue)\n- Responsive design principles\n- Visual elements like progress bars, cards, and icons\n- Clear typography with headings\n- Sections with appropriate padding and margins\n- Bulletpoints where appropriate\n\nMake the roadmap realistic, challenging but achievable, and include specific actionable advice. Include insights about industry trends, salary expectations at different stages, and common challenges people face.\n\nThe output should be complete HTML that can be directly inserted into a web application and render beautifully without additional styling." },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Data Scientist Career Roadmap</title>\n    <style>\n        /* Styling */\n        body { font-family: sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f8fafc; color: #374151; }\n        h1, h2, h3 { color: #3b82f6; }\n        section { padding: 20px; margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }\n        .timeline { display: flex; flex-direction: column; }\n        .timeline-item { margin-bottom: 20px; padding: 10px; border-left: 4px solid #3b82f6; background-color: #e0f2fe; border-radius: 5px; }\n        .timeline-point { font-weight: bold; color: #3b82f6; margin-bottom: 5px; }\n        .key-technologies { display: flex; flex-wrap: wrap; justify-content: space-around; }\n        .tech-icon { text-align: center; margin: 10px; }\n        .tech-icon i { font-size: 48px; color: #3b82f6; margin-bottom: 5px; }\n        .certification { margin-bottom: 10px; padding: 10px; border-radius: 5px; background-color: #e0f2fe; }\n        .resource-category { margin-bottom: 10px; }\n        .resource-item { list-style: disc; margin-left: 20px; margin-bottom: 5px; }\n        ul { padding: 0; list-style-type: none; }\n        li { padding-left: 1em; text-indent: -1em; }\n        .progress { height: 20px; background-color: #e2e8f0; border-radius: 5px; overflow: hidden; }\n        .progress-bar { height: 100%; background-color: #3b82f6; width: 0%; transition: width 0.5s ease-in-out; }\n\n\n\n        /* Responsive Design */\n        @media (max-width: 768px) {\n            .timeline { flex-direction: column; }\n            .key-technologies { flex-direction: column; align-items: center; }\n        }\n    </style>\n</head>\n<body>\n\n    <h1>Data Scientist Career Roadmap (Intermediate Level)</h1>\n\n    <section>\n        <h2>Career Path Overview</h2>\n        <p>From your current intermediate level, you can aim for senior Data Scientist roles, specialize in areas like Machine Learning or Deep Learning, or transition into leadership positions such as Data Science Manager or Director.  Continual learning and project portfolio development are key to growth. Expecting a salary jump from the intermediate level (e.g., $90k-$130k) to senior levels ($120k-$200k+).</p> \n        <p>Common challenges include keeping up with the rapid technological advancements, effectively communicating complex insights to stakeholders, and navigating ethical considerations in data science.</p>\n\n    </section>\n\n    <section>\n        <h2>Skills Development Roadmap</h2>\n        <div class=\"timeline\">\n\n            <div class=\"timeline-item\">\n                <div class=\"timeline-point\">6-12 Months</div>\n                <strong>Technical Skills:</strong> Advanced SQL, Machine Learning algorithms (Ensemble methods, Time Series), Cloud Computing (AWS/Azure/GCP), Big Data tools (Spark/Hadoop).<br>\n                <strong>Soft Skills:</strong>  Effective communication of technical findings, stakeholder management.<br>\n                <strong>Projects:</strong> Build end-to-end machine learning projects, deploy models, and showcase on platforms like GitHub.<br>\n                <strong>Resources:</strong> Advanced ML courses on Coursera/Udacity, cloud platform documentation.\n            </div>\n\n            <div class=\"timeline-item\">\n                <div class=\"timeline-point\">12-18 Months</div>\n                <strong>Technical Skills:</strong> Deep Learning (CNNs, RNNs), MLOps,  Advanced Statistical Modeling.<br>\n                <strong>Soft Skills:</strong>  Mentoring junior data scientists, leading technical discussions.<br>\n                <strong>Projects:</strong> Develop complex deep learning projects, implement MLOps pipelines, contribute to open-source projects.<br>\n                <strong>Resources:</strong> Deep learning specializations, MLOps resources, research papers.\n            </div>\n\n             <div class=\"timeline-item\">\n                <div class=\"timeline-point\">18-24 Months</div>\n                <strong>Technical Skills:</strong>  Advanced Deep Learning (Transformers, GANs), distributed computing, specialized tools (e.g., TensorFlow Extended).<br>\n                <strong>Soft Skills:</strong>  Strategic thinking about data science initiatives, presenting to executive leadership.<br>\n                <strong>Projects:</strong>  Lead complex data science projects, build scalable machine learning systems, publish research or articles.<br>\n                <strong>Resources:</strong>  Research publications, industry conferences, specialized training programs.\n            </div>\n\n        </div>\n    </section>\n\n    <section>\n        <h2>Key Technologies</h2>\n        <div class=\"key-technologies\">\n            <div class=\"tech-icon\"><i class=\"fab fa-python\"></i> Python</div>\n            <div class=\"tech-icon\"><i class=\"fas fa-database\"></i> SQL</div>\n            <div class=\"tech-icon\"><i class=\"fas fa-cloud\"></i> Cloud Computing</div>\n            <div class=\"tech-icon\"><i class=\"fas fa-chart-line\"></i> Machine Learning</div>\n            <div class=\"tech-icon\"><i class=\"fas fa-brain\"></i> Deep Learning</div>\n         </div>\n    </section>\n\n\n    <section>\n        <h2>Industry Certifications</h2>\n        <div class=\"certification\">\n            <strong>AWS Certified Machine Learning – Specialty</strong><br>\n            Difficulty: Advanced <br>\n            Preparation Time: ~3 months<br>\n            Importance: High\n        </div>\n        <div class=\"certification\">\n            <strong>Google Cloud Professional Machine Learning Engineer</strong><br>\n            Difficulty: Advanced<br>\n            Preparation Time: ~3 months<br>\n            Importance: High\n        </div>\n        <div class=\"certification\">\n            <strong>Microsoft Certified: Azure Data Scientist Associate</strong><br>\n            Difficulty: Advanced<br>\n            Preparation Time: ~2 months<br>\n            Importance: High\n        </div>\n    </section>\n\n    <section>\n        <h2>Learning Resources</h2>\n        <div class=\"resource-category\">\n            <h3>Books</h3>\n            <ul>\n                <li>Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow </li>\n                <li>Deep Learning (Adaptive Computation and Machine Learning series)</li>\n            </ul>\n        </div>\n        <div class=\"resource-category\">\n            <h3>Online Courses</h3>\n            <ul>\n                <li>Coursera: Machine Learning Specialization (Andrew Ng)</li>\n                <li>Udacity:  Deep Learning Nanodegree</li>\n                <li>DataCamp: Data Science career tracks</li>\n            </ul>\n        </div>\n        <div class=\"resource-category\">\n            <h3>YouTube Channels</h3>\n            <ul>\n                <li>Sentdex</li>\n                <li>3Blue1Brown</li>\n            </ul>\n        </div>\n         <div class=\"resource-category\">\n            <h3>Communities</h3>\n            <ul>\n                <li>Kaggle</li>\n                <li>Towards Data Science</li>\n            </ul>\n        </div>\n    </section>\n\n\n    <script src=\"https://kit.fontawesome.com/your-font-awesome-kit-id.js\" crossorigin=\"anonymous\"></script> </body>\n</html>\n\n```\n\n\n." },
            ],
        },
    ],
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
    - Clear sections with appropriate spacing

    Include realistic industry trends and common challenges people face. The HTML should be complete and render beautifully without external CSS.
    
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
