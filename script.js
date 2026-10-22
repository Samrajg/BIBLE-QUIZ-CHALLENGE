/**
 * BIBLE QUIZ CHALLENGE - script.js
 * Pure Vanilla JavaScript (ES6+)
 * 
 * Includes Technical Enhancements:
 * - Feature 1: Native Web Audio API Sound FX (Synthesizer chimes, buzzer, tick, victory fanfare)
 * - Feature 2: Pure HTML5 Canvas Confetti System + Streak Counters
 * - Feature 3: LocalStorage Persistence & Personal Best High-Score Tracker
 * - Feature 5: Native Web Share API (WhatsApp/Instagram/Native Card sharing)
 * - Multilingual English & Tamil Support
 */

// ==========================================
// 1. DATA DICTIONARY & QUESTION BANKS
// ==========================================
const QUIZ_DATA = {
  en: {
    quizTitle: "Bible Quiz Challenge",
    brandTitle: 'Bible Quiz <span class="highlight">Challenge</span>',
    brandBadge: "⚡ Interactive Quiz",
    brandSubtitle: "Discover Bible characters, test your knowledge, and learn something new.",
    categoryName: "Characters & Basic Facts",
    levelsName: "Easy • Medium • Hard",
    nicknameLabel: "Choose Your Player Nickname",
    nicknamePlaceholder: "e.g. JoyfulRunner or Noah7",
    nicknameError: "Please enter a nickname to start the quiz.",
    startBtn: "Start Quiz 🚀",
    instructionsTitle: "🎮 How to Play",
    instructions: [
      "<strong>15 Progressive Questions:</strong> 5 Easy, 5 Medium, and 5 Hard questions.",
      "<strong>20 Seconds Per Question:</strong> Answer fast to earn maximum speed bonus!",
      "<strong>Score Breakdown:</strong> Up to 1,000 pts per question (500 base + up to 500 speed bonus).",
      "<strong>No Sign-up Needed:</strong> Play immediately, review all answers, and download your card."
    ],
    hudQuestion: "Question",
    hudOf: "of",
    hudScore: "Score",
    feedbackCorrect: "Correct!",
    feedbackIncorrect: "Incorrect",
    feedbackTimeout: "Time's Up!",
    nextQuestionBtn: "Next Question ➜",
    scriptureRef: "Scripture Reference",
    correctAnswerIs: "The correct answer is",
    resultsTitle: "Quiz Completed!",
    resultsExpert: "Bible Expert",
    resultsExplorer: "Bible Explorer",
    resultsGrowing: "Growing in Knowledge",
    resultsLearning: "Keep Learning",
    encouragementExpert: "Phenomenal! You have an outstanding mastery of Bible characters and stories!",
    encouragementExplorer: "Wonderful job! You have a strong foundation in Bible knowledge!",
    encouragementGrowing: "Good effort! Keep reading and growing in your understanding of the Scriptures!",
    encouragementLearning: "Every expert was once a beginner. Keep exploring the Bible and try again!",
    cardTitle: "⚡ Bible Quiz Challenge",
    cardBadge: "Official Result Card",
    cardPlayer: "Player",
    cardAttempt: "Attempt ID",
    cardCorrect: "Correct Answers",
    cardAccuracy: "Accuracy",
    cardAvgTime: "Avg Response",
    cardSpeedBonus: "Speed Bonus",
    cardCategory: "Category",
    statCorrect: "Correct",
    statIncorrect: "Incorrect",
    statUnanswered: "Unanswered",
    statTotalTime: "Total Time",
    btnBackHome: "🏠 Back Home",
    btnPlayAgain: "🔄 Play Again",
    btnReview: "📝 Review Answers",
    btnDownloadCard: "📸 Download Card (PNG)",
    btnShareCard: "📲 Share Card",
    exportNote: "💡 <strong>Tip for Quiz Organizers:</strong> You can share or download your official result card to send to your quiz organizer.",
    reviewTitle: "Question & Answer Review",
    reviewSubtitle: "Review each question, your answer, and the Bible references.",
    btnBackToResults: "⬅ Back to Results",
    reviewYourAnswer: "Your Answer",
    reviewCorrectAnswer: "Correct Answer",
    reviewTimedOut: "Timed Out",
    streakLabel: "IN A ROW!",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    personalBestLabel: "⭐ Personal Best:",
    newHighScore: "🎉 NEW HIGH SCORE! 🎉",
    difficultyLevels: [
      {
        level: "Easy",
        questions: [
          {
            id: 1,
            question: "How many disciples did Jesus choose?",
            choices: ["12", "10", "7", "40"],
            correctAnswer: "12",
            reference: "Luke 6:13"
          },
          {
            id: 2,
            question: "In which town was Jesus born?",
            choices: ["Nazareth", "Bethlehem", "Jerusalem", "Capernaum"],
            correctAnswer: "Bethlehem",
            reference: "Matthew 2:1"
          },
          {
            id: 3,
            question: "Who built the ark?",
            choices: ["Moses", "Abraham", "Noah", "Jacob"],
            correctAnswer: "Noah",
            reference: "Genesis 6:13-22"
          },
          {
            id: 4,
            question: "Who was thrown into the lions' den but remained safe?",
            choices: ["Joseph", "Elijah", "Samson", "Daniel"],
            correctAnswer: "Daniel",
            reference: "Daniel 6:16-23"
          },
          {
            id: 5,
            question: "Who was swallowed by a great fish?",
            choices: ["Jonah", "Job", "John", "Joshua"],
            correctAnswer: "Jonah",
            reference: "Jonah 1:17"
          }
        ]
      },
      {
        level: "Medium",
        questions: [
          {
            id: 6,
            question: "Which disciple betrayed Jesus?",
            choices: ["Simon Peter", "Judas Iscariot", "Thomas", "Judas son of James"],
            correctAnswer: "Judas Iscariot",
            reference: "Matthew 26:14-16"
          },
          {
            id: 7,
            question: "What was Jesus' first recorded miracle?",
            choices: ["Healing a blind man", "Feeding five thousand people", "Turning water into wine", "Walking on water"],
            correctAnswer: "Turning water into wine",
            reference: "John 2:1-11"
          },
          {
            id: 8,
            question: "Which disciple denied Jesus three times?",
            choices: ["Andrew", "John", "Matthew", "Peter"],
            correctAnswer: "Peter",
            reference: "Luke 22:54-62"
          },
          {
            id: 9,
            question: "What was the name of Abraham's son born to him in his old age?",
            choices: ["Isaac", "Ishmael", "Jacob", "Esau"],
            correctAnswer: "Isaac",
            reference: "Genesis 21:1-3"
          },
          {
            id: 10,
            question: "What sign did God give as a promise after the flood?",
            choices: ["A pillar of fire", "A rainbow", "A burning bush", "A cloud of smoke"],
            correctAnswer: "A rainbow",
            reference: "Genesis 9:12-17"
          }
        ]
      },
      {
        level: "Hard",
        questions: [
          {
            id: 11,
            question: "According to Genesis, what did God create on the first day?",
            choices: ["The sun and the moon", "The land and the seas", "Light", "The stars and the planets"],
            correctAnswer: "Light",
            reference: "Genesis 1:3-5"
          },
          {
            id: 12,
            question: "How many loaves and fish were used when Jesus fed five thousand men?",
            choices: ["7 loaves and 2 fish", "5 loaves and 5 fish", "12 loaves and 2 fish", "5 loaves and 2 fish"],
            correctAnswer: "5 loaves and 2 fish",
            reference: "Matthew 14:17-21"
          },
          {
            id: 13,
            question: "How many days and nights did the rain fall during the flood?",
            choices: ["40 days and 40 nights", "7 days and 7 nights", "30 days and 30 nights", "150 days and 150 nights"],
            correctAnswer: "40 days and 40 nights",
            reference: "Genesis 7:12"
          },
          {
            id: 14,
            question: "Which sea did God part so the Israelites could cross?",
            choices: ["The Dead Sea", "The Red Sea", "The Sea of Galilee", "The Mediterranean Sea"],
            correctAnswer: "The Red Sea",
            reference: "Exodus 14:21-22"
          },
          {
            id: 15,
            question: "Who led the Israelites out of Egypt?",
            choices: ["Joshua", "Aaron", "Moses", "Abraham"],
            correctAnswer: "Moses",
            reference: "Exodus 3:10"
          }
        ]
      }
    ]
  },
  ta: {
    quizTitle: "வேதாகம வினாடி வினா",
    brandTitle: 'வேதாகம வினாடி <span class="highlight">வினா</span>',
    brandBadge: "⚡ நேரடி வினாடி வினா",
    brandSubtitle: "வேதாகம கதாபாத்திரங்களைக் கண்டறிந்து, உங்கள் அறிவைச் சோதித்து புதியவற்றைக் கற்றுக்கொள்ளுங்கள்.",
    categoryName: "வேதாகம கதாபாத்திரங்கள் & அடிப்படை அறிவு",
    levelsName: "எளிது • நடுத்தரம் • கடினம்",
    nicknameLabel: "உங்கள் புனைப்பெயரை உள்ளிடவும்",
    nicknamePlaceholder: "எ.கா: தாவீது அல்லது யோவான்7",
    nicknameError: "வினாடி வினாவைத் தொடங்க புனைப்பெயரை உள்ளிடவும்.",
    startBtn: "வினாடி வினாவைத் தொடங்கு 🚀",
    instructionsTitle: "🎮 விளையாடுவது எப்படி",
    instructions: [
      "<strong>15 படிப்படியான கேள்விகள்:</strong> 5 எளிது, 5 நடுத்தரம், 5 கடினம் கேள்விகள்.",
      "<strong>கேள்விக்கு 20 வினாடிகள்:</strong> விரைவாகப் பதிலளித்து கூடுதல் வேகப் புள்ளிகளைப் பெறுங்கள்!",
      "<strong>மதிப்பெண் கணக்கீடு:</strong> ஒரு கேள்விக்கு 1,000 புள்ளிகள் வரை (500 அடிப்படை + 500 வரை வேகப் போனஸ்).",
      "<strong>கணக்கு தேவையில்லை:</strong> உடனடியாக விளையாடி, விடைகளைச் சரிபார்த்து, உங்கள் கார்டைப் பதிவிறக்குங்கள்."
    ],
    hudQuestion: "கேள்வி",
    hudOf: "/",
    hudScore: "மதிப்பெண்",
    feedbackCorrect: "சரியான விடை!",
    feedbackIncorrect: "தவறான விடை",
    feedbackTimeout: "நேரம் முடிந்தது!",
    nextQuestionBtn: "அடுத்த கேள்வி ➜",
    scriptureRef: "வேதாகம ஆதாரம்",
    correctAnswerIs: "வேதாகமத்தின்படி சரியான விடை",
    resultsTitle: "வினாடி வினா நிறைவுற்றது!",
    resultsExpert: "வேதாகம மேதை",
    resultsExplorer: "வேதாகம ஆய்வாளர்",
    resultsGrowing: "அறிவில் வளருபவர்",
    resultsLearning: "தொடர்ந்து கற்றுக்கொள்ளுங்கள்",
    encouragementExpert: "அற்புதம்! வேதாகம வரலாற்றிலும் கதாபாத்திரங்களிலும் உங்களுக்கு சிறந்த புலமை உண்டு!",
    encouragementExplorer: "சிறந்த முயற்சி! வேதாகம அறிவில் உங்களுக்கு பலமான அடிப்படை உள்ளது!",
    encouragementGrowing: "நல்ல முயற்சி! தொடர்ந்து வேதாகமத்தை வாசித்து அறிவில் வளருங்கள்!",
    encouragementLearning: "ஒவ்வொரு வல்லுநரும் ஒரு காலத்தில் தொடக்கநிலையாளரே. மீண்டும் முயற்சி செய்யுங்கள்!",
    cardTitle: "⚡ வேதாகம வினாடி வினா",
    cardBadge: "அதிகாரப்பூர்வ முடிவு அட்டை",
    cardPlayer: "வீரர்",
    cardAttempt: "முயற்சி எண்",
    cardCorrect: "சரியான விடைகள்",
    cardAccuracy: "துல்லியம்",
    cardAvgTime: "சராசரி வேகம்",
    cardSpeedBonus: "வேக போனஸ்",
    cardCategory: "பிரிவு",
    statCorrect: "சரி",
    statIncorrect: "தவறு",
    statUnanswered: "பதிலளிக்காதவை",
    statTotalTime: "மொத்த நேரம்",
    btnBackHome: "🏠 முகப்புக்குச் செல்",
    btnPlayAgain: "🔄 மீண்டும் விளையாடு",
    btnReview: "📝 விடைகளைச் சரிபார்",
    btnDownloadCard: "📸 கார்டைப் பதிவிறக்கு (PNG)",
    btnShareCard: "📲 பகிர் (Share)",
    exportNote: "💡 <strong>ஒருங்கிணைப்பாளர்களுக்கான குறிப்பு:</strong> முடிவு அட்டையைப் பகிரலாம் அல்லது பதிவிறக்கி ஒருங்கிணைப்பாளருக்கு அனுப்பலாம்.",
    reviewTitle: "வினா & விடை மதிப்பாய்வு",
    reviewSubtitle: "ஒவ்வொரு கேள்வி, உங்கள் விடை மற்றும் வேதாகம குறிப்புகளை மதிப்பாய்வு செய்யுங்கள்.",
    btnBackToResults: "⬅ முடிவுகளுக்குத் திரும்பு",
    reviewYourAnswer: "உங்கள் விடை",
    reviewCorrectAnswer: "சரியான விடை",
    reviewTimedOut: "நேரம் கடந்துவிட்டது",
    streakLabel: "தொடர் வெற்றிகள்!",
    soundOn: "ஒலி இயக்கத்தில்",
    soundOff: "ஒலி முடக்கப்பட்டது",
    personalBestLabel: "⭐ சிறந்த சாதனை:",
    newHighScore: "🎉 புதிய அதிகபட்ச சாதனை! 🎉",
    difficultyLevels: [
      {
        level: "Easy",
        levelTamil: "எளிது",
        questions: [
          {
            id: 1,
            question: "இயேசு எத்தனை சீடர்களைத் தேர்ந்தெடுத்தார்?",
            choices: ["12", "10", "7", "40"],
            correctAnswer: "12",
            reference: "லூக்கா 6:13"
          },
          {
            id: 2,
            question: "இயேசு எந்த ஊரில் பிறந்தார்?",
            choices: ["நாசரேத்", "பெத்லகேம்", "எருசலேம்", "கப்பர்நகூம்"],
            correctAnswer: "பெத்லகேம்",
            reference: "மத்தேயு 2:1"
          },
          {
            id: 3,
            question: "பேழையைக் கட்டியவர் யார்?",
            choices: ["மோசே", "ஆபிரகாம்", "நோவா", "யாக்கோபு"],
            correctAnswer: "நோவா",
            reference: "ஆதியாகமம் 6:13-22"
          },
          {
            id: 4,
            question: "சிங்கங்களின் கெபியில் போடப்பட்டும் பாதுகாப்பாக இருந்தவர் யார்?",
            choices: ["யோசேப்பு", "எலியா", "சிம்சோன்", "தானியேல்"],
            correctAnswer: "தானியேல்",
            reference: "தானியேல் 6:16-23"
          },
          {
            id: 5,
            question: "பெரிய மீனால் விழுங்கப்பட்டவர் யார்?",
            choices: ["யோனா", "யோபு", "யோவான்", "யோசுவா"],
            correctAnswer: "யோனா",
            reference: "யோனா 1:17"
          }
        ]
      },
      {
        level: "Medium",
        levelTamil: "நடுத்தரம்",
        questions: [
          {
            id: 6,
            question: "இயேசுவைக் காட்டிக்கொடுத்த சீடர் யார்?",
            choices: ["சீமோன் பேதுரு", "யூதாஸ் காரியோத்து", "தோமா", "யாக்கோபின் மகனான யூதா"],
            correctAnswer: "யூதாஸ் காரியோத்து",
            reference: "மத்தேயு 26:14-16"
          },
          {
            id: 7,
            question: "இயேசு செய்த முதல் அற்புதம் எது?",
            choices: ["குருடனைக் குணமாக்கியது", "ஐயாயிரம் பேருக்கு உணவளித்தது", "தண்ணீரைத் திராட்சரசமாக மாற்றியது", "தண்ணீரின் மேல் நடந்தது"],
            correctAnswer: "தண்ணீரைத் திராட்சரசமாக மாற்றியது",
            reference: "யோவான் 2:1-11"
          },
          {
            id: 8,
            question: "இயேசுவை மூன்று முறை மறுதலித்த சீடர் யார்?",
            choices: ["அந்திரேயா", "யோவான்", "மத்தேயு", "பேதுரு"],
            correctAnswer: "பேதுரு",
            reference: "லூக்கா 22:54-62"
          },
          {
            id: 9,
            question: "ஆபிரகாம் முதிர்வயதில் பெற்ற மகனின் பெயர் என்ன?",
            choices: ["ஈசாக்கு", "இஸ்மவேல்", "யாக்கோபு", "ஏசா"],
            correctAnswer: "ஈசாக்கு",
            reference: "ஆதியாகமம் 21:1-3"
          },
          {
            id: 10,
            question: "பெருவெள்ளத்திற்குப் பிறகு தேவன் தமது உடன்படிக்கையின் அடையாளமாகக் கொடுத்தது எது?",
            choices: ["அக்கினித் தூண்", "வானவில்", "எரியும் முட்புதர்", "புகை மேகம்"],
            correctAnswer: "வானவில்",
            reference: "ஆதியாகமம் 9:12-17"
          }
        ]
      },
      {
        level: "Hard",
        levelTamil: "கடினம்",
        questions: [
          {
            id: 11,
            question: "ஆதியாகமத்தின்படி, தேவன் முதல் நாளில் எதைப் படைத்தார்?",
            choices: ["சூரியனையும் சந்திரனையும்", "நிலத்தையும் கடல்களையும்", "ஒளியை", "நட்சத்திரங்களையும் கோள்களையும்"],
            correctAnswer: "ஒளியை",
            reference: "ஆதியாகமம் 1:3-5"
          },
          {
            id: 12,
            question: "ஐயாயிரம் ஆண்களுக்கு உணவளித்தபோது எத்தனை அப்பங்களும் மீன்களும் பயன்படுத்தப்பட்டன?",
            choices: ["7 அப்பங்களும் 2 மீன்களும்", "5 அப்பங்களும் 5 மீன்களும்", "12 அப்பங்களும் 2 மீன்களும்", "5 அப்பங்களும் 2 மீன்களும்"],
            correctAnswer: "5 அப்பங்களும் 2 மீன்களும்",
            reference: "மத்தேயு 14:17-21"
          },
          {
            id: 13,
            question: "பெருவெள்ளத்தின்போது எத்தனை நாட்களும் இரவுகளும் மழை பெய்தது?",
            choices: ["40 நாட்களும் 40 இரவுகளும்", "7 நாட்களும் 7 இரவுகளும்", "30 நாட்களும் 30 இரவுகளும்", "150 நாட்களும் 150 இரவுகளும்"],
            correctAnswer: "40 நாட்களும் 40 இரவுகளும்",
            reference: "ஆதியாகமம் 7:12"
          },
          {
            id: 14,
            question: "இஸ்ரவேலர்கள் கடந்து செல்ல தேவன் பிளந்த கடல் எது?",
            choices: ["சவக்கடல்", "செங்கடல்", "கலிலேயா கடல்", "மத்தியதரைக் கடல்"],
            correctAnswer: "செங்கடல்",
            reference: "யாத்திராகமம் 14:21-22"
          },
          {
            id: 15,
            question: "இஸ்ரவேல் மக்களை எகிப்திலிருந்து வழிநடத்திச் சென்றவர் யார்?",
            choices: ["யோசுவா", "ஆரோன்", "மோசே", "ஆபிரகாம்"],
            correctAnswer: "மோசே",
            reference: "யாத்திராகமம் 3:10"
          }
        ]
      }
    ]
  }
};

