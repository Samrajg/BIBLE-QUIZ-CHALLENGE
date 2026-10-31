
function updateActiveQuestionLanguage(lang = currentLang) {
  if (!gameState.selectedQuestions || gameState.selectedQuestions.length === 0) return;
  const currIdx = gameState.currentQuestionIndex;
  const qObj = gameState.selectedQuestions[currIdx];
  if (!qObj) return;

  const raw = qObj.raw || qObj.bilingual || qObj;
  const resolved = resolveBilingualQuestion(raw, lang);

  if (resolved.text) {
    qObj.question = resolved.text;
    DOM.questionText.textContent = resolved.text;
  }
  if (resolved.reference) qObj.reference = resolved.reference;
  if (resolved.correctAnswer) qObj.correctAnswer = resolved.correctAnswer;

  const dict = QUIZ_DATA[lang];
  if (DOM.questionCategoryTag) {
    const lvlName = qObj.levelDisplay || dict.levelsName;
    DOM.questionCategoryTag.textContent = `${lvlName} • ${dict.hudQuestion} ${currIdx + 1}`;
  }

  if (Array.isArray(resolved.choices) && resolved.choices.length > 0) {
    const isTF = (qObj.type === "true_false" || (Array.isArray(resolved.choices) && resolved.choices.length === 2));
    qObj.choices = isTF ? resolved.choices.slice(0, 2) : resolved.choices;
    qObj.shuffledOptions = isTF ? [...qObj.choices] : qObj.choices;
    DOM.answerButtons.forEach((btn, bIdx) => {
      if (bIdx < qObj.choices.length) {
        btn.style.display = "";
        const optSpan = btn.querySelector(".option-text");
        if (optSpan) optSpan.textContent = qObj.choices[bIdx] || "";
      } else {
        btn.style.display = "none";
      }
    });
  }
}
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
    categoryName: "Gospel of Mark (Chapters 1–3)",
    levelsName: "Chapter 1 • Chapter 2 • Chapter 3 (30 Qs)",
    nicknameLabel: "Choose Your Player Nickname",
    nicknamePlaceholder: "e.g. JoyfulRunner or Noah7",
    nicknameError: "Please enter a nickname to start the quiz.",
    startBtn: "Start Quiz 🚀",
    instructionsTitle: "🎮 How to Play",
    instructions: [
      "<strong>30 Progressive Questions:</strong> Mark Chapters 1, 2, and 3 (10 questions each: Easy, Average, Difficult).",
      "<strong>30 Seconds Per Question:</strong> Answer fast to earn maximum speed bonus!",
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
            "level": "Chapter 1 (Mark 1)",
            "questions": [
                  {
                        "id": 1,
                        "chapter": 1,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "Who appeared in the wilderness preaching a baptism of repentance?",
                        "choices": [
                              "Peter",
                              "John the Baptist",
                              "Andrew",
                              "James"
                        ],
                        "correctAnswer": "John the Baptist",
                        "correctIndex": 1,
                        "reference": "Mark 1:4",
                        "bilingual": {
                              "en": {
                                    "question": "Who appeared in the wilderness preaching a baptism of repentance?",
                                    "choices": [
                                          "Peter",
                                          "John the Baptist",
                                          "Andrew",
                                          "James"
                                    ],
                                    "correctAnswer": "John the Baptist",
                                    "reference": "Mark 1:4"
                              },
                              "ta": {
                                    "question": "மனந்திரும்புதலுக்கான ஞானஸ்நானத்தைப் பிரசங்கித்துக்கொண்டு வனாந்தரத்தில் தோன்றியவர் யார்?",
                                    "choices": [
                                          "பேதுரு",
                                          "யோவான் ஸ்நானகன்",
                                          "அந்திரேயா",
                                          "யாக்கோபு"
                                    ],
                                    "correctAnswer": "யோவான் ஸ்நானகன்",
                                    "reference": "மாற்கு 1:4"
                              }
                        }
                  },
                  {
                        "id": 2,
                        "chapter": 1,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did John the Baptist eat in the wilderness?",
                        "choices": [
                              "Bread and fish",
                              "Fruits and milk",
                              "Locusts and wild honey",
                              "Manna and quail"
                        ],
                        "correctAnswer": "Locusts and wild honey",
                        "correctIndex": 2,
                        "reference": "Mark 1:6",
                        "bilingual": {
                              "en": {
                                    "question": "What did John the Baptist eat in the wilderness?",
                                    "choices": [
                                          "Bread and fish",
                                          "Fruits and milk",
                                          "Locusts and wild honey",
                                          "Manna and quail"
                                    ],
                                    "correctAnswer": "Locusts and wild honey",
                                    "reference": "Mark 1:6"
                              },
                              "ta": {
                                    "question": "யோவான் ஸ்நானகன் வனாந்தரத்தில் எதை உணவாக உட்கொண்டார்?",
                                    "choices": [
                                          "அப்பமும் மீனும்",
                                          "பழங்களும் பாலும்",
                                          "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                                          "மன்னாவும் காடையும்"
                                    ],
                                    "correctAnswer": "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                                    "reference": "மாற்கு 1:6"
                              }
                        }
                  },
                  {
                        "id": 3,
                        "chapter": 1,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "In which river was Jesus baptized by John?",
                        "choices": [
                              "Nile River",
                              "Jordan River",
                              "Euphrates River",
                              "Tigris River"
                        ],
                        "correctAnswer": "Jordan River",
                        "correctIndex": 1,
                        "reference": "Mark 1:9",
                        "bilingual": {
                              "en": {
                                    "question": "In which river was Jesus baptized by John?",
                                    "choices": [
                                          "Nile River",
                                          "Jordan River",
                                          "Euphrates River",
                                          "Tigris River"
                                    ],
                                    "correctAnswer": "Jordan River",
                                    "reference": "Mark 1:9"
                              },
                              "ta": {
                                    "question": "இயேசு யோவானால் எந்த நதியில் ஞானஸ்நானம் பெற்றார்?",
                                    "choices": [
                                          "நைல் நதி",
                                          "யோர்தான் நதி",
                                          "ஐபிராத்து நதி",
                                          "திக்ரிஸ் நதி"
                                    ],
                                    "correctAnswer": "யோர்தான் நதி",
                                    "reference": "மாற்கு 1:9"
                              }
                        }
                  },
                  {
                        "id": 4,
                        "chapter": 1,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did the voice from heaven say when Jesus was baptized?",
                        "choices": [
                              "This is the King of Israel",
                              "You are my Son, whom I love; with you I am well pleased",
                              "You are the chosen prophet",
                              "This is the Lamb of God"
                        ],
                        "correctAnswer": "You are my Son, whom I love; with you I am well pleased",
                        "correctIndex": 1,
                        "reference": "Mark 1:11",
                        "bilingual": {
                              "en": {
                                    "question": "What did the voice from heaven say when Jesus was baptized?",
                                    "choices": [
                                          "This is the King of Israel",
                                          "You are my Son, whom I love; with you I am well pleased",
                                          "You are the chosen prophet",
                                          "This is the Lamb of God"
                                    ],
                                    "correctAnswer": "You are my Son, whom I love; with you I am well pleased",
                                    "reference": "Mark 1:11"
                              },
                              "ta": {
                                    "question": "இயேசு ஞானஸ்நானம் பெற்றபோது வானத்திலிருந்து வந்த சத்தம் என்ன கூறியது?",
                                    "choices": [
                                          "இவரே இஸ்ரவேலின் ராஜா.",
                                          "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                                          "நீர் தெரிந்துகொள்ளப்பட்ட தீர்க்கதரிசி.",
                                          "இவரே தேவ ஆட்டுக்குட்டி."
                                    ],
                                    "correctAnswer": "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                                    "reference": "மாற்கு 1:11"
                              }
                        }
                  },
                  {
                        "id": 5,
                        "chapter": 1,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "Whom did Jesus first call while they were casting their nets into the Sea of Galilee?",
                        "choices": [
                              "James and John",
                              "Philip and Thomas",
                              "Simon and Andrew",
                              "Matthew and Peter"
                        ],
                        "correctAnswer": "Simon and Andrew",
                        "correctIndex": 2,
                        "reference": "Mark 1:16–18",
                        "bilingual": {
                              "en": {
                                    "question": "Whom did Jesus first call while they were casting their nets into the Sea of Galilee?",
                                    "choices": [
                                          "James and John",
                                          "Philip and Thomas",
                                          "Simon and Andrew",
                                          "Matthew and Peter"
                                    ],
                                    "correctAnswer": "Simon and Andrew",
                                    "reference": "Mark 1:16–18"
                              },
                              "ta": {
                                    "question": "கலிலேயாக் கடலில் வலை வீசிக்கொண்டிருந்தபோது இயேசு முதலில் யாரை அழைத்தார்?",
                                    "choices": [
                                          "யாக்கோபும் யோவானும்",
                                          "பிலிப்பும் தோமாவும்",
                                          "சீமோனும் அந்திரேயாவும்",
                                          "மத்தேயுவும் பேதுருவும்"
                                    ],
                                    "correctAnswer": "சீமோனும் அந்திரேயாவும்",
                                    "reference": "மாற்கு 1:16–18"
                              }
                        }
                  },
                  {
                        "id": 6,
                        "chapter": 1,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "Where did Jesus go early in the morning to pray?",
                        "choices": [
                              "Synagogue",
                              "A solitary place",
                              "Seashore",
                              "Temple"
                        ],
                        "correctAnswer": "A solitary place",
                        "correctIndex": 1,
                        "reference": "Mark 1:35",
                        "bilingual": {
                              "en": {
                                    "question": "Where did Jesus go early in the morning to pray?",
                                    "choices": [
                                          "Synagogue",
                                          "A solitary place",
                                          "Seashore",
                                          "Temple"
                                    ],
                                    "correctAnswer": "A solitary place",
                                    "reference": "Mark 1:35"
                              },
                              "ta": {
                                    "question": "இயேசு அதிகாலையில் ஜெபம் செய்வதற்காக எங்கு சென்றார்?",
                                    "choices": [
                                          "ஜெப ஆலயம்",
                                          "தனிமையான ஓர் இடம்",
                                          "கடற்கரை",
                                          "தேவாலயம்"
                                    ],
                                    "correctAnswer": "தனிமையான ஓர் இடம்",
                                    "reference": "மாற்கு 1:35"
                              }
                        }
                  },
                  {
                        "id": 7,
                        "chapter": 1,
                        "difficulty": "Average",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "True or False: Jesus healed Simon's mother-in-law, and she began to serve them.",
                        "choices": [
                              "True",
                              "False"
                        ],
                        "correctAnswer": "True",
                        "correctIndex": 0,
                        "reference": "Mark 1:29–31",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus healed Simon's mother-in-law, and she began to serve them.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 1:29–31"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? இயேசு சீமோனின் மாமியை குணமாக்கினார்; அவள் அவர்களுக்குப் பணிவிடை செய்யத் தொடங்கினாள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 1:29–31"
                              }
                        }
                  },
                  {
                        "id": 8,
                        "chapter": 1,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus preach after John was put in prison?",
                        "choices": [
                              "The good news of God",
                              "The laws of Rome",
                              "The history of Israel",
                              "The teachings of Moses only"
                        ],
                        "correctAnswer": "The good news of God",
                        "correctIndex": 0,
                        "reference": "Mark 1:14",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus preach after John was put in prison?",
                                    "choices": [
                                          "The good news of God",
                                          "The laws of Rome",
                                          "The history of Israel",
                                          "The teachings of Moses only"
                                    ],
                                    "correctAnswer": "The good news of God",
                                    "reference": "Mark 1:14"
                              },
                              "ta": {
                                    "question": "யோவான் சிறையில் அடைக்கப்பட்ட பிறகு இயேசு எதைப் பிரசங்கித்தார்?",
                                    "choices": [
                                          "தேவனுடைய சுவிசேஷம்",
                                          "ரோமர்களின் சட்டங்கள்",
                                          "இஸ்ரவேலின் வரலாறு",
                                          "மோசேயின் போதனைகள் மட்டும்"
                                    ],
                                    "correctAnswer": "தேவனுடைய சுவிசேஷம்",
                                    "reference": "மாற்கு 1:14"
                              }
                        }
                  },
                  {
                        "id": 9,
                        "chapter": 1,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "For how many days was Jesus in the wilderness being tempted by Satan?",
                        "choices": [
                              "7 days",
                              "12 days",
                              "30 days",
                              "40 days"
                        ],
                        "correctAnswer": "40 days",
                        "correctIndex": 3,
                        "reference": "Mark 1:12–13",
                        "bilingual": {
                              "en": {
                                    "question": "For how many days was Jesus in the wilderness being tempted by Satan?",
                                    "choices": [
                                          "7 days",
                                          "12 days",
                                          "30 days",
                                          "40 days"
                                    ],
                                    "correctAnswer": "40 days",
                                    "reference": "Mark 1:12–13"
                              },
                              "ta": {
                                    "question": "சாத்தானால் சோதிக்கப்பட்டுக்கொண்டிருந்த இயேசு வனாந்தரத்தில் எத்தனை நாட்கள் இருந்தார்?",
                                    "choices": [
                                          "7 நாட்கள்",
                                          "12 நாட்கள்",
                                          "30 நாட்கள்",
                                          "40 நாட்கள்"
                                    ],
                                    "correctAnswer": "40 நாட்கள்",
                                    "reference": "மாற்கு 1:12–13"
                              }
                        }
                  },
                  {
                        "id": 10,
                        "chapter": 1,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus instruct the man healed of leprosy to do?",
                        "choices": [
                              "Return home immediately",
                              "Show himself to the priest and offer the sacrifices commanded by Moses",
                              "Tell everyone about the miracle",
                              "Follow Jesus to Galilee"
                        ],
                        "correctAnswer": "Show himself to the priest and offer the sacrifices commanded by Moses",
                        "correctIndex": 1,
                        "reference": "Mark 1:43–44",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus instruct the man healed of leprosy to do?",
                                    "choices": [
                                          "Return home immediately",
                                          "Show himself to the priest and offer the sacrifices commanded by Moses",
                                          "Tell everyone about the miracle",
                                          "Follow Jesus to Galilee"
                                    ],
                                    "correctAnswer": "Show himself to the priest and offer the sacrifices commanded by Moses",
                                    "reference": "Mark 1:43–44"
                              },
                              "ta": {
                                    "question": "தொழுநோயிலிருந்து குணமாக்கப்பட்ட மனிதனிடம் இயேசு என்ன செய்யும்படி கட்டளையிட்டார்?",
                                    "choices": [
                                          "உடனடியாக வீட்டிற்குத் திரும்பிச் செல்லும்படி.",
                                          "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                                          "அற்புதத்தைப் பற்றி அனைவரிடமும் சொல்லும்படி.",
                                          "இயேசுவைப் பின்பற்றி கலிலேயாவிற்குச் செல்லும்படி."
                                    ],
                                    "correctAnswer": "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                                    "reference": "மாற்கு 1:43–44"
                              }
                        }
                  }
            ]
      },
      {
            "level": "Chapter 2 (Mark 2)",
            "questions": [
                  {
                        "id": 11,
                        "chapter": 2,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "How many men carried the paralyzed man to Jesus?",
                        "choices": [
                              "Two",
                              "Three",
                              "Four",
                              "Five"
                        ],
                        "correctAnswer": "Four",
                        "correctIndex": 2,
                        "reference": "Mark 2:3",
                        "bilingual": {
                              "en": {
                                    "question": "How many men carried the paralyzed man to Jesus?",
                                    "choices": [
                                          "Two",
                                          "Three",
                                          "Four",
                                          "Five"
                                    ],
                                    "correctAnswer": "Four",
                                    "reference": "Mark 2:3"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனை இயேசுவிடம் தூக்கிக்கொண்டு வந்தவர்கள் எத்தனை பேர்?",
                                    "choices": [
                                          "இரண்டு பேர்",
                                          "மூன்று பேர்",
                                          "நான்கு பேர்",
                                          "ஐந்து பேர்"
                                    ],
                                    "correctAnswer": "நான்கு பேர்",
                                    "reference": "மாற்கு 2:3"
                              }
                        }
                  },
                  {
                        "id": 12,
                        "chapter": 2,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "Where did the men make an opening to lower the paralyzed man?",
                        "choices": [
                              "Wall",
                              "Roof",
                              "Door",
                              "Window"
                        ],
                        "correctAnswer": "Roof",
                        "correctIndex": 1,
                        "reference": "Mark 2:4",
                        "bilingual": {
                              "en": {
                                    "question": "Where did the men make an opening to lower the paralyzed man?",
                                    "choices": [
                                          "Wall",
                                          "Roof",
                                          "Door",
                                          "Window"
                                    ],
                                    "correctAnswer": "Roof",
                                    "reference": "Mark 2:4"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனைக் கீழே இறக்குவதற்காக அந்த மனிதர்கள் எங்கு திறப்பை உண்டாக்கினார்கள்?",
                                    "choices": [
                                          "சுவர்",
                                          "கூரை",
                                          "கதவு",
                                          "ஜன்னல்"
                                    ],
                                    "correctAnswer": "கூரை",
                                    "reference": "மாற்கு 2:4"
                              }
                        }
                  },
                  {
                        "id": 13,
                        "chapter": 2,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What was Levi doing when Jesus called him?",
                        "choices": [
                              "Fishing",
                              "Teaching",
                              "Sitting at the tax collector's booth",
                              "Praying"
                        ],
                        "correctAnswer": "Sitting at the tax collector's booth",
                        "correctIndex": 2,
                        "reference": "Mark 2:14",
                        "bilingual": {
                              "en": {
                                    "question": "What was Levi doing when Jesus called him?",
                                    "choices": [
                                          "Fishing",
                                          "Teaching",
                                          "Sitting at the tax collector's booth",
                                          "Praying"
                                    ],
                                    "correctAnswer": "Sitting at the tax collector's booth",
                                    "reference": "Mark 2:14"
                              },
                              "ta": {
                                    "question": "இயேசு லேவியை அழைத்தபோது அவன் என்ன செய்துகொண்டிருந்தான்?",
                                    "choices": [
                                          "மீன்பிடித்துக் கொண்டிருந்தான்",
                                          "போதித்துக் கொண்டிருந்தான்",
                                          "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                                          "ஜெபித்துக் கொண்டிருந்தான்"
                                    ],
                                    "correctAnswer": "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                                    "reference": "மாற்கு 2:14"
                              }
                        }
                  },
                  {
                        "id": 14,
                        "chapter": 2,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus say to the paralyzed man before healing him?",
                        "choices": [
                              "Your faith has made you well",
                              "Son, your sins are forgiven",
                              "Rise and follow me",
                              "Do not be afraid"
                        ],
                        "correctAnswer": "Son, your sins are forgiven",
                        "correctIndex": 1,
                        "reference": "Mark 2:5",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus say to the paralyzed man before healing him?",
                                    "choices": [
                                          "Your faith has made you well",
                                          "Son, your sins are forgiven",
                                          "Rise and follow me",
                                          "Do not be afraid"
                                    ],
                                    "correctAnswer": "Son, your sins are forgiven",
                                    "reference": "Mark 2:5"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனைக் குணமாக்குவதற்கு முன்பு இயேசு அவனிடம் என்ன கூறினார்?",
                                    "choices": [
                                          "உன் விசுவாசம் உன்னைச் சுகமாக்கியது.",
                                          "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                                          "எழுந்து என்னைப் பின்பற்றி வா.",
                                          "பயப்படாதே."
                                    ],
                                    "correctAnswer": "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                                    "reference": "மாற்கு 2:5"
                              }
                        }
                  },
                  {
                        "id": 15,
                        "chapter": 2,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus compare himself to when explaining why he ate with tax collectors and sinners?",
                        "choices": [
                              "Teacher",
                              "Shepherd",
                              "Doctor",
                              "King"
                        ],
                        "correctAnswer": "Doctor",
                        "correctIndex": 2,
                        "reference": "Mark 2:17",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus compare himself to when explaining why he ate with tax collectors and sinners?",
                                    "choices": [
                                          "Teacher",
                                          "Shepherd",
                                          "Doctor",
                                          "King"
                                    ],
                                    "correctAnswer": "Doctor",
                                    "reference": "Mark 2:17"
                              },
                              "ta": {
                                    "question": "ஆயக்காரர்களோடும் பாவிகளோடும் ஏன் சாப்பிடுகிறீர்கள் என்று கேட்டபோது, இயேசு தம்மை எதற்கு ஒப்பிட்டுக் கூறினார்?",
                                    "choices": [
                                          "போதகர்",
                                          "மேய்ப்பன்",
                                          "வைத்தியர்",
                                          "ராஜா"
                                    ],
                                    "correctAnswer": "வைத்தியர்",
                                    "reference": "மாற்கு 2:17"
                              }
                        }
                  },
                  {
                        "id": 16,
                        "chapter": 2,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "According to Jesus, what should new wine be poured into?",
                        "choices": [
                              "Old wineskins",
                              "New wineskins",
                              "Clay pots",
                              "Wooden containers"
                        ],
                        "correctAnswer": "New wineskins",
                        "correctIndex": 1,
                        "reference": "Mark 2:22",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, what should new wine be poured into?",
                                    "choices": [
                                          "Old wineskins",
                                          "New wineskins",
                                          "Clay pots",
                                          "Wooden containers"
                                    ],
                                    "correctAnswer": "New wineskins",
                                    "reference": "Mark 2:22"
                              },
                              "ta": {
                                    "question": "இயேசுவின் கூற்றுப்படி, புதிய திராட்சரசத்தை எதில் ஊற்ற வேண்டும்?",
                                    "choices": [
                                          "பழைய தோற்பைகள்",
                                          "புதிய தோற்பைகள்",
                                          "மண்பானைகள்",
                                          "மரப் பாத்திரங்கள்"
                                    ],
                                    "correctAnswer": "புதிய தோற்பைகள்",
                                    "reference": "மாற்கு 2:22"
                              }
                        }
                  },
                  {
                        "id": 17,
                        "chapter": 2,
                        "difficulty": "Average",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "True or False: Jesus' disciples were fasting when people questioned Jesus about fasting.",
                        "choices": [
                              "True",
                              "False"
                        ],
                        "correctAnswer": "False",
                        "correctIndex": 1,
                        "reference": "Mark 2:18–19",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus' disciples were fasting when people questioned Jesus about fasting.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "False",
                                    "reference": "Mark 2:18–19"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? உபவாசத்தைக் குறித்து மக்கள் இயேசுவிடம் கேள்வி கேட்டபோது, இயேசுவின் சீஷர்கள் உபவாசம் இருந்துகொண்டிருந்தார்கள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "பொய்",
                                    "reference": "மாற்கு 2:18–19"
                              }
                        }
                  },
                  {
                        "id": 18,
                        "chapter": 2,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "Who questioned Jesus when his disciples picked heads of grain on the Sabbath?",
                        "choices": [
                              "Romans",
                              "Pharisees",
                              "Sadducees",
                              "Samaritans"
                        ],
                        "correctAnswer": "Pharisees",
                        "correctIndex": 1,
                        "reference": "Mark 2:23–24",
                        "bilingual": {
                              "en": {
                                    "question": "Who questioned Jesus when his disciples picked heads of grain on the Sabbath?",
                                    "choices": [
                                          "Romans",
                                          "Pharisees",
                                          "Sadducees",
                                          "Samaritans"
                                    ],
                                    "correctAnswer": "Pharisees",
                                    "reference": "Mark 2:23–24"
                              },
                              "ta": {
                                    "question": "ஓய்வுநாளில் இயேசுவின் சீஷர்கள் கதிர்களைக் கொய்தபோது இயேசுவிடம் கேள்வி கேட்டவர்கள் யார்?",
                                    "choices": [
                                          "ரோமர்கள்",
                                          "பரிசேயர்கள்",
                                          "சதுசேயர்கள்",
                                          "சமாரியர்கள்"
                                    ],
                                    "correctAnswer": "பரிசேயர்கள்",
                                    "reference": "மாற்கு 2:23–24"
                              }
                        }
                  },
                  {
                        "id": 19,
                        "chapter": 2,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "According to Jesus, what did David eat when he and his companions were hungry?",
                        "choices": [
                              "Manna from heaven",
                              "Bread given by fishermen",
                              "Consecrated bread that was lawful only for priests to eat",
                              "Bread prepared by the Pharisees"
                        ],
                        "correctAnswer": "Consecrated bread that was lawful only for priests to eat",
                        "correctIndex": 2,
                        "reference": "Mark 2:25–26",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, what did David eat when he and his companions were hungry?",
                                    "choices": [
                                          "Manna from heaven",
                                          "Bread given by fishermen",
                                          "Consecrated bread that was lawful only for priests to eat",
                                          "Bread prepared by the Pharisees"
                                    ],
                                    "correctAnswer": "Consecrated bread that was lawful only for priests to eat",
                                    "reference": "Mark 2:25–26"
                              },
                              "ta": {
                                    "question": "தாவீதும் அவனோடிருந்தவர்களும் பசியாயிருந்தபோது எதைச் சாப்பிட்டார்கள் என்று இயேசு கூறினார்?",
                                    "choices": [
                                          "பரலோகத்திலிருந்து வந்த மன்னா",
                                          "மீனவர்களால் கொடுக்கப்பட்ட அப்பம்",
                                          "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                                          "பரிசேயர்களால் தயாரிக்கப்பட்ட அப்பம்"
                                    ],
                                    "correctAnswer": "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                                    "reference": "மாற்கு 2:25–26"
                              }
                        }
                  },
                  {
                        "id": 20,
                        "chapter": 2,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus say about the Son of Man and the Sabbath?",
                        "choices": [
                              "The Son of Man is a servant of the Sabbath",
                              "The Son of Man is Lord even of the Sabbath",
                              "The Son of Man must avoid the Sabbath",
                              "The Son of Man created the Pharisees"
                        ],
                        "correctAnswer": "The Son of Man is Lord even of the Sabbath",
                        "correctIndex": 1,
                        "reference": "Mark 2:28",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus say about the Son of Man and the Sabbath?",
                                    "choices": [
                                          "The Son of Man is a servant of the Sabbath",
                                          "The Son of Man is Lord even of the Sabbath",
                                          "The Son of Man must avoid the Sabbath",
                                          "The Son of Man created the Pharisees"
                                    ],
                                    "correctAnswer": "The Son of Man is Lord even of the Sabbath",
                                    "reference": "Mark 2:28"
                              },
                              "ta": {
                                    "question": "மனுஷகுமாரனையும் ஓய்வுநாளையும் குறித்து இயேசு என்ன கூறினார்?",
                                    "choices": [
                                          "மனுஷகுமாரன் ஓய்வுநாளின் ஊழியக்காரன்.",
                                          "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                                          "மனுஷகுமாரன் ஓய்வுநாளைத் தவிர்க்க வேண்டும்.",
                                          "மனுஷகுமாரன் பரிசேயர்களை உருவாக்கினார்."
                                    ],
                                    "correctAnswer": "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                                    "reference": "மாற்கு 2:28"
                              }
                        }
                  }
            ]
      },
      {
            "level": "Chapter 3 (Mark 3)",
            "questions": [
                  {
                        "id": 21,
                        "chapter": 3,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What was the problem with the man whom Jesus saw in the synagogue?",
                        "choices": [
                              "He was blind",
                              "He had a shriveled hand",
                              "He was deaf",
                              "He had leprosy"
                        ],
                        "correctAnswer": "He had a shriveled hand",
                        "correctIndex": 1,
                        "reference": "Mark 3:1",
                        "bilingual": {
                              "en": {
                                    "question": "What was the problem with the man whom Jesus saw in the synagogue?",
                                    "choices": [
                                          "He was blind",
                                          "He had a shriveled hand",
                                          "He was deaf",
                                          "He had leprosy"
                                    ],
                                    "correctAnswer": "He had a shriveled hand",
                                    "reference": "Mark 3:1"
                              },
                              "ta": {
                                    "question": "ஜெப ஆலயத்தில் இயேசு சந்தித்த மனிதனுக்கு என்ன பிரச்சினை இருந்தது?",
                                    "choices": [
                                          "அவன் குருடனாக இருந்தான்.",
                                          "அவனுக்கு சூம்பின கை இருந்தது.",
                                          "அவன் செவிடனாக இருந்தான்.",
                                          "அவனுக்குத் தொழுநோய் இருந்தது."
                                    ],
                                    "correctAnswer": "அவனுக்கு சூம்பின கை இருந்தது.",
                                    "reference": "மாற்கு 3:1"
                              }
                        }
                  },
                  {
                        "id": 22,
                        "chapter": 3,
                        "difficulty": "Easy",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "How many disciples did Jesus appoint?",
                        "choices": [
                              "Seven",
                              "Ten",
                              "Twelve",
                              "Seventy"
                        ],
                        "correctAnswer": "Twelve",
                        "correctIndex": 2,
                        "reference": "Mark 3:14",
                        "bilingual": {
                              "en": {
                                    "question": "How many disciples did Jesus appoint?",
                                    "choices": [
                                          "Seven",
                                          "Ten",
                                          "Twelve",
                                          "Seventy"
                                    ],
                                    "correctAnswer": "Twelve",
                                    "reference": "Mark 3:14"
                              },
                              "ta": {
                                    "question": "இயேசு எத்தனை சீஷர்களைத் தெரிந்துகொண்டு நியமித்தார்?",
                                    "choices": [
                                          "ஏழு பேர்",
                                          "பத்து பேர்",
                                          "பன்னிரண்டு பேர்",
                                          "எழுபது பேர்"
                                    ],
                                    "correctAnswer": "பன்னிரண்டு பேர்",
                                    "reference": "மாற்கு 3:14"
                              }
                        }
                  },
                  {
                        "id": 23,
                        "chapter": 3,
                        "difficulty": "Easy",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "True or False: Jesus gave James and John the name \"Boanerges,\" which means \"Sons of Thunder.\"",
                        "choices": [
                              "True",
                              "False"
                        ],
                        "correctAnswer": "True",
                        "correctIndex": 0,
                        "reference": "Mark 3:17",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus gave James and John the name \"Boanerges,\" which means \"Sons of Thunder.\"",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 3:17"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? யாக்கோபுக்கும் யோவானுக்கும் இயேசு \"போவனெர்கேஸ்\" என்ற பெயரைக் கொடுத்தார். அதன் அர்த்தம் \"இடிமுழக்கத்தின் மக்கள்\" என்பதாகும்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 3:17"
                              }
                        }
                  },
                  {
                        "id": 24,
                        "chapter": 3,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "With whom did the Pharisees plot to kill Jesus after he healed the man with the shriveled hand?",
                        "choices": [
                              "Sadducees",
                              "Herodians",
                              "Romans",
                              "Samaritans"
                        ],
                        "correctAnswer": "Herodians",
                        "correctIndex": 1,
                        "reference": "Mark 3:6",
                        "bilingual": {
                              "en": {
                                    "question": "With whom did the Pharisees plot to kill Jesus after he healed the man with the shriveled hand?",
                                    "choices": [
                                          "Sadducees",
                                          "Herodians",
                                          "Romans",
                                          "Samaritans"
                                    ],
                                    "correctAnswer": "Herodians",
                                    "reference": "Mark 3:6"
                              },
                              "ta": {
                                    "question": "சூம்பின கையுடைய மனிதனை இயேசு குணமாக்கிய பிறகு, அவரைக் கொலை செய்யப் பரிசேயர்கள் யாருடன் ஆலோசனை செய்தார்கள்?",
                                    "choices": [
                                          "சதுசேயர்கள்",
                                          "ஏரோதியர்கள்",
                                          "ரோமர்கள்",
                                          "சமாரியர்கள்"
                                    ],
                                    "correctAnswer": "ஏரோதியர்கள்",
                                    "reference": "மாற்கு 3:6"
                              }
                        }
                  },
                  {
                        "id": 25,
                        "chapter": 3,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did the teachers of the law accuse Jesus of?",
                        "choices": [
                              "Breaking the Sabbath",
                              "Stealing from the temple",
                              "Being possessed by Beelzebul and driving out demons by the prince of demons",
                              "Refusing to teach"
                        ],
                        "correctAnswer": "Being possessed by Beelzebul and driving out demons by the prince of demons",
                        "correctIndex": 2,
                        "reference": "Mark 3:22",
                        "bilingual": {
                              "en": {
                                    "question": "What did the teachers of the law accuse Jesus of?",
                                    "choices": [
                                          "Breaking the Sabbath",
                                          "Stealing from the temple",
                                          "Being possessed by Beelzebul and driving out demons by the prince of demons",
                                          "Refusing to teach"
                                    ],
                                    "correctAnswer": "Being possessed by Beelzebul and driving out demons by the prince of demons",
                                    "reference": "Mark 3:22"
                              },
                              "ta": {
                                    "question": "வேதபாரகர்கள் இயேசுவைக் குறித்து என்ன குற்றம் சாட்டினார்கள்?",
                                    "choices": [
                                          "ஓய்வுநாளை மீறுகிறார் என்று.",
                                          "தேவாலயத்திலிருந்து திருடுகிறார் என்று.",
                                          "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                                          "போதிக்க மறுக்கிறார் என்று."
                                    ],
                                    "correctAnswer": "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                                    "reference": "மாற்கு 3:22"
                              }
                        }
                  },
                  {
                        "id": 26,
                        "chapter": 3,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What name did Jesus give to Simon?",
                        "choices": [
                              "Andrew",
                              "Peter",
                              "James",
                              "Thaddaeus"
                        ],
                        "correctAnswer": "Peter",
                        "correctIndex": 1,
                        "reference": "Mark 3:16",
                        "bilingual": {
                              "en": {
                                    "question": "What name did Jesus give to Simon?",
                                    "choices": [
                                          "Andrew",
                                          "Peter",
                                          "James",
                                          "Thaddaeus"
                                    ],
                                    "correctAnswer": "Peter",
                                    "reference": "Mark 3:16"
                              },
                              "ta": {
                                    "question": "சீமோனுக்கு இயேசு கொடுத்த பெயர் என்ன?",
                                    "choices": [
                                          "அந்திரேயா",
                                          "பேதுரு",
                                          "யாக்கோபு",
                                          "ததேயு"
                                    ],
                                    "correctAnswer": "பேதுரு",
                                    "reference": "மாற்கு 3:16"
                              }
                        }
                  },
                  {
                        "id": 27,
                        "chapter": 3,
                        "difficulty": "Average",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "True or False: Jesus' family said that he was out of his mind.",
                        "choices": [
                              "True",
                              "False"
                        ],
                        "correctAnswer": "True",
                        "correctIndex": 0,
                        "reference": "Mark 3:20–21",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus' family said that he was out of his mind.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 3:20–21"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? இயேசுவின் குடும்பத்தினர் அவர் மதிமயங்கியிருக்கிறார் என்று கூறினார்கள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 3:20–21"
                              }
                        }
                  },
                  {
                        "id": 28,
                        "chapter": 3,
                        "difficulty": "Average",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What did Jesus ask his disciples to have ready because of the large crowd?",
                        "choices": [
                              "A horse",
                              "A small boat",
                              "A house",
                              "A tent"
                        ],
                        "correctAnswer": "A small boat",
                        "correctIndex": 1,
                        "reference": "Mark 3:9",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus ask his disciples to have ready because of the large crowd?",
                                    "choices": [
                                          "A horse",
                                          "A small boat",
                                          "A house",
                                          "A tent"
                                    ],
                                    "correctAnswer": "A small boat",
                                    "reference": "Mark 3:9"
                              },
                              "ta": {
                                    "question": "பெரிய கூட்டம் கூடியிருந்ததால் இயேசு தமது சீஷர்களிடம் எதைத் தயாராக வைத்திருக்கும்படி கூறினார்?",
                                    "choices": [
                                          "குதிரை",
                                          "ஒரு சிறிய படகு",
                                          "ஒரு வீடு",
                                          "ஒரு கூடாரம்"
                                    ],
                                    "correctAnswer": "ஒரு சிறிய படகு",
                                    "reference": "மாற்கு 3:9"
                              }
                        }
                  },
                  {
                        "id": 29,
                        "chapter": 3,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "What does the name \"Boanerges\" mean?",
                        "choices": [
                              "Sons of God",
                              "Sons of Thunder",
                              "Sons of Light",
                              "Sons of Peace"
                        ],
                        "correctAnswer": "Sons of Thunder",
                        "correctIndex": 1,
                        "reference": "Mark 3:17",
                        "bilingual": {
                              "en": {
                                    "question": "What does the name \"Boanerges\" mean?",
                                    "choices": [
                                          "Sons of God",
                                          "Sons of Thunder",
                                          "Sons of Light",
                                          "Sons of Peace"
                                    ],
                                    "correctAnswer": "Sons of Thunder",
                                    "reference": "Mark 3:17"
                              },
                              "ta": {
                                    "question": "\"போவனெர்கேஸ்\" என்ற பெயரின் அர்த்தம் என்ன?",
                                    "choices": [
                                          "தேவனுடைய புத்திரர்கள்",
                                          "இடிமுழக்கத்தின் மக்கள்",
                                          "ஒளியின் மக்கள்",
                                          "சமாதானத்தின் மக்கள்"
                                    ],
                                    "correctAnswer": "இடிமுழக்கத்தின் மக்கள்",
                                    "reference": "மாற்கு 3:17"
                              }
                        }
                  },
                  {
                        "id": 30,
                        "chapter": 3,
                        "difficulty": "Difficult",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "According to Jesus, who are his brother, sister and mother?",
                        "choices": [
                              "Only his biological family",
                              "Everyone who follows him physically",
                              "Whoever does God's will",
                              "Only the twelve disciples"
                        ],
                        "correctAnswer": "Whoever does God's will",
                        "correctIndex": 2,
                        "reference": "Mark 3:33–35",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, who are his brother, sister and mother?",
                                    "choices": [
                                          "Only his biological family",
                                          "Everyone who follows him physically",
                                          "Whoever does God's will",
                                          "Only the twelve disciples"
                                    ],
                                    "correctAnswer": "Whoever does God's will",
                                    "reference": "Mark 3:33–35"
                              },
                              "ta": {
                                    "question": "இயேசுவின் கூற்றுப்படி, அவருடைய சகோதரனும் சகோதரியும் தாயும் யார்?",
                                    "choices": [
                                          "அவருடைய சொந்த குடும்பத்தினர் மட்டுமே.",
                                          "அவரைப் பின்தொடர்ந்து வருகிற அனைவரும்.",
                                          "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                                          "பன்னிரண்டு சீஷர்கள் மட்டுமே."
                                    ],
                                    "correctAnswer": "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                                    "reference": "மாற்கு 3:33–35"
                              }
                        }
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
    categoryName: "மாற்கு சுவிசேஷம் (அதிகாரங்கள் 1–3)",
    levelsName: "அதிகாரம் 1 • அதிகாரம் 2 • அதிகாரம் 3 (30 வினாக்கள்)",
    nicknameLabel: "உங்கள் புனைப்பெயரை உள்ளிடவும்",
    nicknamePlaceholder: "எ.கா: தாவீது அல்லது யோவான்7",
    nicknameError: "வினாடி வினாவைத் தொடங்க புனைப்பெயரை உள்ளிடவும்.",
    startBtn: "வினாடி வினாவைத் தொடங்கு 🚀",
    instructionsTitle: "🎮 விளையாடுவது எப்படி",
    instructions: [
      "<strong>30 படிப்படியான கேள்விகள்:</strong> மாற்கு சுவிசேஷம் அதிகாரம் 1, 2, 3 (ஒவ்வொன்றிலும் 10 கேள்விகள்: எளிது, நடுத்தரம், கடினம்).",
      "<strong>கேள்விக்கு 30 வினாடிகள்:</strong> விரைவாகப் பதிலளித்து கூடுதல் வேகப் புள்ளிகளைப் பெறுங்கள்!",
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
            "level": "அதிகாரம் 1 (மாற்கு 1)",
            "levelTamil": "அதிகாரம் 1",
            "questions": [
                  {
                        "id": 1,
                        "chapter": 1,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "மனந்திரும்புதலுக்கான ஞானஸ்நானத்தைப் பிரசங்கித்துக்கொண்டு வனாந்தரத்தில் தோன்றியவர் யார்?",
                        "choices": [
                              "பேதுரு",
                              "யோவான் ஸ்நானகன்",
                              "அந்திரேயா",
                              "யாக்கோபு"
                        ],
                        "correctAnswer": "யோவான் ஸ்நானகன்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 1:4",
                        "bilingual": {
                              "en": {
                                    "question": "Who appeared in the wilderness preaching a baptism of repentance?",
                                    "choices": [
                                          "Peter",
                                          "John the Baptist",
                                          "Andrew",
                                          "James"
                                    ],
                                    "correctAnswer": "John the Baptist",
                                    "reference": "Mark 1:4"
                              },
                              "ta": {
                                    "question": "மனந்திரும்புதலுக்கான ஞானஸ்நானத்தைப் பிரசங்கித்துக்கொண்டு வனாந்தரத்தில் தோன்றியவர் யார்?",
                                    "choices": [
                                          "பேதுரு",
                                          "யோவான் ஸ்நானகன்",
                                          "அந்திரேயா",
                                          "யாக்கோபு"
                                    ],
                                    "correctAnswer": "யோவான் ஸ்நானகன்",
                                    "reference": "மாற்கு 1:4"
                              }
                        }
                  },
                  {
                        "id": 2,
                        "chapter": 1,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "யோவான் ஸ்நானகன் வனாந்தரத்தில் எதை உணவாக உட்கொண்டார்?",
                        "choices": [
                              "அப்பமும் மீனும்",
                              "பழங்களும் பாலும்",
                              "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                              "மன்னாவும் காடையும்"
                        ],
                        "correctAnswer": "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 1:6",
                        "bilingual": {
                              "en": {
                                    "question": "What did John the Baptist eat in the wilderness?",
                                    "choices": [
                                          "Bread and fish",
                                          "Fruits and milk",
                                          "Locusts and wild honey",
                                          "Manna and quail"
                                    ],
                                    "correctAnswer": "Locusts and wild honey",
                                    "reference": "Mark 1:6"
                              },
                              "ta": {
                                    "question": "யோவான் ஸ்நானகன் வனாந்தரத்தில் எதை உணவாக உட்கொண்டார்?",
                                    "choices": [
                                          "அப்பமும் மீனும்",
                                          "பழங்களும் பாலும்",
                                          "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                                          "மன்னாவும் காடையும்"
                                    ],
                                    "correctAnswer": "வெட்டுக்கிளிகளும் காட்டுத்தேனும்",
                                    "reference": "மாற்கு 1:6"
                              }
                        }
                  },
                  {
                        "id": 3,
                        "chapter": 1,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசு யோவானால் எந்த நதியில் ஞானஸ்நானம் பெற்றார்?",
                        "choices": [
                              "நைல் நதி",
                              "யோர்தான் நதி",
                              "ஐபிராத்து நதி",
                              "திக்ரிஸ் நதி"
                        ],
                        "correctAnswer": "யோர்தான் நதி",
                        "correctIndex": 1,
                        "reference": "மாற்கு 1:9",
                        "bilingual": {
                              "en": {
                                    "question": "In which river was Jesus baptized by John?",
                                    "choices": [
                                          "Nile River",
                                          "Jordan River",
                                          "Euphrates River",
                                          "Tigris River"
                                    ],
                                    "correctAnswer": "Jordan River",
                                    "reference": "Mark 1:9"
                              },
                              "ta": {
                                    "question": "இயேசு யோவானால் எந்த நதியில் ஞானஸ்நானம் பெற்றார்?",
                                    "choices": [
                                          "நைல் நதி",
                                          "யோர்தான் நதி",
                                          "ஐபிராத்து நதி",
                                          "திக்ரிஸ் நதி"
                                    ],
                                    "correctAnswer": "யோர்தான் நதி",
                                    "reference": "மாற்கு 1:9"
                              }
                        }
                  },
                  {
                        "id": 4,
                        "chapter": 1,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசு ஞானஸ்நானம் பெற்றபோது வானத்திலிருந்து வந்த சத்தம் என்ன கூறியது?",
                        "choices": [
                              "இவரே இஸ்ரவேலின் ராஜா.",
                              "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                              "நீர் தெரிந்துகொள்ளப்பட்ட தீர்க்கதரிசி.",
                              "இவரே தேவ ஆட்டுக்குட்டி."
                        ],
                        "correctAnswer": "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                        "correctIndex": 1,
                        "reference": "மாற்கு 1:11",
                        "bilingual": {
                              "en": {
                                    "question": "What did the voice from heaven say when Jesus was baptized?",
                                    "choices": [
                                          "This is the King of Israel",
                                          "You are my Son, whom I love; with you I am well pleased",
                                          "You are the chosen prophet",
                                          "This is the Lamb of God"
                                    ],
                                    "correctAnswer": "You are my Son, whom I love; with you I am well pleased",
                                    "reference": "Mark 1:11"
                              },
                              "ta": {
                                    "question": "இயேசு ஞானஸ்நானம் பெற்றபோது வானத்திலிருந்து வந்த சத்தம் என்ன கூறியது?",
                                    "choices": [
                                          "இவரே இஸ்ரவேலின் ராஜா.",
                                          "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                                          "நீர் தெரிந்துகொள்ளப்பட்ட தீர்க்கதரிசி.",
                                          "இவரே தேவ ஆட்டுக்குட்டி."
                                    ],
                                    "correctAnswer": "நீர் என்னுடைய நேசகுமாரன், உம்மில் பிரியமாயிருக்கிறேன்.",
                                    "reference": "மாற்கு 1:11"
                              }
                        }
                  },
                  {
                        "id": 5,
                        "chapter": 1,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "கலிலேயாக் கடலில் வலை வீசிக்கொண்டிருந்தபோது இயேசு முதலில் யாரை அழைத்தார்?",
                        "choices": [
                              "யாக்கோபும் யோவானும்",
                              "பிலிப்பும் தோமாவும்",
                              "சீமோனும் அந்திரேயாவும்",
                              "மத்தேயுவும் பேதுருவும்"
                        ],
                        "correctAnswer": "சீமோனும் அந்திரேயாவும்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 1:16–18",
                        "bilingual": {
                              "en": {
                                    "question": "Whom did Jesus first call while they were casting their nets into the Sea of Galilee?",
                                    "choices": [
                                          "James and John",
                                          "Philip and Thomas",
                                          "Simon and Andrew",
                                          "Matthew and Peter"
                                    ],
                                    "correctAnswer": "Simon and Andrew",
                                    "reference": "Mark 1:16–18"
                              },
                              "ta": {
                                    "question": "கலிலேயாக் கடலில் வலை வீசிக்கொண்டிருந்தபோது இயேசு முதலில் யாரை அழைத்தார்?",
                                    "choices": [
                                          "யாக்கோபும் யோவானும்",
                                          "பிலிப்பும் தோமாவும்",
                                          "சீமோனும் அந்திரேயாவும்",
                                          "மத்தேயுவும் பேதுருவும்"
                                    ],
                                    "correctAnswer": "சீமோனும் அந்திரேயாவும்",
                                    "reference": "மாற்கு 1:16–18"
                              }
                        }
                  },
                  {
                        "id": 6,
                        "chapter": 1,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசு அதிகாலையில் ஜெபம் செய்வதற்காக எங்கு சென்றார்?",
                        "choices": [
                              "ஜெப ஆலயம்",
                              "தனிமையான ஓர் இடம்",
                              "கடற்கரை",
                              "தேவாலயம்"
                        ],
                        "correctAnswer": "தனிமையான ஓர் இடம்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 1:35",
                        "bilingual": {
                              "en": {
                                    "question": "Where did Jesus go early in the morning to pray?",
                                    "choices": [
                                          "Synagogue",
                                          "A solitary place",
                                          "Seashore",
                                          "Temple"
                                    ],
                                    "correctAnswer": "A solitary place",
                                    "reference": "Mark 1:35"
                              },
                              "ta": {
                                    "question": "இயேசு அதிகாலையில் ஜெபம் செய்வதற்காக எங்கு சென்றார்?",
                                    "choices": [
                                          "ஜெப ஆலயம்",
                                          "தனிமையான ஓர் இடம்",
                                          "கடற்கரை",
                                          "தேவாலயம்"
                                    ],
                                    "correctAnswer": "தனிமையான ஓர் இடம்",
                                    "reference": "மாற்கு 1:35"
                              }
                        }
                  },
                  {
                        "id": 7,
                        "chapter": 1,
                        "difficulty": "நடுத்தரம்",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "உண்மையா அல்லது பொய்யா? இயேசு சீமோனின் மாமியை குணமாக்கினார்; அவள் அவர்களுக்குப் பணிவிடை செய்யத் தொடங்கினாள்.",
                        "choices": [
                              "உண்மை",
                              "பொய்"
                        ],
                        "correctAnswer": "உண்மை",
                        "correctIndex": 0,
                        "reference": "மாற்கு 1:29–31",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus healed Simon's mother-in-law, and she began to serve them.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 1:29–31"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? இயேசு சீமோனின் மாமியை குணமாக்கினார்; அவள் அவர்களுக்குப் பணிவிடை செய்யத் தொடங்கினாள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 1:29–31"
                              }
                        }
                  },
                  {
                        "id": 8,
                        "chapter": 1,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "யோவான் சிறையில் அடைக்கப்பட்ட பிறகு இயேசு எதைப் பிரசங்கித்தார்?",
                        "choices": [
                              "தேவனுடைய சுவிசேஷம்",
                              "ரோமர்களின் சட்டங்கள்",
                              "இஸ்ரவேலின் வரலாறு",
                              "மோசேயின் போதனைகள் மட்டும்"
                        ],
                        "correctAnswer": "தேவனுடைய சுவிசேஷம்",
                        "correctIndex": 0,
                        "reference": "மாற்கு 1:14",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus preach after John was put in prison?",
                                    "choices": [
                                          "The good news of God",
                                          "The laws of Rome",
                                          "The history of Israel",
                                          "The teachings of Moses only"
                                    ],
                                    "correctAnswer": "The good news of God",
                                    "reference": "Mark 1:14"
                              },
                              "ta": {
                                    "question": "யோவான் சிறையில் அடைக்கப்பட்ட பிறகு இயேசு எதைப் பிரசங்கித்தார்?",
                                    "choices": [
                                          "தேவனுடைய சுவிசேஷம்",
                                          "ரோமர்களின் சட்டங்கள்",
                                          "இஸ்ரவேலின் வரலாறு",
                                          "மோசேயின் போதனைகள் மட்டும்"
                                    ],
                                    "correctAnswer": "தேவனுடைய சுவிசேஷம்",
                                    "reference": "மாற்கு 1:14"
                              }
                        }
                  },
                  {
                        "id": 9,
                        "chapter": 1,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "சாத்தானால் சோதிக்கப்பட்டுக்கொண்டிருந்த இயேசு வனாந்தரத்தில் எத்தனை நாட்கள் இருந்தார்?",
                        "choices": [
                              "7 நாட்கள்",
                              "12 நாட்கள்",
                              "30 நாட்கள்",
                              "40 நாட்கள்"
                        ],
                        "correctAnswer": "40 நாட்கள்",
                        "correctIndex": 3,
                        "reference": "மாற்கு 1:12–13",
                        "bilingual": {
                              "en": {
                                    "question": "For how many days was Jesus in the wilderness being tempted by Satan?",
                                    "choices": [
                                          "7 days",
                                          "12 days",
                                          "30 days",
                                          "40 days"
                                    ],
                                    "correctAnswer": "40 days",
                                    "reference": "Mark 1:12–13"
                              },
                              "ta": {
                                    "question": "சாத்தானால் சோதிக்கப்பட்டுக்கொண்டிருந்த இயேசு வனாந்தரத்தில் எத்தனை நாட்கள் இருந்தார்?",
                                    "choices": [
                                          "7 நாட்கள்",
                                          "12 நாட்கள்",
                                          "30 நாட்கள்",
                                          "40 நாட்கள்"
                                    ],
                                    "correctAnswer": "40 நாட்கள்",
                                    "reference": "மாற்கு 1:12–13"
                              }
                        }
                  },
                  {
                        "id": 10,
                        "chapter": 1,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "தொழுநோயிலிருந்து குணமாக்கப்பட்ட மனிதனிடம் இயேசு என்ன செய்யும்படி கட்டளையிட்டார்?",
                        "choices": [
                              "உடனடியாக வீட்டிற்குத் திரும்பிச் செல்லும்படி.",
                              "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                              "அற்புதத்தைப் பற்றி அனைவரிடமும் சொல்லும்படி.",
                              "இயேசுவைப் பின்பற்றி கலிலேயாவிற்குச் செல்லும்படி."
                        ],
                        "correctAnswer": "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                        "correctIndex": 1,
                        "reference": "மாற்கு 1:43–44",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus instruct the man healed of leprosy to do?",
                                    "choices": [
                                          "Return home immediately",
                                          "Show himself to the priest and offer the sacrifices commanded by Moses",
                                          "Tell everyone about the miracle",
                                          "Follow Jesus to Galilee"
                                    ],
                                    "correctAnswer": "Show himself to the priest and offer the sacrifices commanded by Moses",
                                    "reference": "Mark 1:43–44"
                              },
                              "ta": {
                                    "question": "தொழுநோயிலிருந்து குணமாக்கப்பட்ட மனிதனிடம் இயேசு என்ன செய்யும்படி கட்டளையிட்டார்?",
                                    "choices": [
                                          "உடனடியாக வீட்டிற்குத் திரும்பிச் செல்லும்படி.",
                                          "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                                          "அற்புதத்தைப் பற்றி அனைவரிடமும் சொல்லும்படி.",
                                          "இயேசுவைப் பின்பற்றி கலிலேயாவிற்குச் செல்லும்படி."
                                    ],
                                    "correctAnswer": "ஆசாரியனிடம் தன்னைக் காண்பித்து, மோசே கட்டளையிட்ட காணிக்கைகளைச் செலுத்தும்படி.",
                                    "reference": "மாற்கு 1:43–44"
                              }
                        }
                  }
            ]
      },
      {
            "level": "அதிகாரம் 2 (மாற்கு 2)",
            "levelTamil": "அதிகாரம் 2",
            "questions": [
                  {
                        "id": 11,
                        "chapter": 2,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "திமிர்வாதக்காரனை இயேசுவிடம் தூக்கிக்கொண்டு வந்தவர்கள் எத்தனை பேர்?",
                        "choices": [
                              "இரண்டு பேர்",
                              "மூன்று பேர்",
                              "நான்கு பேர்",
                              "ஐந்து பேர்"
                        ],
                        "correctAnswer": "நான்கு பேர்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 2:3",
                        "bilingual": {
                              "en": {
                                    "question": "How many men carried the paralyzed man to Jesus?",
                                    "choices": [
                                          "Two",
                                          "Three",
                                          "Four",
                                          "Five"
                                    ],
                                    "correctAnswer": "Four",
                                    "reference": "Mark 2:3"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனை இயேசுவிடம் தூக்கிக்கொண்டு வந்தவர்கள் எத்தனை பேர்?",
                                    "choices": [
                                          "இரண்டு பேர்",
                                          "மூன்று பேர்",
                                          "நான்கு பேர்",
                                          "ஐந்து பேர்"
                                    ],
                                    "correctAnswer": "நான்கு பேர்",
                                    "reference": "மாற்கு 2:3"
                              }
                        }
                  },
                  {
                        "id": 12,
                        "chapter": 2,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "திமிர்வாதக்காரனைக் கீழே இறக்குவதற்காக அந்த மனிதர்கள் எங்கு திறப்பை உண்டாக்கினார்கள்?",
                        "choices": [
                              "சுவர்",
                              "கூரை",
                              "கதவு",
                              "ஜன்னல்"
                        ],
                        "correctAnswer": "கூரை",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:4",
                        "bilingual": {
                              "en": {
                                    "question": "Where did the men make an opening to lower the paralyzed man?",
                                    "choices": [
                                          "Wall",
                                          "Roof",
                                          "Door",
                                          "Window"
                                    ],
                                    "correctAnswer": "Roof",
                                    "reference": "Mark 2:4"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனைக் கீழே இறக்குவதற்காக அந்த மனிதர்கள் எங்கு திறப்பை உண்டாக்கினார்கள்?",
                                    "choices": [
                                          "சுவர்",
                                          "கூரை",
                                          "கதவு",
                                          "ஜன்னல்"
                                    ],
                                    "correctAnswer": "கூரை",
                                    "reference": "மாற்கு 2:4"
                              }
                        }
                  },
                  {
                        "id": 13,
                        "chapter": 2,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசு லேவியை அழைத்தபோது அவன் என்ன செய்துகொண்டிருந்தான்?",
                        "choices": [
                              "மீன்பிடித்துக் கொண்டிருந்தான்",
                              "போதித்துக் கொண்டிருந்தான்",
                              "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                              "ஜெபித்துக் கொண்டிருந்தான்"
                        ],
                        "correctAnswer": "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 2:14",
                        "bilingual": {
                              "en": {
                                    "question": "What was Levi doing when Jesus called him?",
                                    "choices": [
                                          "Fishing",
                                          "Teaching",
                                          "Sitting at the tax collector's booth",
                                          "Praying"
                                    ],
                                    "correctAnswer": "Sitting at the tax collector's booth",
                                    "reference": "Mark 2:14"
                              },
                              "ta": {
                                    "question": "இயேசு லேவியை அழைத்தபோது அவன் என்ன செய்துகொண்டிருந்தான்?",
                                    "choices": [
                                          "மீன்பிடித்துக் கொண்டிருந்தான்",
                                          "போதித்துக் கொண்டிருந்தான்",
                                          "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                                          "ஜெபித்துக் கொண்டிருந்தான்"
                                    ],
                                    "correctAnswer": "ஆயத்துறையில் உட்கார்ந்திருந்தான்",
                                    "reference": "மாற்கு 2:14"
                              }
                        }
                  },
                  {
                        "id": 14,
                        "chapter": 2,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "திமிர்வாதக்காரனைக் குணமாக்குவதற்கு முன்பு இயேசு அவனிடம் என்ன கூறினார்?",
                        "choices": [
                              "உன் விசுவாசம் உன்னைச் சுகமாக்கியது.",
                              "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                              "எழுந்து என்னைப் பின்பற்றி வா.",
                              "பயப்படாதே."
                        ],
                        "correctAnswer": "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:5",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus say to the paralyzed man before healing him?",
                                    "choices": [
                                          "Your faith has made you well",
                                          "Son, your sins are forgiven",
                                          "Rise and follow me",
                                          "Do not be afraid"
                                    ],
                                    "correctAnswer": "Son, your sins are forgiven",
                                    "reference": "Mark 2:5"
                              },
                              "ta": {
                                    "question": "திமிர்வாதக்காரனைக் குணமாக்குவதற்கு முன்பு இயேசு அவனிடம் என்ன கூறினார்?",
                                    "choices": [
                                          "உன் விசுவாசம் உன்னைச் சுகமாக்கியது.",
                                          "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                                          "எழுந்து என்னைப் பின்பற்றி வா.",
                                          "பயப்படாதே."
                                    ],
                                    "correctAnswer": "மகனே, உன் பாவங்கள் உனக்கு மன்னிக்கப்பட்டது.",
                                    "reference": "மாற்கு 2:5"
                              }
                        }
                  },
                  {
                        "id": 15,
                        "chapter": 2,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "ஆயக்காரர்களோடும் பாவிகளோடும் ஏன் சாப்பிடுகிறீர்கள் என்று கேட்டபோது, இயேசு தம்மை எதற்கு ஒப்பிட்டுக் கூறினார்?",
                        "choices": [
                              "போதகர்",
                              "மேய்ப்பன்",
                              "வைத்தியர்",
                              "ராஜா"
                        ],
                        "correctAnswer": "வைத்தியர்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 2:17",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus compare himself to when explaining why he ate with tax collectors and sinners?",
                                    "choices": [
                                          "Teacher",
                                          "Shepherd",
                                          "Doctor",
                                          "King"
                                    ],
                                    "correctAnswer": "Doctor",
                                    "reference": "Mark 2:17"
                              },
                              "ta": {
                                    "question": "ஆயக்காரர்களோடும் பாவிகளோடும் ஏன் சாப்பிடுகிறீர்கள் என்று கேட்டபோது, இயேசு தம்மை எதற்கு ஒப்பிட்டுக் கூறினார்?",
                                    "choices": [
                                          "போதகர்",
                                          "மேய்ப்பன்",
                                          "வைத்தியர்",
                                          "ராஜா"
                                    ],
                                    "correctAnswer": "வைத்தியர்",
                                    "reference": "மாற்கு 2:17"
                              }
                        }
                  },
                  {
                        "id": 16,
                        "chapter": 2,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசுவின் கூற்றுப்படி, புதிய திராட்சரசத்தை எதில் ஊற்ற வேண்டும்?",
                        "choices": [
                              "பழைய தோற்பைகள்",
                              "புதிய தோற்பைகள்",
                              "மண்பானைகள்",
                              "மரப் பாத்திரங்கள்"
                        ],
                        "correctAnswer": "புதிய தோற்பைகள்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:22",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, what should new wine be poured into?",
                                    "choices": [
                                          "Old wineskins",
                                          "New wineskins",
                                          "Clay pots",
                                          "Wooden containers"
                                    ],
                                    "correctAnswer": "New wineskins",
                                    "reference": "Mark 2:22"
                              },
                              "ta": {
                                    "question": "இயேசுவின் கூற்றுப்படி, புதிய திராட்சரசத்தை எதில் ஊற்ற வேண்டும்?",
                                    "choices": [
                                          "பழைய தோற்பைகள்",
                                          "புதிய தோற்பைகள்",
                                          "மண்பானைகள்",
                                          "மரப் பாத்திரங்கள்"
                                    ],
                                    "correctAnswer": "புதிய தோற்பைகள்",
                                    "reference": "மாற்கு 2:22"
                              }
                        }
                  },
                  {
                        "id": 17,
                        "chapter": 2,
                        "difficulty": "நடுத்தரம்",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "உண்மையா அல்லது பொய்யா? உபவாசத்தைக் குறித்து மக்கள் இயேசுவிடம் கேள்வி கேட்டபோது, இயேசுவின் சீஷர்கள் உபவாசம் இருந்துகொண்டிருந்தார்கள்.",
                        "choices": [
                              "உண்மை",
                              "பொய்"
                        ],
                        "correctAnswer": "பொய்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:18–19",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus' disciples were fasting when people questioned Jesus about fasting.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "False",
                                    "reference": "Mark 2:18–19"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? உபவாசத்தைக் குறித்து மக்கள் இயேசுவிடம் கேள்வி கேட்டபோது, இயேசுவின் சீஷர்கள் உபவாசம் இருந்துகொண்டிருந்தார்கள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "பொய்",
                                    "reference": "மாற்கு 2:18–19"
                              }
                        }
                  },
                  {
                        "id": 18,
                        "chapter": 2,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "ஓய்வுநாளில் இயேசுவின் சீஷர்கள் கதிர்களைக் கொய்தபோது இயேசுவிடம் கேள்வி கேட்டவர்கள் யார்?",
                        "choices": [
                              "ரோமர்கள்",
                              "பரிசேயர்கள்",
                              "சதுசேயர்கள்",
                              "சமாரியர்கள்"
                        ],
                        "correctAnswer": "பரிசேயர்கள்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:23–24",
                        "bilingual": {
                              "en": {
                                    "question": "Who questioned Jesus when his disciples picked heads of grain on the Sabbath?",
                                    "choices": [
                                          "Romans",
                                          "Pharisees",
                                          "Sadducees",
                                          "Samaritans"
                                    ],
                                    "correctAnswer": "Pharisees",
                                    "reference": "Mark 2:23–24"
                              },
                              "ta": {
                                    "question": "ஓய்வுநாளில் இயேசுவின் சீஷர்கள் கதிர்களைக் கொய்தபோது இயேசுவிடம் கேள்வி கேட்டவர்கள் யார்?",
                                    "choices": [
                                          "ரோமர்கள்",
                                          "பரிசேயர்கள்",
                                          "சதுசேயர்கள்",
                                          "சமாரியர்கள்"
                                    ],
                                    "correctAnswer": "பரிசேயர்கள்",
                                    "reference": "மாற்கு 2:23–24"
                              }
                        }
                  },
                  {
                        "id": 19,
                        "chapter": 2,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "தாவீதும் அவனோடிருந்தவர்களும் பசியாயிருந்தபோது எதைச் சாப்பிட்டார்கள் என்று இயேசு கூறினார்?",
                        "choices": [
                              "பரலோகத்திலிருந்து வந்த மன்னா",
                              "மீனவர்களால் கொடுக்கப்பட்ட அப்பம்",
                              "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                              "பரிசேயர்களால் தயாரிக்கப்பட்ட அப்பம்"
                        ],
                        "correctAnswer": "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 2:25–26",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, what did David eat when he and his companions were hungry?",
                                    "choices": [
                                          "Manna from heaven",
                                          "Bread given by fishermen",
                                          "Consecrated bread that was lawful only for priests to eat",
                                          "Bread prepared by the Pharisees"
                                    ],
                                    "correctAnswer": "Consecrated bread that was lawful only for priests to eat",
                                    "reference": "Mark 2:25–26"
                              },
                              "ta": {
                                    "question": "தாவீதும் அவனோடிருந்தவர்களும் பசியாயிருந்தபோது எதைச் சாப்பிட்டார்கள் என்று இயேசு கூறினார்?",
                                    "choices": [
                                          "பரலோகத்திலிருந்து வந்த மன்னா",
                                          "மீனவர்களால் கொடுக்கப்பட்ட அப்பம்",
                                          "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                                          "பரிசேயர்களால் தயாரிக்கப்பட்ட அப்பம்"
                                    ],
                                    "correctAnswer": "ஆசாரியர்கள் மட்டுமே சாப்பிடுவதற்கு அனுமதிக்கப்பட்ட பரிசுத்த அப்பம்",
                                    "reference": "மாற்கு 2:25–26"
                              }
                        }
                  },
                  {
                        "id": 20,
                        "chapter": 2,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "மனுஷகுமாரனையும் ஓய்வுநாளையும் குறித்து இயேசு என்ன கூறினார்?",
                        "choices": [
                              "மனுஷகுமாரன் ஓய்வுநாளின் ஊழியக்காரன்.",
                              "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                              "மனுஷகுமாரன் ஓய்வுநாளைத் தவிர்க்க வேண்டும்.",
                              "மனுஷகுமாரன் பரிசேயர்களை உருவாக்கினார்."
                        ],
                        "correctAnswer": "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                        "correctIndex": 1,
                        "reference": "மாற்கு 2:28",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus say about the Son of Man and the Sabbath?",
                                    "choices": [
                                          "The Son of Man is a servant of the Sabbath",
                                          "The Son of Man is Lord even of the Sabbath",
                                          "The Son of Man must avoid the Sabbath",
                                          "The Son of Man created the Pharisees"
                                    ],
                                    "correctAnswer": "The Son of Man is Lord even of the Sabbath",
                                    "reference": "Mark 2:28"
                              },
                              "ta": {
                                    "question": "மனுஷகுமாரனையும் ஓய்வுநாளையும் குறித்து இயேசு என்ன கூறினார்?",
                                    "choices": [
                                          "மனுஷகுமாரன் ஓய்வுநாளின் ஊழியக்காரன்.",
                                          "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                                          "மனுஷகுமாரன் ஓய்வுநாளைத் தவிர்க்க வேண்டும்.",
                                          "மனுஷகுமாரன் பரிசேயர்களை உருவாக்கினார்."
                                    ],
                                    "correctAnswer": "மனுஷகுமாரன் ஓய்வுநாளுக்கும் ஆண்டவராயிருக்கிறார்.",
                                    "reference": "மாற்கு 2:28"
                              }
                        }
                  }
            ]
      },
      {
            "level": "அதிகாரம் 3 (மாற்கு 3)",
            "levelTamil": "அதிகாரம் 3",
            "questions": [
                  {
                        "id": 21,
                        "chapter": 3,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "ஜெப ஆலயத்தில் இயேசு சந்தித்த மனிதனுக்கு என்ன பிரச்சினை இருந்தது?",
                        "choices": [
                              "அவன் குருடனாக இருந்தான்.",
                              "அவனுக்கு சூம்பின கை இருந்தது.",
                              "அவன் செவிடனாக இருந்தான்.",
                              "அவனுக்குத் தொழுநோய் இருந்தது."
                        ],
                        "correctAnswer": "அவனுக்கு சூம்பின கை இருந்தது.",
                        "correctIndex": 1,
                        "reference": "மாற்கு 3:1",
                        "bilingual": {
                              "en": {
                                    "question": "What was the problem with the man whom Jesus saw in the synagogue?",
                                    "choices": [
                                          "He was blind",
                                          "He had a shriveled hand",
                                          "He was deaf",
                                          "He had leprosy"
                                    ],
                                    "correctAnswer": "He had a shriveled hand",
                                    "reference": "Mark 3:1"
                              },
                              "ta": {
                                    "question": "ஜெப ஆலயத்தில் இயேசு சந்தித்த மனிதனுக்கு என்ன பிரச்சினை இருந்தது?",
                                    "choices": [
                                          "அவன் குருடனாக இருந்தான்.",
                                          "அவனுக்கு சூம்பின கை இருந்தது.",
                                          "அவன் செவிடனாக இருந்தான்.",
                                          "அவனுக்குத் தொழுநோய் இருந்தது."
                                    ],
                                    "correctAnswer": "அவனுக்கு சூம்பின கை இருந்தது.",
                                    "reference": "மாற்கு 3:1"
                              }
                        }
                  },
                  {
                        "id": 22,
                        "chapter": 3,
                        "difficulty": "எளிது",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசு எத்தனை சீஷர்களைத் தெரிந்துகொண்டு நியமித்தார்?",
                        "choices": [
                              "ஏழு பேர்",
                              "பத்து பேர்",
                              "பன்னிரண்டு பேர்",
                              "எழுபது பேர்"
                        ],
                        "correctAnswer": "பன்னிரண்டு பேர்",
                        "correctIndex": 2,
                        "reference": "மாற்கு 3:14",
                        "bilingual": {
                              "en": {
                                    "question": "How many disciples did Jesus appoint?",
                                    "choices": [
                                          "Seven",
                                          "Ten",
                                          "Twelve",
                                          "Seventy"
                                    ],
                                    "correctAnswer": "Twelve",
                                    "reference": "Mark 3:14"
                              },
                              "ta": {
                                    "question": "இயேசு எத்தனை சீஷர்களைத் தெரிந்துகொண்டு நியமித்தார்?",
                                    "choices": [
                                          "ஏழு பேர்",
                                          "பத்து பேர்",
                                          "பன்னிரண்டு பேர்",
                                          "எழுபது பேர்"
                                    ],
                                    "correctAnswer": "பன்னிரண்டு பேர்",
                                    "reference": "மாற்கு 3:14"
                              }
                        }
                  },
                  {
                        "id": 23,
                        "chapter": 3,
                        "difficulty": "எளிது",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "உண்மையா அல்லது பொய்யா? யாக்கோபுக்கும் யோவானுக்கும் இயேசு \"போவனெர்கேஸ்\" என்ற பெயரைக் கொடுத்தார். அதன் அர்த்தம் \"இடிமுழக்கத்தின் மக்கள்\" என்பதாகும்.",
                        "choices": [
                              "உண்மை",
                              "பொய்"
                        ],
                        "correctAnswer": "உண்மை",
                        "correctIndex": 0,
                        "reference": "மாற்கு 3:17",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus gave James and John the name \"Boanerges,\" which means \"Sons of Thunder.\"",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 3:17"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? யாக்கோபுக்கும் யோவானுக்கும் இயேசு \"போவனெர்கேஸ்\" என்ற பெயரைக் கொடுத்தார். அதன் அர்த்தம் \"இடிமுழக்கத்தின் மக்கள்\" என்பதாகும்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 3:17"
                              }
                        }
                  },
                  {
                        "id": 24,
                        "chapter": 3,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "சூம்பின கையுடைய மனிதனை இயேசு குணமாக்கிய பிறகு, அவரைக் கொலை செய்யப் பரிசேயர்கள் யாருடன் ஆலோசனை செய்தார்கள்?",
                        "choices": [
                              "சதுசேயர்கள்",
                              "ஏரோதியர்கள்",
                              "ரோமர்கள்",
                              "சமாரியர்கள்"
                        ],
                        "correctAnswer": "ஏரோதியர்கள்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 3:6",
                        "bilingual": {
                              "en": {
                                    "question": "With whom did the Pharisees plot to kill Jesus after he healed the man with the shriveled hand?",
                                    "choices": [
                                          "Sadducees",
                                          "Herodians",
                                          "Romans",
                                          "Samaritans"
                                    ],
                                    "correctAnswer": "Herodians",
                                    "reference": "Mark 3:6"
                              },
                              "ta": {
                                    "question": "சூம்பின கையுடைய மனிதனை இயேசு குணமாக்கிய பிறகு, அவரைக் கொலை செய்யப் பரிசேயர்கள் யாருடன் ஆலோசனை செய்தார்கள்?",
                                    "choices": [
                                          "சதுசேயர்கள்",
                                          "ஏரோதியர்கள்",
                                          "ரோமர்கள்",
                                          "சமாரியர்கள்"
                                    ],
                                    "correctAnswer": "ஏரோதியர்கள்",
                                    "reference": "மாற்கு 3:6"
                              }
                        }
                  },
                  {
                        "id": 25,
                        "chapter": 3,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "வேதபாரகர்கள் இயேசுவைக் குறித்து என்ன குற்றம் சாட்டினார்கள்?",
                        "choices": [
                              "ஓய்வுநாளை மீறுகிறார் என்று.",
                              "தேவாலயத்திலிருந்து திருடுகிறார் என்று.",
                              "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                              "போதிக்க மறுக்கிறார் என்று."
                        ],
                        "correctAnswer": "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                        "correctIndex": 2,
                        "reference": "மாற்கு 3:22",
                        "bilingual": {
                              "en": {
                                    "question": "What did the teachers of the law accuse Jesus of?",
                                    "choices": [
                                          "Breaking the Sabbath",
                                          "Stealing from the temple",
                                          "Being possessed by Beelzebul and driving out demons by the prince of demons",
                                          "Refusing to teach"
                                    ],
                                    "correctAnswer": "Being possessed by Beelzebul and driving out demons by the prince of demons",
                                    "reference": "Mark 3:22"
                              },
                              "ta": {
                                    "question": "வேதபாரகர்கள் இயேசுவைக் குறித்து என்ன குற்றம் சாட்டினார்கள்?",
                                    "choices": [
                                          "ஓய்வுநாளை மீறுகிறார் என்று.",
                                          "தேவாலயத்திலிருந்து திருடுகிறார் என்று.",
                                          "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                                          "போதிக்க மறுக்கிறார் என்று."
                                    ],
                                    "correctAnswer": "பெயல்செபூல் பிடித்திருக்கிறார் என்றும், பிசாசுகளின் தலைவனால் பிசாசுகளைத் துரத்துகிறார் என்றும்.",
                                    "reference": "மாற்கு 3:22"
                              }
                        }
                  },
                  {
                        "id": 26,
                        "chapter": 3,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "சீமோனுக்கு இயேசு கொடுத்த பெயர் என்ன?",
                        "choices": [
                              "அந்திரேயா",
                              "பேதுரு",
                              "யாக்கோபு",
                              "ததேயு"
                        ],
                        "correctAnswer": "பேதுரு",
                        "correctIndex": 1,
                        "reference": "மாற்கு 3:16",
                        "bilingual": {
                              "en": {
                                    "question": "What name did Jesus give to Simon?",
                                    "choices": [
                                          "Andrew",
                                          "Peter",
                                          "James",
                                          "Thaddaeus"
                                    ],
                                    "correctAnswer": "Peter",
                                    "reference": "Mark 3:16"
                              },
                              "ta": {
                                    "question": "சீமோனுக்கு இயேசு கொடுத்த பெயர் என்ன?",
                                    "choices": [
                                          "அந்திரேயா",
                                          "பேதுரு",
                                          "யாக்கோபு",
                                          "ததேயு"
                                    ],
                                    "correctAnswer": "பேதுரு",
                                    "reference": "மாற்கு 3:16"
                              }
                        }
                  },
                  {
                        "id": 27,
                        "chapter": 3,
                        "difficulty": "நடுத்தரம்",
                        "type": "true_false",
                        "timeLimit": 30,
                        "question": "உண்மையா அல்லது பொய்யா? இயேசுவின் குடும்பத்தினர் அவர் மதிமயங்கியிருக்கிறார் என்று கூறினார்கள்.",
                        "choices": [
                              "உண்மை",
                              "பொய்"
                        ],
                        "correctAnswer": "உண்மை",
                        "correctIndex": 0,
                        "reference": "மாற்கு 3:20–21",
                        "bilingual": {
                              "en": {
                                    "question": "True or False: Jesus' family said that he was out of his mind.",
                                    "choices": [
                                          "True",
                                          "False"
                                    ],
                                    "correctAnswer": "True",
                                    "reference": "Mark 3:20–21"
                              },
                              "ta": {
                                    "question": "உண்மையா அல்லது பொய்யா? இயேசுவின் குடும்பத்தினர் அவர் மதிமயங்கியிருக்கிறார் என்று கூறினார்கள்.",
                                    "choices": [
                                          "உண்மை",
                                          "பொய்"
                                    ],
                                    "correctAnswer": "உண்மை",
                                    "reference": "மாற்கு 3:20–21"
                              }
                        }
                  },
                  {
                        "id": 28,
                        "chapter": 3,
                        "difficulty": "நடுத்தரம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "பெரிய கூட்டம் கூடியிருந்ததால் இயேசு தமது சீஷர்களிடம் எதைத் தயாராக வைத்திருக்கும்படி கூறினார்?",
                        "choices": [
                              "குதிரை",
                              "ஒரு சிறிய படகு",
                              "ஒரு வீடு",
                              "ஒரு கூடாரம்"
                        ],
                        "correctAnswer": "ஒரு சிறிய படகு",
                        "correctIndex": 1,
                        "reference": "மாற்கு 3:9",
                        "bilingual": {
                              "en": {
                                    "question": "What did Jesus ask his disciples to have ready because of the large crowd?",
                                    "choices": [
                                          "A horse",
                                          "A small boat",
                                          "A house",
                                          "A tent"
                                    ],
                                    "correctAnswer": "A small boat",
                                    "reference": "Mark 3:9"
                              },
                              "ta": {
                                    "question": "பெரிய கூட்டம் கூடியிருந்ததால் இயேசு தமது சீஷர்களிடம் எதைத் தயாராக வைத்திருக்கும்படி கூறினார்?",
                                    "choices": [
                                          "குதிரை",
                                          "ஒரு சிறிய படகு",
                                          "ஒரு வீடு",
                                          "ஒரு கூடாரம்"
                                    ],
                                    "correctAnswer": "ஒரு சிறிய படகு",
                                    "reference": "மாற்கு 3:9"
                              }
                        }
                  },
                  {
                        "id": 29,
                        "chapter": 3,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "\"போவனெர்கேஸ்\" என்ற பெயரின் அர்த்தம் என்ன?",
                        "choices": [
                              "தேவனுடைய புத்திரர்கள்",
                              "இடிமுழக்கத்தின் மக்கள்",
                              "ஒளியின் மக்கள்",
                              "சமாதானத்தின் மக்கள்"
                        ],
                        "correctAnswer": "இடிமுழக்கத்தின் மக்கள்",
                        "correctIndex": 1,
                        "reference": "மாற்கு 3:17",
                        "bilingual": {
                              "en": {
                                    "question": "What does the name \"Boanerges\" mean?",
                                    "choices": [
                                          "Sons of God",
                                          "Sons of Thunder",
                                          "Sons of Light",
                                          "Sons of Peace"
                                    ],
                                    "correctAnswer": "Sons of Thunder",
                                    "reference": "Mark 3:17"
                              },
                              "ta": {
                                    "question": "\"போவனெர்கேஸ்\" என்ற பெயரின் அர்த்தம் என்ன?",
                                    "choices": [
                                          "தேவனுடைய புத்திரர்கள்",
                                          "இடிமுழக்கத்தின் மக்கள்",
                                          "ஒளியின் மக்கள்",
                                          "சமாதானத்தின் மக்கள்"
                                    ],
                                    "correctAnswer": "இடிமுழக்கத்தின் மக்கள்",
                                    "reference": "மாற்கு 3:17"
                              }
                        }
                  },
                  {
                        "id": 30,
                        "chapter": 3,
                        "difficulty": "கடினம்",
                        "type": "mcq",
                        "timeLimit": 30,
                        "question": "இயேசுவின் கூற்றுப்படி, அவருடைய சகோதரனும் சகோதரியும் தாயும் யார்?",
                        "choices": [
                              "அவருடைய சொந்த குடும்பத்தினர் மட்டுமே.",
                              "அவரைப் பின்தொடர்ந்து வருகிற அனைவரும்.",
                              "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                              "பன்னிரண்டு சீஷர்கள் மட்டுமே."
                        ],
                        "correctAnswer": "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                        "correctIndex": 2,
                        "reference": "மாற்கு 3:33–35",
                        "bilingual": {
                              "en": {
                                    "question": "According to Jesus, who are his brother, sister and mother?",
                                    "choices": [
                                          "Only his biological family",
                                          "Everyone who follows him physically",
                                          "Whoever does God's will",
                                          "Only the twelve disciples"
                                    ],
                                    "correctAnswer": "Whoever does God's will",
                                    "reference": "Mark 3:33–35"
                              },
                              "ta": {
                                    "question": "இயேசுவின் கூற்றுப்படி, அவருடைய சகோதரனும் சகோதரியும் தாயும் யார்?",
                                    "choices": [
                                          "அவருடைய சொந்த குடும்பத்தினர் மட்டுமே.",
                                          "அவரைப் பின்தொடர்ந்து வருகிற அனைவரும்.",
                                          "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                                          "பன்னிரண்டு சீஷர்கள் மட்டுமே."
                                    ],
                                    "correctAnswer": "தேவனுடைய சித்தத்தின்படி செய்கிறவர்கள்.",
                                    "reference": "மாற்கு 3:33–35"
                              }
                        }
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
  TOTAL_QUESTIONS: 30,
  TIME_LIMIT_SECONDS: 30,
  BASE_POINTS: 500,
  SPEED_BONUS_MAX: 500,
  MAX_SCORE_PER_Q: 1000,
  STORAGE_KEY_BEST: "BIBLE_QUIZ_BEST_SCORE",
  STORAGE_KEY_CUSTOM_QUIZZES: "BIBLE_QUIZ_ADMIN_QUIZZES",
  STORAGE_KEY_ADMIN_SESSION: "BIBLE_QUIZ_ADMIN_AUTH"
};

