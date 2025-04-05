import { NextRequest, NextResponse } from "next/server";
import { getChatbotResponse } from "@/gemini-calls/chatbot";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const response = await getChatbotResponse(message);
    return NextResponse.json({ response });
  } catch (err) {
    return NextResponse.json(
      { response: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
