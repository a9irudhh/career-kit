import { NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import PostModel from '@/db/models/Post';
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

// Get all posts
export async function GET(request: Request) {
  try {
    await connectToMongoDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Find posts and populate author
    const posts = await PostModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username')
      .lean();

    const total = await PostModel.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Create a post
export async function POST(request: Request) {
  try {
    await connectToMongoDb();
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, category, tags } = await request.json();

    const post = await PostModel.create({
      title,
      content,
      author: user.userId,
      category,
      tags
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}