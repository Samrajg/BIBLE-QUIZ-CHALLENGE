const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

// Test the bilingual functions in node
const startIdx = script.indexOf('function getLocalizedQuizProp');
const endIdx = script.indexOf('function revertToDefaultQuiz');
const extractedCode = script.substring(startIdx, endIdx);

eval(extractedCode);

const sampleBilingual = {
  title: { en: 'Bible Characters', ta: 'வேதாகம மனிதர்கள்' },
  questions: [
    {
      question: { en: 'Who built the ark?', ta: 'பேழையைக் கட்டியவர் யார்?' },
      choices: {
        en: ['Moses', 'Noah', 'David', 'Paul'],
        ta: ['மோசே', 'நோவா', 'தாவீது', 'பவுல்']
      },
      correctIndex: 1,
      reference: { en: 'Genesis 6', ta: 'ஆதியாகமம் 6' }
    },
    {
      question_en: 'Where was Jesus born?',
      question_ta: 'இயேசு எங்கு பிறந்தார்?',
      choices_en: ['Nazareth', 'Bethlehem', 'Jerusalem', 'Rome'],
      choices_ta: ['நாசரேத்', 'பெத்லகேம்', 'எருசலேம்', 'ரோம்'],
      correctIndex: 1,
      reference: 'Matthew 2:1'
    }
  ]
};

// Test Q1
const q1En = resolveBilingualQuestion(sampleBilingual.questions[0], 'en');
const q1Ta = resolveBilingualQuestion(sampleBilingual.questions[0], 'ta');

console.log('Q1 (EN):', q1En.text, '-> Correct:', q1En.correctAnswer);
console.log('Q1 (TA):', q1Ta.text, '-> Correct:', q1Ta.correctAnswer);

if (q1En.correctAnswer !== 'Noah' || q1Ta.correctAnswer !== 'நோவா') {
  throw new Error('Q1 mapping failed');
}

// Test Q2
const q2En = resolveBilingualQuestion(sampleBilingual.questions[1], 'en');
const q2Ta = resolveBilingualQuestion(sampleBilingual.questions[1], 'ta');

console.log('Q2 (EN):', q2En.text, '-> Correct:', q2En.correctAnswer);
console.log('Q2 (TA):', q2Ta.text, '-> Correct:', q2Ta.correctAnswer);

if (q2En.correctAnswer !== 'Bethlehem' || q2Ta.correctAnswer !== 'பெத்லகேம்') {
  throw new Error('Q2 mapping failed');
}

console.log('🎉 ALL BILINGUAL JSON RESOLVER TESTS PASSED!');
