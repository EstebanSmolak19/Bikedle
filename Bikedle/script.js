let gameData = []; // Variable globale pour stocker les données JSON

// Charger les données JSON contenant les images et noms des motos
function loadJson() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        gameData = data;
        initializeGame()
    })
    .catch(err => console.error('Erreur lors du chargement des données :', err));
}
loadJson()

const motoImage = document.getElementById('moto-image'); // Image affichée
const feedback = document.getElementById('feedback'); // Zone de feedback
const nextBtn = document.getElementById('next-btn'); // Bouton "Suivant"
const submitBtn = document.getElementById('submit-btn'); // Bouton "Valider"
const guessInput = document.getElementById('guess-input'); // Zone de saisie
const remainingAttempts = document.getElementById('remaining-attempts'); // Compteur d'essais
const select_games = document.querySelector('.game-container-select'); //Sélection des jeux (carousel)
const game_container = document.querySelector('.game-container'); // game
const title = document.querySelector('.title'); //mode de jeu

// Timer
const chronometre = document.querySelector('.timer-container');
const timeDisplay = document.getElementById('time-display');
const circleProgress = document.getElementById('circle-progress');

// Son
const CorrectAudio = document.getElementById('CorrectAudio');
const ErrorAudio = document.getElementById('ErrorAudio');
const GameoverAudio = document.getElementById('Game-Over-Audio');

let blurInterval;
let slideIndex = 0;
let currentGame = "normal"
let currentMotoIndex = 0; // Index de la moto actuelle
let currentImageIndex = 0; // Index de l'image affichée pour la moto actuelle
let attemptsLeft;
let correctName;
let color;
let timerInterval; 
let currentMode = "normal";



function initializeGame() {
    currentImageIndex = 0;
    currentMotoIndex = 0;

    if (gameData && gameData.motos && gameData.motos.length > 0) {
        attemptsLeft = gameData.motos[currentMotoIndex]["images"].length;
        correctName = gameData.motos[currentMotoIndex].name;
        remainingAttempts.textContent = attemptsLeft;

        loadMotoImage(gameData.motos[currentMotoIndex].images[currentImageIndex]);
        feedback.textContent = '';
        guessInput.value = '';
        submitBtn.disabled = false;
        nextBtn.style.display = "none";
    }
}

submitBtn.addEventListener('click', handleSubmit)
nextBtn.addEventListener('click', handleNext)

function handleSubmit() {
    var userGuess = guessInput.value.trim(); // Récupère et nettoie la saisie
    
    if (userGuess.toLowerCase() === correctName.toLowerCase()) {

        if(currentMode !== "normal"){
            TimerAudio.pause()
            clearInterval(timerInterval);
            clearInterval(blurInterval);
            feedback.textContent = "Bravo ! Vous avez trouvé la bonne moto.";
        }

        CorrectAudio.play();
        motoImage.style.filter = `blur(0px)`;
        remainingAttempts.textContent = `0`;
        feedback.innerHTML = "Bravo ! Vous avez trouvé la bonne moto.";
        feedback.style.color = "green";

        ifEndGame();
    } else {
        ErrorAudio.play();
        attemptsLeft--;

        setTimeout(() => {
            remainingAttempts.textContent = attemptsLeft;

            if (attemptsLeft > 0) {
                currentImageIndex++;
                if (currentImageIndex < gameData.motos[currentMotoIndex].images.length) {
                    feedback.textContent = "Mauvaise réponse. Un nouvel indice apparaît.";
                    feedback.style.color = "red";
                    guessInput.value = '';

                     // Reset le flou et le compteur pour chaque image
                     if(currentMode === "flou") {
                        startBlurGame()
                        timer(30)
                        TimerAudio.play()
                    }

                    loadMotoImage(gameData.motos[currentMotoIndex].images[currentImageIndex]);
                } else {
                    feedback.textContent = "Pas d'autres indices disponibles.";
                }
            } else {

                if (!TimerAudio.paused) {
                    TimerAudio.pause();
                }

                // Vérifie si le mode de jeu est différent de "normal" sinon on arrete le timer et/ou on enlève le flou si le mode est flou
                if(currentMode !== "normal"){
                    GameoverAudio.play()
                    clearInterval(timerInterval);
                    motoImage.style.filter = `blur(0px)`;  
                    clearInterval(blurInterval);
                }

                GameoverAudio.play();
                feedback.style.color = "red";
                submitBtn.disabled = true;
                ifEndGame(correctName);
            }
        }, 1000);
    }
}