const ADMIN_DEMO_CREDENTIALS = {
  user: "admin",
  pass: "jesus"
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
  currentStreak: 0,
  // Custom quiz support (Phase 2)
  activeCustomQuiz: null,
  hasSharedResultCard: false
};

// ==========================================
// 3. DOM ELEMENTS CACHE
// ==========================================
const DOM = {
  screens: {
    unauthorized: document.getElementById("unauthorized-screen"),
    welcome: document.getElementById("welcome-screen"),
    quiz: document.getElementById("quiz-screen"),
    results: document.getElementById("results-screen"),
    review: document.getElementById("review-screen"),
    admin: document.getElementById("admin-screen"),
    editor: document.getElementById("editor-screen"),
    leaderboard: document.getElementById("leaderboard-screen")
  },
  soundToggleBtn: document.getElementById("sound-toggle-btn"),
  soundIcon: document.getElementById("sound-icon"),
  soundLabel: document.getElementById("sound-label"),
  langBtnEn: document.getElementById("lang-btn-en"),
  langBtnTa: document.getElementById("lang-btn-ta"),
  adminPortalBtn: document.getElementById("admin-portal-btn"),
  // Welcome Elements
  lblBrandBadge: document.getElementById("lbl-brand-badge"),
  lblBrandTitle: document.getElementById("lbl-brand-title"),
  lblBrandSubtitle: document.getElementById("lbl-brand-subtitle"),
  sharedQuizBanner: document.getElementById("shared-quiz-banner"),
  sharedQuizTitle: document.getElementById("shared-quiz-title"),
  sharedQuizDesc: document.getElementById("shared-quiz-desc"),
  sharedQuizQCount: document.getElementById("shared-quiz-qcount"),
  sharedQuizTime: document.getElementById("shared-quiz-time"),
  sharedQuizDifficulty: document.getElementById("shared-quiz-difficulty"),
  playDefaultQuizBtn: document.getElementById("play-default-quiz-btn"),
  lblPillCategory: document.getElementById("lbl-pill-category"),
  valPillCategory: document.getElementById("val-pill-category"),
  lblPillLevels: document.getElementById("lbl-pill-levels"),
  valPillLevels: document.getElementById("val-pill-levels"),
  lblPillQuestions: document.getElementById("lbl-pill-questions"),
  valPillQuestions: document.getElementById("val-pill-questions"),
  lblPillTime: document.getElementById("lbl-pill-time"),
  valPillTime: document.getElementById("val-pill-time"),
  lblPillScore: document.getElementById("lbl-pill-score"),
  valPillScore: document.getElementById("val-pill-score"),
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
  hudScoreMax: document.getElementById("hud-score-max"),
  fullscreenToggleBtn: document.getElementById("fullscreen-toggle-btn"),
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
  confettiCanvas: document.getElementById("confetti-canvas"),
  // Phase 2: Admin Dashboard Elements
  adminCreateQuizBtn: document.getElementById("admin-create-quiz-btn"),
  adminImportJsonBtn: document.getElementById("admin-import-json-btn"),
  adminImportFileInput: document.getElementById("admin-import-file-input"),
  adminLogoutBtn: document.getElementById("admin-logout-btn"),
  adminExitHomeBtn: document.getElementById("admin-exit-home-btn"),
  adminQuizCount: document.getElementById("admin-quiz-count"),
  adminQuizList: document.getElementById("admin-quiz-list"),
  // Phase 2: Quiz Editor Elements
  editorPageTitle: document.getElementById("editor-page-title"),
  editorModeBadge: document.getElementById("editor-mode-badge"),
  editorCancelBtn: document.getElementById("editor-cancel-btn"),
  editorSaveDraftBtn: document.getElementById("editor-save-draft-btn"),
  editorPublishBtn: document.getElementById("editor-publish-btn"),
  editorQuizForm: document.getElementById("quiz-editor-form"),
  editorQuizId: document.getElementById("editor-quiz-id"),
  editorQuizTitle: document.getElementById("editor-quiz-title"),
  editorQuizDifficulty: document.getElementById("editor-quiz-difficulty"),
  editorQuizTime: document.getElementById("editor-quiz-time"),
  editorQuizDesc: document.getElementById("editor-quiz-desc"),
  editorQuestionsCount: document.getElementById("editor-questions-count"),
  editorQuestionsList: document.getElementById("editor-questions-list"),
  editorAddQBtn: document.getElementById("editor-add-q-btn"),
  editorAddQBottomBtn: document.getElementById("editor-add-q-bottom-btn"),
  // Phase 2: Modals Elements
  adminLoginModal: document.getElementById("admin-login-modal"),
  closeLoginModalBtn: document.getElementById("close-login-modal-btn"),
  adminLoginForm: document.getElementById("admin-login-form"),
  adminUserInput: document.getElementById("admin-user-input"),
  adminPassInput: document.getElementById("admin-pass-input"),
  adminLoginError: document.getElementById("admin-login-error"),
  cancelLoginBtn: document.getElementById("cancel-login-btn"),
  shareLinkModal: document.getElementById("share-link-modal"),
  closeShareModalBtn: document.getElementById("close-share-modal-btn"),
  shareUrlWarning: document.getElementById("share-url-warning"),
  shareUrlCharCount: document.getElementById("share-url-char-count"),
  shareUrlInput: document.getElementById("share-url-input"),
  copyShareUrlBtn: document.getElementById("copy-share-url-btn"),
  downloadQuizJsonBtn: document.getElementById("download-quiz-json-btn"),
  testQuizLinkBtn: document.getElementById("test-quiz-link-btn"),
  unauthorizedAdminBtn: document.getElementById("unauthorized-admin-btn"),
  // Smart Import Modal Elements
  smartImportModal: document.getElementById("smart-import-modal"),
  closeImportModalBtn: document.getElementById("close-import-modal-btn"),
  cancelImportModalBtn: document.getElementById("cancel-import-modal-btn"),
  modalUploadFileBtn: document.getElementById("modal-upload-file-btn"),
  modalFileInput: document.getElementById("modal-file-input"),
  importJsonTextarea: document.getElementById("import-json-textarea"),
  importJsonError: document.getElementById("import-json-error"),
  processImportBtn: document.getElementById("process-import-btn"),
  editorImportJsonBtn: document.getElementById("editor-import-json-btn"),
  // Phase 2: Live Leaderboard Elements
  leaderboardNavBtn: document.getElementById("leaderboard-nav-btn"),
  viewLeaderboardBtn: document.getElementById("view-leaderboard-btn"),
  lbStatusDot: document.getElementById("leaderboard-status-dot"),
  lbStatusText: document.getElementById("leaderboard-status-text"),
  lbEventTitle: document.getElementById("leaderboard-event-title"),
  lbEventSubtitle: document.getElementById("leaderboard-event-subtitle"),
  lbParticipantCount: document.getElementById("lb-participant-count"),
  lbRefreshBtn: document.getElementById("lb-refresh-btn"),
  lbProjectorModeBtn: document.getElementById("lb-projector-mode-btn"),
  lbBackBtn: document.getElementById("lb-back-btn"),
  lbTbody: document.getElementById("leaderboard-tbody"),
  lbLastUpdated: document.getElementById("lb-last-updated")
};

