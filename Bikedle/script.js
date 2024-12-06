// Charger les données JSON contenant les images et noms des motos
function loadJson() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => initializeGame(data))
    .catch(err => console.error('Erreur lors du chargement des données :', err));
}

const motoImage = document.getElementById('moto-image'); // Image affichée
const feedback = document.getElementById('feedback'); // Zone de feedback
const nextBtn = document.getElementById('next-btn'); // Bouton "Suivant"
const submitBtn = document.getElementById('submit-btn'); // Bouton "Valider"
let currentMotoIndex = 0; // Index de la moto actuelle
const guessInput = document.getElementById('guess-input'); // Zone de saisie
const remainingAttempts = document.getElementById('remaining-attempts'); // Compteur d'essais

function initializeGame(data) {
    let attemptsLeft = data.motos[currentMotoIndex]["images"].length; // Nombre d'essais restants
    let currentImageIndex = 0; // Index de l'image affichée pour la moto actuelle
    let blurInterval;
    remainingAttempts.textContent = attemptsLeft;

    // Charger la première image de la première moto
    loadMotoImage(data.motos[currentMotoIndex].images[currentImageIndex]);

    // Gestion du clic sur le bouton "Valider"
    submitBtn.addEventListener('click', () => {
        var userGuess = guessInput.value.trim(); // Récupère et nettoie la saisie
        var correctName = data.motos[currentMotoIndex].name; // Nom correct de la moto
        if(currentMode !== "normal"){
            chronometre.style.display = "block"; //rajoue du chronomètre
        }

        if (userGuess.toLowerCase() === correctName.toLowerCase()) {
            if(currentMode !== "normal"){
                TimerAudio.pause()
                CorrectAudio.play()
                clearInterval(timerInterval);
                motoImage.style.filter = `blur(0px)`;  
                clearInterval(blurInterval);
                remainingAttempts.innerHTML = `0`; 
                verificationGame(data, correctName)
            }
            // Si la réponse est correcte
            feedback.textContent = "Bravo ! Vous avez trouvé la bonne moto.";
            feedback.style.color = "green";
            nextBtn.style.display = "block"; // Affiche le bouton "Suivant"
            submitBtn.disabled = true; // Désactive le bouton "Valider"
        } else {
            // Si la réponse est incorrecte
            ErrorAudio.play()
            attemptsLeft--;
            remainingAttempts.textContent = attemptsLeft;

            // Delai de 1 seconde pour sychroniser le son et le changement d'image
            setTimeout(() => {
                if (attemptsLeft > 0) {
                    currentImageIndex++; // Passe à l'image suivante de la moto
                    if (currentImageIndex < data.motos[currentMotoIndex].images.length) {
                        feedback.textContent = "Mauvaise réponse. Un nouvel indice apparaît.";
                        feedback.style.color = "red";

                        nextBtn.style.display = "none"
                        submitBtn.disabled = false;

                        // Reset le flou et le compteur pour chaque image
                        if(currentMode === "flou") {
                            startBlurGame()
                            timer(30)
                            TimerAudio.play()
                        }
                        loadMotoImage(data.motos[currentMotoIndex].images[currentImageIndex]);
                    } else {
                        // Si plus d'images disponibles, reste sur la dernière
                        feedback.textContent = "Mauvaise réponse. Pas d'autres indices disponibles.";
                        feedback.style.color = "red";
                    }
                } else {
                    GameoverAudio.play();
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
                    feedback.textContent = `Vous avez perdu. La bonne réponse était : ${correctName}`;
                    feedback.style.color = "red";
                    correctName = ' ';
                    verificationGame(data, correctName)
                }
        }, 1000)
        guessInput.value = ''; // Réinitialise la saisie
    };
})
    // Gestion du clic sur le bouton "Suivant"
    nextBtn.addEventListener('click', () => {
        guessInput.value = '';
        if(currentMode === "flou"){
            startBlurGame()
        }
        if(currentMode === "timer"){
            timerGame()
        }
        currentMotoIndex++;
        attemptsLeft = data.motos[currentMotoIndex]["images"].length;
        currentImageIndex = 0; // Réinitialise l'index des images
        if (currentMotoIndex < data.motos.length) {
            feedback.textContent = '';
            remainingAttempts.textContent = attemptsLeft;
            loadMotoImage(data.motos[currentMotoIndex].images[currentImageIndex]);
            submitBtn.disabled = false; // Réactive le bouton "Valider"
            nextBtn.style.display = "none"; // Cache le bouton "Suivant"
        } else {
            feedback.textContent = "Félicitations, vous avez terminé le jeu !";
            feedback.style.color = "blue";
            nextBtn.style.display = "none"; // Cache le bouton "Suivant"
            submitBtn.disabled = true; // Désactive le bouton "Valider"
        }
    });

    // Charger une image
    function loadMotoImage(imageUrl) {
        motoImage.src = imageUrl;
    }
}
function verificationGame(data, nameMoto) {
     // Vérifie s'il y a d'autre motos à deviner
     if(data.motos[currentMotoIndex + 1]){
        nextBtn.style.display = "block"; // Affiche le bouton "Suivant" 
    } else {
        setTimeout(() => {
            endGame(nameMoto)
        }, 5000);
    }
    submitBtn.disabled = true; // Désactive le bouton "Valider"
}
const timeDisplay = document.getElementById('time-display');
const circleProgress = document.getElementById('circle-progress');
const chronometre = document.querySelector('.timer-container');
const game_container = document.querySelector('.game-container');
const select_games = document.querySelector('.game-container-select');
const title = document.querySelector('.title');

// Effets sonores
const TimerAudio = document.getElementById('TimerAudio'); 
const ErrorAudio = document.getElementById('ErrorAudio'); 
const GameoverAudio = document.getElementById('Game-Over-Audio');
const CorrectAudio = document.getElementById('CorrectAudio');
const FondAudio = document.getElementById('FondAudio');


// // Fonction pour jouer l'audio
// function playFondAudio() {
//     FondAudio.play().then(() => {
//       console.log("Audio joué");
//     }).catch(() => {
//       console.error("Erreur de lecture de l'audio:");
//     });
// }
// playFondAudio()

let color;
let timerInterval; 
let blurInterval;

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

let currentMode = "normal"; 

function startNormalGame() {
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

let slideIndex = 0;

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


function endGame(nameMoto) { 
    currentMotoIndex = 0;
    currentImageIndex = 0;
    attemptsLeft = 0;
    currentMode = "normal"; 

    // Arrêter les intervalles et réinitialiser les styles
    clearInterval(timerInterval);
    clearInterval(blurInterval);
    motoImage.style.filter = "none";
    chronometre.style.display = "none";

    // Réinitialiser l'interface utilisateur
    feedback.textContent = '';
    feedback.style.color = '';
    nextBtn.style.display = "none";
    submitBtn.disabled = false;
    remainingAttempts.textContent = '';
    guessInput.value = '';

    nameMoto.value = '';
    
    select_games.style.display = "block";
    game_container.style.display = "none";
    loadJson()
}

showSlides();
loadJson()

