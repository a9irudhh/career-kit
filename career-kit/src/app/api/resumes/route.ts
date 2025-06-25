import { NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import ResumeModel from '@/db/models/Resume';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Get user from token helper function
const getUserFromToken = async () => {
  const token = (await cookies()).get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as {
      userId: string;
      email: string;
      username: string;
    };

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Get all resumes for a user
export async function GET(request: Request) {
  try {
    await connectToMongoDb();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');

    const skip = (page - 1) * limit;

    // Find resumes for the user
    const resumes = await ResumeModel.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ResumeModel.countDocuments({ userId: user.userId });

    return NextResponse.json({
      resumes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// Create/Save a resume
export async function POST(request: Request) {
  try {
    await connectToMongoDb();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumeData = await request.json();

    // Validate required fields
    if (!resumeData.personalInfo || !resumeData.generatedContent) {
      return NextResponse.json({ 
        error: 'Missing required fields: personalInfo, generatedContent' 
      }, { status: 400 });
    }

    const resume = await ResumeModel.create({
      ...resumeData,
      userId: user.userId,
      createdBy: user.username
    });

    return NextResponse.json({ 
      success: true,
      resume: {
        id: resume._id,
        name: resume.personalInfo.name,
        createdAt: resume.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
  }
}


// Delete a resume
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDb();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await ResumeModel.findOneAndDelete({
      _id: params.id,
      userId: user.userId
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}