// ==========================================
// 4. FEATURE 1: NATIVE WEB AUDIO API SYNTHESIZER
// ==========================================
let audioCtx = null;

function getAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    console.warn("AudioContext init error:", err);
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

    // Scale particle count for low-power / mobile devices to maintain smooth 60fps
    const isMobile = window.innerWidth < 640;
    const particleCount = isMobile ? 55 : 90;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.8,
        w: Math.random() * 8 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3.5 + 2.5,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 6
      });
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    let frames = 0;
    const maxFrames = isMobile ? 120 : 180; // 2-3 seconds max

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
      if (frames < maxFrames) {
        this.animFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.animFrameId = null;
      }
    };

    render();
  },
  stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    const canvas = DOM.confettiCanvas;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
  DOM.valPillTime.textContent = "30s/Q";
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

  // Refresh in-quiz active question in selected language for both default & custom quiz
  if (DOM.screens.quiz && DOM.screens.quiz.classList.contains("active") && gameState.selectedQuestions.length > 0) {
    updateActiveQuestionLanguage(lang);
  }

  // If a custom quiz is loaded, refresh its banner and active question if currently in-quiz
  if (gameState.activeCustomQuiz) {
    const custom = gameState.activeCustomQuiz;
    const title = getLocalizedQuizProp(custom, "title", lang);
    const desc = getLocalizedQuizProp(custom, "description", lang);
    const diff = getLocalizedQuizProp(custom, "difficulty", lang) || "Custom";
    if (DOM.sharedQuizTitle) DOM.sharedQuizTitle.textContent = title;
    if (DOM.sharedQuizDesc && desc) DOM.sharedQuizDesc.textContent = desc;
    if (DOM.sharedQuizDifficulty) DOM.sharedQuizDifficulty.textContent = diff;
    if (DOM.valPillCategory) DOM.valPillCategory.textContent = title;
    if (DOM.valPillLevels) DOM.valPillLevels.textContent = diff;

    // If quiz is currently active on screen, refresh question text and answer choices in the newly selected language
    if (DOM.screens.quiz && DOM.screens.quiz.classList.contains("active") && gameState.selectedQuestions.length > 0) {
      updateActiveQuestionLanguage(lang);
    } else if (DOM.screens.welcome && DOM.screens.welcome.classList.contains("active")) {
      // Re-populate localized questions count and welcome banner
      const qList = getLocalizedQuizQuestions(custom, lang);
      if (DOM.sharedQuizQCount) DOM.sharedQuizQCount.textContent = `${qList.length} ${lang === "ta" ? "கேள்விகள்" : "Questions"}`;
      if (DOM.valPillQuestions) DOM.valPillQuestions.textContent = qList.length;
    }
  }
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

