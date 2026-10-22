# 📖 Bible Quiz Challenge (Version 1)

A responsive, colorful, interactive web game inspired by the fast-paced, engaging quiz experience of Kahoot. Built purely with **HTML5, CSS3, and Vanilla JavaScript** for instant browser play and effortless hosting on **GitHub Pages**.

---

## 🚀 Features

- **Kahoot-Inspired UI**: Colorful shape-coded cards, cheerful typography, and smooth transitions.
- **Randomized Question Bank**: 35 beginner-friendly, fact-checked questions covering Old and New Testament characters. 10 unique questions and randomized answer choices selected each run.
- **20-Second Countdown Timer**: Synchronized with browser monotonic time (`performance.now()`) for accuracy.
- **Transparent Scoring Formula**: Up to 1,000 points per question (500 base points for correctness + up to 500 bonus points for response speed). Maximum score: 10,000 points.
- **Real-Time Feedback & Scripture References**: Displays instant explanations with Bible verse references for every question.
- **Accurate Statistics & Encouraging Ratings**: Detailed summary metrics (Accuracy, Avg Response Time, Speed Bonus, etc.).
- **Interactive Review Screen**: Complete step-by-step review of all 10 attempted questions with correct answers and explanations.
- **Screenshot-Friendly Result Card**: Dedicated visual card designed for players to capture or download directly as a PNG to send to quiz organizers or Sunday School leaders.
- **Zero Dependencies**: No npm, no frameworks, no database, no external paid APIs. 100% client-side.

---

## 📂 Repository File Structure

```text
bible-quiz/
├── index.html     # Semantic structure for all screens (Welcome, Question, Results, Review)
├── style.css      # Kahoot-inspired color scheme, responsive grid, animations
├── script.js      # Complete question bank, game logic, timer, scoring, and card export
└── README.md      # Documentation and deployment guide
```

---

## 🧮 Scoring System Explained

The scoring system rewards both **accuracy** and **speed**:

- **Maximum score per question**: 1,000 points
- **Base score (Correct answer)**: 500 points
- **Speed bonus**: Up to 500 points
- **Wrong answer or Timeout**: 0 points

### Exact Formula

$$\text{Points} = 500 + \text{round}\left(500 \times \left(1 - \frac{\text{responseTime}}{\text{timeLimit}}\right)\right)$$

*Where `timeLimit` is 20 seconds, and `responseTime` is clamped between 0 and 20.*

### Examples:
- Correct in 2.0s: $500 + \text{round}(500 \times (1 - 2/20)) = 500 + 450 = 950\text{ points}$
- Correct in 10.0s: $500 + \text{round}(500 \times (1 - 10/20)) = 500 + 250 = 750\text{ points}$
- Correct in 18.0s: $500 + \text{round}(500 \times (1 - 18/20)) = 500 + 50 = 550\text{ points}$
- Incorrect or Timed Out: $0\text{ points}$

Maximum possible score across 10 questions: **10,000 points**.

---

## 🏆 Performance Ratings

- **90% – 100%**: *Bible Expert*
- **70% – 89%**: *Bible Explorer*
- **50% – 69%**: *Growing in Knowledge*
- **Below 50%**: *Keep Learning*

---

## 💻 Testing Locally Before Publishing

1. Clone or download this project folder onto your local computer.
2. Double-click [index.html](file:///e:/BIBLE-QUIZ-CHALLENGE/index.html) to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, if you use Visual Studio Code, you can right-click `index.html` and click **Open with Live Server**.

---

## 🌐 Complete Step-by-Step GitHub Pages Deployment Guide

Follow these steps to publish your quiz online for free:

### Step 1: Create a New GitHub Repository
1. Log in to your account at [GitHub.com](https://github.com).
2. In the top-right corner, click the **`+`** icon and select **New repository**.
3. Choose a name (e.g., `bible-quiz` or `bible-quiz-challenge`).
4. Set the visibility to **Public**.
5. Do not check "Add a README file" if you already have these files locally.
6. Click **Create repository**.

### Step 2: Push or Upload Files
If you are using Git via terminal/command line:
```bash
git init
git add .
git commit -m "Initial commit of Bible Quiz Challenge"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```
*Or via web browser:*
- On your new repository's page, click **uploading an existing file**.
- Drag and drop `index.html`, `style.css`, `script.js`, and `README.md`.
- Click **Commit changes**.

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click on the **Settings** tab at the top.
2. In the left navigation menu, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` (or `master`) and keep folder as `/ (root)`.
4. Click **Save**.

### Step 4: Access Your Live Website
- Refresh the **Pages** settings page after about 1 to 2 minutes.
- A banner will appear at the top saying:
  > *Your site is live at `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`*
- Click the link to play the live quiz from any computer, tablet, or smartphone!

### Step 5: Updating the Website
Whenever you modify files or add questions to `script.js`:
- Commit and push your changes to the `main` branch.
- GitHub Pages will automatically re-deploy within 60–90 seconds.

---

## 📋 Comprehensive Testing Checklist

- [x] **Screen A (Welcome)** loads with clear instructions, category, and rules.
- [x] Empty nickname inputs or whitespace-only inputs are rejected with validation styling.
- [x] 10 unique questions are selected randomly from the 35-question bank.
- [x] Answer choices are shuffled dynamically for every question.
- [x] 20-second countdown runs cleanly and turns urgent red at $\le 5$ seconds.
- [x] Fast response time calculation accurately awards speed bonuses up to 500 pts.
- [x] Multiple clicks cannot trigger double points or multiple submissions.
- [x] Timeout immediately disables options, awards 0 points, and reveals the correct answer.
- [x] Screen C clearly displays Scripture reference and an educational explanation.
- [x] Final statistics satisfy $\text{Correct} + \text{Incorrect} + \text{Unanswered} = 10$.
- [x] Performance rating matches percentage boundaries without dividing by zero.
- [x] Screen F result card contains attempt ID, timestamp, nickname, and stats.
- [x] Download Result Card generates a clean PNG directly in the browser.
- [x] Screen E Review shows all 10 questions with player's choice vs correct answer.
- [x] "Play Again" completely resets the timer, score, and state with a new attempt ID.
