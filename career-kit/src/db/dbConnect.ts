import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function connectToMongoDb() {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
        throw new Error('MongoDB URI is not defined');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}