// ==========================================
// 2. CONFIGURATION & STATE
// ==========================================
let currentLang = "en";
let isAudioMuted = false;

const CONFIG = {
  TOTAL_QUESTIONS: 15,
  TIME_LIMIT_SECONDS: 20,
  BASE_POINTS: 500,
  SPEED_BONUS_MAX: 500,
  MAX_SCORE_PER_Q: 1000,
  STORAGE_KEY_BEST: "BIBLE_QUIZ_BEST_SCORE"
};

const gameState = {
  playerName: "",
  attemptId: "",
  currentQuestionIndex: 0,
  selectedQuestions: [],
  userRecords: [],
  cumulativeScore: 0,
  questionStartTime: 0,
  timerInterval: null,
  isAnswerSubmitted: false,
  currentStreak: 0
};

// ==========================================
// 3. DOM ELEMENTS CACHE
// ==========================================
const DOM = {
  screens: {
    welcome: document.getElementById("welcome-screen"),
    quiz: document.getElementById("quiz-screen"),
    results: document.getElementById("results-screen"),
    review: document.getElementById("review-screen")
  },
  soundToggleBtn: document.getElementById("sound-toggle-btn"),
  soundIcon: document.getElementById("sound-icon"),
  soundLabel: document.getElementById("sound-label"),
  langBtnEn: document.getElementById("lang-btn-en"),
  langBtnTa: document.getElementById("lang-btn-ta"),
  // Welcome Elements
  lblBrandBadge: document.getElementById("lbl-brand-badge"),
  lblBrandTitle: document.getElementById("lbl-brand-title"),
  lblBrandSubtitle: document.getElementById("lbl-brand-subtitle"),
  lblPillCategory: document.getElementById("lbl-pill-category"),
  valPillCategory: document.getElementById("val-pill-category"),
  lblPillLevels: document.getElementById("lbl-pill-levels"),
  valPillLevels: document.getElementById("val-pill-levels"),
  lblPillQuestions: document.getElementById("lbl-pill-questions"),
  lblPillTime: document.getElementById("lbl-pill-time"),
  lblPillScore: document.getElementById("lbl-pill-score"),
  lblNickname: document.getElementById("lbl-nickname"),
  form: document.getElementById("nickname-form"),
  nicknameInput: document.getElementById("nickname-input"),
  nicknameError: document.getElementById("nickname-error"),
  startBtn: document.getElementById("start-btn"),
  welcomeBestScore: document.getElementById("welcome-best-score"),
  welcomeBestDetails: document.getElementById("welcome-best-details"),
  lblInstructionsTitle: document.getElementById("lbl-instructions-title"),
  instructionsList: document.getElementById("instructions-list"),
  // Quiz Screen Elements
  hudPlayerName: document.getElementById("hud-player-name"),
  lblQTracker: document.getElementById("lbl-q-tracker"),
  lblOfTracker: document.getElementById("lbl-of-tracker"),
  currentQNum: document.getElementById("current-q-num"),
  totalQNum: document.getElementById("total-q-num"),
  timerBox: document.getElementById("timer-box"),
  timerDisplay: document.getElementById("timer-display"),
  lblScore: document.getElementById("lbl-score"),
  hudScore: document.getElementById("hud-score"),
  progressBar: document.getElementById("progress-bar"),
  streakIndicator: document.getElementById("streak-indicator"),
  streakCount: document.getElementById("streak-count"),
  questionCategoryTag: document.querySelector(".question-category-tag"),
  questionText: document.getElementById("question-text"),
  answerButtons: [
    document.getElementById("opt-0"),
    document.getElementById("opt-1"),
    document.getElementById("opt-2"),
    document.getElementById("opt-3")
  ],
  // Feedback Panel
  feedbackPanel: document.getElementById("feedback-panel"),
  feedbackBanner: document.getElementById("feedback-banner"),
  feedbackIcon: document.getElementById("feedback-icon"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackPointsTag: document.getElementById("feedback-points-tag"),
  lblScriptureRef: document.getElementById("lbl-scripture-ref"),
  feedbackReference: document.getElementById("feedback-reference"),
  feedbackExplanation: document.getElementById("feedback-explanation"),
  nextQuestionBtn: document.getElementById("next-question-btn"),
  // Results Elements
  newHighScoreBanner: document.getElementById("new-high-score-banner"),
  resultsRatingBadge: document.getElementById("results-rating-badge"),
  lblResultsTitle: document.getElementById("lbl-results-title"),
  resultsEncouragement: document.getElementById("results-encouragement"),
  cardBrandTitle: document.getElementById("card-brand-title"),
  cardBadgeTag: document.getElementById("card-badge-tag"),
  cardPlayerName: document.getElementById("card-player-name"),
  lblAttemptId: document.getElementById("lbl-attempt-id"),
  cardAttemptId: document.getElementById("card-attempt-id"),
  cardFinalScore: document.getElementById("card-final-score"),
  cardRatingLabel: document.getElementById("card-rating-label"),
  cardCorrectCount: document.getElementById("card-correct-count"),
  cardLblCorrect: document.getElementById("card-lbl-correct"),
  cardAccuracy: document.getElementById("card-accuracy"),
  cardLblAccuracy: document.getElementById("card-lbl-accuracy"),
  cardAvgTime: document.getElementById("card-avg-time"),
  cardLblAvgTime: document.getElementById("card-lbl-avg-time"),
  cardSpeedBonus: document.getElementById("card-speed-bonus"),
  cardLblSpeedBonus: document.getElementById("card-lbl-speed-bonus"),
  cardLblCategory: document.getElementById("card-lbl-category"),
  cardValCategory: document.getElementById("card-val-category"),
  cardTimestamp: document.getElementById("card-timestamp"),
  lblStatCorrect: document.getElementById("lbl-stat-correct"),
  lblStatIncorrect: document.getElementById("lbl-stat-incorrect"),
  lblStatUnanswered: document.getElementById("lbl-stat-unanswered"),
  lblStatTotalTime: document.getElementById("lbl-stat-total-time"),
  summaryCorrect: document.getElementById("summary-correct"),
  summaryIncorrect: document.getElementById("summary-incorrect"),
  summaryUnanswered: document.getElementById("summary-unanswered"),
  summaryTotalTime: document.getElementById("summary-total-time"),
  screenshotCard: document.getElementById("screenshot-card"),
  shareCardBtn: document.getElementById("share-card-btn"),
  downloadCardBtn: document.getElementById("download-card-btn"),
  backHomeBtn: document.getElementById("back-home-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  reviewBtn: document.getElementById("review-btn"),
  lblExportNote: document.getElementById("lbl-export-note"),
  // Review Elements
  lblReviewTitle: document.getElementById("lbl-review-title"),
  lblReviewSubtitle: document.getElementById("lbl-review-subtitle"),
  backToResultsBtn: document.getElementById("back-to-results-btn"),
  reviewList: document.getElementById("review-list"),
  reviewHomeBtn: document.getElementById("review-home-btn"),
  reviewPlayAgainBtn: document.getElementById("review-play-again-btn"),
  confettiCanvas: document.getElementById("confetti-canvas")
};

// ==========================================
// 4. FEATURE 1: NATIVE WEB AUDIO API SYNTHESIZER
// ==========================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const SoundFX = {
  // Short tick for final countdown seconds
  playTick() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  },

  // Harmonious Major Chord on Correct Answer
  playCorrect() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch(e) {}
  },

  // Soft low buzzer on incorrect/timeout
  playIncorrect() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  },

  // Joyful Fanfare for high completion score
  playFanfare() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const melody = [
        { f: 523.25, t: 0.00, d: 0.12 }, // C5
        { f: 523.25, t: 0.14, d: 0.12 }, // C5
        { f: 523.25, t: 0.28, d: 0.12 }, // C5
        { f: 659.25, t: 0.42, d: 0.20 }, // E5
        { f: 783.99, t: 0.64, d: 0.45 }  // G5
      ];
      melody.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });
    } catch(e) {}
  }
};

