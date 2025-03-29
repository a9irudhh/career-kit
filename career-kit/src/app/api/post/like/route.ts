import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDb } from '@/db/dbConnect';
import { ObjectId } from 'mongodb';
import { getUserFromToken } from '@/lib/token';

export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        await connectToMongoDb();
        // Check authentication
        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user ID from the session
        const userId = user.userId;

        // Parse request body
        const { postId } = await req.json();

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        // Connect to the database
        const { db } = await connectToDatabase();

        // Find the post by ID
        const post = await db.collection('posts').findOne({
            _id: new ObjectId(postId)
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Check if user has already liked the post
        const userLiked = post.likes.includes(userId);

        // Update the likes array (toggle like status)
        let updatedLikes;
        if (userLiked) {
            // Remove like
            updatedLikes = post.likes.filter((id: string) => id !== userId);
        } else {
            // Add like
            updatedLikes = [...post.likes, userId];
        }

        // Update the post in the database
        await db.collection('posts').updateOne(
            { _id: new ObjectId(postId) },
            { $set: { likes: updatedLikes } }
        );

        // Return the updated likes array
        return NextResponse.json({ likes: updatedLikes }, { status: 200 });

    } catch (error) {
        console.error('Error handling post like:', error);
        return NextResponse.json(
            { error: 'Failed to process like action' },
            { status: 500 }
        );
    }
}