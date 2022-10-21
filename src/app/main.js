import '../styles/scss/main.scss';
import component from './modules/component';
import { createMatrix, createRandomSet, createSet } from './modules/createMatrix';
import { coordinates } from './modules/coordinates';
import { createLayout } from './modules/layout';
import { audio } from './modules/audio';
import gsap from 'gsap';

require('./modules/roundRect');

createLayout();

let arr = [];
let exp = [];
let size = 3;
let moves = 0;
let timer = 0;
let isPlay = false;
let canClick = true;

const blockTimer = document.getElementById('gameTimer');
const canvas = document.getElementById('canvas');
const buttonShuffle = document.getElementById('gameShuffle');
const buttonPlay = document.getElementById('gamePlay');
const buttonPause = document.getElementById('gamePause');
const button3x3 = document.getElementById('gameSize3');
const button4x4 = document.getElementById('gameSize4');
const button5x5 = document.getElementById('gameSize5');
const button6x6 = document.getElementById('gameSize6');
const button7x7 = document.getElementById('gameSize7');
const button8x8 = document.getElementById('gameSize8');
const soundButton = document.getElementById('gameSound');
const sound = audio();

buttonShuffle.addEventListener('click', () => {
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  gameClear();
})

buttonPlay.addEventListener('click', () => gamePlay())

buttonPause.addEventListener('click', () => gamePause())

button3x3.addEventListener('click', () => {
  size = 3;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button3x3.classList.add('active');
  gameClear();
})

button4x4.addEventListener('click', () => {
  size = 4;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button4x4.classList.add('active');
  gameClear();
})

button5x5.addEventListener('click', () => {
  size = 5;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button5x5.classList.add('active');
  gameClear();
})

button6x6.addEventListener('click', () => {
  size = 6;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button6x6.classList.add('active');
  gameClear();
})

button7x7.addEventListener('click', () => {
  size = 7;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button7x7.classList.add('active');
  gameClear();
})

button8x8.addEventListener('click', () => {
  size = 8;
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  button8x8.classList.add('active');
  gameClear();
})

soundButton.addEventListener('click', () => {
  if(soundButton.classList.contains('active')) {
    soundButton.textContent = 'Sound Off';
    soundButton.classList.remove('active');
    sound.volume = 0;
  } else {
    soundButton.textContent = 'Sound On';
    soundButton.classList.add('active');
    sound.volume = 1;
  }
})

// CREATE ARRAY
arr = createMatrix(size, createRandomSet);
exp = createMatrix(size, createSet);

console.log(arr);
console.log(exp);

const ctx = canvas.getContext('2d');

function update() {
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  arr.map((a, i) => {
    a.map((obj, j) => {
      if(obj.n !== 'free') {
        if(arr[i][j].n == exp[i][j].n) component(ctx, size, obj, true);
        else component(ctx, size, obj);
      }
    })
  })
  if(isPlay && deepEqual(arr, exp)) {
    gamePause ();
    showInfo(`Hooray! You solved the puzzle in ${blockTimer.textContent} and ${moves} moves!`)
  }
  document.getElementById('gameScore').textContent = moves;
}

setInterval(update, 20);

setInterval(() => {
  if(isPlay) {
    timer += 1;
    const h = `${Math.floor(timer / 3600)}`.padStart(2, '0');
    const m = `${Math.floor((timer % 3600) / 60)}`.padStart(2, '0');
    const s = `${Math.floor((timer % 3600) % 60)}`.padStart(2, '0');
    blockTimer.textContent = `${h}:${m}:${s}`;
    // START PAUSE BUTTONS
    buttonPlay.classList.add('active');
    buttonPause.classList.remove('active');
    // console.log(timer)
  } else {
    buttonPlay.classList.remove('active');
    buttonPause.classList.add('active');
  }
}, 1000)

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const fix = 500 / document.getElementById("canvas").offsetWidth;
  const mouseX = (event.clientX - rect.left) * fix;
  const mouseY = (event.clientY - rect.top) * fix;
  return { mouseX, mouseY}
}

canvas.addEventListener('click', function(e) {
  if(canClick) {
    canClick = false;
    const {mouseX, mouseY} = getCursorPosition(canvas, e);
    console.log(mouseX, mouseY);
    arr.map((a, i) => {
      a.map((obj, j) => {
        const { xStart, yStart, xEnd, yEnd} = coordinates(size, j, i);
        if(mouseX > xStart && mouseX < xEnd && mouseY > yStart && mouseY < yEnd) {

          // MOVE UP
          if(arr[i - 1] && arr[i - 1][j] && arr[i - 1][j].n == 'free') {
            const numberY = arr[i][j].y;
            const freeY = arr[i - 1][j].y;
            gsap.to(arr[i][j], {y: freeY, duration: 0.3}).then(() => {
              arr[i - 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = numberY;
            })
            moves += 1;
            gamePlay();
            sound.play();
          }

          // // MOVE DOWN
          if(arr[i + 1] && arr[i + 1][j] && arr[i + 1][j].n == 'free') {
            const numberY = arr[i][j].y;
            const freeY = arr[i + 1][j].y;
            gsap.to(arr[i][j], {y: freeY, duration: 0.3}).then(() => {
              arr[i + 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = numberY;
            })
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }

          // MOVE LEFT
          if(arr[i][j - 1] && arr[i][j - 1].n == 'free') {
            const numberX = arr[i][j].x;
            const freeX = arr[i][j - 1].x;
            gsap.to(arr[i][j], {x: freeX, duration: 0.3}).then(() => {
              arr[i][j - 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = numberX;
            })
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }

          // // MOVE RIGHT
          if(arr[i][j + 1] && arr[i][j + 1].n == 'free') {
            const numberX = arr[i][j].x;
            const freeX = arr[i][j + 1].x;
            gsap.to(arr[i][j], {x: freeX, duration: 0.3}).then(() => {
              arr[i][j + 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = numberX;
            })
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }
        }
      })
    })
  }
  setTimeout(() => canClick = true, 300)
})

// HELPERS
function showInfo(message) {
  document.querySelector('.modal-info__message').textContent = message;
  document.querySelector('.modal-info').classList.add('active');
}

function gameClear () {
  isPlay = false;
  moves = 0;
  timer = 0;
  blockTimer.textContent = '00:00:00';
  buttonPlay.classList.remove('active');
  buttonPause.classList.add('active');
}

function gamePlay () {
  isPlay = true;
  buttonPlay.classList.add('active');
  buttonPause.classList.remove('active');
}

function gamePause () {
  isPlay = false;
  buttonPlay.classList.remove('active');
  buttonPause.classList.add('active');
}

function deepEqual (arr1, arr2) {
  let isEqueal = true;
  arr1.forEach((arr, i) => {
    arr.forEach((obj, j) => {
      if(obj.n !== arr2[i][j].n) isEqueal = false;
      if(obj.x !== arr2[i][j].x) isEqueal = false;
      if(obj.y !== arr2[i][j].y) isEqueal = false;
    })
  })
  return isEqueal
}

document.querySelector('.modal-info__button').addEventListener('click', () => {
  document.querySelector('.modal-info').classList.remove('active');
})





// canvas.addEventListener('mousemove', function(e) {
//   const {x, y} = getCursorPosition(canvas, e);
//   console.log(x, y)
// })
