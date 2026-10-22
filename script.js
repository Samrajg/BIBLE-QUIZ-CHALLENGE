/**
 * BIBLE QUIZ CHALLENGE - script.js
 * Pure Vanilla JavaScript (ES6+)
 * No external libraries, no frameworks, zero dependencies.
 */

// ==========================================
// 1. QUESTION BANK (5 Focused Questions for MVP)
// ==========================================
const QUESTION_BANK = [
  {
    id: 1,
    category: "Gospels",
    difficulty: "Beginner",
    question: "How many disciples did Jesus choose?",
    options: ["12", "7", "10", "40"],
    correctAnswer: "12",
    reference: "Luke 6:12–16",
    explanation: "Jesus went up on a mountainside to pray all night, and when morning came, He called His disciples and chose twelve of them, whom He also designated apostles."
  },
  {
    id: 2,
    category: "Gospels",
    difficulty: "Beginner",
    question: "Which disciple betrayed Jesus?",
    options: ["Judas Iscariot", "Simon Peter", "Thomas", "John"],
    correctAnswer: "Judas Iscariot",
    reference: "Matthew 26:14–16",
    explanation: "Judas Iscariot went to the chief priests and agreed to betray Jesus for thirty pieces of silver."
  },
  {
    id: 3,
    category: "Old Testament",
    difficulty: "Beginner",
    question: "Who was thrown into the lions’ den but stayed safe?",
    options: ["Daniel", "David", "Joseph", "Samson"],
    correctAnswer: "Daniel",
    reference: "Daniel 6:16–23",
    explanation: "King Darius had Daniel cast into the den of lions for praying to God, but God sent His angel to shut the lions' mouths because Daniel was found blameless."
  },
  {
    id: 4,
    category: "Gospels",
    difficulty: "Beginner",
    question: "In which town was Jesus born?",
    options: ["Bethlehem", "Nazareth", "Jerusalem", "Capernaum"],
    correctAnswer: "Bethlehem",
    reference: "Micah 5:2 & Luke 2:4–7",
    explanation: "Joseph and Mary traveled to Bethlehem, the City of David, where Jesus was born in a manger, fulfilling prophecy."
  },
  {
    id: 5,
    category: "Miracles",
    difficulty: "Beginner",
    question: "What was Jesus’ first miracle?",
    options: [
      "Turning water into wine (at the wedding in Cana)",
      "Feeding the 5,000",
      "Walking on water",
      "Healing the blind man"
    ],
    correctAnswer: "Turning water into wine (at the wedding in Cana)",
    reference: "John 2:1–11",
    explanation: "Jesus performed this first of His signs in Cana of Galilee, turning water into wine and revealing His glory, and His disciples believed in Him."
  }
];

// ==========================================
// 2. CONSTANTS & CONFIGURATION
// ==========================================
const CONFIG = {
  TOTAL_QUESTIONS: QUESTION_BANK.length, // 5 questions
  TIME_LIMIT_SECONDS: 20,
  BASE_POINTS: 500,
  SPEED_BONUS_MAX: 500,
  MAX_SCORE_PER_Q: 1000
};

// ==========================================
// 3. GAME STATE (Single Source of Truth)
// ==========================================
const gameState = {
  playerName: "",
  attemptId: "",
  currentQuestionIndex: 0,
  selectedQuestions: [],
  userRecords: [],
  cumulativeScore: 0,
  questionStartTime: 0,
  timerInterval: null,
  isAnswerSubmitted: false
};

