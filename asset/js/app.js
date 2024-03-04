'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let box = 20;

let snake = []; // on initialise le serpent
snake[0] = { x: 10 * box, y: 10 * box }; // on initialise la position du serpent au milieu du canvas

let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}; // on initialise la position de la nourriture

let score = 0;

let d;

document.addEventListener('keydown', direction);

function direction(event) {
    let key = event.keyCode; // on récupère le code de la touche appuyée
    if (key == 37 && d != "RIGHT") { // si la touche est la flèche de gauche et que le serpent ne va pas à droite alors on va à gauche
        d = "LEFT";
    } else if(key == 38 && d != "DOWN") { // si la touche est la flèche du haut et que le serpent ne va pas en bas alors on va en haut
        d = "UP";
    } else if (key == 39 && d != "LEFT") { // si la touche est la flèche de droite et que le serpent ne va pas à gauche alors on va à droite
        d = "RIGHT";
    } else if (key == 40 && d != "UP") { // si la touche est la flèche du bas et que le serpent ne va pas en haut alors on va en bas
        d = "DOWN";
    }
}

function draw() {
    context.clearRect(0, 0, 400, 400); // on efface le canvas à chaque frame

    for (let i = 0; i < snake.length; i++){
        context.fillStyle = (i == 0) ? "blue" : "lightblue"; // on définit la couleur du serpent
        context.fillRect(snake[i].x, snake[i].y, box, box); // on dessine le serpent
        context.strokeStyle = "red"; // on définit la couleur de la bordure du serpent
        context.strokeRect(snake[i].x, snake[i].y, box, box); // on dessine la bordure du serpent
    }

    context.fillStyle = "red"; // on définit la couleur de la nourriture
    // food soit arrondi pour former un cercle
    context.beginPath();
    context.arc(food.x + 10, food.y + 10, 10, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    

    let snakeX = snake[0].x; // on récupère la position de la tête du serpent
    let snakeY = snake[0].y; // on récupère la position de la tête du serpent

    if (d == "LEFT") snakeX -= box; // si la direction est la gauche on déplace la tête du serpent vers la gauche
    if (d == "UP") snakeY -= box; // si la direction est le haut on déplace la tête du serpent vers le haut
    if (d == "RIGHT") snakeX += box; // si la direction est la droite on déplace la tête du serpent vers la droite
    if (d == "DOWN") snakeY += box; // si la direction est le bas on déplace la tête du serpent vers le bas

    if (snakeX == food.x && snakeY == food.y) { // si la tête du serpent touche la nourriture
        score++; // on incrémente le score
        food = { // on change la position de la nourriture
            x: Math.floor(Math.random() * 15 + 1) * box,
            y: Math.floor(Math.random() * 15 + 1) * box
        };
    } else {
        snake.pop(); // on retire le dernier élément du tableau
    }
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if(snakeX < 0 || snakeY < 0 || snakeX > 19*box || snakeY > 19 * box || collision(newHead, snake)) {
        clearInterval(game);
        endGame();
    }

    snake.unshift(newHead); // on ajoute la nouvelle tête du serpent

    context.fillStyle = "white";
    context.font = "30px Roboto";
    context.fillText(score, 2 * box, 1.6 * box);

}

function collision(head, array) {
    for(let g = 0; g < array.length; g++) {
        if(head.x == array[g].x && head.y == array[g].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, 100); // on appelle la fonction draw toutes les 100ms

function endGame() {
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.style.display = 'block';
    gameOverMessage.innerHTML = "<p style='color: white; text-align: center'>Tu as perdu ! Ton score est de " + score + "</p><p style='color: white; text-align: center'>Cliquez pour rejouer</p>";

    // Ajoutez un gestionnaire d'événements pour redémarrer le jeu au clic
    canvas.addEventListener('click', restartGame);
}


function restartGame() {
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.style.display = 'none';

    // Reste du code pour redémarrer le jeu
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box
    };
    score = 0;
    d = undefined;
    clearInterval(game);
    game = setInterval(draw, 100);
    canvas.removeEventListener('click', restartGame);
}
