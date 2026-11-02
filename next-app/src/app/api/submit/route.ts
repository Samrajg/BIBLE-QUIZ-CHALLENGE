import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MARK_30_QUESTIONS } from "@/lib/quizData";

const SubmitRecordSchema = z.object({
  playerName: z.string().min(1).max(30),
  attemptId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      selectedAnswer: z.string(),
      responseTimeSec: z.number().min(0).max(60),
      isTimeout: z.boolean().optional()
    })
  )
});

// In-memory leaderboard store with persistent database compatibility
interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  correctCount: number;
  accuracy: number;
  totalTimeSec: number;
  createdAt: string;
}

const leaderboardStore: ScoreEntry[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubmitRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid submission data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { playerName, attemptId, answers } = parsed.data;
    let score = 0;
    let correctCount = 0;
    let totalTimeSec = 0;

    const answerMap = new Map(answers.map((a) => [a.questionId, a]));

    MARK_30_QUESTIONS.forEach((q) => {
      const submission = answerMap.get(q.id);
      if (submission && !submission.isTimeout) {
        totalTimeSec += submission.responseTimeSec;
        const isCorrect =
          submission.selectedAnswer === q.en.correctAnswer ||
          submission.selectedAnswer === q.ta.correctAnswer;

        if (isCorrect) {
          correctCount++;
          // Base 500 + up to 500 speed bonus
          const clampedTime = Math.max(0.1, Math.min(submission.responseTimeSec, 30));
          const speedBonus = Math.round(500 * (1 - clampedTime / 30));
          score += 500 + speedBonus;
        }
      }
    });

    const accuracy = Math.round((correctCount / MARK_30_QUESTIONS.length) * 100);

    const record: ScoreEntry = {
      id: attemptId,
      playerName,
      score,
      correctCount,
      accuracy,
      totalTimeSec: Math.round(totalTimeSec * 10) / 10,
      createdAt: new Date().toISOString()
    };

    leaderboardStore.push(record);
    leaderboardStore.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      result: record,
      totalQuestions: MARK_30_QUESTIONS.length,
      rank: leaderboardStore.findIndex((e) => e.id === attemptId) + 1
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    leaderboard: leaderboardStore.slice(0, 50)
  });
}