function requestFullScreenMode() {
  const elem = document.documentElement;
  try {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  } catch (err) {}
}

function toggleFullScreenMode() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    requestFullScreenMode();
  } else {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } catch (err) {}
  }
}

function updateResultsExitButtonsState() {
  const isUnlocked = gameState.hasSharedResultCard;
  if (DOM.backHomeBtn) {
    DOM.backHomeBtn.disabled = !isUnlocked;
    DOM.backHomeBtn.title = isUnlocked ? "" : "Please share or download your result card to unlock exit.";
  }
  if (DOM.playAgainBtn) {
    DOM.playAgainBtn.disabled = !isUnlocked;
    DOM.playAgainBtn.title = isUnlocked ? "" : "Please share or download your result card to unlock play again.";
  }
  if (DOM.lblExportNote) {
    if (!isUnlocked) {
      DOM.lblExportNote.innerHTML = `⚠️ <strong>Action Required:</strong> Please click <strong>"📲 Share Card"</strong> or <strong>"📸 Download Card (PNG)"</strong> to submit/save your answers before leaving.`;
      DOM.lblExportNote.style.color = "#ea580c";
    } else {
      const dict = QUIZ_DATA[currentLang];
      DOM.lblExportNote.innerHTML = `✅ <strong>Answers Saved/Shared!</strong> You can now view the review, play again, or return home.`;
      DOM.lblExportNote.style.color = "#16a34a";
    }
  }
}

