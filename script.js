import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Function to make computer choice (Rock, Paper, Scissor)
function makingComputerChoice() {
    let randomNo = Math.random() * 100;
    let computerChoice;

    if (randomNo >= 0 && randomNo <= 30) {
        computerChoice = "Rock";
    } else if (randomNo > 30 && randomNo <= 60) {
        computerChoice = "Paper";
    } else {
        computerChoice = "Scissor";
    }

    return computerChoice;
}

// Client choices (Rock, Paper, Scissor)
function clientSetRock() {
    let clientChoice = "Rock";
    compare(clientChoice, makingComputerChoice());
}

function clientSetPaper() {
    let clientChoice = "Paper";
    compare(clientChoice, makingComputerChoice());
}

function clientSetScissor() {
    let clientChoice = "Scissor";
    compare(clientChoice, makingComputerChoice());
}

// Compare user choice and computer choice
function compare(clientChoice, computerChoice) {
    let message;
    if (clientChoice === "Rock" && computerChoice === "Paper") {
        message = "Computer chose Paper & You chose Rock";
        failierStatus(message);
    } else if (clientChoice === "Paper" && computerChoice === "Rock") {
        message = "Computer chose Rock & You chose Paper";
        successStatus(message);
    } else if (clientChoice === "Paper" && computerChoice === "Scissor") {
        message = "Computer chose Scissor & You chose Paper";
        failierStatus(message);
    } else if (clientChoice === "Scissor" && computerChoice === "Paper") {
        message = "Computer chose Paper & You chose Scissor";
        successStatus(message);
    } else if (clientChoice === "Scissor" && computerChoice === "Rock") {
        message = "Computer chose Rock & You chose Scissor";
        failierStatus(message);
    } else if (clientChoice === "Rock" && computerChoice === "Scissor") {
        message = "Computer chose Scissor & You chose Rock";
        successStatus(message);
    } else if (clientChoice === computerChoice) {
        message = "Computer chose the same as You!";
        drawStatus(message);
    }
}

// Status functions (Win, Lose, Draw)
function successStatus(message) {
    let statusCont = document.getElementById("result_status_cont");
    statusCont.innerHTML = "You Won! " + message;

    let status = document.getElementById("result_status");
    status.style.backgroundColor = "lightgreen";
    status.style.color = "green";
    status.style.display = "block";

    calculateUserScore(5);
    animateScore("user-score");
    showScoreStatus();
    savingScoreInDb();
}

function failierStatus(message) {
    let statusCont = document.getElementById("result_status_cont");
    statusCont.innerHTML = "You Lost! " + message;

    let status = document.getElementById("result_status");
    status.style.backgroundColor = "#FFCDD2";
    status.style.color = "#B71C1C";
    status.style.fontWeight = "bold";
    status.style.display = "block";

    calculateCompScore(5);
    animateScore("comp-score");
    showScoreStatus();
}

function drawStatus(message) {
    let statusCont = document.getElementById("result_status_cont");
    statusCont.innerHTML = "Match Draw! " + message;

    let status = document.getElementById("result_status");
    status.style.backgroundColor = "rgb(255, 218, 151)";
    status.style.color = "orange";
    status.style.display = "block";
}

// Hide status
function cut() {
    let status = document.getElementById("result_status");
    status.style.display = "none";
}

// Scores for user and computer
let totalUserScore = 0;
let totalCompScore = 0;

function calculateCompScore(point) {
    totalCompScore += point;
    return totalCompScore;
}

function calculateUserScore(point) {
    totalUserScore += point;
    return totalUserScore;
}

// Show score status with color changes
function showScoreStatus() {
    let userScore = document.getElementById("user-score");
    let compScore = document.getElementById("comp-score");

    if (totalUserScore < totalCompScore) {
        userScore.style.color = "red";
    } else if (totalCompScore < totalUserScore) {
        compScore.style.color = "red";
    } else {
        userScore.style.color = "#ffffff";
        compScore.style.color = "#ffffff";
    }

    userScore.innerHTML = totalUserScore;
    compScore.innerHTML = totalCompScore;
}

// Score animation
function animateScore(elementId) {
    let scoreElement = document.getElementById(elementId);
    scoreElement.classList.add('change');
    setTimeout(() => {
        scoreElement.classList.remove('change');
    }, 500);
}


function showCustomAlert(message) {
    const modal = document.getElementById('customAlert');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'flex'; // Show the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('customAlert');
    modal.style.display = 'none'; // Hide the modal
}
// AutoPlay functionality
let autoPlayIsOn = false;

function switchAutoPlay() {
    if (autoPlayIsOn) {
        autoPlayIsOn = false;
        showCustomAlert("Auto Play Toggle Says, It Is Off!");
    } else {
        autoPlayIsOn = true;
        showCustomAlert("Auto Play Toggle Says, It Is On!");
    }
}

setInterval(function autoPlayer() {
    if (autoPlayIsOn) {
        autoPlay();
    }
}, 500);

function autoPlay() {
    let randomNum = Math.random() * 100;

    if (randomNum >= 0 && randomNum <= 30) {
        document.getElementById("scissor").click();
    } else if (randomNum > 30 && randomNum <= 60) {
        document.getElementById("paper").click();
    } else {
        document.getElementById("rock").click();
    }
}

// Internet connection check and game control hiding
document.addEventListener('DOMContentLoaded', function() {
    function checkInternetConnection() {
        if (!navigator.onLine) {
            hideClientPlayControls();
            showCustomAlert("Check Your Internet Connection!");

            setTimeout(() => {
                history.go(-1);
            }, 1000);
        }
    }

    checkInternetConnection();
});

function hideClientPlayControls() {
    const boxes = document.querySelectorAll('.box');
    const controlButtons = document.querySelectorAll('.control-button');

    boxes.forEach(function(box) {
        box.style.display = 'none';
    });

    controlButtons.forEach(function(btn) {
        btn.style.display = 'none';
    });
}

// Firebase High Score Logic
function savingScoreInDb() {
    let currentScore = totalUserScore;
    saveHighScore(currentScore); // Call to save the score
    displayUserDetails(); // Display user details after game
}

// Display user details (name and high score) after game ends
const displayUserDetails = async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const userRef = doc(db, "players", userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userName = userData.name;
                const highScore = userData.highScore;

                document.getElementById("userNameDisplay").innerText = `Welcome, ${userName}!`;
                document.getElementById("highScoreDisplay").innerText = `Your High Score: ${highScore}`;
            } else {
                document.getElementById("userNameDisplay").innerText = `Welcome!`;
                document.getElementById("highScoreDisplay").innerText = `No high score yet!`;
            }
        } else {
            console.log('User not logged in');
        }
    });
};

// Save High Score in Firebase Firestore
const saveHighScore = async (currentScore) => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const scoreRef = doc(db, "players", userId);
        const scoreDoc = await getDoc(scoreRef);

        if (scoreDoc.exists()) {
            const storedHighScore = scoreDoc.data().highScore;

            if (currentScore > storedHighScore) {
                await updateDoc(scoreRef, {
                    highScore: currentScore
                });
                console.log('High score updated to:', currentScore);
            } else {
                console.log('Current score is lower than stored high score, no update.');
            }
        }
    } else {
        console.log('No user is signed in.');
    }
};


window.clientSetRock = clientSetRock;
window.clientSetScissor = clientSetScissor;
window.clientSetPaper = clientSetPaper;
window.switchAutoPlay = switchAutoPlay;
window.closeModal = closeModal ;
displayUserDetails();