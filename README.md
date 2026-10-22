# 📖 Bible Quiz Challenge (வேதாகம வினாடி வினா)

A modern, responsive, interactive Bible quiz web application featuring bilingual support (English & Tamil), progressive difficulty levels (Easy, Medium, Hard), real-time synthesised sound effects, celebratory confetti animations, local personal best tracking, and instant social sharing.

Built cleanly with **HTML5, CSS3, and Vanilla JavaScript** with zero external packages or paid APIs.

---

## 🎨 Fresh Look & Custom Design
- **Custom Branding**: Features dedicated custom logo & favicon (`logo.avif`).
- **Clean Off-White & Royal Navy Palette**: Shifted away from generic arcade quiz tiles to an elegant, high-contrast white and royal blue theme suitable for churches, youth fellowships, Sunday schools, and individual study.
- **Floating Biblical Motifs**: Ambient background with gentle drifting motifs (Ark/Ship, Dove, Lion, Tree, Bible, Fish, Rainbow, Crown, and Stars).

---

## 🚀 Key Features

1. **Bilingual Support (English & Tamil)**:
   - Instant language switching directly from the top bar (`English | தமிழ்`).
   - All 15 questions, options, feedbacks, review screens, and exported result cards dynamically change language without reloading.

2. **Progressive Difficulty (15 Questions)**:
   - **Level 1 (Easy)**: Questions 1–5 (Foundational Gospel and Old Testament stories).
   - **Level 2 (Medium)**: Questions 6–10 (Miracles, disciples, and covenant promises).
   - **Level 3 (Hard)**: Questions 11–15 (Genesis creation days, loaves & fishes counts, flood timeline, and Exodus).

3. **Web Audio API Synthesizer (Zero Audio Files)**:
   - Built directly with browser `AudioContext`:
     - 8-bit countdown urgency ticks for the last 5 seconds.
     - Harmonic major chord chimes for correct answers.
     - Soft buzzer for wrong answers/timeouts.
     - Triumphant fanfare upon quiz completion.
   - Accessible **Mute/Unmute** toggle button (`🔊 Sound On` / `🔇 Sound Off`).

4. **Celebratory Confetti & Streaks**:
   - Physics-based HTML5 canvas multi-color confetti explosion upon completing with high scores ($\ge 70\%$) or setting a new record.
   - Interactive streak counter: `🔥 2+ IN A ROW!` appears when answering consecutively.

5. **Local Storage & Personal Best High Score**:
   - Stores your top score and player name locally.
   - Displays `⭐ Personal Best: Player (Score pts)` on the welcome screen.
   - Displays an animated `🎉 NEW HIGH SCORE! 🎉` banner when beating your personal best.

6. **Native Web Share API & PNG Result Card**:
   - Tap **📲 Share Card** on mobile devices (Android/iOS) to directly launch the native share sheet to send the generated result card to **WhatsApp**, **Instagram**, or **Messages**.
   - Tap **📸 Download Card (PNG)** to save the high-resolution certificate directly.
   - Tap **🏠 Back Home** to quickly return to the welcome screen.

7. **Phase 2: Admin Portal & Custom Quiz Builder (No Backend / No Database)**:
   - **Demo Login**: Username `admin`, Password `jesus` (client-side demo).
   - **Full Quiz Management**: Create custom quizzes with custom titles, descriptions, difficulty levels, custom time limits (5s, 10s, 15s, 20s, 30s), and any number of 4-choice questions.
   - **Draft & Publish**: Save drafts or publish directly to browser `localStorage`.
   - **JSON Export & Import**: Back up or share quiz files as JSON.
   - **🔗 Instant Shareable URL Links**:
     - Serializes and safely encodes quiz data into URL query parameters (`?quiz=...`).
     - Anyone opening the link can play immediately on GitHub Pages without logging in or needing an account.
     - Includes validation, error recovery, URL length warnings, and one-click clipboard copying.

---

## 📂 Project Structure

```text
BIBLE-QUIZ-CHALLENGE/
├── index.html        # Clean semantic markup with bilingual containers, canvas & Admin Portal
├── style.css         # Modern white & royal blue theme, floating animations, cards, admin UI
├── script.js         # Game state, questions, AudioContext SFX, Canvas, Admin & URL serialization
├── logo.avif         # Official logo & favicon
└── README.md         # Documentation & deployment guide
```

---

## 🧮 Scoring System

- **Base Points (Correct Answer)**: 500 pts
- **Speed Bonus**: Up to 500 pts
- **Wrong Answer or Timeout**: 0 pts
- **Time Limit**: 20 seconds per question

$$\text{Points} = 500 + \text{round}\left(500 \times \left(1 - \frac{\text{responseTime}}{\text{timeLimit}}\right)\right)$$

- **Time Limit**: 10 seconds per question (fast-paced)
- **Base Points**: 500 pts
- **Speed Bonus**: Up to 500 pts
- **Max Score per Question**: 1,000 pts
- **Total Max Score (15 Questions)**: 15,000 pts

---

## 🌐 GitHub Pages Deployment Guide

### Step 1: Open GitHub Repository
Visit your repository:
[`https://github.com/Samrajg/BIBLE-QUIZ-CHALLENGE`](https://github.com/Samrajg/BIBLE-QUIZ-CHALLENGE)

### Step 2: Enable Pages
1. Go to **Settings** > **Pages** (under "Code and automation").
2. Set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and folder to `/ (root)`.
4. Click **Save**.

Your live website will be accessible at:
👉 **`https://samrajg.github.io/BIBLE-QUIZ-CHALLENGE/`**

---

## 💻 Local Testing
Simply open `index.html` in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari. No web server or build process required!
