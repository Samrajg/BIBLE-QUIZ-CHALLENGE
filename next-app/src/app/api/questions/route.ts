import { NextResponse } from "next/server";
import { MARK_30_QUESTIONS } from "@/lib/quizData";

export async function GET() {
  return NextResponse.json({
    success: true,
    title: {
      en: "Gospel of Mark (Chapters 1–3)",
      ta: "மாற்கு சுவிசேஷம் (அதிகாரங்கள் 1–3)"
    },
    totalQuestions: MARK_30_QUESTIONS.length,
    timeLimitPerQuestion: 30,
    questions: MARK_30_QUESTIONS
  });
}
