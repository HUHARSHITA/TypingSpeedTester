const wordBox = document.getElementById("word-box");

const paragraphs = [
  'Students thrive when curiosity is encouraged and knowledge is celebrated. A strong education system builds a strong foundation for the future. Consistency is more important than intensity. Great things are built not in a day, but through small steps taken every single day. Empathy and ethics are as important as intelligence in the world of AI.',
  'Technology is evolving rapidly, and with it comes the power to solve real world problems. From healthcare to education, AI is revolutionizing our lives.The best way to predict the future is to create it. Innovation begins with a spark of curiosity and the courage to pursue it. Responsible innovation shapes a better world for all.',
  'Life is a beautiful journey filled with happy and sad moments. It teaches us many lessons as we grow. Sometimes it is hard, but it always moves forward. We should enjoy little things and stay positive. Helping others and being kind makes life better. Every day is a gift, and we should live it well.',
  'Education helps us learn new things and grow as a person. It gives us knowledge, skills, and the power to think. With education, we can get good jobs and live a better life. Schools and teachers guide us in the right direction. Learning never stops, and it helps us become smart, responsible, and confident people.',
  'Music is a special part of our lives. It makes us feel happy, calm, or even excited. People listen to music when they are sad or when they want to celebrate. There are many kinds of music like classical, pop, or rock. It has no language, but everyone can enjoy it. Music connects people everywhere.',
  'Trees are very important for life. They give us oxygen, shade, and fruits. Trees keep the air clean and help animals live in the forests. They also stop soil from washing away during rain. We should plant more trees and protect them. Without trees, life on Earth would not be healthy or safe.',
  'Electricity is a big part of our daily life. It helps us light our homes, use fans, charge phones, and watch TV. Without electricity, many things would stop working. It is made in power stations and comes to our homes through wires. We should use it wisely and never waste it. It makes life easier.',
  'Wildlife includes animals, birds, and insects living in nature. They are important for a healthy Earth. Tigers, elephants, and deer are some examples. They live in forests and jungles. But many animals are in danger because of hunting and pollution. We must protect them and their homes. Saving wildlife helps save nature too.'
];
const typingSound = new Audio("type.mp3");
const errorSound = new Audio("error.mp3");
typingSound.volume = 0.3;
errorSound.volume = 0.5;

const selectedParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
const words = selectedParagraph
  .split(" ");
let currentIndex = 0;
let correctCount = 0;
let startTime;

const input = document.getElementById("input");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const resultBox = document.getElementById("result");
const restart = document.getElementById("restart");

const validShortWords = ['a', 'i', 'an', 'am', 'is', 'it', 'all', 'in', 'on', 'to', 'of', 'as', 'be', 'by', 'do', 'go', 'he', 'me', 'my', 'no', 'or', 'so', 'up', 'we'];

function renderText() {
  wordBox.innerHTML = words
    .map((word, index) => `<span id="word-${index}">${word}</span>`)
    .join(" ");
}
renderText();

// Timer
let timeLeft = 30;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `0:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Typing logic
input.addEventListener("keyup", (e) => {
  if (/^[a-zA-Z]$/.test(e.key)) {
    typingSound.currentTime = 0;
    typingSound.play();
  }

  if (!startTime) {
    startTime = new Date();
    startTimer();
  }

  if (e.key === " ") {
    if (e.key === " ") {
      const typedWord = input.value.trim().replace(/[.,!?;:]/g, '').toLowerCase();
      const rawTargetWord = words[currentIndex];
      const targetWord = rawTargetWord.replace(/[.,!?;:]/g, '').toLowerCase();
      const wordSpan = document.getElementById(`word-${currentIndex}`);

      // Gibberish prevention
      if (
        (!/^[a-zA-Z]+$/.test(typedWord)) ||
        (typedWord.length === 1 && !validShortWords.includes(typedWord))
      ) {
        input.value = "";
        errorSound.play(); // wrong sound for gibberish
        return;
      }

      // Mark result
      if (typedWord === targetWord) {
        wordSpan.classList.add("correct");
        correctCount++;
        typingSound.play();
      } else {
        wordSpan.classList.add("incorrect");
        errorSound.play();
      }

      currentIndex++;
      input.value = "";

      if (currentIndex == words.length) {
        endGame(true);
      }
    }

    const typedWord = input.value.trim();
    const targetWord = words[currentIndex];
    const wordSpan = document.getElementById(`word-${currentIndex}`);

    // Block gibberish/junk
    if (
      (!/^[a-zA-Z]+$/.test(typedWord)) ||
      (typedWord.length === 1 && !validShortWords.includes(typedWord.toLowerCase()))
    ) {
      input.value = "";
      return;
    }

    if (typedWord === targetWord) {
      wordSpan.classList.add("correct");
      correctCount++;
    } else {
      wordSpan.classList.add("incorrect");
    }

    currentIndex++;
    input.value = "";

    if (currentIndex > words.length) {
      endGame(true);
    }
  }
});

function endGame(completedEarly = false) {
  clearInterval(timerInterval);
  // Final check if last word is typed but not assessed
  if (input.value.trim()) {
    const typedWord = input.value.trim().replace(/[.,!?;:]/g, '').toLowerCase();
    const rawTargetWord = words[currentIndex];
    const targetWord = rawTargetWord.replace(/[.,!?;:]/g, '').toLowerCase();
    const wordSpan = document.getElementById(`word-${currentIndex}`);

    if (
      /^[a-zA-Z]+$/.test(typedWord) &&
      (typedWord.length > 1 || validShortWords.includes(typedWord))
    ) {
      if (typedWord === targetWord) {
        wordSpan.classList.add("correct");
        correctCount++;
      } else {
        wordSpan.classList.add("incorrect");
      }
      currentIndex++;
    }
  }

  input.disabled = true;
  resultBox.style.display = "block";

  const totalTyped = currentIndex;
  const timeTaken = (new Date() - startTime) / 60000;

  //   const wpm = Math.round((totalTyped / timeTaken) || 0);
  //   const accuracy = Math.round((correctCount / totalTyped) * 100 || 0);
  const accuracy = Math.round((correctCount / totalTyped) * 100 || 0);
  let wpm = Math.round((totalTyped / timeTaken) || 0);

  // If accuracy is too low, treat WPM as 0
  if (accuracy < 15) {
    wpm = 0;
  }

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;

  if (completedEarly) {
    resultBox.insertAdjacentHTML("afterbegin", `<p>🎉 Well done! You completed all the words before time.</p>`);
  }
}

// Restart
restart.addEventListener("click", () => {
  location.reload();
});

// Disable right-click & paste
document.addEventListener("contextmenu", event => event.preventDefault());
input.addEventListener("paste", e => e.preventDefault());

// Mobile popup check
if (window.innerWidth < 768) {
  alert("⚠️ This typing test is best experienced on a desktop or laptop.");
}
