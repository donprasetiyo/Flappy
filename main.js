import './style.css'
import javascriptLogo from './javascript.svg'

document.querySelector('#app').innerHTML = `
<div id="ScoreText"></div>
  <div id="game">
    <div id="block"></div>
    <div id="hole"></div>
    <img id="character"></img>
    <div id="center">
    <div id="dialog">You Lose! Your score is. Press [SPACE] bar to restart the game.</div>
    
    </div>
    
    <div id="ground"></div>
    <div id="before-ground"></div>
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
let beforeGround = document.getElementById("before-ground");
let getPipeHeight = 0;




let isWin = false;
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
let currentHole = 0;


let gravityWeight = 0;


let wingSound = new Audio('/assets/wing.mp3');
let pointSound = new Audio('/assets/point.mp3');
let hitSound = new Audio('/assets/hit.mp3');
let dieSound = new Audio('/assets/die.mp3');

function holeIteration() {
  //let random = -((Math.random()*300) + gameHeight);
  //top is -gameHeight and bottom is gameHeight-(pipesize)
  //top is -745 and bottom is
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
  currentHole = hole.style.top;
  counter++;
  ScoreText.innerText = "Score: " + counter;
}


hole.addEventListener('animationiteration', holeIteration);




const gravityInterval = setInterval(() => {
  gravityWeight++;


}, 100);

const rotationInterval = setInterval(() => {
  characterRotation = characterRotation + 2;
}, 20);

function gameIntervalManager(isResume) {
  if (isResume === true) {
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
      //console.log(lastBlockPosition - document.getElementById("game").offsetLeft)
      //console.log(blockLeft, cTop, hole.style.top, holeTop)
      //ScoreText.innerText = `${cTop}, ${holeTop}, ${holeBottom}`;
      ScoreText.style.zIndex = 999999;
      if (cBottom >= (gameHeight - groundHeight) || ((blockLeft <= 203) && (blockLeft > 100) && ((cTop < holeTop) || (cBottom > holeBottom)))) {
        //ScoreText.innerText = "game over. your score is " + counter.toString();

        // character.style.top = (characterTop + gravityWeight) + "px";
        // character.style.transform = `rotate(${characterRotation}deg)`;
        // character.src = "/assets/unflipped.png";

        isLose = true;
        hitSound.play();
        dieSound.play();
        dialogBox.innerText = `You Lose! Your score is ${counter}. Press [SPACE] bar to restart the game.`
        centerBox.style.display = "block";
        // isPaused = true;
        //character.style.top = characterLastTop + "px";
        //counter = 0;
        //stop the game

        block.style.animationPlayState = 'paused';
        hole.style.animationPlayState = 'paused';
        ground.style.animationPlayState = 'paused';
        beforeGround.style.animationPlayState = 'paused';

        hole.removeEventListener('animationiteration', null);

        //block.style.left = lastBlockPosition


        //block.style.animation = "unset"
      }

      if ((blockLeft <= 203) && (blockLeft > 100) && ((cTop > holeTop) || (cBottom < holeBottom))) {
        pointSound.play();

      }
      if (cBottom >= (gameHeight - groundHeight)) {
        
        clearInterval(gameInterval);
      }
    }, 10);
  }

}


gameIntervalManager(true);


function jumpNow() {

  if (isLose === false) {
    wingSound.currentTime = 0;
    wingSound.play();
    gravityWeight = 0;

    let baseRotate = -35;
    // characterRotation = characterRotation - 10;
    // //let jumpRotate = characterRotation--;

    // // while (characterRotation > baseRotate) {
    // //   characterRotation--;
    // //   //break;
    // // }

    characterRotation = -45;

    // ScoreText.innerText = `${characterRotation}`;
    const jumpRotation = setInterval(() => {

      // if (characterRotation > -30) {
      //   characterRotation = -30;
      //   clearInterval(jumpRotation);
      // }

      // characterRotation = jumpRotate;
    }, 100);

    jumping = 1;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
      jumpCount++;
      var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
      if (characterTop > 6 && jumpCount < 15) {
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

  //console.log("pressed")
}

document.querySelector('#app').addEventListener('keydown', jumpNow())

document.onkeydown = checkKey;

function checkKey(e) {

  e = e || window.event;

  if (e.keyCode == '38' && isPaused === false) {
    // up arrow
    // console.log('up')
    jumpNow();

  }
  else if (e.keyCode == '32') {
    // space button
    resetGame();
  }
  else if (e.keyCode == '37') {
    // left arrow
  }
  else if (e.keyCode == '39') {
    // right arrow
  }

}


function resetGame() {

  isLose = false;
  centerBox.style.display = "none";
  ScoreText.innerText = "Score: " + 0;
  counter = 0;
  isPaused = false;

  hole.addEventListener('animationiteration', holeIteration)

  //   block.style.setProperty('--my-start-width', `${}px`);
  // hole.style.setProperty('--my-start-width', `${-gameWidth}px`);
  character.style.top = "100px";
  // block.style.animation = "block 1s infinite linear";
  // hole.style.animation = "block 1s infinite linear";
  // block.style.animation = "block 4s infinite linear";
  // hole.style.animation = "block 4s infinite linear";


  block.style.animationPlayState = 'running';
  hole.style.animationPlayState = 'running';
  ground.style.animationPlayState = 'running';
  beforeGround.style.animationPlayState = 'running';

  block.style.animation = "none";
  hole.style.animation = "none";
  ground.style.animation = "none";
  beforeGround.style.animation = "none";



  //   block.style.setProperty('--my-start-width', `${gameWidth}px`);
  // hole.style.setProperty('--my-start-width', `${gameWidth}px`);
  gravityWeight = 0;
  characterRotation = -45;
  gameIntervalManager(true);
  // gravityInterval();
  // rotationInterval();


  setTimeout(() => {
    block.style.animation = "block 4s infinite linear";
    hole.style.animation = "block 4s infinite linear";
    ground.style.animation = "block 4s infinite linear";
    beforeGround.style.animation = "moveBeforeGround 4s infinite linear"
    block.style.animationPlayState = 'running';
    hole.style.animationPlayState = 'running';
    ground.style.animationPlayState = 'running';
    beforeGround.style.animationPlayState = 'running';

  }, 1);
  //    block.style.setProperty('--my-start-width', `${gameWidth}px`);
  // hole.style.setProperty('--my-start-width', `${gameWidth}px`);

}