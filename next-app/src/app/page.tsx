"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MARK_30_QUESTIONS, QuizQuestion } from "@/lib/quizData";
import {
  Trophy,
  Clock,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  LogOut,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";

export default function BibleQuizPage() {
  const [lang, setLang] = useState<"en" | "ta">("en");
  const [nickname, setNickname] = useState("");
  const [screen, setScreen] = useState<"welcome" | "quiz" | "results" | "review">("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userRecords, setUserRecords] = useState<
    {
      qIndex: number;
      chosenAnswer: string;
      isCorrect: boolean;
      points: number;
      timeSpent: number;
    }[]
  >([]);

  const questionStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions: QuizQuestion[] = MARK_30_QUESTIONS;
  const currentQ = questions[currentIndex];
  const qData = currentQ ? currentQ[lang] : null;

  // Sound Synthesizer via Web Audio API
  const playSound = useCallback((type: "correct" | "incorrect" | "tick" | "fanfare") => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (type === "tick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "correct") {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + i * 0.05 + 0.3);
        });
      } else if (type === "incorrect") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "fanfare") {
        [523.25, 523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.4);
        });
      }
    } catch {}
  }, [isMuted]);

  // Request Fullscreen
  const requestFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
  };

  // Start Quiz
  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nickname.trim()) return;
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setUserRecords([]);
    setWarningCount(0);
    setShowWarningBanner(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setScreen("quiz");
    requestFullScreen();
  };

  // Restart Quiz from Question 1
  const restartQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    alert(
      lang === "ta"
        ? "⚠️ 5 முறை முழுத்திரையிலிருந்து வெளியேறியதால் வினாடி வினா ஆரம்பத்திலிருந்து மீண்டும் தொடங்குகிறது!"
        : "⚠️ Exited fullscreen 5 times! Quiz restarted from Question 1."
    );
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setUserRecords([]);
    setWarningCount(0);
    setShowWarningBanner(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(30);
    requestFullScreen();
  }, [lang]);

  // Fullscreen Warning Detection (5 Warnings = Restart)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (screen !== "quiz") return;
      if (!document.fullscreenElement) {
        setWarningCount((prev) => {
          const next = prev + 1;
          setShowWarningBanner(true);
          if (next >= 5) {
            setTimeout(restartQuiz, 100);
            return 0;
          }
          return next;
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [screen, restartQuiz]);

  // Handle Answer Selection
  const handleAnswer = useCallback((optionIdx: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOption(optionIdx);

    const elapsedMs = performance.now() - questionStartTimeRef.current;
    const timeSpent = Math.min(30, Math.max(0.1, elapsedMs / 1000));
    const isCorrect = optionIdx === currentQ.correctIndex;

    let pointsAwarded = 0;
    if (isCorrect) {
      playSound("correct");
      setStreak((s) => s + 1);
      const speedBonus = Math.round(500 * (1 - timeSpent / 30));
      pointsAwarded = 500 + speedBonus;
      setScore((sc) => sc + pointsAwarded);
    } else {
      playSound("incorrect");
      setStreak(0);
    }

    setUserRecords((prev) => [
      ...prev,
      {
        qIndex: currentIndex,
        chosenAnswer: qData?.choices[optionIdx] || "",
        isCorrect,
        points: pointsAwarded,
        timeSpent: Math.round(timeSpent * 10) / 10
      }
    ]);
  }, [isAnswered, currentQ, qData, currentIndex, playSound]);

  // Next Question or Finish
  const handleNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      playSound("fanfare");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setScreen("results");
    }
  }, [currentIndex, questions.length, playSound]);

  // Timer Countdown Per Question
  useEffect(() => {
    if (screen !== "quiz" || isAnswered) return;

    questionStartTimeRef.current = performance.now();
    setTimeLeft(30);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAnswer(-1); // timeout
          return 0;
        }
        if (prev <= 6) playSound("tick");
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, screen, isAnswered, handleAnswer, playSound]);

  // Exit Quiz Early
  const handleExitQuiz = () => {
    const confirmMsg =
      lang === "ta"
        ? "நிச்சயமாக வினாடி வினாவிலிருந்து வெளியேற விரும்புகிறீர்களா?"
        : "Are you sure you want to exit the quiz?";
    if (window.confirm(confirmMsg)) {
      if (timerRef.current) clearInterval(timerRef.current);
      setScreen("welcome");
      try {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      } catch {}
    }
  };

  const correctAnswersCount = userRecords.filter((r) => r.isCorrect).length;
  const accuracyPercent = Math.round((correctAnswersCount / questions.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">
            {lang === "ta" ? "வேதாகம வினாடி வினா" : "Bible Quiz Challenge"}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex bg-slate-800 p-0.5 rounded-full border border-slate-700">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "en" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setLang("ta")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                lang === "ta" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🇮🇳 தமிழ்
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center p-3 sm:p-6 max-w-3xl w-full mx-auto">
        {/* ================= SCREEN 1: WELCOME ================= */}
        {screen === "welcome" && (
          <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur text-center">
            <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl mb-4">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {lang === "ta" ? "மாற்கு சுவிசேஷம் (1–3)" : "Gospel of Mark (Chapters 1–3)"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
              {lang === "ta"
                ? "30 வினாக்கள் • கேள்விக்கு 30 வினாடிகள் • உடனடி தமிழ் & ஆங்கில மொழிமாற்றம்."
                : "30 Questions • 30 Seconds per Question • Instant Tamil & English Bilingual Toggle."}
            </p>

            {/* Info Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 text-xs sm:text-sm font-semibold">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {lang === "ta" ? "கேள்விகள்" : "Questions"}
                </span>
                <span className="text-indigo-300 font-bold">30</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {lang === "ta" ? "நேரம்" : "Time"}
                </span>
                <span className="text-amber-300 font-bold">30s / Q</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {lang === "ta" ? "மதிப்பெண்" : "Max Score"}
                </span>
                <span className="text-emerald-300 font-bold">30,000 pts</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {lang === "ta" ? "அதிகாரங்கள்" : "Chapters"}
                </span>
                <span className="text-purple-300 font-bold">Mark 1, 2, 3</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleStart} className="space-y-4 max-w-sm mx-auto">
              <div>
                <label className="block text-left text-xs font-semibold text-slate-300 mb-1">
                  {lang === "ta" ? "உங்கள் பெயரை உள்ளிடவும்" : "Enter Your Nickname"}
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={lang === "ta" ? "எ.கா: தாவீது" : "e.g. David7"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === "ta" ? "வினாடி வினாவைத் தொடங்கு 🚀" : "Start Quiz Challenge 🚀"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= SCREEN 2: ACTIVE QUIZ ================= */}
        {screen === "quiz" && qData && (
          <div className="w-full flex flex-col gap-3">
            {/* Warning Banner */}
            {showWarningBanner && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl text-center flex items-center justify-between animate-pulse">
                <span>
                  {lang === "ta"
                    ? `⚠️ எச்சரிக்கை ${warningCount}/5: முழுத்திரையிலிருந்து வெளியேறக் கூடாது! 5 முறை வெளியேறினால் வினாடி வினா ஆரம்பத்திலிருந்து தொடங்கும்.`
                    : `⚠️ Warning ${warningCount}/5: Fullscreen exit detected! 5 warnings will restart the quiz.`}
                </span>
                <button
                  onClick={() => {
                    requestFullScreen();
                    setShowWarningBanner(false);
                  }}
                  className="ml-2 text-xs bg-red-600 px-2 py-0.5 rounded text-white"
                >
                  {lang === "ta" ? "முழுத்திரை" : "Fix"}
                </button>
              </div>
            )}

            {/* Quiz HUD */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">
                  {lang === "ta" ? "கேள்வி" : "Q"}: {currentIndex + 1} / {questions.length}
                </span>
                {streak >= 2 && (
                  <span className="flex items-center gap-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold px-2 py-0.5 rounded-full text-[11px]">
                    <Flame className="w-3 h-3 fill-orange-400" /> {streak} Streak
                  </span>
                )}
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-1 font-mono font-bold px-3 py-1 rounded-full border ${
                  timeLeft <= 5
                    ? "bg-red-500/20 border-red-500 text-red-400 animate-ping"
                    : "bg-slate-900 border-slate-700 text-amber-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>

              {/* Score & Exit Button */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400">
                  {score.toLocaleString()} <span className="text-[10px] text-slate-400">pts</span>
                </span>
                <button
                  onClick={requestFullScreen}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-700 hidden sm:block"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleExitQuiz}
                  className="bg-red-900/40 hover:bg-red-900/70 border border-red-700/60 text-red-300 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{lang === "ta" ? "வெளியேறு" : "Exit"}</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {lang === "ta" ? currentQ.difficultyTa : currentQ.difficulty} • {lang === "ta" ? `அதிகாரம் ${currentQ.chapter}` : `Chapter ${currentQ.chapter}`}
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  {currentQ.type === "true_false" ? (lang === "ta" ? "உண்மை / பொய்" : "True / False") : "MCQ"}
                </span>
              </div>

              {/* Reduced mobile font size */}
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug mb-5">
                {qData.question}
              </h2>

              {/* Answer Choices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {qData.choices.map((choice, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctIndex;
                  let btnStyle = "bg-slate-900/70 border-slate-700 hover:border-indigo-500 text-slate-200";

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = "bg-emerald-900/60 border-emerald-500 text-emerald-200 font-bold";
                    } else if (isSelected && !isCorrectAnswer) {
                      btnStyle = "bg-red-900/60 border-red-500 text-red-200 font-bold";
                    } else {
                      btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                    }
                  }

                  const letters = ["A", "B", "C", "D"];

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(idx)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {letters[idx]}
                      </span>
                      <span className="flex-1 leading-tight">{choice}</span>
                      {isAnswered && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Answer Feedback & Scripture Reference */}
              {isAnswered && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                  <div className="text-xs text-left w-full sm:w-auto">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      {lang === "ta" ? "வேதாகம ஆதாரம்" : "Scripture Reference"}:
                    </span>
                    <span className="text-amber-300 font-semibold">{qData.reference}</span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                  >
                    <span>{currentIndex + 1 < questions.length ? (lang === "ta" ? "அடுத்த கேள்வி ➜" : "Next Question ➜") : (lang === "ta" ? "முடிவுகளைக் காண்க" : "View Results")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: RESULTS ================= */}
        {screen === "results" && (
          <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur">
            <Trophy className="w-14 h-14 text-amber-400 mx-auto mb-3 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {lang === "ta" ? "வினாடி வினா நிறைவடைந்தது!" : "Quiz Completed!"}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              {lang === "ta" ? `${nickname}, உங்கள் விடை மதிப்பீடு இதோ:` : `Great job, ${nickname}! Here are your results:`}
            </p>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{lang === "ta" ? "மதிப்பெண்" : "Total Score"}</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{score.toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{lang === "ta" ? "சரியானவை" : "Correct"}</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-400">{correctAnswersCount} / {questions.length}</span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{lang === "ta" ? "துல்லியம்" : "Accuracy"}</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">{accuracyPercent}%</span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{lang === "ta" ? "கேள்விகள்" : "Questions"}</span>
                <span className="text-xl sm:text-2xl font-black text-purple-400">{questions.length}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setScreen("review")}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{lang === "ta" ? "விடைகளைச் சரிபார்" : "Review Answers"}</span>
              </button>
              <button
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === "ta" ? "மீண்டும் விளையாடு" : "Play Again"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 4: REVIEW ================= */}
        {screen === "review" && (
          <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white">
                {lang === "ta" ? "விடைகள் மதிப்பாய்வு (30 வினாக்கள்)" : "Answer Review (30 Questions)"}
              </h2>
              <button
                onClick={() => setScreen("results")}
                className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded-lg text-white font-semibold"
              >
                {lang === "ta" ? "⬅ திரும்பு" : "⬅ Back to Results"}
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const rec = userRecords.find((r) => r.qIndex === idx);
                const qLocalized = q[lang];
                const isCorrect = rec?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-left text-xs ${
                      isCorrect
                        ? "bg-emerald-950/30 border-emerald-800/60"
                        : "bg-red-950/30 border-red-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-slate-300">
                        {idx + 1}. {qLocalized.question}
                      </span>
                      <span className={isCorrect ? "text-emerald-400 font-extrabold" : "text-red-400 font-extrabold"}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <div className="space-y-0.5 mt-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">{lang === "ta" ? "உங்கள் விடை" : "Your Answer"}: </span>
                        <span className={isCorrect ? "text-emerald-300 font-semibold" : "text-red-300 font-semibold"}>
                          {rec ? rec.chosenAnswer || "None" : "Timed Out"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">{lang === "ta" ? "சரியான விடை" : "Correct Answer"}: </span>
                        <span className="text-emerald-400 font-bold">{qLocalized.correctAnswer}</span>
                      </div>
                      <div className="text-amber-300/80 mt-1 font-medium">
                        📖 {lang === "ta" ? "வேதாகம ஆதாரம்" : "Reference"}: {qLocalized.reference}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
