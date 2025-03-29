import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserFromToken = async () => {
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