import './style.css';

document.querySelector('#app').innerHTML = `
<div id="ScoreText"></div>
  <div id="game">
    <div id="block"></div>
    <div id="hole"></div>
    <img id="character"></img>
    <div id="center">
    <div id="dialog">You Lose! Your score is. Click or press [SPACE] bar to restart the game.
    
    </div>
    
    </div>
    
    <div id="ground"></div>
  </div>
  
`
let game = document.getElementById("game");
let block = document.getElementById("block");
let hole = document.getElementById("hole");
let character = document.getElementById("character");
let ScoreText = document.getElementById("ScoreText");
let dialogBox = document.getElementById("dialog");
let centerBox = document.getElementById("center");
let ground = document.getElementById("ground");
let getPipeHeight = 0;
let isLose = false;
ScoreText.innerText = "Score: " + 0;
character.src = "/assets/idle.png";
let characterRotation = 0;
let gameHeight = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
let gameWidth = parseInt(window.getComputedStyle(game).getPropertyValue("width"));
let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue("height"));
//set block's left using computed window width for CSS animation
block.style.setProperty('--my-start-width', `${gameWidth}px`);
hole.style.setProperty('--my-start-width', `${gameWidth}px`);
ground.style.setProperty('--my-start-width', `${gameWidth}px`);
document.documentElement.style.setProperty('--max-window-width-minus', `${0}px`);
let jumping = 0;
let counter = 0;
let isPaused = false;
let gravityWeight = 0;
let wingSound = new Audio('/assets/wing.mp3');
let pointSound = new Audio('/assets/point.mp3');
let hitSound = new Audio('/assets/hit.mp3');
let dieSound = new Audio('/assets/die.mp3');

let isWelcomePressed = false;

dialogBox.innerText = `Welcome to the game. Tap the screen or press Up-Arrow to jump and start playing.`;
centerBox.style.display = "block";

function holeIteration() {
  let top = -gameHeight + gameHeight;
  let bottom = -gameHeight + (gameHeight - getPipeHeight) + gameHeight;
  bottom = bottom - groundHeight;
  //get random value between top and bottom;
  function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const rndInt = randomIntFromInterval((top), bottom)
  let random = rndInt - gameHeight;
  hole.style.top = random + "px";
  counter++;
  ScoreText.innerText = "Score: " + counter;
}

hole.addEventListener('animationiteration', holeIteration);
const gravityInterval = setInterval(() => {
  gravityWeight++;
}, 150);

const rotationInterval = setInterval(() => {
  characterRotation = characterRotation + 2;
}, 20);

function gameIntervalManager(isResume) {

  if (isResume === true && isWelcomePressed === true) {

    const gameInterval = setInterval(() => {

      var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
      var cBottom = characterTop + parseInt(window.getComputedStyle(character).getPropertyValue("height"));

      if (jumping === 0) {

        if (cBottom <= (gameHeight - groundHeight)) {

          character.style.top = (characterTop + gravityWeight) + "px";
          character.style.transform = `rotate(${characterRotation}deg)`;
          character.src = "/assets/unflipped.png";

        }
      }

      let characterLastTop = characterTop;

      let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
      let holeCSSTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
      let holeHeight = parseInt(window.getComputedStyle(hole).getPropertyValue("height"));

      let cTop = characterLastTop;
      let lastBlockPosition = block.getBoundingClientRect().left;
      let holeTop = holeCSSTop + gameHeight;
      let holeBottom = holeTop + holeHeight;
      getPipeHeight = holeBottom - holeTop;
      ScoreText.style.zIndex = 999999;

      let characterCurrentWidth = parseInt(window.getComputedStyle(character).getPropertyValue("width"));
      let comparisonNumber = 100 - characterCurrentWidth;

      if (cBottom >= (gameHeight - groundHeight) || ((blockLeft <= (203 - comparisonNumber)) && (blockLeft > (100 - comparisonNumber)) && ((cTop < holeTop) || (cBottom > holeBottom)))) {

        isLose = true;
        hitSound.play();
        dieSound.play();
        dialogBox.innerText = `You Lose! Your score is ${counter}`;
        let resetButton = document.createElement('button');
        resetButton.innerText = 'Restart Game';
        dialogBox.appendChild(resetButton);

        document.querySelector('#dialog > button').addEventListener('click', () => {
          if (isPaused === true) {
            resetGame();
          }
        })

        centerBox.style.display = "block";
        isPaused = true;
        block.style.animationPlayState = 'paused';
        hole.style.animationPlayState = 'paused';
        ground.style.animationPlayState = 'paused';
        hole.removeEventListener('animationiteration', null);
        clearInterval(gameInterval);

      }

      if ((blockLeft <= (103 - comparisonNumber)) && (blockLeft > (0 - comparisonNumber)) && ((cTop > holeTop) || (cBottom < holeBottom))) {

        pointSound.play();

      }

    }, 10);
  }

  if (isWelcomePressed === false) {

    block.style.animationPlayState = 'paused';
    hole.style.animationPlayState = 'paused';
    ground.style.animationPlayState = 'paused';

  }
}

