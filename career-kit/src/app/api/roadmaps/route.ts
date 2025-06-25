import { NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import RoadmapModel from '@/db/models/Roadmap';
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

// Get all roadmaps (public view) - no authentication required
export async function GET(request: Request) {
  try {
    await connectToMongoDb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const jobTitle = searchParams.get('jobTitle');
    const level = searchParams.get('level');
    const myRoadmaps = searchParams.get('myRoadmaps'); // Filter for user's own roadmaps

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    // If myRoadmaps is true, only show user's roadmaps
    if (myRoadmaps === 'true') {
      const user = await getUserFromToken();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query.userId = user.userId;
    }

    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };
    if (level) query.level = level;

    // Find roadmaps and populate creator info
    const roadmaps = await RoadmapModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await RoadmapModel.countDocuments(query);

    // Get current user to check ownership
    const currentUser = await getUserFromToken();

    // Add ownership info to each roadmap
    const roadmapsWithOwnership = roadmaps.map(roadmap => ({
      ...roadmap,
      isOwner: currentUser ? roadmap.userId === currentUser.userId : false
    }));

    return NextResponse.json({
      roadmaps: roadmapsWithOwnership,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      currentUser: currentUser ? { userId: currentUser.userId, username: currentUser.username } : null
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}

// Create/Save a roadmap (requires authentication)
export async function POST(request: Request) {
  try {
    await connectToMongoDb();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, level, timeRange, roadmapContent } = await request.json();

    // Validate required fields
    if (!jobTitle || !level || !timeRange || !roadmapContent) {
      return NextResponse.json({ 
        error: 'Missing required fields: jobTitle, level, timeRange, roadmapContent' 
      }, { status: 400 });
    }

    const roadmap = await RoadmapModel.create({
      jobTitle,
      level,
      timeRange,
      roadmapContent,
      userId: user.userId,
      createdBy: user.username, // Store creator username for display
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true,
      roadmap: {
        id: roadmap._id,
        jobTitle: roadmap.jobTitle,
        level: roadmap.level,
        timeRange: roadmap.timeRange,
        createdAt: roadmap.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json({ error: 'Failed to save roadmap' }, { status: 500 });
  }
}