function toggleSound() {
  isAudioMuted = !isAudioMuted;
  const dict = QUIZ_DATA[currentLang];
  if (isAudioMuted) {
    DOM.soundIcon.textContent = "🔇";
    DOM.soundLabel.textContent = dict.soundOff;
    DOM.soundToggleBtn.classList.add("muted");
  } else {
    DOM.soundIcon.textContent = "🔊";
    DOM.soundLabel.textContent = dict.soundOn;
    DOM.soundToggleBtn.classList.remove("muted");
    getAudioContext();
    SoundFX.playTick();
  }
}

// ==========================================
// 5. FEATURE 2: PURE HTML5 CANVAS CONFETTI
// ==========================================
const ConfettiCannon = {
  particles: [],
  animFrameId: null,

  start() {
    const canvas = DOM.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c"];
    this.particles = [];

    for (let i = 0; i < 110; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.8,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8
      });
    }

    cancelAnimationFrame(this.animFrameId);
    let frames = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frames++;
      if (frames < 240) {
        this.animFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  }
};

// ==========================================
// 6. FEATURE 3: LOCALSTORAGE & PERSONAL BEST
// ==========================================
function getPersonalBest() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY_BEST);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function savePersonalBest(score, playerName) {
  try {
    const currentBest = getPersonalBest();
    if (!currentBest || score > currentBest.score) {
      const data = {
        score: score,
        playerName: playerName,
        date: new Date().toLocaleDateString()
      };
      localStorage.setItem(CONFIG.STORAGE_KEY_BEST, JSON.stringify(data));
      return true; // New High Score!
    }
  } catch (e) {}
  return false;
}

