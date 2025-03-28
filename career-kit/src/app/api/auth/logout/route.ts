import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        // Get the token from cookies
        const token = (await cookies()).get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback_secret'
        ) as {
            userId: string;
            email: string;
            username: string;
        };

        // Return user data
        return NextResponse.json({
            user: {
                id: decoded.userId,
                email: decoded.email,
                username: decoded.username
            }
        });
    } catch (error) {
        console.error('User fetch error:', error);
        return NextResponse.json(
            { message: 'Authentication failed' },
            { status: 401 }
        );
    }
}