import { NextResponse } from 'next/server';
import UserModel from '@/db/models/User';
import bcrypt from 'bcrypt';
import { connectToMongoDb } from '@/db/dbConnect';

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        connectToMongoDb();



        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}