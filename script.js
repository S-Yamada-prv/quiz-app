// クイズの問題と正解情報を配列で管理する
const quizData = [
  {
    question: "地球の大気中で最も多く含まれている気体はどれでしょう？",
    choices: ["酸素", "窒素", "二酸化炭素", "水蒸気"],
    answer: "窒素",
    explanation: "地球の大気の約78%は窒素です。"
  },
  {
    question: "日本で1年のうち最も暑い月として一般的に知られているのはどれでしょう？",
    choices: ["3月", "6月", "8月", "12月"],
    answer: "8月",
    explanation: "多くの地域で8月が最も気温が高くなる時期です。"
  },
  {
    question: "物体が地面に落ちるのは、何の働きによるものですか？",
    choices: ["磁力", "摩擦力", "重力", "浮力"],
    answer: "重力",
    explanation: "地球が物体を引き寄せる力を重力と呼びます。"
  },
  {
    question: "1リットルは何ミリリットルに相当しますか？",
    choices: ["10 mL", "100 mL", "1000 mL", "10000 mL"],
    answer: "1000 mL",
    explanation: "1リットルは1000ミリリットルです。"
  },
  {
    question: "日本の首都はどこでしょう？",
    choices: ["大阪", "京都", "東京", "福岡"],
    answer: "東京",
    explanation: "日本の首都は東京です。"
  }
];

// HTML内の要素を取得
const quizCountEl = document.getElementById("quiz-count");
const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const chartWrapperEl = document.getElementById("chart-wrapper");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const finishBtn = document.getElementById("finish-btn");

// 現在の状態を管理する変数
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let scoreChart = null;

// 現在の問題を画面に表示する関数
function renderQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];

  answered = false;
  feedbackEl.classList.add("hidden");
  feedbackEl.classList.remove("correct", "wrong");
  chartWrapperEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");
  finishBtn.classList.add("hidden");

  quizCountEl.textContent = `問題 ${currentQuestionIndex + 1} / ${quizData.length}`;
  questionTextEl.textContent = currentQuestion.question;
  choicesEl.innerHTML = "";

  // 4択を動的に生成して表示
  currentQuestion.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = choice;
    button.addEventListener("click", () => handleAnswer(choice, button));
    choicesEl.appendChild(button);
  });
}

// 回答時の処理
function handleAnswer(selectedChoice, selectedButton) {
  // すでに回答済みなら何もしない
  if (answered) {
    return;
  }

  answered = true;
  const currentQuestion = quizData[currentQuestionIndex];
  const buttons = choicesEl.querySelectorAll(".choice-btn");

  // 各選択肢に正解・不正解のスタイルを付ける
  buttons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === currentQuestion.answer) {
      button.classList.add("correct");
    }

    if (button === selectedButton && selectedChoice !== currentQuestion.answer) {
      button.classList.add("wrong");
    }
  });

  const isCorrect = selectedChoice === currentQuestion.answer;

  // 正解・不正解のフィードバックを表示
  if (isCorrect) {
    score += 1;
    feedbackEl.textContent = `正解！ ${currentQuestion.explanation}`;
    feedbackEl.classList.add("correct");
  } else {
    feedbackEl.textContent = `不正解です。正解は「${currentQuestion.answer}」です。${currentQuestion.explanation}`;
    feedbackEl.classList.add("wrong");
  }

  feedbackEl.classList.remove("hidden");

  // 最終問題かどうかでボタンの文言を切り替える
  if (currentQuestionIndex < quizData.length - 1) {
    nextBtn.textContent = "次の問題へ";
    nextBtn.classList.remove("hidden");
  } else {
    nextBtn.textContent = "結果を見る";
    nextBtn.classList.remove("hidden");
  }
}

// 最終結果画面を表示する関数
function renderScoreChart() {
  const ctx = document.getElementById("scoreChart").getContext("2d");
  const incorrectCount = quizData.length - score;

  if (scoreChart) {
    scoreChart.destroy();
  }

  scoreChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["正解数", "不正解数"],
      datasets: [
        {
          label: "問題数",
          data: [score, incorrectCount],
          backgroundColor: ["#2d6cdf", "#d9534f"],
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "クイズ結果"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: quizData.length,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function showResult() {
  const totalQuestions = quizData.length;

  questionTextEl.textContent = `${score} / ${totalQuestions}`;
  quizCountEl.textContent = "最終結果";
  choicesEl.innerHTML = "";
  feedbackEl.classList.remove("hidden");
  feedbackEl.classList.remove("wrong");
  feedbackEl.classList.add("correct");

  if (score === totalQuestions) {
    feedbackEl.textContent = "満点です！とても優秀ですね。";
  } else if (score >= 3) {
    feedbackEl.textContent = "よくできました！もう少しで満点です。";
  } else if (score >= 2) {
    feedbackEl.textContent = "なかなか良い成績です。次はさらに上を目指しましょう。";
  } else {
    feedbackEl.textContent = "次回はもう一度挑戦してみてください。";
  }

  chartWrapperEl.classList.remove("hidden");
  renderScoreChart();

  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
  restartBtn.textContent = "もう一度挑戦";
  finishBtn.classList.remove("hidden");
}

// 次の問題へ進むボタンのイベント
nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex === quizData.length - 1) {
    showResult();
    return;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex < quizData.length) {
    renderQuestion();
  }
});

// 最初からやり直すボタンのイベント
restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  choicesEl.innerHTML = "";
  chartWrapperEl.classList.add("hidden");
  restartBtn.classList.add("hidden");
  finishBtn.classList.add("hidden");
  renderQuestion();
});

// 終了ボタンのイベント
finishBtn.addEventListener("click", () => {
  window.close();
});

// 最初の問題を表示
renderQuestion();
