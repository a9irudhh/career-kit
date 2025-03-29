import { NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import PostModel from '@/db/models/Post';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

// Get a single post using query parameters
export async function GET(request: Request) {
    try {
        await connectToMongoDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Validate the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 });
        }

        const post = await PostModel.findById(id)
            .populate('author', 'username')
            .lean();

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// Update a post using query parameters
export async function PUT(request: Request) {
    try {
        await connectToMongoDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 });
        }

        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await PostModel.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user is the author
        if (post.author.toString() !== user.userId) {
            return NextResponse.json({ error: 'Not authorized to update this post' }, { status: 403 });
        }

        const { title, content, category, tags } = await request.json();

        post.title = title;
        post.content = content;
        post.category = category;
        post.tags = tags;
        post.updatedAt = new Date();

        await post.save();

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// Delete a post using query parameters
export async function DELETE(request: Request) {
    try {
        await connectToMongoDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid post ID format' }, { status: 400 });
        }

        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const post = await PostModel.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user is the author
        if (post.author.toString() !== user.userId) {
            return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 });
        }

        await PostModel.deleteOne({ _id: id });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}