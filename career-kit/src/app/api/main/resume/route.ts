import { NextResponse } from 'next/server';
import { generateResume } from '@/gemini-calls/resume-builder'; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { schooling, professionalExp, skills, projects, extraCurricular } = body;
        if (!schooling || !professionalExp || !skills || !projects || !extraCurricular) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const resumeData = await generateResume({
            schooling,
            professionalExp,
            skills,
            projects,
            extraCurricular,
        });
        return NextResponse.json({ data: resumeData }, { status: 200 });
    } catch (error) {
        console.error('Error processing resume data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}