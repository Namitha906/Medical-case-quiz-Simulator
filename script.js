let cases = [];
let currentCase = 0;
let score = 0;

fetch("cases.json")
  .then(res => res.json())
  .then(data => {
    cases = Object.values(data);
  });

function startSimulation() {
  document.getElementById("start-btn").classList.add("hidden");
  document.getElementById("case-card").classList.remove("hidden");
   document.getElementById("top-bar").classList.remove("hidden");

  updateScore();
  updateProgress();

  loadCase();
}

function loadCase() {
  let c = cases[currentCase];

  document.getElementById("patient").innerText = c.patient;
  document.getElementById("symptoms").innerText =
    "Symptoms: " + c.symptoms.join(", ");

  let testDiv = document.getElementById("test-buttons");
  testDiv.innerHTML = "";

  for (let test in c.tests) {
    let btn = document.createElement("button");
    btn.innerText = test;
    btn.onclick = () => selectTest(test);
    testDiv.appendChild(btn);
  }

  document.getElementById("result-section").innerHTML = "";
  document.getElementById("diagnosis-section").classList.add("hidden");
  document.getElementById("next-btn").classList.add("hidden");
  updateProgress();
}

function selectTest(test) {
  let c = cases[currentCase];
  let result=document.getElementById("result-section");

 console.log(Object.keys(c.tests));
console.log("Correct:", c.correct_test);
  result.innerHTML="";

  if(test ===c.correct_test){
    result.innerHTML= "✅ Correct Test <br><br>Result: "+ c.tests[test];
    score+=5;
    updateScore();
    showDiagnosisOptions();
  } else{
    result.innerHTML="⚠️ Wrong test. Try another option";
  }
}

function showDiagnosisOptions() {
  let c = cases[currentCase];
  let diagDiv = document.getElementById("diagnosis-buttons");

  diagDiv.innerHTML = "";

  c.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    diagDiv.appendChild(btn);
  });

  document.getElementById("diagnosis-section").classList.remove("hidden");
}

function checkAnswer(answer) {
  let c = cases[currentCase];

  let result = document.getElementById("result-section");

  if (answer === c.answer) {
   score+=10;
   result.innerHTML="✅Correct! " +c.explanation;
  }else{
    result.innerHTML="❌ Wrong! " +c.explanation;
  }
  updateScore();

  let buttons=document.querySelectorAll("#diagnosis-buttons button");
  buttons.forEach(btn=> btn.disabled = true);

  document.getElementById("next-btn").classList.remove("hidden");
}

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

function updateProgress() {
  document.getElementById("progress").innerText =
    "Case " + (currentCase + 1) + " / " + cases.length;
}

function nextCase() {
 console.log("Next clicked");

  if (cases.length === 0) return;

  currentCase++;

  if (currentCase >= cases.length) {
    currentCase = 0;
  }

  loadCase();
}