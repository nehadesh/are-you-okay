import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4o" or "gpt-4o-mini"
      messages: [
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message?.content ?? "Sorry, no reply.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "Failed to get response from OpenAI" }, { status: 500 });
  }
}
