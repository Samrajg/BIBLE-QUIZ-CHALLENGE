/**
 * BIBLE QUIZ CHALLENGE - script.js
 * Pure Vanilla JavaScript (ES6+)
 * No external libraries, no frameworks, zero dependencies.
 */

// ==========================================
// 1. QUESTION BANK (35 Verified Questions)
// ==========================================
const QUESTION_BANK = [
  {
    id: 1,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who built an ark to save his family and animals from the great flood?",
    options: ["Noah", "Moses", "Abraham", "Elijah"],
    correctAnswer: "Noah",
    reference: "Genesis 6:13–22",
    explanation: "God instructed Noah to build an ark of gopher wood because Noah walked faithfully with God."
  },
  {
    id: 2,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who defeated the giant Goliath with a sling and a stone?",
    options: ["David", "Saul", "Samson", "Jonathan"],
    correctAnswer: "David",
    reference: "1 Samuel 17:48–50",
    explanation: "Young shepherd David trusted in the name of the Lord to overcome the Philistine champion Goliath."
  },
  {
    id: 3,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which prophet was swallowed by a great fish after fleeing God's command?",
    options: ["Jonah", "Jeremiah", "Hosea", "Amos"],
    correctAnswer: "Jonah",
    reference: "Jonah 1:17",
    explanation: "Jonah attempted to sail to Tarshish instead of Nineveh, and spent three days and nights in the belly of the fish."
  },
  {
    id: 4,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was chosen by God to lead the Israelites out of slavery in Egypt?",
    options: ["Moses", "Joshua", "Aaron", "Caleb"],
    correctAnswer: "Moses",
    reference: "Exodus 3:10–12",
    explanation: "God spoke to Moses from the burning bush and sent him to Pharaoh to deliver His people."
  },
  {
    id: 5,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was the mother of Jesus Christ?",
    options: ["Mary", "Elizabeth", "Martha", "Hannah"],
    correctAnswer: "Mary",
    reference: "Luke 1:26–38",
    explanation: "The angel Gabriel visited Mary of Nazareth, announcing that she would give birth to Jesus, the Son of God."
  },
  {
    id: 6,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was the first man created according to Genesis?",
    options: ["Adam", "Noah", "Seth", "Abel"],
    correctAnswer: "Adam",
    reference: "Genesis 2:7",
    explanation: "God formed Adam from the dust of the ground and breathed into his nostrils the breath of life."
  },
  {
    id: 7,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was the first woman created according to Genesis?",
    options: ["Eve", "Sarah", "Rebekah", "Leah"],
    correctAnswer: "Eve",
    reference: "Genesis 2:21–23",
    explanation: "Eve was created by God as a suitable companion and helper for Adam."
  },
  {
    id: 8,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which king asked God for wisdom rather than wealth or long life?",
    options: ["Solomon", "David", "Hezekiah", "Josiah"],
    correctAnswer: "Solomon",
    reference: "1 Kings 3:7–12",
    explanation: "King Solomon prayed for an understanding heart to judge God's people, and God granted him unmatched wisdom."
  },
  {
    id: 9,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was thrown into a den of lions for continuing to pray to God?",
    options: ["Daniel", "Shadrach", "Meshach", "Abednego"],
    correctAnswer: "Daniel",
    reference: "Daniel 6:16–23",
    explanation: "Daniel remained faithful in praying three times daily, and God sent His angel to shut the lions' mouths."
  },
  {
    id: 10,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which disciple betrayed Jesus for thirty pieces of silver?",
    options: ["Judas Iscariot", "Peter", "Thomas", "Philip"],
    correctAnswer: "Judas Iscariot",
    reference: "Matthew 26:14–16",
    explanation: "Judas Iscariot agreed to deliver Jesus to the chief priests in exchange for thirty silver coins."
  },
  {
    id: 11,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who is known as the father of faith, whom God promised descendants like the stars?",
    options: ["Abraham", "Lot", "Terah", "Nahor"],
    correctAnswer: "Abraham",
    reference: "Genesis 15:5–6",
    explanation: "Abraham believed God's covenant promise that he would be the father of many nations."
  },
  {
    id: 12,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which son of Abraham was born to Sarah in her old age?",
    options: ["Isaac", "Ishmael", "Esau", "Jacob"],
    correctAnswer: "Isaac",
    reference: "Genesis 21:1–3",
    explanation: "Sarah bore Isaac, whose name means 'laughter', fulfilling God's promise to Abraham."
  },
  {
    id: 13,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who received a coat of many colors and was sold into Egypt by his brothers?",
    options: ["Joseph", "Benjamin", "Reuben", "Judah"],
    correctAnswer: "Joseph",
    reference: "Genesis 37:3–28",
    explanation: "Joseph's brothers were jealous of his dreams and coat, but God used his journey to Egypt to preserve lives."
  },
  {
    id: 14,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who succeeded Moses and led the Israelites across the Jordan into the Promised Land?",
    options: ["Joshua", "Caleb", "Gideon", "Barak"],
    correctAnswer: "Joshua",
    reference: "Joshua 1:1–6",
    explanation: "Joshua was commanded to be strong and courageous as he led Israel into Canaan."
  },
  {
    id: 15,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which judge was blessed with superhuman physical strength tied to his Nazirite vow?",
    options: ["Samson", "Gideon", "Jephthah", "Ehud"],
    correctAnswer: "Samson",
    reference: "Judges 16:17",
    explanation: "Samson was dedicated as a Nazirite from birth, and his physical strength was an empowerment from God's Spirit."
  },
  {
    id: 16,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which young boy heard God calling his name at night while serving in the temple with Eli?",
    options: ["Samuel", "David", "Solomon", "Josiah"],
    correctAnswer: "Samuel",
    reference: "1 Samuel 3:8–10",
    explanation: "Eli told Samuel to reply, 'Speak, Lord, for your servant is listening', beginning Samuel's prophetic ministry."
  },
  {
    id: 17,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was anointed as the very first king of Israel?",
    options: ["Saul", "David", "Jeroboam", "Rehoboam"],
    correctAnswer: "Saul",
    reference: "1 Samuel 10:1",
    explanation: "The prophet Samuel anointed Saul, from the tribe of Benjamin, as Israel's first monarch."
  },
  {
    id: 18,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which prophet confronted the prophets of Baal on Mount Carmel with fire from heaven?",
    options: ["Elijah", "Elisha", "Isaiah", "Micah"],
    correctAnswer: "Elijah",
    reference: "1 Kings 18:36–39",
    explanation: "The Lord answered Elijah's prayer with fire that consumed the water-drenched sacrifice on Mount Carmel."
  },
  {
    id: 19,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which prophet asked for a double portion of Elijah's spirit and received his cloak?",
    options: ["Elisha", "Enoch", "Obadiah", "Joel"],
    correctAnswer: "Elisha",
    reference: "2 Kings 2:9–14",
    explanation: "Elisha witnessed Elijah being taken up to heaven in a whirlwind and continued the prophetic ministry."
  },
  {
    id: 20,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which Jewish queen risked her life to save her people from Haman's plot?",
    options: ["Esther", "Ruth", "Deborah", "Vashti"],
    correctAnswer: "Esther",
    reference: "Esther 4:14–16",
    explanation: "Queen Esther approached King Xerxes with bravery, saying, 'If I perish, I perish', rescuing her people."
  },
  {
    id: 21,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which devoted Moabite woman said to Naomi, 'Where you go I will go, and where you stay I will stay'?",
    options: ["Ruth", "Orpah", "Rahab", "Rachel"],
    correctAnswer: "Ruth",
    reference: "Ruth 1:16–17",
    explanation: "Ruth clung loyally to her mother-in-law Naomi and later became an ancestor of King David and Jesus."
  },
  {
    id: 22,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which fisherman disciple walked on water briefly toward Jesus before starting to sink?",
    options: ["Peter", "Andrew", "John", "James"],
    correctAnswer: "Peter",
    reference: "Matthew 14:28–31",
    explanation: "Peter stepped out of the boat onto the water, but when he saw the wind, he became afraid and Jesus rescued him."
  },
  {
    id: 23,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who baptized Jesus in the Jordan River and preached repentance in the wilderness?",
    options: ["John the Baptist", "Nicodemus", "Simon of Cyrene", "Joseph of Arimathea"],
    correctAnswer: "John the Baptist",
    reference: "Matthew 3:13–17",
    explanation: "John baptized Jesus in the Jordan, where the heavens opened and the Spirit descended like a dove."
  },
  {
    id: 24,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which apostle was formerly known as Saul and encountered Jesus on the road to Damascus?",
    options: ["Paul", "Barnabas", "Silas", "Luke"],
    correctAnswer: "Paul",
    reference: "Acts 9:1–6",
    explanation: "Saul the persecutor had a life-changing encounter with the risen Christ and became the apostle Paul."
  },
  {
    id: 25,
    category: "Characters",
    difficulty: "Beginner",
    question: "Whom did Jesus raise from the dead after he had been in the tomb for four days in Bethany?",
    options: ["Lazarus", "Jairus", "Zacchaeus", "Bartimaeus"],
    correctAnswer: "Lazarus",
    reference: "John 11:38–44",
    explanation: "Jesus called out with a loud voice, 'Lazarus, come out!' and Lazarus walked out alive."
  },
  {
    id: 26,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which sister was busy preparing hospitality while Mary sat at Jesus' feet listening to His teaching?",
    options: ["Martha", "Salome", "Joanna", "Priscilla"],
    correctAnswer: "Martha",
    reference: "Luke 10:38–42",
    explanation: "Jesus gently told Martha that Mary had chosen what is better, which would not be taken away from her."
  },
  {
    id: 27,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which short chief tax collector climbed a sycamore-fig tree to see Jesus passing by?",
    options: ["Zacchaeus", "Matthew", "Cornelius", "Theophilus"],
    correctAnswer: "Zacchaeus",
    reference: "Luke 19:1–8",
    explanation: "Jesus called Zacchaeus down and stayed at his house, leading to Zacchaeus repenting and making restitution."
  },
  {
    id: 28,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which disciple declared he would not believe Jesus had risen unless he saw the nail marks?",
    options: ["Thomas", "Philip", "Bartholomew", "Thaddaeus"],
    correctAnswer: "Thomas",
    reference: "John 20:24–29",
    explanation: "When Jesus appeared, Thomas saw His hands and side and exclaimed, 'My Lord and my God!'"
  },
  {
    id: 29,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which female judge and prophetess in Israel led a victory alongside commander Barak?",
    options: ["Deborah", "Jael", "Huldah", "Miriam"],
    correctAnswer: "Deborah",
    reference: "Judges 4:4–9",
    explanation: "Deborah held court under the Palm of Deborah and inspired Israel to defeat Sisera's army."
  },
  {
    id: 30,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which brother sold his birthright for a bowl of red lentil stew?",
    options: ["Esau", "Jacob", "Ishmael", "Labon"],
    correctAnswer: "Esau",
    reference: "Genesis 25:29–34",
    explanation: "Esau came in famished from hunting and surrendered his birthright to his twin brother Jacob."
  },
  {
    id: 31,
    category: "Characters",
    difficulty: "Beginner",
    question: "Whose wife looked back at the burning city of Sodom and became a pillar of salt?",
    options: ["Lot's wife", "Abraham's wife", "Noah's wife", "Nahor's wife"],
    correctAnswer: "Lot's wife",
    reference: "Genesis 19:26",
    explanation: "Despite the angels' warning not to look back, Lot's wife looked behind her and turned into a pillar of salt."
  },
  {
    id: 32,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which judge tested God's sign using a fleece of wool with morning dew?",
    options: ["Gideon", "Jephthah", "Othniel", "Shamgar"],
    correctAnswer: "Gideon",
    reference: "Judges 6:36–40",
    explanation: "Gideon laid a fleece on the threshing floor to confirm God would save Israel by his hand."
  },
  {
    id: 33,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was the sister of Moses and Aaron who led the women in singing praise after the Red Sea crossing?",
    options: ["Miriam", "Zipporah", "Jochebed", "Elisheba"],
    correctAnswer: "Miriam",
    reference: "Exodus 15:20–21",
    explanation: "Miriam the prophetess took a timbrel and led the women in singing triumph to the Lord."
  },
  {
    id: 34,
    category: "Characters",
    difficulty: "Beginner",
    question: "Which young Jewish man and his friends resolved not to defile themselves with the royal Babylonian food?",
    options: ["Daniel", "Nehemiah", "Ezra", "Mordecai"],
    correctAnswer: "Daniel",
    reference: "Daniel 1:8",
    explanation: "Daniel resolved in his heart not to defile himself with the king's rich food and wine."
  },
  {
    id: 35,
    category: "Characters",
    difficulty: "Beginner",
    question: "Who was the cupbearer to King Artaxerxes who rebuilt the broken walls of Jerusalem in 52 days?",
    options: ["Nehemiah", "Ezra", "Zerubbabel", "Haggai"],
    correctAnswer: "Nehemiah",
    reference: "Nehemiah 2:1–5, 6:15",
    explanation: "Nehemiah organized the people with faith and prayer, repairing the walls of Jerusalem despite opposition."
  }
];

// ==========================================
// 2. CONSTANTS & CONFIGURATION
// ==========================================
const CONFIG = {
  TOTAL_QUESTIONS: 10,
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

  // Select 10 unique random questions from the question bank
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
  DOM.cardPlayerName.textContent = gameState.playerName;
  DOM.cardAttemptId.textContent = gameState.attemptId;
  DOM.cardFinalScore.textContent = gameState.cumulativeScore.toLocaleString();
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

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "18px 'Inter', Arial, sans-serif";
  ctx.fillText("/ 10,000 pts", 190, 230);

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
  ctx.fillText("Category: Bible Characters (Beginner)", 30, 405);
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
