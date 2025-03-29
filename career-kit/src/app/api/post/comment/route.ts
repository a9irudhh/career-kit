import { NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import CommentModel from '@/db/models/Comment';
import PostModel from '@/db/models/Post';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Get user from token
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

// Get comments for a post
export async function GET(request: Request) {
    try {
        await connectToMongoDb();
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const comments = await CommentModel.find({ post: postId })
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// Create a comment
export async function POST(request: Request) {
    try {
        await connectToMongoDb();
        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, postId, parentCommentId } = await request.json();

        if (!content || !postId) {
            return NextResponse.json({ error: 'Content and postId are required' }, { status: 400 });
        }

        // Verify post exists
        const post = await PostModel.findById(postId);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Create comment
        const comment = await CommentModel.create({
            content,
            author: user.userId,
            post: postId,
            parentComment: parentCommentId || null,
        });

        // Add to post's comments array
        await PostModel.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        });

        // Populate author for response
        const populatedComment = await CommentModel.findById(comment._id)
            .populate('author', 'username')
            .lean();

        return NextResponse.json({ comment: populatedComment }, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}