// const gameModes = {
//     "normal": startNormalGame,
//     "flou": startBlurGame,
//     "timer": timerGame
// };
// const gameFunction = gameModes[currentMode];


function handleNext() {
    guessInput.value = '';

    console.log(currentMode)

    switch(currentMode) {
        case "normal":
            startNormalGame();
            break;
        case "flou":
            startBlurGame()
            break;
        case "timer":
            timerGame()
            break;
    }

    currentMotoIndex++;

    if (currentMotoIndex < gameData.motos.length) {
        attemptsLeft = gameData.motos[currentMotoIndex]["images"].length;
        currentImageIndex = 0;
        correctName = gameData.motos[currentMotoIndex].name;

        feedback.textContent = '';
        remainingAttempts.textContent = attemptsLeft;
        loadMotoImage(gameData.motos[currentMotoIndex].images[currentImageIndex]);
        submitBtn.disabled = false;
        nextBtn.style.display = "none";
    } else {
        feedback.textContent = "Félicitations, vous avez terminé le jeu !";
        feedback.style.color = "blue";
        submitBtn.disabled = true;
    }
}

function ifEndGame(name) {
    if(gameData.motos[currentMotoIndex + 1]) {
        nextBtn.style.display = "block"; // Affiche le bouton "Suivant"
        feedback.textContent = `Mauvaise réponse. La bonne réponse était : ${name}`;
    } else {
        submitBtn.disabled = true; // Désactive le bouton "Valider"
        feedback.innerHTML = `Vous avez perdu. La bonne réponse était : ${name}. <br> Redirection dans 5 secondes... `;
        endGame()
    }
}

function endGame(){
    setTimeout(() => {
        select_games.style.display = "block";
        game_container.style.display = "none";
        chronometre.style.display = "none";
        resetGame()

    }, 5000)
}

function resetGame() {
    // Réinitialiser l'interface utilisateur
    feedback.textContent = '';
    guessInput.value = '';
    submitBtn.disabled = false;
    nextBtn.style.display = "none";

    initializeGame();
}

// Charger une image
function loadMotoImage(imageUrl) {
     motoImage.src = imageUrl;
}

function startNormalGame() {
    currentMode = "normal"
    select_games.style.display = "none";
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> NormalGame </span>`
}

function startBlurGame() {
    let blurPx = 10;
    currentMode = "flou"
    chronometre.style.display = "block";
    select_games.style.display = "none";
    motoImage.style.filter = `blur(${blurPx}px)`;
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> BlurGame </span>`
    TimerAudio.play()
    flou(blurPx)
    timer(30)
}

function timerGame() {
    currentMode = "timer"
    chronometre.style.display = "block";
    select_games.style.display = "none";
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> timerGame </span>`
    TimerAudio.play()
    timer(30)
}

function timer(temps) {
    TimerAudio.play();
    clearInterval(timerInterval);
    timeDisplay.textContent = temps;

    timerInterval = setInterval(() => {
        temps--;
        timeDisplay.textContent = temps;

        // Couleur du cercle selon le temps restant
        color = temps > 15 ? "#4CAF50" : (temps > 5 ? "#FF9800" : "#F44336");
        const progress = (temps / 30) * 100;
        circleProgress.style.background = `conic-gradient(${color} ${progress}%, #444 ${progress}%)`;

        if (temps <= 0) {
            chronometre.style.display = "none";
            TimerAudio.pause()
            ErrorAudio.play()
            feedback.textContent = `Le temps est écoulé`;
            feedback.style.color = "red";
            console.log("Le temps est écoulé, le flou est supprimé.");
            clearInterval(timerInterval); // Stopper le timer à 0
            nextBtn.style.display = "Block";
            submitBtn.disabled = true;
        }
    }, 1000);
}

function flou(blurPx) {
    clearInterval(blurInterval);
    blurInterval = setInterval(() => {
        if (blurPx> 0) {
             blurPx -= 2; 
            motoImage.style.filter = `blur(${blurPx}px)`;
            console.log('Flou appliqué:', blurPx);
        } else {
            clearInterval(blurInterval);
        }
    }, 5000); 
}

// Affichage du carousel
function showSlides() {
    const slides = document.querySelectorAll('.mySlides');
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    if (slideIndex >= slides.length) {
        slideIndex = 0; 
    }
    slides[slideIndex].style.display = 'block'; 
}

function plusSlides(n) {
    slideIndex += n;
    const slides = document.querySelectorAll('.mySlides');
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }
    showSlides(); 
}

showSlides();