gameIntervalManager(true);

function jumpNow() {

  if (isLose === false) {

    wingSound.currentTime = 0;
    wingSound.play();
    gravityWeight = 0;
    characterRotation = -45;

    const jumpRotation = setInterval(() => {
    }, 100);

    jumping = 1;
    let jumpCount = 0;

    let jumpInterval = setInterval(() => {
      jumpCount++;

      var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));

      if (characterTop > 6 && jumpCount < 15 && isWelcomePressed === true) {

        character.style.top = (characterTop - 8) + "px";
        character.src = "/assets/flipped.png";

      }

      if (jumpCount > 20) {

        clearInterval(jumpInterval);
        jumping = 0;
        jumpCount = 0;

      }

    }, 10);

  }
}

document.querySelector('#app').addEventListener('keydown', jumpNow());
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == '38' && isPaused === false) {
    jumpNow();
  }

  if (e.keyCode == '38' && isWelcomePressed === false) {
    isWelcomePressed = true;
    block.style.animationPlayState = 'running';
    hole.style.animationPlayState = 'running';
    ground.style.animationPlayState = 'running';
    gameIntervalManager(true);
    centerBox.style.display = "none";
  }

  else if (e.keyCode == '32' && isPaused === true) {
    resetGame();
  }

  else if (e.keyCode == '37') {
  }

  else if (e.keyCode == '39') {
  }
}

function resetGame() {
  gravityWeight = 0;
  isLose = false;
  centerBox.style.display = "none";
  ScoreText.innerText = "Score: " + 0;
  counter = 0;
  isPaused = false;
  hole.addEventListener('animationiteration', holeIteration)
  character.style.top = "100px";
  block.style.animationPlayState = 'running';
  hole.style.animationPlayState = 'running';
  ground.style.animationPlayState = 'running';
  block.style.animation = "none";
  hole.style.animation = "none";
  ground.style.animation = "none";
  gravityWeight = 0;
  characterRotation = -45;
  gameIntervalManager(true);
  setTimeout(() => {
    block.style.animation = "block 4s infinite linear";
    hole.style.animation = "block 4s infinite linear";
    ground.style.animation = "block 4s infinite linear";
    block.style.animationPlayState = 'running';
    hole.style.animationPlayState = 'running';
    ground.style.animationPlayState = 'running';
  }, 1);
}

document.querySelector('#app').addEventListener('click', () => {
  if (isPaused === false) {
    jumpNow();
  }
  if (isWelcomePressed === false) {
    isWelcomePressed = true;
    block.style.animationPlayState = 'running';
    hole.style.animationPlayState = 'running';
    ground.style.animationPlayState = 'running';
    gameIntervalManager(true);
    centerBox.style.display = "none";
  }
  // if (isPaused === true){
  //   resetGame();
  // }
});