function markResultCardShared() {
  gameState.hasSharedResultCard = true;
  updateResultsExitButtonsState();
}

function showScreen(screenKey) {
  Object.values(DOM.screens).forEach(screen => screen.classList.remove("active"));
  if (DOM.screens[screenKey]) {
    DOM.screens[screenKey].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function calculateQuestionPoints(isCorrect, responseTimeSeconds, maxTime = CONFIG.TIME_LIMIT_SECONDS) {
  if (!isCorrect) return 0;
  const limit = (maxTime && maxTime > 0) ? maxTime : CONFIG.TIME_LIMIT_SECONDS;
  const clampedTime = Math.max(0, Math.min(responseTimeSeconds, limit));
  const speedBonus = Math.round(CONFIG.SPEED_BONUS_MAX * (1 - (clampedTime / limit)));
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
  gameState.hasSharedResultCard = false;

  let allQuestions = [];
  let totalQ = 0;
  let custom = gameState.activeCustomQuiz;

  if (custom) {
    const rawQuestions = getLocalizedQuizQuestions(custom, currentLang);
    totalQ = rawQuestions.length;
    allQuestions = rawQuestions.map((rawQ, idx) => {
      const resolved = resolveBilingualQuestion(rawQ, currentLang);
      const isTF = (rawQ.type === "true_false" || rawQ.type === "boolean" || (Array.isArray(resolved.choices) && resolved.choices.length === 2));
      const choices = isTF ? resolved.choices.slice(0, 2) : resolved.choices;
      const shuffled = isTF ? [...choices] : shuffleArray(choices);
      const qTime = (rawQ.timeLimit && parseInt(rawQ.timeLimit, 10) > 0) ? parseInt(rawQ.timeLimit, 10) : null;
      return {
        id: rawQ.id || idx + 1,
        type: isTF ? "true_false" : "mcq",
        raw: rawQ,
        question: resolved.text,
        choices: choices,
        correctAnswer: resolved.correctAnswer,
        reference: resolved.reference,
        timeLimit: qTime,
        levelDisplay: getLocalizedQuizProp(custom, "difficulty", currentLang) || "Custom",
        shuffledOptions: shuffled
      };
    });
  } else {
    // Built-in standard 15-question quiz (5 Easy, 5 Medium, 5 Hard)
    const dict = QUIZ_DATA[currentLang];
    dict.difficultyLevels.forEach((lvl) => {
      const shuffledLvlQ = shuffleArray(lvl.questions);
      shuffledLvlQ.forEach((q) => {
        allQuestions.push({
          id: q.id,
          type: "mcq",
          raw: q,
          question: q.question,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          reference: q.reference,
          timeLimit: CONFIG.TIME_LIMIT_SECONDS,
          levelDisplay: lvl.level,
          shuffledOptions: shuffleArray(q.choices)
        });
      });
    });
    totalQ = allQuestions.length;
  }

  gameState.selectedQuestions = allQuestions;

  const maxTotalScore = totalQ * CONFIG.MAX_SCORE_PER_Q;
  DOM.hudPlayerName.textContent = gameState.playerName;
  DOM.totalQNum.textContent = totalQ;
  DOM.hudScore.textContent = "0";
  if (DOM.hudScoreMax) {
    DOM.hudScoreMax.textContent = `/ ${maxTotalScore.toLocaleString()}`;
  }
  DOM.streakIndicator.classList.add("hidden");

  // Automatically request fullscreen when quiz starts
  requestFullScreenMode();

  showScreen("quiz");
  loadQuestion(0);
}

function loadQuestion(index) {
  gameState.currentQuestionIndex = index;
  gameState.isAnswerSubmitted = false;
  clearInterval(gameState.timerInterval);

  const qData = gameState.selectedQuestions[index];
  const dict = QUIZ_DATA[currentLang];
  const totalCount = gameState.selectedQuestions.length;

  DOM.currentQNum.textContent = index + 1;
  const progressPercent = ((index + 1) / totalCount) * 100;
  DOM.progressBar.style.width = `${progressPercent}%`;

  if (DOM.questionCategoryTag) {
    DOM.questionCategoryTag.textContent = `${qData.levelDisplay} • ${dict.hudQuestion} ${index + 1}`;
  }

  DOM.questionText.textContent = qData.question;

  const numChoices = (qData.shuffledOptions && qData.shuffledOptions.length) ? qData.shuffledOptions.length : 4;
  DOM.answerButtons.forEach((btn, idx) => {
    if (idx < numChoices) {
      btn.style.display = "";
      btn.disabled = false;
      btn.classList.remove("is-correct", "is-incorrect", "is-dimmed");
      btn.setAttribute("data-index", idx);
      const optionTextEl = btn.querySelector(".option-text");
      if (optionTextEl) {
        optionTextEl.textContent = qData.shuffledOptions[idx] || "";
      }
    } else {
      btn.style.display = "none";
      btn.disabled = true;
    }
  });

  DOM.feedbackPanel.classList.add("hidden");

  const questionTimeLimit = (qData && qData.timeLimit && qData.timeLimit > 0)
    ? qData.timeLimit
    : ((gameState.activeCustomQuiz && gameState.activeCustomQuiz.timeLimit) 
        ? gameState.activeCustomQuiz.timeLimit 
        : CONFIG.TIME_LIMIT_SECONDS);

  let timeLeft = questionTimeLimit;
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
  DOM.answerButtons.forEach(btn => btn.disabled = true);
  clearInterval(gameState.timerInterval);

  const qData = gameState.selectedQuestions[gameState.currentQuestionIndex];
  const qTimeLimit = (qData && qData.timeLimit && qData.timeLimit > 0)
    ? qData.timeLimit
    : ((gameState.activeCustomQuiz && gameState.activeCustomQuiz.timeLimit) ? gameState.activeCustomQuiz.timeLimit : CONFIG.TIME_LIMIT_SECONDS);

  const elapsedMs = performance.now() - gameState.questionStartTime;
  const elapsedSec = Math.min(qTimeLimit, Math.max(0.1, elapsedMs / 1000));

  const chosenAnswer = qData.shuffledOptions[chosenIndex];
  const isCorrect = (chosenAnswer === qData.correctAnswer);
  const pointsAwarded = calculateQuestionPoints(isCorrect, elapsedSec, qTimeLimit);

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
    if (btn.style.display === "none") return;
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
  const qTimeLimit = (qData && qData.timeLimit && qData.timeLimit > 0)
    ? qData.timeLimit
    : ((gameState.activeCustomQuiz && gameState.activeCustomQuiz.timeLimit) ? gameState.activeCustomQuiz.timeLimit : CONFIG.TIME_LIMIT_SECONDS);
  const elapsedSec = qTimeLimit;
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
    if (btn.style.display === "none") return;
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
  const totalCount = gameState.selectedQuestions.length || CONFIG.TOTAL_QUESTIONS;
  if (nextIndex < totalCount) {
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
  const totalCount = gameState.selectedQuestions.length || CONFIG.TOTAL_QUESTIONS;

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

  const accuracy = Math.round((correctCount / totalCount) * 100);
  const avgResponseTime = (totalTime / totalCount).toFixed(1);
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

  const maxPossibleScore = totalCount * CONFIG.MAX_SCORE_PER_Q;
  DOM.cardPlayerName.textContent = gameState.playerName;
  DOM.cardAttemptId.textContent = gameState.attemptId;
  DOM.cardFinalScore.textContent = gameState.cumulativeScore.toLocaleString();
  const cardScoreSub = document.querySelector(".card-score-box .score-sub");
  if (cardScoreSub) {
    cardScoreSub.textContent = `/ ${maxPossibleScore.toLocaleString()} pts`;
  }

  DOM.cardRatingLabel.textContent = performance.title;
  DOM.cardCorrectCount.textContent = `${correctCount}/${totalCount}`;
  DOM.cardAccuracy.textContent = `${accuracy}%`;
  DOM.cardAvgTime.textContent = `${avgResponseTime}s`;
  DOM.cardSpeedBonus.textContent = `+${speedBonusTotal.toLocaleString()}`;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const timeFormatted = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  DOM.cardTimestamp.textContent = `${dateFormatted} at ${timeFormatted}`;

  // Phase 2: Asynchronously submit score to live shared leaderboard (Cloudflare DO)
  LeaderboardClient.submitQuizResult({
    playerName: gameState.playerName,
    score: gameState.cumulativeScore,
    totalTimeSec: totalTime,
    correctCount: correctCount,
    maxQuestions: totalCount,
    attemptId: gameState.attemptId
  });

  // Lock exit buttons until player shares or downloads result card
  updateResultsExitButtonsState();

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

    const totalCount = gameState.selectedQuestions.length || CONFIG.TOTAL_QUESTIONS;
    card.className = `review-card ${statusClass}`;
    card.innerHTML = `
      <div class="review-top-bar">
        <span class="review-q-num">${dict.hudQuestion} ${rec.questionNumber} ${dict.hudOf} ${totalCount} • ${rec.levelDisplay}</span>
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
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#1e293b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 22px 'Plus Jakarta Sans', 'Noto Sans Tamil', sans-serif";
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

  const totalQCount = gameState.selectedQuestions.length || CONFIG.TOTAL_QUESTIONS;
  const maxPossibleScore = (totalQCount * CONFIG.MAX_SCORE_PER_Q).toLocaleString();
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
    markResultCardShared();
  } catch (err) {
    alert("Result card generated! Please take a quick screenshot of the card.");
    markResultCardShared();
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
        markResultCardShared();
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
        markResultCardShared();
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

  // Welcome Form & Start Button
  function handleStartQuiz() {
    const rawName = DOM.nicknameInput.value;
    const trimmed = rawName.trim();
    const dict = QUIZ_DATA[currentLang];

    if (!trimmed) {
      DOM.nicknameError.textContent = dict.nicknameError;
      DOM.nicknameInput.classList.add("input-error");
      DOM.nicknameInput.focus();
      return;
    }

    // Threat 3: Client-side XSS / Invalid character prevention (English & Tamil only)
    const validNicknameRegex = /^[a-zA-Z0-9 _\-\u0B80-\u0BFF]{2,30}$/;
    if (!validNicknameRegex.test(trimmed)) {
      DOM.nicknameError.textContent = (currentLang === "ta")
        ? "பெயர் 2 முதல் 30 எழுத்துகள் வரை இருக்க வேண்டும் (சிறப்பு எழுத்துக்கள் அனுமதிக்கப்படவில்லை)."
        : "Nickname must be 2-30 characters (letters, numbers, spaces only; no special characters).";
      DOM.nicknameInput.classList.add("input-error");
      DOM.nicknameInput.focus();
      return;
    }

    DOM.nicknameError.textContent = "";
    DOM.nicknameInput.classList.remove("input-error");
    startQuiz(trimmed);
  }

  DOM.form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleStartQuiz();
  });

  if (DOM.startBtn) {
    DOM.startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleStartQuiz();
    });
  }

  DOM.nicknameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleStartQuiz();
    }
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

  // Fullscreen Toggle Button in HUD
  if (DOM.fullscreenToggleBtn) {
    DOM.fullscreenToggleBtn.addEventListener("click", toggleFullScreenMode);
  }

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

  // Threat 1 & Anti-Cheating: Window blur / tab switch detection during active quiz
  window.addEventListener("blur", () => {
    if (DOM.screens.quiz && DOM.screens.quiz.classList.contains("active") && !gameState.isAnswerSubmitted) {
      // User switched away to inspect DevTools or search answers
      if (DOM.feedbackPanel && DOM.feedbackPanel.classList.contains("hidden")) {
        console.warn("Anti-cheat warning: focus lost during active question.");
      }
    }
  });

  // Result Actions
  DOM.shareCardBtn.addEventListener("click", shareResultCard);
  DOM.downloadCardBtn.addEventListener("click", exportCardAsImage);

  DOM.backHomeBtn.addEventListener("click", () => {
    if (!gameState.hasSharedResultCard) {
      alert("⚠️ Please share or download your result card before returning home.");
      return;
    }
    displayWelcomeBestScore();
    showScreen("welcome");
  });

  DOM.playAgainBtn.addEventListener("click", () => {
    if (!gameState.hasSharedResultCard) {
      alert("⚠️ Please share or download your result card before playing again.");
      return;
    }
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
    if (!gameState.hasSharedResultCard) {
      alert("⚠️ Please share or download your result card before returning home.");
      showScreen("results");
      return;
    }
    displayWelcomeBestScore();
    showScreen("welcome");
  });

  DOM.reviewPlayAgainBtn.addEventListener("click", () => {
    if (!gameState.hasSharedResultCard) {
      alert("⚠️ Please share or download your result card before playing again.");
      showScreen("results");
      return;
    }
    if (gameState.playerName) {
      startQuiz(gameState.playerName);
    } else {
      showScreen("welcome");
    }
  });

  // ==========================================
  // PHASE 2: ADMIN PORTAL & QUIZ BUILDER LISTENERS
  // ==========================================
  initAdminModule();
  checkForSharedQuizInUrl();
});

// ==========================================
// 12. PHASE 2: ADMIN, BUILDER & SHARE MODULE
// ==========================================
const AdminModule = {
  currentEditingQuizId: null,

  // Demo Login Session Check
  isAdminLoggedIn() {
    try {
      return sessionStorage.getItem(CONFIG.STORAGE_KEY_ADMIN_SESSION) === "true";
    } catch (e) {
      return false;
    }
  },

  setAdminLoggedIn(val) {
    try {
      if (val) {
        sessionStorage.setItem(CONFIG.STORAGE_KEY_ADMIN_SESSION, "true");
      } else {
        sessionStorage.removeItem(CONFIG.STORAGE_KEY_ADMIN_SESSION);
      }
    } catch (e) {}
  },

  // LocalStorage Custom Quizzes CRUD
  getSavedQuizzes() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY_CUSTOM_QUIZZES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Error reading custom quizzes from localStorage:", e);
      return [];
    }
  },

  saveQuizzes(quizzes) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY_CUSTOM_QUIZZES, JSON.stringify(quizzes));
      return true;
    } catch (e) {
      alert("Failed to save quiz to browser localStorage: " + e.message);
      return false;
    }
  },

  getQuizById(id) {
    return this.getSavedQuizzes().find(q => q.id === id) || null;
  },

  saveQuiz(quizData) {
    const list = this.getSavedQuizzes();
    const existingIndex = list.findIndex(q => q.id === quizData.id);
    quizData.updatedAt = new Date().toISOString();
    if (existingIndex >= 0) {
      list[existingIndex] = quizData;
    } else {
      quizData.createdAt = new Date().toISOString();
      list.unshift(quizData);
    }
    this.saveQuizzes(list);
    this.renderAdminDashboard();
  },

  deleteQuiz(id) {
    if (!confirm("Are you sure you want to delete this custom quiz? This action cannot be undone.")) return;
    let list = this.getSavedQuizzes();
    list = list.filter(q => q.id !== id);
    this.saveQuizzes(list);
    this.renderAdminDashboard();
  },

  renderAdminDashboard() {
    const quizzes = this.getSavedQuizzes();
    DOM.adminQuizCount.textContent = quizzes.length;

    if (quizzes.length === 0) {
      DOM.adminQuizList.innerHTML = `
        <div class="admin-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">📖</div>
          <h4>No Custom Quizzes Created Yet</h4>
          <p>Create your first custom Bible quiz or import a previously exported JSON file to get started.</p>
          <button type="button" class="btn btn-primary" onclick="AdminModule.openEditorForNew()" style="margin-top: 14px;">
            ➕ Create First Quiz
          </button>
        </div>
      `;
      return;
    }

    DOM.adminQuizList.innerHTML = quizzes.map(q => {
      const isPub = q.published;
      const statusClass = isPub ? "status-published" : "status-draft";
      const statusLabel = isPub ? "Published" : "Draft";
      const qCount = (q.questions || []).length;
      const timeLimit = q.timeLimit || 10;
      const diff = q.difficulty || "Medium";
      const safeTitle = escapeHtml(q.title || "Untitled Quiz");
      const safeDesc = escapeHtml(q.description || "No description provided.");

      return `
        <div class="admin-quiz-card" data-quiz-id="${q.id}">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="quiz-card-status-badge ${statusClass}">${statusLabel}</span>
              <span style="font-size: 0.76rem; color: #94a3b8;">${new Date(q.updatedAt || q.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 class="quiz-card-title">${safeTitle}</h4>
            <p class="quiz-card-desc">${safeDesc}</p>
            <div class="quiz-card-meta">
              <span>📝 ${qCount} Questions</span>
              <span>⏳ ${timeLimit}s/Q</span>
              <span>⚡ ${diff}</span>
            </div>
          </div>
          <div class="quiz-card-actions">
            <button type="button" class="btn btn-primary btn-sm" onclick="AdminModule.generateAndShowShareLink('${q.id}')" title="Generate Shareable Link">
              🔗 Share Link
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="AdminModule.openEditorForEdit('${q.id}')" title="Edit Quiz">
              ✏️ Edit
            </button>
            <button type="button" class="btn btn-outline btn-sm" onclick="AdminModule.previewQuiz('${q.id}')" title="Preview & Play">
              ▶️ Play
            </button>
            <button type="button" class="btn btn-outline btn-sm" onclick="AdminModule.exportQuizAsJson('${q.id}')" title="Export as JSON file">
              💾 Export JSON
            </button>
            <button type="button" class="btn-icon-danger" onclick="AdminModule.deleteQuiz('${q.id}')" title="Delete Quiz">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  // Open Quiz Editor for New Quiz
  openEditorForNew() {
    this.currentEditingQuizId = null;
    DOM.editorModeBadge.textContent = "✏️ Create New Quiz";
    DOM.editorPageTitle.textContent = "Create Custom Bible Quiz";
    DOM.editorQuizId.value = "";
    DOM.editorQuizTitle.value = "";
    DOM.editorQuizDesc.value = "";
    DOM.editorQuizDifficulty.value = "Medium";
    DOM.editorQuizTime.value = "10";
    DOM.editorQuestionsList.innerHTML = "";

    // Add 3 starter question items for convenience
    this.addQuestionToEditor();
    this.addQuestionToEditor();
    this.addQuestionToEditor();

    showScreen("editor");
  },

  // Open Quiz Editor for Existing Quiz
  openEditorForEdit(quizId) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      alert("Quiz not found.");
      return;
    }
    this.currentEditingQuizId = quiz.id;
    DOM.editorModeBadge.textContent = "✏️ Edit Quiz";
    DOM.editorPageTitle.textContent = `Edit "${quiz.title}"`;
    DOM.editorQuizId.value = quiz.id;
    DOM.editorQuizTitle.value = quiz.title || "";
    DOM.editorQuizDesc.value = quiz.description || "";
    DOM.editorQuizDifficulty.value = quiz.difficulty || "Medium";
    DOM.editorQuizTime.value = String(quiz.timeLimit || 10);
    DOM.editorQuestionsList.innerHTML = "";

    (quiz.questions || []).forEach(q => {
      this.addQuestionToEditor(q);
    });

    if (!quiz.questions || quiz.questions.length === 0) {
      this.addQuestionToEditor();
    }

    showScreen("editor");
  },

  addQuestionToEditor(initialData = null) {
    const container = DOM.editorQuestionsList;
    const qIndex = container.children.length;
    const qNumber = qIndex + 1;

    const qCard = document.createElement("div");
    qCard.className = "editor-q-card";
    qCard.dataset.index = qIndex;

    const initialQText = initialData ? escapeHtml(initialData.question || "") : "";
    const initialChoices = (initialData && Array.isArray(initialData.choices)) 
      ? initialData.choices 
      : ["", "", "", ""];
    const initialCorrectIndex = (initialData && typeof initialData.correctIndex === "number") 
      ? initialData.correctIndex 
      : 0;
    const initialRef = initialData ? escapeHtml(initialData.reference || "") : "";

    const choiceRowsHtml = [0, 1, 2, 3].map(cIdx => {
      const choiceLabel = String.fromCharCode(65 + cIdx); // A, B, C, D
      const choiceVal = escapeHtml(initialChoices[cIdx] || "");
      const isChecked = (cIdx === initialCorrectIndex) ? "checked" : "";
      const rowClass = (cIdx === initialCorrectIndex) ? "choice-input-row is-correct-choice" : "choice-input-row";

      return `
        <div class="${rowClass}" data-choice-row="${cIdx}">
          <label class="choice-radio-label">
            <input type="radio" name="correct_q_${qIndex}" value="${cIdx}" ${isChecked} onchange="AdminModule.onCorrectChoiceChange(this)" />
            <span>${choiceLabel}</span>
          </label>
          <input type="text" class="choice-text-input" placeholder="Option ${choiceLabel} text" value="${choiceVal}" required />
        </div>
      `;
    }).join("");

    qCard.innerHTML = `
      <div class="editor-q-card-header">
        <span class="editor-q-number">Question #${qNumber}</span>
        <div class="editor-q-actions">
          <button type="button" class="btn-icon-danger" onclick="AdminModule.removeQuestionCard(this)" title="Delete this question">
            ✕ Remove
          </button>
        </div>
      </div>

      <div class="input-group" style="margin-bottom: 10px;">
        <input type="text" class="editor-q-text" placeholder="Enter Bible question text (e.g. In which city was Jesus born?)" value="${initialQText}" required />
      </div>

      <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; margin-top: 8px;">
        Choices (Select the radio button next to the CORRECT answer):
      </div>

      <div class="editor-choices-grid">
        ${choiceRowsHtml}
      </div>

      <div class="editor-q-ref-row">
        <label>Scripture Reference:</label>
        <input type="text" class="editor-q-ref" placeholder="e.g. Luke 2:4 or Genesis 1:1" value="${initialRef}" />
      </div>
    `;

    container.appendChild(qCard);
    this.updateEditorQuestionNumbers();
  },

  onCorrectChoiceChange(radio) {
    const card = radio.closest(".editor-q-card");
    if (!card) return;
    const choiceRows = card.querySelectorAll(".choice-input-row");
    choiceRows.forEach(row => {
      const r = row.querySelector('input[type="radio"]');
      if (r && r.checked) {
        row.classList.add("is-correct-choice");
      } else {
        row.classList.remove("is-correct-choice");
      }
    });
  },

  removeQuestionCard(btn) {
    const card = btn.closest(".editor-q-card");
    const container = DOM.editorQuestionsList;
    if (container.children.length <= 1) {
      alert("A quiz must have at least one question.");
      return;
    }
    if (card) {
      card.remove();
      this.updateEditorQuestionNumbers();
    }
  },

  updateEditorQuestionNumbers() {
    const cards = DOM.editorQuestionsList.querySelectorAll(".editor-q-card");
    cards.forEach((card, idx) => {
      card.dataset.index = idx;
      const numSpan = card.querySelector(".editor-q-number");
      if (numSpan) numSpan.textContent = `Question #${idx + 1}`;
      // Rename radio buttons to avoid conflict
      const radios = card.querySelectorAll('input[type="radio"]');
      radios.forEach(r => {
        r.name = `correct_q_${idx}`;
      });
    });
    DOM.editorQuestionsCount.textContent = cards.length;
  },

  collectEditorData(isPublishing) {
    const title = DOM.editorQuizTitle.value.trim();
    if (!title) {
      alert("Please provide a Quiz Title.");
      DOM.editorQuizTitle.focus();
      return null;
    }

    const cards = DOM.editorQuestionsList.querySelectorAll(".editor-q-card");
    if (cards.length === 0) {
      alert("Please add at least one question.");
      return null;
    }

    const questions = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const qText = card.querySelector(".editor-q-text").value.trim();
      if (!qText) {
        alert(`Question #${i + 1} has empty question text.`);
        card.querySelector(".editor-q-text").focus();
        return null;
      }

      const choiceInputs = card.querySelectorAll(".choice-text-input");
      const choices = [];
      for (let j = 0; j < choiceInputs.length; j++) {
        const val = choiceInputs[j].value.trim();
        if (!val) {
          alert(`Question #${i + 1}, Option ${String.fromCharCode(65 + j)} is empty.`);
          choiceInputs[j].focus();
          return null;
        }
        choices.push(val);
      }

      const checkedRadio = card.querySelector('input[type="radio"]:checked');
      const correctIndex = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
      const refInput = card.querySelector(".editor-q-ref");
      const refText = refInput ? refInput.value.trim() : "";

      questions.push({
        id: i + 1,
        question: qText,
        choices: choices,
        correctIndex: correctIndex,
        correctAnswer: choices[correctIndex],
        reference: refText || "Bible Reference"
      });
    }

    const quizId = DOM.editorQuizId.value || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const difficulty = DOM.editorQuizDifficulty.value;
    const timeLimit = parseInt(DOM.editorQuizTime.value, 10) || 10;
    const desc = DOM.editorQuizDesc.value.trim();

    return {
      v: 1,
      id: quizId,
      title: title,
      description: desc,
      difficulty: difficulty,
      timeLimit: timeLimit,
      published: Boolean(isPublishing),
      questions: questions
    };
  },

  saveCurrentEditor(isPublishing) {
    const data = this.collectEditorData(isPublishing);
    if (!data) return;
    this.saveQuiz(data);
    alert(isPublishing ? "🎉 Quiz published successfully!" : "💾 Quiz draft saved!");
    showScreen("admin");
  },

  // Export a quiz as a JSON file
  exportQuizAsJson(quizId) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      alert("Quiz not found for export.");
      return;
    }
    // Clean export data without administrative secrets
    const exportData = {
      v: 1,
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions
    };

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    const cleanFileName = (quiz.title || "quiz").replace(/[^a-zA-Z0-9_-]/g, "_");
    downloadAnchor.setAttribute("download", `${cleanFileName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import a previously exported JSON file
  handleImportJson(file, autoPlay = false) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const validation = validateQuizData(parsed);
        if (!validation.valid) {
          alert("Import failed: " + validation.error);
          return;
        }

        // Generate fresh unique ID so it does not collide unexpectedly
        parsed.id = parsed.id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        parsed.published = true;
        this.saveQuiz(parsed);

        const quizTitle = getLocalizedQuizProp(parsed, "title", currentLang) || "Imported Quiz";
        const questionsList = getLocalizedQuizQuestions(parsed, currentLang);
        alert(`✅ Quiz "${quizTitle}" imported successfully with ${questionsList.length} questions!`);

        if (autoPlay) {
          loadCustomQuizIntoGame(parsed);
        } else if (DOM.screens.admin.classList.contains("active")) {
          this.renderAdminDashboard();
        } else {
          loadCustomQuizIntoGame(parsed);
        }
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  },

  // Populate editor form fields directly from imported JSON
  populateEditorFromJson(parsed) {
    const title = getLocalizedQuizProp(parsed, "title", currentLang) || "";
    const desc = getLocalizedQuizProp(parsed, "description", currentLang) || "";
    const diff = getLocalizedQuizProp(parsed, "difficulty", currentLang) || "Medium";
    const time = String(parsed.timeLimit || 10);
    const questions = getLocalizedQuizQuestions(parsed, currentLang);

    DOM.editorQuizTitle.value = title;
    DOM.editorQuizDesc.value = desc;
    DOM.editorQuizDifficulty.value = diff;
    DOM.editorQuizTime.value = time;
    DOM.editorQuestionsList.innerHTML = "";

    questions.forEach(rawQ => {
      const resolved = resolveBilingualQuestion(rawQ, currentLang);
      this.addQuestionToEditor({
        question: resolved.text,
        choices: resolved.choices,
        correctIndex: resolved.correctIndex,
        reference: resolved.reference
      });
    });

    if (questions.length === 0) {
      this.addQuestionToEditor();
    }

    alert(`✅ Loaded ${questions.length} questions directly into the editor! You can now edit, save, or publish.`);
  },

  // Generate & Show Share Link
  generateAndShowShareLink(quizId) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      alert("Quiz not found.");
      return;
    }

    // Prepare shareable payload (strip private admin metadata)
    const payload = {
      v: 2,
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        correctIndex: q.correctIndex,
        reference: q.reference,
        type: q.type || null,
        timeLimit: q.timeLimit || null,
        en: q.en || (q.rawBilingual && q.rawBilingual.en) || null,
        ta: q.ta || (q.rawBilingual && q.rawBilingual.ta) || null,
        rawBilingual: q.rawBilingual || null
      }))
    };

    const encoded = encodeQuizForUrl(payload);
    // Base URL pointing to GitHub Pages location
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?quiz=${encoded}`;

    DOM.shareUrlInput.value = shareUrl;
    DOM.shareUrlCharCount.textContent = shareUrl.length;

    // Show warning if excessively long (> 2000 chars)
    if (shareUrl.length > 2000) {
      DOM.shareUrlWarning.classList.remove("hidden");
    } else {
      DOM.shareUrlWarning.classList.add("hidden");
    }

    DOM.downloadQuizJsonBtn.onclick = () => {
      this.exportQuizAsJson(quiz.id);
    };

    DOM.testQuizLinkBtn.onclick = () => {
      DOM.shareLinkModal.classList.add("hidden");
      loadCustomQuizIntoGame(payload);
    };

    DOM.shareLinkModal.classList.remove("hidden");
  },

  previewQuiz(quizId) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return;
    loadCustomQuizIntoGame(quiz);
  }
};