// ==========================================
// 4. DOM ELEMENTS CACHE
// ==========================================
const DOM = {
  // Screens
  screens: {
    welcome: document.getElementById("welcome-screen"),
    quiz: document.getElementById("quiz-screen"),
    results: document.getElementById("results-screen"),
    review: document.getElementById("review-screen")
  },
  // Screen A
  form: document.getElementById("nickname-form"),
  nicknameInput: document.getElementById("nickname-input"),
  nicknameError: document.getElementById("nickname-error"),
  startBtn: document.getElementById("start-btn"),
  // Screen B HUD
  hudPlayerName: document.getElementById("hud-player-name"),
  currentQNum: document.getElementById("current-q-num"),
  totalQNum: document.getElementById("total-q-num"),
  timerBox: document.getElementById("timer-box"),
  timerDisplay: document.getElementById("timer-display"),
  hudScore: document.getElementById("hud-score"),
  progressBar: document.getElementById("progress-bar"),
  // Screen B Question & Answers
  questionText: document.getElementById("question-text"),
  answerGrid: document.getElementById("answer-grid"),
  answerButtons: [
    document.getElementById("opt-0"),
    document.getElementById("opt-1"),
    document.getElementById("opt-2"),
    document.getElementById("opt-3")
  ],
  // Screen C Feedback
  feedbackPanel: document.getElementById("feedback-panel"),
  feedbackBanner: document.getElementById("feedback-banner"),
  feedbackIcon: document.getElementById("feedback-icon"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackPointsTag: document.getElementById("feedback-points-tag"),
  feedbackReference: document.getElementById("feedback-reference"),
  feedbackExplanation: document.getElementById("feedback-explanation"),
  nextQuestionBtn: document.getElementById("next-question-btn"),
  // Screen D & F Results & Card
  resultsRatingBadge: document.getElementById("results-rating-badge"),
  resultsEncouragement: document.getElementById("results-encouragement"),
  cardPlayerName: document.getElementById("card-player-name"),
  cardAttemptId: document.getElementById("card-attempt-id"),
  cardFinalScore: document.getElementById("card-final-score"),
  cardRatingLabel: document.getElementById("card-rating-label"),
  cardCorrectCount: document.getElementById("card-correct-count"),
  cardAccuracy: document.getElementById("card-accuracy"),
  cardAvgTime: document.getElementById("card-avg-time"),
  cardSpeedBonus: document.getElementById("card-speed-bonus"),
  cardTimestamp: document.getElementById("card-timestamp"),
  summaryCorrect: document.getElementById("summary-correct"),
  summaryIncorrect: document.getElementById("summary-incorrect"),
  summaryUnanswered: document.getElementById("summary-unanswered"),
  summaryTotalTime: document.getElementById("summary-total-time"),
  screenshotCard: document.getElementById("screenshot-card"),
  downloadCardBtn: document.getElementById("download-card-btn"),
  reviewBtn: document.getElementById("review-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  // Screen E Review
  reviewList: document.getElementById("review-list"),
  backToResultsBtn: document.getElementById("back-to-results-btn"),
  reviewPlayAgainBtn: document.getElementById("review-play-again-btn")
};

// ==========================================
// 5. HELPER UTILITIES
// ==========================================

/**
 * Fisher-Yates array shuffle algorithm (unbiased)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates an 8-character unique alphanumeric Attempt ID
 */
function generateAttemptId() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BQC-${randomPart}`;
}

/**
 * Switch active visible screen
 */
function showScreen(screenKey) {
  Object.values(DOM.screens).forEach(screen => screen.classList.remove("active"));
  if (DOM.screens[screenKey]) {
    DOM.screens[screenKey].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Calculates score according to the Master Specification:
 * Points = 500 + round(500 * (1 - responseTime / timeLimit))
 * Clamped between 0 and 1,000 pts.
 */
function calculateQuestionPoints(isCorrect, responseTimeSeconds) {
  if (!isCorrect) return 0;
  
  const clampedTime = Math.max(0, Math.min(responseTimeSeconds, CONFIG.TIME_LIMIT_SECONDS));
  const speedBonus = Math.round(CONFIG.SPEED_BONUS_MAX * (1 - (clampedTime / CONFIG.TIME_LIMIT_SECONDS)));
  const totalPoints = CONFIG.BASE_POINTS + speedBonus;
  
  return Math.min(CONFIG.MAX_SCORE_PER_Q, Math.max(CONFIG.BASE_POINTS, totalPoints));
}

/**
 * Returns performance rating and encouraging message
 */
function getPerformanceRating(accuracyPercentage) {
  if (accuracyPercentage >= 90) {
    return {
      title: "Bible Expert",
      message: "Phenomenal! You have an outstanding mastery of Bible characters and stories!"
    };
  } else if (accuracyPercentage >= 70) {
    return {
      title: "Bible Explorer",
      message: "Wonderful job! You have a strong foundation in Bible knowledge!"
    };
  } else if (accuracyPercentage >= 50) {
    return {
      title: "Growing in Knowledge",
      message: "Good effort! Keep reading and growing in your understanding of the Scriptures!"
    };
  } else {
    return {
      title: "Keep Learning",
      message: "Every expert was once a beginner. Keep exploring the Bible and try again!"
    };
  }
}

// ==========================================
// 6. GAME FLOW CONTROLLER
// ==========================================

/**
 * Initialize a brand new game session
 */
function startQuiz(nickname) {
  gameState.playerName = nickname;
  gameState.attemptId = generateAttemptId();
  gameState.currentQuestionIndex = 0;
  gameState.cumulativeScore = 0;
  gameState.userRecords = [];
  gameState.isAnswerSubmitted = false;

  // Select questions from the question bank and shuffle options
  const shuffledBank = shuffleArray(QUESTION_BANK);
  gameState.selectedQuestions = shuffledBank.slice(0, CONFIG.TOTAL_QUESTIONS).map(q => {
    return {
      ...q,
      shuffledOptions: shuffleArray(q.options)
    };
  });

  // Setup HUD
  DOM.hudPlayerName.textContent = gameState.playerName;
  DOM.totalQNum.textContent = CONFIG.TOTAL_QUESTIONS;
  DOM.hudScore.textContent = "0";

  showScreen("quiz");
  loadQuestion(0);
}

/**
 * Loads a question onto Screen B
 */
function loadQuestion(index) {
  gameState.currentQuestionIndex = index;
  gameState.isAnswerSubmitted = false;
  clearInterval(gameState.timerInterval);

  const qData = gameState.selectedQuestions[index];

  // Update HUD
  DOM.currentQNum.textContent = index + 1;
  const progressPercent = ((index + 1) / CONFIG.TOTAL_QUESTIONS) * 100;
  DOM.progressBar.style.width = `${progressPercent}%`;

  // Update Question Content
  DOM.questionText.textContent = qData.question;

  // Reset & Populate Answer Buttons
  DOM.answerButtons.forEach((btn, idx) => {
    btn.disabled = false;
    btn.className = "answer-card btn-option";
    btn.setAttribute("data-index", idx);
    const optionTextEl = btn.querySelector(".option-text");
    if (optionTextEl) {
      optionTextEl.textContent = qData.shuffledOptions[idx];
    }
  });

  // Hide feedback panel
  DOM.feedbackPanel.classList.add("hidden");

  // Reset & Start Countdown Timer
  let timeLeft = CONFIG.TIME_LIMIT_SECONDS;
  DOM.timerDisplay.textContent = timeLeft;
  DOM.timerBox.classList.remove("timer-urgent");

  // Monotonic browser start time
  gameState.questionStartTime = performance.now();

  gameState.timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(gameState.timerInterval);
      handleTimeout();
      return;
    }

    DOM.timerDisplay.textContent = timeLeft;
    if (timeLeft <= 5) {
      DOM.timerBox.classList.add("timer-urgent");
    }
  }, 1000);
}

/**
 * Handle user option selection
 */
function handleAnswerSelection(chosenIndex) {
  if (gameState.isAnswerSubmitted) return; // Prevent duplicate clicks
  gameState.isAnswerSubmitted = true;
  clearInterval(gameState.timerInterval);

  // Exact elapsed time in seconds using monotonic clock
  const elapsedMs = performance.now() - gameState.questionStartTime;
  const elapsedSec = Math.min(CONFIG.TIME_LIMIT_SECONDS, Math.max(0.1, elapsedMs / 1000));

  const qData = gameState.selectedQuestions[gameState.currentQuestionIndex];
  const chosenAnswer = qData.shuffledOptions[chosenIndex];
  const isCorrect = (chosenAnswer === qData.correctAnswer);
  const pointsAwarded = calculateQuestionPoints(isCorrect, elapsedSec);

  gameState.cumulativeScore += pointsAwarded;
  DOM.hudScore.textContent = gameState.cumulativeScore.toLocaleString();

  // Save record
  gameState.userRecords.push({
    questionNumber: gameState.currentQuestionIndex + 1,
    questionText: qData.question,
    options: qData.shuffledOptions,
    userAnswer: chosenAnswer,
    correctAnswer: qData.correctAnswer,
    isCorrect: isCorrect,
    isTimeout: false,
    responseTimeSec: elapsedSec,
    points: pointsAwarded,
    reference: qData.reference,
    explanation: qData.explanation
  });

  // Disable all answer buttons immediately
  DOM.answerButtons.forEach(btn => btn.disabled = true);

  // Apply visual styling
  DOM.answerButtons.forEach((btn, idx) => {
    const text = qData.shuffledOptions[idx];
    if (text === qData.correctAnswer) {
      btn.classList.add("is-correct");
    } else if (idx === chosenIndex && !isCorrect) {
      btn.classList.add("is-incorrect");
    } else {
      btn.classList.add("is-dimmed");
    }
  });

  // Present Screen C Feedback
  showFeedback({
    isCorrect: isCorrect,
    isTimeout: false,
    points: pointsAwarded,
    reference: qData.reference,
    explanation: qData.explanation
  });
}

/**
 * Handle question timeout when 20s expires
 */
function handleTimeout() {
  if (gameState.isAnswerSubmitted) return;
  gameState.isAnswerSubmitted = true;

  const qData = gameState.selectedQuestions[gameState.currentQuestionIndex];
  const elapsedSec = CONFIG.TIME_LIMIT_SECONDS;

  // Record unanswered timeout
  gameState.userRecords.push({
    questionNumber: gameState.currentQuestionIndex + 1,
    questionText: qData.question,
    options: qData.shuffledOptions,
    userAnswer: "Unanswered (Time ran out)",
    correctAnswer: qData.correctAnswer,
    isCorrect: false,
    isTimeout: true,
    responseTimeSec: elapsedSec,
    points: 0,
    reference: qData.reference,
    explanation: qData.explanation
  });

  // Disable buttons and reveal correct answer
  DOM.answerButtons.forEach((btn, idx) => {
    btn.disabled = true;
    const text = qData.shuffledOptions[idx];
    if (text === qData.correctAnswer) {
      btn.classList.add("is-correct");
    } else {
      btn.classList.add("is-dimmed");
    }
  });

  // Present Screen C Feedback for Timeout
  showFeedback({
    isCorrect: false,
    isTimeout: true,
    points: 0,
    reference: qData.reference,
    explanation: qData.explanation
  });
}

/**
 * Displays Screen C Feedback panel
 */
function showFeedback({ isCorrect, isTimeout, points, reference, explanation }) {
  DOM.feedbackBanner.className = "feedback-banner";

  if (isTimeout) {
    DOM.feedbackBanner.classList.add("timeout");
    DOM.feedbackIcon.textContent = "⏱";
    DOM.feedbackTitle.textContent = "Time's Up!";
    DOM.feedbackPointsTag.textContent = "+0 Points";
  } else if (isCorrect) {
    DOM.feedbackBanner.classList.add("correct");
    DOM.feedbackIcon.textContent = "✓";
    DOM.feedbackTitle.textContent = "Correct!";
    DOM.feedbackPointsTag.textContent = `+${points.toLocaleString()} Points`;
  } else {
    DOM.feedbackBanner.classList.add("incorrect");
    DOM.feedbackIcon.textContent = "✗";
    DOM.feedbackTitle.textContent = "Incorrect";
    DOM.feedbackPointsTag.textContent = "+0 Points";
  }

  DOM.feedbackReference.textContent = reference;
  DOM.feedbackExplanation.textContent = explanation;

  DOM.feedbackPanel.classList.remove("hidden");
  DOM.nextQuestionBtn.focus();
}

/**
 * Advances to the next question or finishes the quiz
 */
function advanceToNextQuestion() {
  const nextIndex = gameState.currentQuestionIndex + 1;
  if (nextIndex < CONFIG.TOTAL_QUESTIONS) {
    loadQuestion(nextIndex);
  } else {
    completeQuiz();
  }
}

/**
 * Calculates final statistics and displays Screen D & F
 */
function completeQuiz() {
  clearInterval(gameState.timerInterval);

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalTime = 0;

  gameState.userRecords.forEach(rec => {
    totalTime += rec.responseTimeSec;
    if (rec.isCorrect) {
      correctCount++;
    } else if (rec.isTimeout) {
      unansweredCount++;
    } else {
      incorrectCount++;
    }
  });

  const accuracy = Math.round((correctCount / CONFIG.TOTAL_QUESTIONS) * 100);
  const avgResponseTime = (totalTime / CONFIG.TOTAL_QUESTIONS).toFixed(1);
  const speedBonusTotal = Math.max(0, gameState.cumulativeScore - (CONFIG.BASE_POINTS * correctCount));
  const performance = getPerformanceRating(accuracy);

  // Screen D elements
  DOM.resultsRatingBadge.textContent = performance.title;
  DOM.resultsEncouragement.textContent = performance.message;

  DOM.summaryCorrect.textContent = correctCount;
  DOM.summaryIncorrect.textContent = incorrectCount;
  DOM.summaryUnanswered.textContent = unansweredCount;
  DOM.summaryTotalTime.textContent = `${totalTime.toFixed(1)}s`;

  // Screen F Result Card elements
  const maxPossibleScore = CONFIG.TOTAL_QUESTIONS * CONFIG.MAX_SCORE_PER_Q;
  DOM.cardPlayerName.textContent = gameState.playerName;
  DOM.cardAttemptId.textContent = gameState.attemptId;
  DOM.cardFinalScore.textContent = gameState.cumulativeScore.toLocaleString();
  const cardScoreSub = document.querySelector(".card-score-box .score-sub");
  if (cardScoreSub) {
    cardScoreSub.textContent = `/ ${maxPossibleScore.toLocaleString()} pts`;
  }

  DOM.cardRatingLabel.textContent = performance.title;
  DOM.cardCorrectCount.textContent = `${correctCount}/${CONFIG.TOTAL_QUESTIONS}`;
  DOM.cardAccuracy.textContent = `${accuracy}%`;
  DOM.cardAvgTime.textContent = `${avgResponseTime}s`;
  DOM.cardSpeedBonus.textContent = `+${speedBonusTotal.toLocaleString()}`;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const timeFormatted = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  DOM.cardTimestamp.textContent = `${dateFormatted} at ${timeFormatted}`;

  showScreen("results");
}

/**
 * Builds Screen E: Answer Review
 */
function populateAnswerReview() {
  DOM.reviewList.innerHTML = "";

  gameState.userRecords.forEach(rec => {
    const card = document.createElement("div");
    let statusClass = "review-correct";
    let statusLabel = "✓ Correct";

    if (rec.isTimeout) {
      statusClass = "review-timeout";
      statusLabel = "⏱ Timed Out";
    } else if (!rec.isCorrect) {
      statusClass = "review-incorrect";
      statusLabel = "✗ Incorrect";
    }

    card.className = `review-card ${statusClass}`;
    card.innerHTML = `
      <div class="review-top-bar">
        <span class="review-q-num">Question ${rec.questionNumber} of ${CONFIG.TOTAL_QUESTIONS}</span>
        <span class="review-status-pill">${statusLabel} (+${rec.points} pts in ${rec.responseTimeSec.toFixed(1)}s)</span>
      </div>
      <div class="review-question-text">${rec.questionText}</div>
      <div class="review-answers-box">
        <div class="review-user-ans"><strong>Your Answer:</strong> ${rec.userAnswer}</div>
        <div class="review-correct-ans"><strong>Correct Answer:</strong> ${rec.correctAnswer}</div>
      </div>
      <div class="review-ref-exp">
        <strong>Scripture (${rec.reference}):</strong> ${rec.explanation}
      </div>
    `;

    DOM.reviewList.appendChild(card);
  });

  showScreen("review");
}

/**
 * Exports Result Card as high-resolution PNG using HTML5 Canvas
 * Fallback-proof, pure native browser canvas rendering!
 */
function exportCardAsImage() {
  const cardElement = DOM.screenshotCard;
  if (!cardElement) return;

  const width = 600;
  const height = 440;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Gradient Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#2e0854");
  gradient.addColorStop(1, "#150630");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Outer border & shadow effect
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header Banner
  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 24px 'Fredoka', 'Segoe UI', Arial, sans-serif";
  ctx.fillText("⚡ BIBLE QUIZ CHALLENGE", 30, 52);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "14px 'Inter', Arial, sans-serif";
  ctx.fillText("OFFICIAL RESULT CARD", width - 210, 52);

  // Thin line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 70);
  ctx.lineTo(width - 30, 70);
  ctx.stroke();

  // Player Name & Attempt
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px 'Fredoka', 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`Player: ${gameState.playerName}`, 30, 115);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "14px monospace";
  ctx.fillText(`ID: ${gameState.attemptId}`, 30, 140);

  // Big Score Box
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(30, 160, width - 60, 95);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 13px 'Inter', Arial, sans-serif";
  ctx.fillText("FINAL SCORE", 50, 188);

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 44px 'Fredoka', 'Segoe UI', Arial, sans-serif";
  ctx.fillText(`${gameState.cumulativeScore.toLocaleString()}`, 50, 235);

  const maxPossibleScore = (CONFIG.TOTAL_QUESTIONS * CONFIG.MAX_SCORE_PER_Q).toLocaleString();
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "18px 'Inter', Arial, sans-serif";
  ctx.fillText(`/ ${maxPossibleScore} pts`, 190, 230);

  // Rating Badge in Box
  const ratingText = DOM.cardRatingLabel.textContent;
  ctx.fillStyle = "#ff8c00";
  ctx.fillRect(width - 240, 185, 190, 42);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Fredoka', 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ratingText, width - 145, 212);
  ctx.textAlign = "left";

  // 4 Stats columns
  const statY = 280;
  const statBoxWidth = (width - 60 - 30) / 4;
  const stats = [
    { num: DOM.cardCorrectCount.textContent, label: "Correct" },
    { num: DOM.cardAccuracy.textContent, label: "Accuracy" },
    { num: DOM.cardAvgTime.textContent, label: "Avg Time" },
    { num: DOM.cardSpeedBonus.textContent, label: "Speed Bonus" }
  ];

  stats.forEach((s, idx) => {
    const x = 30 + idx * (statBoxWidth + 10);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x, statY, statBoxWidth, 75);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px 'Fredoka', 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.num, x + (statBoxWidth / 2), statY + 34);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px 'Inter', Arial, sans-serif";
    ctx.fillText(s.label.toUpperCase(), x + (statBoxWidth / 2), statY + 58);
  });
  ctx.textAlign = "left";

  // Footer Info
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 380);
  ctx.lineTo(width - 30, 380);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px 'Inter', Arial, sans-serif";
  ctx.fillText("Category: Bible Quiz Challenge (MVP)", 30, 405);
  ctx.fillText(DOM.cardTimestamp.textContent, width - 240, 405);

  // Trigger download
  try {
    const imageURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `BibleQuiz_${gameState.playerName}_${gameState.attemptId}.png`;
    downloadLink.href = imageURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    alert("Result card generated! If download doesn't begin automatically, please take a quick screenshot of the card.");
  }
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Screen A: Nickname Validation & Start
  DOM.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawName = DOM.nicknameInput.value;
    const trimmed = rawName.trim();

    if (!trimmed) {
      DOM.nicknameError.textContent = "Please enter a nickname to start the quiz.";
      DOM.nicknameInput.classList.add("input-error");
      DOM.nicknameInput.focus();
      return;
    }

    DOM.nicknameError.textContent = "";
    DOM.nicknameInput.classList.remove("input-error");
    startQuiz(trimmed);
  });

  DOM.nicknameInput.addEventListener("input", () => {
    if (DOM.nicknameInput.value.trim().length > 0) {
      DOM.nicknameError.textContent = "";
      DOM.nicknameInput.classList.remove("input-error");
    }
  });

  // Screen B: 4 Answer Card Buttons
  DOM.answerButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      handleAnswerSelection(idx);
    });
  });

  // Screen C: Next Question Button
  DOM.nextQuestionBtn.addEventListener("click", () => {
    advanceToNextQuestion();
  });

  // Keyboard navigation for Answer Options (Keys 1-4 or Enter/Space)
  window.addEventListener("keydown", (e) => {
    if (!DOM.screens.quiz.classList.contains("active")) return;

    if (!gameState.isAnswerSubmitted) {
      if (e.key === "1") handleAnswerSelection(0);
      else if (e.key === "2") handleAnswerSelection(1);
      else if (e.key === "3") handleAnswerSelection(2);
      else if (e.key === "4") handleAnswerSelection(3);
    } else {
      if (e.key === "Enter" && !DOM.feedbackPanel.classList.contains("hidden")) {
        advanceToNextQuestion();
      }
    }
  });

  // Screen D: Export, Review, Play Again
  DOM.downloadCardBtn.addEventListener("click", exportCardAsImage);

  DOM.reviewBtn.addEventListener("click", populateAnswerReview);

  DOM.playAgainBtn.addEventListener("click", () => {
    DOM.nicknameInput.value = gameState.playerName; // pre-fill last nickname
    showScreen("welcome");
    DOM.nicknameInput.focus();
  });

  // Screen E: Review Screen Back & Play Again
  DOM.backToResultsBtn.addEventListener("click", () => {
    showScreen("results");
  });

  DOM.reviewPlayAgainBtn.addEventListener("click", () => {
    DOM.nicknameInput.value = gameState.playerName;
    showScreen("welcome");
    DOM.nicknameInput.focus();
  });
});