function displayWelcomeBestScore() {
  const best = getPersonalBest();
  if (best && best.score > 0) {
    DOM.welcomeBestScore.classList.remove("hidden");
    DOM.welcomeBestDetails.textContent = `${best.playerName} (${best.score.toLocaleString()} pts)`;
  } else {
    DOM.welcomeBestScore.classList.add("hidden");
  }
}

// ==========================================
// 7. LANGUAGE SWITCHER LOGIC
// ==========================================
function setLanguage(lang) {
  currentLang = lang;
  const dict = QUIZ_DATA[lang];

  DOM.langBtnEn.classList.toggle("active", lang === "en");
  DOM.langBtnTa.classList.toggle("active", lang === "ta");

  DOM.lblBrandBadge.textContent = dict.brandBadge;
  DOM.lblBrandTitle.innerHTML = dict.brandTitle;
  DOM.lblBrandSubtitle.textContent = dict.brandSubtitle;
  DOM.lblPillCategory.textContent = lang === "ta" ? "பிரிவு:" : "Category:";
  DOM.valPillCategory.textContent = dict.categoryName;
  DOM.lblPillLevels.textContent = lang === "ta" ? "நிலைகள்:" : "Levels:";
  DOM.valPillLevels.textContent = dict.levelsName;
  DOM.lblPillQuestions.textContent = lang === "ta" ? "கேள்விகள்:" : "Questions:";
  DOM.lblPillTime.textContent = lang === "ta" ? "நேரம்:" : "Time:";
  DOM.lblPillScore.textContent = lang === "ta" ? "அதிகபட்ச மதிப்பெண்:" : "Max Score:";
  DOM.lblNickname.textContent = dict.nicknameLabel;
  DOM.nicknameInput.placeholder = dict.nicknamePlaceholder;
  DOM.startBtn.textContent = dict.startBtn;
  DOM.lblInstructionsTitle.textContent = dict.instructionsTitle;

  DOM.instructionsList.innerHTML = dict.instructions.map(item => `<li>${item}</li>`).join("");

  DOM.lblQTracker.textContent = dict.hudQuestion;
  DOM.lblOfTracker.textContent = dict.hudOf;
  DOM.lblScore.textContent = dict.hudScore;
  DOM.lblScriptureRef.textContent = `${dict.scriptureRef}:`;
  DOM.nextQuestionBtn.textContent = dict.nextQuestionBtn;

  DOM.lblResultsTitle.textContent = dict.resultsTitle;
  DOM.cardBrandTitle.textContent = dict.cardTitle;
  DOM.cardBadgeTag.textContent = dict.cardBadge;
  DOM.lblAttemptId.textContent = `${dict.cardAttempt}:`;
  DOM.cardLblCorrect.textContent = dict.cardCorrect;
  DOM.cardLblAccuracy.textContent = dict.cardAccuracy;
  DOM.cardLblAvgTime.textContent = dict.cardAvgTime;
  DOM.cardLblSpeedBonus.textContent = dict.cardSpeedBonus;
  DOM.cardLblCategory.textContent = `${dict.cardCategory}:`;
  DOM.cardValCategory.textContent = dict.categoryName;

  DOM.lblStatCorrect.textContent = dict.statCorrect;
  DOM.lblStatIncorrect.textContent = dict.statIncorrect;
  DOM.lblStatUnanswered.textContent = dict.statUnanswered;
  DOM.lblStatTotalTime.textContent = dict.statTotalTime;

  DOM.shareCardBtn.textContent = dict.btnShareCard;
  DOM.backHomeBtn.textContent = dict.btnBackHome;
  DOM.playAgainBtn.textContent = dict.btnPlayAgain;
  DOM.reviewBtn.textContent = dict.btnReview;
  DOM.downloadCardBtn.textContent = dict.btnDownloadCard;
  DOM.lblExportNote.innerHTML = dict.exportNote;
  DOM.soundLabel.textContent = isAudioMuted ? dict.soundOff : dict.soundOn;

  DOM.lblReviewTitle.textContent = dict.reviewTitle;
  DOM.lblReviewSubtitle.textContent = dict.reviewSubtitle;
  DOM.backToResultsBtn.textContent = dict.btnBackToResults;
  DOM.reviewHomeBtn.textContent = dict.btnBackHome;
  DOM.reviewPlayAgainBtn.textContent = dict.btnPlayAgain;

  displayWelcomeBestScore();
}