// ==========================================
// 13. URL ENCODING & DECODING UTILITIES
// ==========================================
function encodeQuizForUrl(quizObj) {
  try {
    if (typeof compressQuizPayload === "function") {
      return compressQuizPayload(quizObj);
    }
    const jsonStr = JSON.stringify(quizObj);
    const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
    return encodeURIComponent(btoa(utf8Bytes));
  } catch (err) {
    console.error("URL encoding error:", err);
    return "";
  }
}

function decodeQuizFromUrl(encodedStr) {
  try {
    if (typeof decompressQuizPayload === "function") {
      const decomp = decompressQuizPayload(encodedStr);
      if (decomp) return decomp;
    }
    const base64 = decodeURIComponent(encodedStr);
    const decodedBytes = atob(base64);
    const jsonStr = decodeURIComponent(Array.prototype.map.call(decodedBytes, (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("URL decoding error:", err);
    return null;
  }
}

function validateQuizData(data) {
  if (!data) {
    return { valid: false, error: "Quiz data is missing." };
  }

  // Support raw array of questions directly
  if (Array.isArray(data)) {
    if (data.length === 0) return { valid: false, error: "Questions array is empty." };
    return { valid: true };
  }

  if (typeof data !== "object") {
    return { valid: false, error: "Quiz data is not an object or array." };
  }

  // Bilingual wrapper support: { en: {...}, ta: {...} }
  if (data.en && (data.en.questions || data.en.difficultyLevels)) {
    const enVal = validateQuizData(data.en);
    if (!enVal.valid) return { valid: false, error: "English quiz invalid: " + enVal.error };
    if (data.ta && (data.ta.questions || data.ta.difficultyLevels)) {
      const taVal = validateQuizData(data.ta);
      if (!taVal.valid) return { valid: false, error: "Tamil quiz invalid: " + taVal.error };
    }
    return { valid: true, isBilingualContainer: true };
  }

  // Handle difficultyLevels format { difficultyLevels: [ { level: '...', questions: [...] } ] }
  if (Array.isArray(data.difficultyLevels)) {
    let count = 0;
    data.difficultyLevels.forEach(d => { if (Array.isArray(d.questions)) count += d.questions.length; });
    if (count === 0) return { valid: false, error: "No questions found inside difficulty levels." };
    return { valid: true };
  }

  // Title validation: string or bilingual object { en: "...", ta: "..." }
  const hasValidTitle = (typeof data.title === "string" && data.title.trim().length > 0) ||
    (typeof data.title_en === "string") ||
    (data.title && typeof data.title === "object" && (data.title.en || data.title.ta));

  if (!hasValidTitle) {
    return { valid: false, error: "Quiz title is missing." };
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    return { valid: false, error: "Quiz contains no valid questions." };
  }

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    
    // Check question text (string, or { en, ta }, or question_en / question_ta, questionText)
    const hasQText = (typeof q.question === "string" && q.question.trim().length > 0) ||
      (typeof q.questionText === "string" && q.questionText.trim().length > 0) ||
      (q.question && typeof q.question === "object" && (q.question.en || q.question.ta)) ||
      (typeof q.question_en === "string") || (typeof q.question_ta === "string");

    if (!hasQText) {
      return { valid: false, error: `Question #${i + 1} has invalid text.` };
    }

    // Check choices
    let choicesArray = q.choices || q.options;
    if (!Array.isArray(choicesArray) && choicesArray && typeof choicesArray === "object") {
      choicesArray = choicesArray.en || choicesArray.ta || Object.values(choicesArray);
    }
    if (!Array.isArray(choicesArray) && Array.isArray(q.choices_en)) {
      choicesArray = q.choices_en;
    }

    if (!Array.isArray(choicesArray) || choicesArray.length < 2) {
      return { valid: false, error: `Question #${i + 1} must have at least 2 choices.` };
    }
  }

  return { valid: true };
}

function checkForSharedQuizInUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizParam = urlParams.get("quiz");

  // Threat 4 Mitigation: Enforce URL query length limits to prevent DoS/payload injection
  if (quizParam && quizParam.length > 8000) {
    alert("⚠️ Quiz link is excessively long and cannot be safely parsed. Please use JSON file import instead.");
    showScreen("unauthorized");
    return;
  }

  if (!quizParam) {
    // Also check hash fallback e.g. #quiz=...
    const hash = window.location.hash;
    if (hash && hash.includes("quiz=")) {
      const match = hash.match(/quiz=([^&]+)/);
      if (match && match[1]) {
        if (match[1].length > 8000) {
          alert("⚠️ Quiz link is excessively long and cannot be safely parsed.");
          showScreen("unauthorized");
          return;
        }
        handleEncodedQuizParam(match[1]);
        return;
      }
    }
    // If no quiz parameter in URL, check if an active shared quiz is saved in localStorage
    try {
      const activeShared = localStorage.getItem("BIBLE_QUIZ_ACTIVE_SHARED_QUIZ");
      if (activeShared) {
        const parsed = JSON.parse(activeShared);
        const validation = validateQuizData(parsed);
        if (validation && validation.valid) {
          loadCustomQuizIntoGame(parsed);
          return;
        }
      }
    } catch (e) {}

    // Check custom quizzes collection as second fallback
    try {
      const storedQuizzes = localStorage.getItem(CONFIG.STORAGE_KEY_CUSTOM_QUIZZES);
      if (storedQuizzes) {
        const list = JSON.parse(storedQuizzes);
        if (Array.isArray(list) && list.length > 0) {
          const published = list.find(q => q.published) || list[list.length - 1];
          if (published && published.questions && published.questions.length > 0) {
            loadCustomQuizIntoGame(published);
            return;
          }
        }
      }
    } catch (e) {}

    // No quiz parameter and no local custom quiz: load standard default 15-question quiz directly
    revertToDefaultQuiz();
    return;
  }

  handleEncodedQuizParam(quizParam);
}

function handleEncodedQuizParam(encodedStr) {
  const decoded = decodeQuizFromUrl(encodedStr);
  if (!decoded) {
    alert("⚠️ Could not load the shared quiz link. The link may be incomplete or corrupted. Loading default Bible Quiz instead.");
    revertToDefaultQuiz();
    return;
  }

  const validation = validateQuizData(decoded);
  if (!validation.valid) {
    alert("⚠️ Invalid quiz link: " + validation.error + ". Loading default Bible Quiz instead.");
    revertToDefaultQuiz();
    return;
  }

  loadCustomQuizIntoGame(decoded);
}

function getLocalizedQuizProp(quizData, prop, lang = currentLang) {
  if (!quizData) return "";
  const altLang = (lang === "ta") ? "en" : "ta";

  // Check bilingual container { en: {...}, ta: {...} }
  if (quizData[lang] && quizData[lang][prop]) {
    return quizData[lang][prop];
  }
  if (quizData[altLang] && quizData[altLang][prop]) {
    return quizData[altLang][prop];
  }

  // Check object property e.g. quizData.title = { en: "...", ta: "..." }
  if (quizData[prop] && typeof quizData[prop] === "object") {
    if (quizData[prop][lang]) return quizData[prop][lang];
    if (quizData[prop][altLang]) return quizData[prop][altLang];
  }

  // Check suffix e.g. quizData.title_en or quizData.title_ta
  const specificKey = `${prop}_${lang}`;
  if (quizData[specificKey]) return quizData[specificKey];
  const altKey = `${prop}_${altLang}`;
  if (quizData[altKey]) return quizData[altKey];

  // Fallback to direct property
  return quizData[prop] || "";
}

function resolveBilingualQuestion(q, lang = currentLang) {
  if (!q) return { text: "", choices: [], correctIndex: 0, correctAnswer: "", reference: "" };
  const altLang = (lang === "ta") ? "en" : "ta";

  // Check language sub-object e.g. q.en / q.ta or q.rawBilingual.en / q.rawBilingual.ta
  const langObj = q[lang] || (q.rawBilingual && q.rawBilingual[lang]);
  const altObj = q[altLang] || (q.rawBilingual && q.rawBilingual[altLang]);

  // Pick active sub-object: use preferred lang if it has question text/choices, else fallback to alt lang
  const activeSub = (langObj && (langObj.question || (Array.isArray(langObj.options) && langObj.options.length) || (Array.isArray(langObj.choices) && langObj.choices.length)))
    ? langObj
    : ((altObj && (altObj.question || (Array.isArray(altObj.options) && altObj.options.length) || (Array.isArray(altObj.choices) && altObj.choices.length))) ? altObj : null);

  // 1. Resolve Question Text
  let text = "";
  if (activeSub && (activeSub.question || activeSub.question_text || activeSub.title)) {
    text = activeSub.question || activeSub.question_text || activeSub.title;
  } else if (q.question && typeof q.question === "object") {
    text = q.question[lang] || q.question[altLang] || "";
  } else if (lang === "ta" && (q.question_ta || q.tamil_question)) {
    text = q.question_ta || q.tamil_question;
  } else if (lang === "en" && (q.question_en || q.english_question)) {
    text = q.question_en || q.english_question;
  } else {
    text = q.question || q.question_en || q.question_ta || "";
  }

  // 2. Resolve Choices Array
  let choices = [];
  if (activeSub && (activeSub.options || activeSub.choices || activeSub.answers)) {
    const rawOpts = activeSub.options || activeSub.choices || activeSub.answers;
    if (Array.isArray(rawOpts)) choices = rawOpts.map(c => String(c ?? "").trim());
  } else if (q.choices && typeof q.choices === "object" && !Array.isArray(q.choices)) {
    choices = q.choices[lang] || q.choices[altLang] || [];
  } else if (lang === "ta" && (Array.isArray(q.choices_ta) || Array.isArray(q.tamil_choices))) {
    choices = q.choices_ta || q.tamil_choices;
  } else if (lang === "en" && (Array.isArray(q.choices_en) || Array.isArray(q.english_choices))) {
    choices = q.choices_en || q.english_choices;
  } else if (Array.isArray(q.choices)) {
    choices = q.choices;
  }

  // Fallback choices if choices is empty but top-level has choices
  if (choices.length === 0 && Array.isArray(q.choices)) {
    choices = q.choices;
  } else if (choices.length === 0 && Array.isArray(q.options)) {
    choices = q.options;
  }

  // 3. Resolve Reference
  let ref = (lang === "ta") ? "வேதாகம ஆதாரம்" : "Bible Scripture";
  if (activeSub && (activeSub.reference || activeSub.verse || activeSub.scripture)) {
    ref = activeSub.reference || activeSub.verse || activeSub.scripture;
  } else if (q.reference && typeof q.reference === "object") {
    ref = q.reference[lang] || q.reference[altLang] || ref;
  } else if (lang === "ta" && (q.reference_ta || q.tamil_reference)) {
    ref = q.reference_ta || q.tamil_reference;
  } else if (q.reference) {
    ref = q.reference;
  }

  // 4. Resolve Correct Index & Answer
  const correctIndex = (typeof q.correctIndex === "number") ? q.correctIndex : 0;
  const correctAnswer = choices[correctIndex] || q.correctAnswer || choices[0] || "";

  return {
    text,
    choices,
    correctIndex,
    correctAnswer,
    reference: ref
  };
}

function getLocalizedQuizQuestions(quizData, lang = currentLang) {
  if (!quizData) return [];
  const altLang = (lang === "ta") ? "en" : "ta";

  let rawQuestions = [];
  if (Array.isArray(quizData)) {
    rawQuestions = quizData;
  } else if (quizData[lang] && Array.isArray(quizData[lang].questions)) {
    rawQuestions = quizData[lang].questions;
  } else if (Array.isArray(quizData.questions)) {
    rawQuestions = quizData.questions;
  } else if (quizData[altLang] && Array.isArray(quizData[altLang].questions)) {
    rawQuestions = quizData[altLang].questions;
  } else if (quizData[lang] && Array.isArray(quizData[lang].difficultyLevels)) {
    quizData[lang].difficultyLevels.forEach(lvl => {
      if (Array.isArray(lvl.questions)) rawQuestions.push(...lvl.questions);
    });
  } else if (Array.isArray(quizData.difficultyLevels)) {
    quizData.difficultyLevels.forEach(lvl => {
      if (Array.isArray(lvl.questions)) rawQuestions.push(...lvl.questions);
    });
  } else if (quizData[altLang] && Array.isArray(quizData[altLang].difficultyLevels)) {
    quizData[altLang].difficultyLevels.forEach(lvl => {
      if (Array.isArray(lvl.questions)) rawQuestions.push(...lvl.questions);
    });
  }

  return rawQuestions;
}

function loadCustomQuizIntoGame(quizData) {
  gameState.activeCustomQuiz = quizData;

  const title = getLocalizedQuizProp(quizData, "title", currentLang);
  const desc = getLocalizedQuizProp(quizData, "description", currentLang) || 
    (currentLang === "ta" ? "ஒருங்கிணைப்பாளரால் உருவாக்கப்பட்ட வேதாகம வினாடி வினா." : "Custom Bible Quiz challenge created by quiz organizer.");
  const questions = getLocalizedQuizQuestions(quizData, currentLang);
  const timeLimit = quizData.timeLimit || (quizData[currentLang] && quizData[currentLang].timeLimit) || 10;
  const difficulty = getLocalizedQuizProp(quizData, "difficulty", currentLang) || "Custom";

  // Show customized banner on welcome screen
  DOM.sharedQuizBanner.classList.remove("hidden");
  DOM.sharedQuizTitle.textContent = title;
  DOM.sharedQuizDesc.textContent = desc;
  DOM.sharedQuizQCount.textContent = `${questions.length} Questions`;
  DOM.sharedQuizTime.textContent = `${timeLimit}s/Q`;
  DOM.sharedQuizDifficulty.textContent = difficulty;

  DOM.valPillCategory.textContent = title;
  DOM.valPillLevels.textContent = difficulty;
  DOM.valPillQuestions.textContent = questions.length;
  DOM.valPillTime.textContent = `${timeLimit}s/Q`;
  const maxPts = questions.length * 1000;
  DOM.valPillScore.textContent = `${maxPts.toLocaleString()} pts`;

  showScreen("welcome");
}

function revertToDefaultQuiz() {
  gameState.activeCustomQuiz = null;
  const dict = QUIZ_DATA[currentLang];

  // Hide custom quiz banner and restore default 15-question info
  if (DOM.sharedQuizBanner) DOM.sharedQuizBanner.classList.add("hidden");
  if (DOM.valPillCategory) DOM.valPillCategory.textContent = dict.categoryName;
  if (DOM.valPillLevels) DOM.valPillLevels.textContent = dict.levelsName;
  if (DOM.valPillQuestions) DOM.valPillQuestions.textContent = "30";
  if (DOM.valPillTime) DOM.valPillTime.textContent = "30s/Q";
  if (DOM.valPillScore) DOM.valPillScore.textContent = "30,000 pts";

  showScreen("welcome");

  // Clear quiz param from URL without refreshing
  if (window.history.replaceState) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 14. ADMIN MODULE INITIALIZATION
// ==========================================
function initAdminModule() {
  // Topbar Admin Button Trigger
  if (DOM.adminPortalBtn) {
    DOM.adminPortalBtn.addEventListener("click", (e) => {
      // If clicked, redirect to dedicated login or admin page
      e.preventDefault();
      if (AdminModule.isAdminLoggedIn()) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }

  // Admin Login Modal Handlers
  if (DOM.closeLoginModalBtn) {
    DOM.closeLoginModalBtn.addEventListener("click", () => {
      if (DOM.adminLoginModal) DOM.adminLoginModal.classList.add("hidden");
    });
  }

  if (DOM.cancelLoginBtn) {
    DOM.cancelLoginBtn.addEventListener("click", () => {
      if (DOM.adminLoginModal) DOM.adminLoginModal.classList.add("hidden");
    });
  }

  if (DOM.adminLoginForm) {
    DOM.adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = DOM.adminUserInput.value.trim();
      const pass = DOM.adminPassInput.value.trim();

      if (user === ADMIN_DEMO_CREDENTIALS.user && pass === ADMIN_DEMO_CREDENTIALS.pass) {
        AdminModule.setAdminLoggedIn(true);
        if (DOM.adminLoginModal) DOM.adminLoginModal.classList.add("hidden");
        window.location.href = "admin.html";
      } else {
        if (DOM.adminLoginError) DOM.adminLoginError.textContent = "Invalid username or password.";
      }
    });
  }

  // Admin Dashboard Actions
  DOM.adminCreateQuizBtn.addEventListener("click", () => {
    AdminModule.openEditorForNew();
  });

  // Smart JSON Import Modal Logic (Dual: File Upload & ChatGPT Paste)
  let importTargetContext = "admin"; // "admin" | "editor"

  const openSmartImportModal = (context) => {
    importTargetContext = context;
    if (DOM.importJsonTextarea) DOM.importJsonTextarea.value = "";
    if (DOM.importJsonError) DOM.importJsonError.textContent = "";
    if (DOM.modalFileInput) DOM.modalFileInput.value = "";
    if (DOM.smartImportModal) {
      DOM.smartImportModal.classList.remove("hidden");
      if (DOM.importJsonTextarea) DOM.importJsonTextarea.focus();
    }
  };

  const closeSmartImportModal = () => {
    if (DOM.smartImportModal) DOM.smartImportModal.classList.add("hidden");
    if (DOM.importJsonError) DOM.importJsonError.textContent = "";
  };

  if (DOM.adminImportJsonBtn) {
    DOM.adminImportJsonBtn.addEventListener("click", () => {
      openSmartImportModal("admin");
    });
  }

  if (DOM.editorImportJsonBtn) {
    DOM.editorImportJsonBtn.addEventListener("click", () => {
      openSmartImportModal("editor");
    });
  }

  if (DOM.closeImportModalBtn) {
    DOM.closeImportModalBtn.addEventListener("click", closeSmartImportModal);
  }

  if (DOM.cancelImportModalBtn) {
    DOM.cancelImportModalBtn.addEventListener("click", closeSmartImportModal);
  }

  // Upload file inside modal
  if (DOM.modalUploadFileBtn && DOM.modalFileInput) {
    DOM.modalUploadFileBtn.addEventListener("click", () => {
      DOM.modalFileInput.click();
    });

    DOM.modalFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (DOM.importJsonTextarea) {
            DOM.importJsonTextarea.value = evt.target.result;
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Process & Parse JSON button
  if (DOM.processImportBtn) {
    DOM.processImportBtn.addEventListener("click", () => {
      const text = DOM.importJsonTextarea ? DOM.importJsonTextarea.value.trim() : "";
      if (!text) {
        if (DOM.importJsonError) DOM.importJsonError.textContent = "Please paste JSON code or upload a file first.";
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        if (DOM.importJsonError) DOM.importJsonError.textContent = "JSON Syntax Error: " + err.message;
        return;
      }

      const val = validateQuizData(parsed);
      if (!val.valid) {
        if (DOM.importJsonError) DOM.importJsonError.textContent = "Validation Error: " + val.error;
        return;
      }

      closeSmartImportModal();

      if (importTargetContext === "editor") {
        AdminModule.populateEditorFromJson(parsed);
      } else {
        // Saved as a quiz in custom quizzes list
        const quizObj = {
          id: (parsed.id && typeof parsed.id === "string") ? parsed.id : "quiz-" + Date.now(),
          title: getLocalizedQuizProp(parsed, "title", "en") || "Imported Quiz",
          description: getLocalizedQuizProp(parsed, "description", "en") || "Imported JSON Quiz",
          difficulty: getLocalizedQuizProp(parsed, "difficulty", "en") || "Medium",
          timeLimit: parsed.timeLimit || 10,
          status: "published",
          createdAt: new Date().toISOString(),
          questions: getLocalizedQuizQuestions(parsed, "en"),
          rawBilingual: parsed
        };
        AdminModule.saveQuiz(quizObj);
        AdminModule.renderAdminDashboard();
        alert(`✅ Quiz "${quizObj.title}" successfully imported and published!`);
      }
    });
  }

  // Fallback direct file input in admin (if used)
  if (DOM.adminImportFileInput) {
    DOM.adminImportFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        AdminModule.handleImportJson(e.target.files[0]);
      }
    });
  }

  DOM.adminLogoutBtn.addEventListener("click", () => {
    AdminModule.setAdminLoggedIn(false);
    if (gameState.activeCustomQuiz) {
      showScreen("welcome");
    } else {
      revertToDefaultQuiz();
    }
  });

  DOM.adminExitHomeBtn.addEventListener("click", () => {
    if (gameState.activeCustomQuiz) {
      showScreen("welcome");
    } else {
      revertToDefaultQuiz();
    }
  });

  // Unauthorized Screen Admin Button
  if (DOM.unauthorizedAdminBtn) {
    DOM.unauthorizedAdminBtn.addEventListener("click", () => {
      DOM.adminUserInput.value = "";
      DOM.adminPassInput.value = "";
      DOM.adminLoginError.textContent = "";
      DOM.adminLoginModal.classList.remove("hidden");
      DOM.adminUserInput.focus();
    });
  }

  // Editor Actions
  DOM.editorCancelBtn.addEventListener("click", () => {
    if (confirm("Discard unsaved changes?")) {
      showScreen("admin");
    }
  });

  DOM.editorSaveDraftBtn.addEventListener("click", () => {
    AdminModule.saveCurrentEditor(false);
  });

  DOM.editorPublishBtn.addEventListener("click", () => {
    AdminModule.saveCurrentEditor(true);
  });

  DOM.editorAddQBtn.addEventListener("click", () => {
    AdminModule.addQuestionToEditor();
  });

  DOM.editorAddQBottomBtn.addEventListener("click", () => {
    AdminModule.addQuestionToEditor();
  });

  // Share Modal Handlers
  DOM.closeShareModalBtn.addEventListener("click", () => {
    DOM.shareLinkModal.classList.add("hidden");
  });

  DOM.copyShareUrlBtn.addEventListener("click", () => {
    DOM.shareUrlInput.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(DOM.shareUrlInput.value).then(() => {
        const origText = DOM.copyShareUrlBtn.textContent;
        DOM.copyShareUrlBtn.textContent = "✅ Copied!";
        setTimeout(() => {
          DOM.copyShareUrlBtn.textContent = origText;
        }, 2000);
      }).catch(() => {
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      });
    } else {
      document.execCommand("copy");
      alert("Link copied to clipboard!");
    }
  });

  if (DOM.playDefaultQuizBtn) {
    DOM.playDefaultQuizBtn.addEventListener("click", revertToDefaultQuiz);
  }

  // End of Admin & Editor bindings
}

