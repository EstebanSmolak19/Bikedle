// Charger les données JSON contenant les images et noms des motos
fetch('data.json')
    .then(response => response.json())
    .then(data => initializeGame(data))
    .catch(err => console.error('Erreur lors du chargement des données :', err));

function initializeGame(data) {
    let currentMotoIndex = 0; // Index de la moto actuelle
    let attemptsLeft = 3; // Nombre d'essais restants
    let currentImageIndex = 0; // Index de l'image affichée pour la moto actuelle

    const motoImage = document.getElementById('moto-image'); // Image affichée
    const guessInput = document.getElementById('guess-input'); // Zone de saisie
    const submitBtn = document.getElementById('submit-btn'); // Bouton "Valider"
    const feedback = document.getElementById('feedback'); // Zone de feedback
    const remainingAttempts = document.getElementById('remaining-attempts'); // Compteur d'essais
    const nextBtn = document.getElementById('next-btn'); // Bouton "Suivant"

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
        attemptsLeft = 3;
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