// ==========================================
// 8. HELPER UTILITIES
// ==========================================
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateAttemptId() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BQC-${randomPart}`;
}

function showScreen(screenKey) {
  Object.values(DOM.screens).forEach(screen => screen.classList.remove("active"));
  if (DOM.screens[screenKey]) {
    DOM.screens[screenKey].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function calculateQuestionPoints(isCorrect, responseTimeSeconds) {
  if (!isCorrect) return 0;
  const clampedTime = Math.max(0, Math.min(responseTimeSeconds, CONFIG.TIME_LIMIT_SECONDS));
  const speedBonus = Math.round(CONFIG.SPEED_BONUS_MAX * (1 - (clampedTime / CONFIG.TIME_LIMIT_SECONDS)));
  const totalPoints = CONFIG.BASE_POINTS + speedBonus;
  return Math.min(CONFIG.MAX_SCORE_PER_Q, Math.max(CONFIG.BASE_POINTS, totalPoints));
}

function getPerformanceRating(accuracyPercentage) {
  const dict = QUIZ_DATA[currentLang];
  if (accuracyPercentage >= 90) {
    return { title: dict.resultsExpert, message: dict.encouragementExpert };
  } else if (accuracyPercentage >= 70) {
    return { title: dict.resultsExplorer, message: dict.encouragementExplorer };
  } else if (accuracyPercentage >= 50) {
    return { title: dict.resultsGrowing, message: dict.encouragementGrowing };
  } else {
    return { title: dict.resultsLearning, message: dict.encouragementLearning };
  }
}

// ==========================================
// 9. GAME FLOW CONTROLLER
// ==========================================
function startQuiz(nickname) {
  getAudioContext();
  gameState.playerName = nickname;
  gameState.attemptId = generateAttemptId();
  gameState.currentQuestionIndex = 0;
  gameState.cumulativeScore = 0;
  gameState.userRecords = [];
  gameState.isAnswerSubmitted = false;
  gameState.currentStreak = 0;

  const dict = QUIZ_DATA[currentLang];
  const allQuestions = dict.difficultyLevels.flatMap(lvl => 
    lvl.questions.map(q => ({
      ...q,
      levelDisplay: currentLang === "ta" ? lvl.levelTamil : lvl.level,
      shuffledOptions: shuffleArray(q.choices)
    }))
  );

  gameState.selectedQuestions = allQuestions;

  DOM.hudPlayerName.textContent = gameState.playerName;
  DOM.totalQNum.textContent = CONFIG.TOTAL_QUESTIONS;
  DOM.hudScore.textContent = "0";
  DOM.streakIndicator.classList.add("hidden");

  showScreen("quiz");
  loadQuestion(0);
}

function loadQuestion(index) {
  gameState.currentQuestionIndex = index;
  gameState.isAnswerSubmitted = false;
  clearInterval(gameState.timerInterval);

  const qData = gameState.selectedQuestions[index];
  const dict = QUIZ_DATA[currentLang];

  DOM.currentQNum.textContent = index + 1;
  const progressPercent = ((index + 1) / CONFIG.TOTAL_QUESTIONS) * 100;
  DOM.progressBar.style.width = `${progressPercent}%`;

  if (DOM.questionCategoryTag) {
    DOM.questionCategoryTag.textContent = `${qData.levelDisplay} • ${dict.hudQuestion} ${index + 1}`;
  }

  DOM.questionText.textContent = qData.question;

  DOM.answerButtons.forEach((btn, idx) => {
    btn.disabled = false;
    btn.className = "answer-card btn-option";
    btn.setAttribute("data-index", idx);
    const optionTextEl = btn.querySelector(".option-text");
    if (optionTextEl) {
      optionTextEl.textContent = qData.shuffledOptions[idx];
    }
  });

  DOM.feedbackPanel.classList.add("hidden");

  let timeLeft = CONFIG.TIME_LIMIT_SECONDS;
  DOM.timerDisplay.textContent = timeLeft;
  DOM.timerBox.classList.remove("timer-urgent");

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
      SoundFX.playTick(); // Tick sound FX for urgency
    }
  }, 1000);
}

function handleAnswerSelection(chosenIndex) {
  if (gameState.isAnswerSubmitted) return;
  gameState.isAnswerSubmitted = true;
  clearInterval(gameState.timerInterval);

  const elapsedMs = performance.now() - gameState.questionStartTime;
  const elapsedSec = Math.min(CONFIG.TIME_LIMIT_SECONDS, Math.max(0.1, elapsedMs / 1000));

  const qData = gameState.selectedQuestions[gameState.currentQuestionIndex];
  const chosenAnswer = qData.shuffledOptions[chosenIndex];
  const isCorrect = (chosenAnswer === qData.correctAnswer);
  const pointsAwarded = calculateQuestionPoints(isCorrect, elapsedSec);

  if (isCorrect) {
    gameState.currentStreak++;
    SoundFX.playCorrect(); // Major chord chime
    if (gameState.currentStreak >= 2) {
      DOM.streakCount.textContent = gameState.currentStreak;
      DOM.streakIndicator.classList.remove("hidden");
    }
  } else {
    gameState.currentStreak = 0;
    DOM.streakIndicator.classList.add("hidden");
    SoundFX.playIncorrect(); // Buzzer sound
  }

  gameState.cumulativeScore += pointsAwarded;
  DOM.hudScore.textContent = gameState.cumulativeScore.toLocaleString();

  gameState.userRecords.push({
    questionNumber: gameState.currentQuestionIndex + 1,
    questionText: qData.question,
    levelDisplay: qData.levelDisplay,
    options: qData.shuffledOptions,
    userAnswer: chosenAnswer,
    correctAnswer: qData.correctAnswer,
    isCorrect: isCorrect,
    isTimeout: false,
    responseTimeSec: elapsedSec,
    points: pointsAwarded,
    reference: qData.reference
  });

  DOM.answerButtons.forEach(btn => btn.disabled = true);

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

  showFeedback({
    isCorrect: isCorrect,
    isTimeout: false,
    points: pointsAwarded,
    reference: qData.reference,
    correctAnswer: qData.correctAnswer
  });
}

function handleTimeout() {
  if (gameState.isAnswerSubmitted) return;
  gameState.isAnswerSubmitted = true;

  const qData = gameState.selectedQuestions[gameState.currentQuestionIndex];
  const elapsedSec = CONFIG.TIME_LIMIT_SECONDS;
  const dict = QUIZ_DATA[currentLang];

  gameState.currentStreak = 0;
  DOM.streakIndicator.classList.add("hidden");
  SoundFX.playIncorrect();

  gameState.userRecords.push({
    questionNumber: gameState.currentQuestionIndex + 1,
    questionText: qData.question,
    levelDisplay: qData.levelDisplay,
    options: qData.shuffledOptions,
    userAnswer: dict.reviewTimedOut,
    correctAnswer: qData.correctAnswer,
    isCorrect: false,
    isTimeout: true,
    responseTimeSec: elapsedSec,
    points: 0,
    reference: qData.reference
  });

  DOM.answerButtons.forEach((btn, idx) => {
    btn.disabled = true;
    const text = qData.shuffledOptions[idx];
    if (text === qData.correctAnswer) {
      btn.classList.add("is-correct");
    } else {
      btn.classList.add("is-dimmed");
    }
  });

  showFeedback({
    isCorrect: false,
    isTimeout: true,
    points: 0,
    reference: qData.reference,
    correctAnswer: qData.correctAnswer
  });
}

function showFeedback({ isCorrect, isTimeout, points, reference, correctAnswer }) {
  const dict = QUIZ_DATA[currentLang];
  DOM.feedbackBanner.className = "feedback-banner";

  if (isTimeout) {
    DOM.feedbackBanner.classList.add("timeout");
    DOM.feedbackIcon.textContent = "⏱";
    DOM.feedbackTitle.textContent = dict.feedbackTimeout;
    DOM.feedbackPointsTag.textContent = "+0 Points";
  } else if (isCorrect) {
    DOM.feedbackBanner.classList.add("correct");
    DOM.feedbackIcon.textContent = "✓";
    DOM.feedbackTitle.textContent = dict.feedbackCorrect;
    DOM.feedbackPointsTag.textContent = `+${points.toLocaleString()} Points`;
  } else {
    DOM.feedbackBanner.classList.add("incorrect");
    DOM.feedbackIcon.textContent = "✗";
    DOM.feedbackTitle.textContent = dict.feedbackIncorrect;
    DOM.feedbackPointsTag.textContent = "+0 Points";
  }

  DOM.feedbackReference.textContent = reference;
  DOM.feedbackExplanation.textContent = `${dict.correctAnswerIs}: "${correctAnswer}"`;

  DOM.feedbackPanel.classList.remove("hidden");
  DOM.nextQuestionBtn.focus();
}

function advanceToNextQuestion() {
  const nextIndex = gameState.currentQuestionIndex + 1;
  if (nextIndex < CONFIG.TOTAL_QUESTIONS) {
    loadQuestion(nextIndex);
  } else {
    completeQuiz();
  }
}

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

  // Check personal best (Feature 3)
  const isNewRecord = savePersonalBest(gameState.cumulativeScore, gameState.playerName);
  if (isNewRecord) {
    DOM.newHighScoreBanner.classList.remove("hidden");
  } else {
    DOM.newHighScoreBanner.classList.add("hidden");
  }

  // Trigger sound & confetti if accuracy >= 70% or new high score (Feature 1 & 2)
  if (accuracy >= 70 || isNewRecord) {
    SoundFX.playFanfare();
    ConfettiCannon.start();
  }

  DOM.resultsRatingBadge.textContent = performance.title;
  DOM.resultsEncouragement.textContent = performance.message;

  DOM.summaryCorrect.textContent = correctCount;
  DOM.summaryIncorrect.textContent = incorrectCount;
  DOM.summaryUnanswered.textContent = unansweredCount;
  DOM.summaryTotalTime.textContent = `${totalTime.toFixed(1)}s`;

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

function populateAnswerReview() {
  DOM.reviewList.innerHTML = "";
  const dict = QUIZ_DATA[currentLang];

  gameState.userRecords.forEach(rec => {
    const card = document.createElement("div");
    let statusClass = "review-correct";
    let statusLabel = `✓ ${dict.statCorrect}`;

    if (rec.isTimeout) {
      statusClass = "review-timeout";
      statusLabel = `⏱ ${dict.reviewTimedOut}`;
    } else if (!rec.isCorrect) {
      statusClass = "review-incorrect";
      statusLabel = `✗ ${dict.statIncorrect}`;
    }

    card.className = `review-card ${statusClass}`;
    card.innerHTML = `
      <div class="review-top-bar">
        <span class="review-q-num">${dict.hudQuestion} ${rec.questionNumber} ${dict.hudOf} ${CONFIG.TOTAL_QUESTIONS} • ${rec.levelDisplay}</span>
        <span class="review-status-pill">${statusLabel} (+${rec.points} pts in ${rec.responseTimeSec.toFixed(1)}s)</span>
      </div>
      <div class="review-question-text">${rec.questionText}</div>
      <div class="review-answers-box">
        <div class="review-user-ans"><strong>${dict.reviewYourAnswer}:</strong> ${rec.userAnswer}</div>
        <div class="review-correct-ans"><strong>${dict.reviewCorrectAnswer}:</strong> ${rec.correctAnswer}</div>
      </div>
      <div class="review-ref-exp">
        <strong>${dict.scriptureRef}:</strong> ${rec.reference}
      </div>
    `;
    DOM.reviewList.appendChild(card);
  });

  showScreen("review");
}

/**
 * Render canvas card for export & sharing
 */
function renderCardCanvas() {
  const dict = QUIZ_DATA[currentLang];
  const width = 600;
  const height = 440;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#2e0854");
  gradient.addColorStop(1, "#150630");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 22px 'Fredoka', 'Noto Sans Tamil', sans-serif";
  ctx.fillText(dict.cardTitle, 30, 52);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "13px 'Inter', 'Noto Sans Tamil', sans-serif";
  ctx.fillText(dict.cardBadge, width - 210, 52);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 70);
  ctx.lineTo(width - 30, 70);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px 'Fredoka', 'Noto Sans Tamil', sans-serif";
  ctx.fillText(`${dict.cardPlayer}: ${gameState.playerName}`, 30, 115);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "14px monospace";
  ctx.fillText(`${dict.cardAttempt}: ${gameState.attemptId}`, 30, 140);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(30, 160, width - 60, 95);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 13px 'Inter', 'Noto Sans Tamil', sans-serif";
  ctx.fillText(dict.hudScore.toUpperCase(), 50, 188);

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 44px 'Fredoka', sans-serif";
  ctx.fillText(`${gameState.cumulativeScore.toLocaleString()}`, 50, 235);

  const maxPossibleScore = (CONFIG.TOTAL_QUESTIONS * CONFIG.MAX_SCORE_PER_Q).toLocaleString();
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "18px 'Inter', sans-serif";
  ctx.fillText(`/ ${maxPossibleScore} pts`, 220, 230);

  const ratingText = DOM.cardRatingLabel.textContent;
  ctx.fillStyle = "#ff8c00";
  ctx.fillRect(width - 240, 185, 190, 42);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px 'Fredoka', 'Noto Sans Tamil', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ratingText, width - 145, 212);
  ctx.textAlign = "left";

  const statY = 280;
  const statBoxWidth = (width - 60 - 30) / 4;
  const stats = [
    { num: DOM.cardCorrectCount.textContent, label: dict.statCorrect },
    { num: DOM.cardAccuracy.textContent, label: dict.cardAccuracy },
    { num: DOM.cardAvgTime.textContent, label: dict.cardAvgTime },
    { num: DOM.cardSpeedBonus.textContent, label: dict.cardSpeedBonus }
  ];

  stats.forEach((s, idx) => {
    const x = 30 + idx * (statBoxWidth + 10);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x, statY, statBoxWidth, 75);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px 'Fredoka', 'Noto Sans Tamil', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.num, x + (statBoxWidth / 2), statY + 34);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px 'Inter', 'Noto Sans Tamil', sans-serif";
    ctx.fillText(s.label.toUpperCase(), x + (statBoxWidth / 2), statY + 58);
  });
  ctx.textAlign = "left";

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 380);
  ctx.lineTo(width - 30, 380);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px 'Inter', 'Noto Sans Tamil', sans-serif";
  ctx.fillText(`${dict.cardCategory}: ${dict.categoryName}`, 30, 405);
  ctx.fillText(DOM.cardTimestamp.textContent, width - 240, 405);

  return canvas;
}

function exportCardAsImage() {
  const canvas = renderCardCanvas();
  try {
    const imageURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `BibleQuiz_${gameState.playerName}_${gameState.attemptId}.png`;
    downloadLink.href = imageURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    alert("Result card generated! Please take a quick screenshot of the card.");
  }
}

// ==========================================
// 10. FEATURE 5: NATIVE WEB SHARE API
// ==========================================
async function shareResultCard() {
  const canvas = renderCardCanvas();
  const shareText = currentLang === "ta" 
    ? `நான் வேதாகம வினாடி வினாவில் ${gameState.cumulativeScore.toLocaleString()} புள்ளிகள் பெற்றேன்! என் சாதனையை முறியடிக்க முடியுமா?`
    : `I scored ${gameState.cumulativeScore.toLocaleString()} pts on the Bible Quiz Challenge! Can you beat my score?`;

  // Check if Web Share API with files is supported
  canvas.toBlob(async (blob) => {
    if (!blob) {
      exportCardAsImage();
      return;
    }

    const file = new File([blob], `BibleQuiz_${gameState.playerName}.png`, { type: "image/png" });
    const shareData = {
      title: "Bible Quiz Challenge",
      text: shareText,
      files: [file]
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          exportCardAsImage();
        }
        return;
      }
    }

    // Fallback: If image share is not supported, try text share or download
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bible Quiz Challenge",
          text: shareText,
          url: window.location.href
        });
      } catch (e) {
        exportCardAsImage();
      }
    } else {
      exportCardAsImage();
    }
  }, "image/png");
}

// ==========================================
// 11. EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  setLanguage("en");

  // Audio Toggle (Feature 1)
  DOM.soundToggleBtn.addEventListener("click", toggleSound);

  // Language switch
  DOM.langBtnEn.addEventListener("click", () => setLanguage("en"));
  DOM.langBtnTa.addEventListener("click", () => setLanguage("ta"));

  // Welcome Form
  DOM.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawName = DOM.nicknameInput.value;
    const trimmed = rawName.trim();
    const dict = QUIZ_DATA[currentLang];

    if (!trimmed) {
      DOM.nicknameError.textContent = dict.nicknameError;
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

  // Answer buttons
  DOM.answerButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      handleAnswerSelection(idx);
    });
  });

  // Next question
  DOM.nextQuestionBtn.addEventListener("click", () => {
    advanceToNextQuestion();
  });

  // Keyboard navigation
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

  // Result Actions
  DOM.shareCardBtn.addEventListener("click", shareResultCard);
  DOM.downloadCardBtn.addEventListener("click", exportCardAsImage);

  DOM.backHomeBtn.addEventListener("click", () => {
    displayWelcomeBestScore();
    showScreen("welcome");
  });

  DOM.playAgainBtn.addEventListener("click", () => {
    if (gameState.playerName) {
      startQuiz(gameState.playerName);
    } else {
      showScreen("welcome");
    }
  });

  DOM.reviewBtn.addEventListener("click", populateAnswerReview);

  // Review Actions
  DOM.backToResultsBtn.addEventListener("click", () => {
    showScreen("results");
  });

  DOM.reviewHomeBtn.addEventListener("click", () => {
    displayWelcomeBestScore();
    showScreen("welcome");
  });

  DOM.reviewPlayAgainBtn.addEventListener("click", () => {
    if (gameState.playerName) {
      startQuiz(gameState.playerName);
    } else {
      showScreen("welcome");
    }
  });
});