// ==========================================
// 15. PHASE 2: LIVE LEADERBOARD CLIENT (CLOUDFLARE DO)
// ==========================================
const LeaderboardClient = {
  socket: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 2000,
  currentEventId: "default-event",
  isProjector: false,

  getApiBase() {
    // Check if query param specifies custom backend or default to local/remote
    const urlParams = new URLSearchParams(window.location.search);
    const customApi = urlParams.get("api");
    if (customApi) return customApi;

    // In local dev, use port 8787; in production, use Cloudflare worker route or window.location.origin
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8787";
    }
    return window.location.origin;
  },

  getWsBase() {
    const api = this.getApiBase();
    if (api.startsWith("https://")) {
      return api.replace("https://", "wss://");
    }
    return api.replace("http://", "ws://");
  },

  getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const ev = urlParams.get("event");
    if (ev) return ev;
    if (gameState.activeCustomQuiz && gameState.activeCustomQuiz.id) {
      return `quiz-${gameState.activeCustomQuiz.id}`;
    }
    return "default-event";
  },

  connectWebSocket() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const eventId = this.getEventId();
    this.currentEventId = eventId;
    const wsUrl = `${this.getWsBase()}/ws?event=${encodeURIComponent(eventId)}`;

    try {
      this.updateConnectionStatus("connecting", "Connecting...");
      this.socket = new WebSocket(wsUrl);

      this.socket.addEventListener("open", () => {
        this.reconnectAttempts = 0;
        this.updateConnectionStatus("connected", "Live • Connected");
      });

      this.socket.addEventListener("message", (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "snapshot" || msg.type === "update") {
            this.renderLeaderboard(msg.data);
          }
        } catch (e) {}
      });

      this.socket.addEventListener("close", () => {
        this.updateConnectionStatus("disconnected", "Offline • Reconnecting...");
        this.scheduleReconnect();
      });

      this.socket.addEventListener("error", () => {
        this.updateConnectionStatus("disconnected", "Connection Error");
      });
    } catch (err) {
      this.updateConnectionStatus("disconnected", "Offline");
    }
  },

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      setTimeout(() => {
        this.connectWebSocket();
      }, delay);
    }
  },

  updateConnectionStatus(status, label) {
    if (!DOM.lbStatusDot || !DOM.lbStatusText) return;
    const pill = DOM.lbStatusDot.parentElement;
    if (pill) {
      pill.className = `leaderboard-live-pill ${status}`;
    }
    DOM.lbStatusText.textContent = label;
  },

  async fetchSnapshot() {
    const eventId = this.getEventId();
    try {
      const res = await fetch(`${this.getApiBase()}/api/leaderboard?event=${encodeURIComponent(eventId)}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        this.renderLeaderboard(data);
      }
    } catch (e) {}
  },

  async submitQuizResult(resultData) {
    const eventId = this.getEventId();
    try {
      await fetch(`${this.getApiBase()}/api/submit-score?event=${encodeURIComponent(eventId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: resultData.playerName,
          playerId: resultData.playerName,
          score: resultData.score,
          totalTimeSec: resultData.totalTimeSec,
          correctCount: resultData.correctCount,
          maxQuestions: resultData.maxQuestions,
          attemptId: resultData.attemptId,
          idempotencyKey: resultData.attemptId
        })
      });
    } catch (err) {
      console.warn("Live leaderboard submit skipped:", err);
    }
  },

  renderLeaderboard(data) {
    if (!data || !DOM.lbTbody) return;

    if (DOM.lbParticipantCount) {
      DOM.lbParticipantCount.textContent = data.totalParticipants || 0;
    }
    if (DOM.lbLastUpdated) {
      const timeStr = new Date().toLocaleTimeString();
      DOM.lbLastUpdated.textContent = `Last updated: ${timeStr} (${data.status === "closed" ? "Event Closed" : "Live"})`;
    }

    const rankings = data.topRankings || [];
    if (rankings.length === 0) {
      DOM.lbTbody.innerHTML = `<tr><td colspan="5" class="lb-empty-msg">Waiting for quiz submissions...</td></tr>`;
      return;
    }

    let html = "";
    rankings.forEach(item => {
      let rankBadge = `<span class="rank-badge">${item.rank}</span>`;
      if (item.rank === 1) rankBadge = `<span class="rank-badge rank-1">🥇 1</span>`;
      else if (item.rank === 2) rankBadge = `<span class="rank-badge rank-2">🥈 2</span>`;
      else if (item.rank === 3) rankBadge = `<span class="rank-badge rank-3">🥉 3</span>`;

      const escapedName = escapeHtml(item.playerName);
      const isCurrentPlayer = (item.playerName === gameState.playerName);
      const rowStyle = isCurrentPlayer ? "background: #eff6ff; font-weight: bold;" : "";

      html += `
        <tr style="${rowStyle}">
          <td class="td-rank">${rankBadge}</td>
          <td class="td-player">${escapedName} ${isCurrentPlayer ? "⭐ (You)" : ""}</td>
          <td class="td-score">${item.score.toLocaleString()} pts</td>
          <td class="td-accuracy">${item.accuracy || 0}%</td>
          <td class="td-time">${item.totalTimeSec || 0}s</td>
        </tr>
      `;
    });

    DOM.lbTbody.innerHTML = html;
  },

  init() {
    if (DOM.leaderboardNavBtn) {
      DOM.leaderboardNavBtn.addEventListener("click", () => {
        showScreen("leaderboard");
        this.connectWebSocket();
        this.fetchSnapshot();
      });
    }

    if (DOM.viewLeaderboardBtn) {
      DOM.viewLeaderboardBtn.addEventListener("click", () => {
        showScreen("leaderboard");
        this.connectWebSocket();
        this.fetchSnapshot();
      });
    }

    if (DOM.lbBackBtn) {
      DOM.lbBackBtn.addEventListener("click", () => {
        if (gameState.playerName) {
          showScreen("results");
        } else {
          showScreen("welcome");
        }
      });
    }

    if (DOM.lbRefreshBtn) {
      DOM.lbRefreshBtn.addEventListener("click", () => {
        this.fetchSnapshot();
      });
    }

    if (DOM.lbProjectorModeBtn) {
      DOM.lbProjectorModeBtn.addEventListener("click", () => {
        this.isProjector = !this.isProjector;
        document.body.classList.toggle("projector-mode", this.isProjector);
        DOM.lbProjectorModeBtn.textContent = this.isProjector ? "📱 Exit Projector" : "🖥️ Projector Mode";
      });
    }

    // Auto-open leaderboard if URL has ?leaderboard=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("leaderboard") === "true") {
      showScreen("leaderboard");
      this.connectWebSocket();
      this.fetchSnapshot();
      if (urlParams.get("projector") === "true") {
        this.isProjector = true;
        document.body.classList.add("projector-mode");
      }
    }
  }
};

// Auto-initialize Leaderboard Client
LeaderboardClient.init();
