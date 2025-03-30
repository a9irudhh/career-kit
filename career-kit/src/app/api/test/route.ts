import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const data = { message: 'GET method successful', status: 'ok' };
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}