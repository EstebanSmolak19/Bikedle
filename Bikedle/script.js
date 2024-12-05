// Charger les données JSON contenant les images et noms des motos
fetch('data.json')
    .then(response => response.json())
    .then(data => initializeGame(data))
    .catch(err => console.error('Erreur lors du chargement des données :', err));

const motoImage = document.getElementById('moto-image'); // Image affichée

function initializeGame(data) {
    let currentMotoIndex = 0; // Index de la moto actuelle
    let attemptsLeft = data.motos[currentMotoIndex]["images"].length; // Nombre d'essais restants
    let currentImageIndex = 0; // Index de l'image affichée pour la moto actuelle

    const guessInput = document.getElementById('guess-input'); // Zone de saisie
    const submitBtn = document.getElementById('submit-btn'); // Bouton "Valider"
    const feedback = document.getElementById('feedback'); // Zone de feedback
    const remainingAttempts = document.getElementById('remaining-attempts'); // Compteur d'essais
    const nextBtn = document.getElementById('next-btn'); // Bouton "Suivant"
    remainingAttempts.textContent = attemptsLeft;

    // Charger la première image de la première moto
    loadMotoImage(data.motos[currentMotoIndex].images[currentImageIndex]);


    // Gestion du clic sur le bouton "Valider"
    submitBtn.addEventListener('click', () => {
        const userGuess = guessInput.value.trim(); // Récupère et nettoie la saisie
        const correctName = data.motos[currentMotoIndex].name; // Nom correct de la moto

        if (userGuess.toLowerCase() === correctName.toLowerCase()) {
            // Si la réponse est correcte
            feedback.textContent = "Bravo ! Vous avez trouvé la bonne moto.";
            feedback.style.color = "green";
            nextBtn.style.display = "block"; // Affiche le bouton "Suivant"
            submitBtn.disabled = true; // Désactive le bouton "Valider"
        } else {
            // Si la réponse est incorrecte
            attemptsLeft--;
            remainingAttempts.textContent = attemptsLeft;

            if (attemptsLeft > 0) {
                currentImageIndex++; // Passe à l'image suivante de la moto
                if (currentImageIndex < data.motos[currentMotoIndex].images.length) {
                    feedback.textContent = "Mauvaise réponse. Un nouvel indice apparaît.";
                    feedback.style.color = "red";

                    loadMotoImage(data.motos[currentMotoIndex].images[currentImageIndex]);
                } else {
                    // Si plus d'images disponibles, reste sur la dernière
                    feedback.textContent = "Mauvaise réponse. Pas d'autres indices disponibles.";
                    feedback.style.color = "red";
                }
            } else {
                feedback.textContent = `Vous avez perdu. La bonne réponse était : ${correctName}.`;
                feedback.style.color = "red";
                nextBtn.style.display = "block"; // Affiche le bouton "Suivant"
                submitBtn.disabled = true; // Désactive le bouton "Valider"
            }
        }

        guessInput.value = ''; // Réinitialise la saisie
    });

    // Gestion du clic sur le bouton "Suivant"
    nextBtn.addEventListener('click', () => {
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

let blurPx = 25;

function timer(temps) {

    const display = document.querySelector('.timer');
    display.textContent = temps;
    temps--; 

    const countdownTimeout = setTimeout(() => {
        if (temps >= 0) {
            timer(temps);
        } else {
            display.style.display = "none"
            console.log("Le temps est écoulé, le flou est supprimé.");
        }
    }, 1000); 
}


function flou() {
    const blurInterval = setInterval(() => {
        if (blurPx > 0) {
            blurPx -= 5; 
            motoImage.style.filter = `blur(${blurPx}px)`;
            console.log('Flou appliqué:', blurPx);
        } else {
            clearInterval(blurInterval);
        }
    }, 5000); 
}

const valideBtn = document.querySelector('.valideBtn');
const selectElement = document.querySelector('select[name="games-select"]');
const game_container = document.querySelector('.game-container');
const select_games = document.querySelector('.game-container-select');
const title = document.querySelector('.title');

const gameFunctions = {
    normal: startNormalGame,
    flou: startBlurGame,
    timer: timerGame
};

valideBtn.addEventListener('click', () => {
    const selectedValue = selectElement.value; 
    const selectedFunction = gameFunctions[selectedValue];
    if (selectedFunction) {
        selectedFunction(); 
    }
});

function startNormalGame() {
    motoImage.style.filter = `blur(0px)`;
    select_games.style.display = "none";
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> NormalGame </span>`
}

function startBlurGame() {
    select_games.style.display = "none";
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> BlurGame </span>`
    flou()
    timer(30)
}

function timerGame() {
    console.log('oui')
    motoImage.style.filter = `blur(0px)`;
    select_games.style.display = "none";
    game_container.style.display = "block";
    title.innerHTML = `Bikedle <span> timerGame </span>`
    timer(30);
}