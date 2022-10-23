import '../styles/scss/main.scss';
import component from './modules/component';
import { createMatrix, createRandomSet, createSet } from './modules/createMatrix';
import { getComponentPosition, getCursorPosition, deepEqual } from './modules/coordinates';
import { createLayout } from './modules/layout';
import { showModalInfo, showModalResult, modalCloseButton } from './modules/modal';
import { saveCurrentPosition, saveResult, unsaveCurrentPosition } from './modules/results';
import { timerToHMS } from './modules/time';
import { audio } from "./modules/audio";
require('./modules/roundRect');

createLayout();
modalCloseButton();

const blockTimer = document.getElementById('gameTimer');
const canvas = document.getElementById('canvas');
const buttonPlay = document.getElementById('gamePlay');
const buttonPause = document.getElementById('gamePause');
const buttonSave = document.getElementById('gameSave');
const buttonResults = document.getElementById('gameResults');
const button3x3 = document.getElementById('gameSize3');
const button4x4 = document.getElementById('gameSize4');
const button5x5 = document.getElementById('gameSize5');
const button6x6 = document.getElementById('gameSize6');
const button7x7 = document.getElementById('gameSize7');
const button8x8 = document.getElementById('gameSize8');
const soundButton = document.getElementById('gameSound');
const sound = audio();

let arr = [];
let exp = [];
let size = 4;
let moves = 0;
let timer = 0;
let isPlay = false;
let canClick = true;
let useSaver = false;
let volume = 1;

buttonPlay.addEventListener('click', () => {
  gameShuffle();
  gamePlay();
})

buttonPause.addEventListener('click', (e) => {
  e.target.classList.contains('active') ? gamePlay() : gamePause();
})

buttonSave.addEventListener('click', (e) => {
  if(e.target.classList.contains('active')) {
    unsaveCurrentPosition();
    useSaver = false;
  }
  else {
    saveCurrentPosition(arr, exp, size, moves, timer, volume);
    useSaver = true;
  }
});

buttonResults.addEventListener('click', () => showModalResult())

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
    volume = 0;
  } else {
    soundButton.textContent = 'Sound On';
    soundButton.classList.add('active');
    sound.volume = 1;
    volume = 1;
  }
})

const savedData = JSON.parse(localStorage.getItem('gameSave'));
console.log('savedData', savedData);

if(savedData &&
  savedData.arr &&
  savedData.exp &&
  savedData.size &&
  savedData.moves >= 0 &&
  savedData.timer >= 0 &&
  savedData.volume >= 0
) {
  arr = savedData.arr;
  exp = savedData.exp;
  size = savedData.size;
  moves = savedData.moves;
  timer = savedData.timer;
  volume = savedData.volume;
  blockTimer.textContent = timerToHMS(timer);
  buttonSave.classList.add('active');
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  document.getElementById(`gameSize${size}`).classList.add('active');
  useSaver = true;
  if(volume == 0) {
    soundButton.textContent = 'Sound Off';
    soundButton.classList.remove('active');
  }
  console.log('GET SAVED SET');
  // console.log(arr);
  // console.log(exp);
} else {
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  console.log('CREATE NEW SET');
  // console.log(arr);
  // console.log(exp);
}

const ctx = canvas.getContext('2d');

function gameFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arr.map((a, i) => {
    a.map((obj, j) => {
      if(obj.n !== 'free') {
        arr[i][j].n == exp[i][j].n ? component(ctx, size, obj, true) : component(ctx, size, obj);
      }
    })
  })
  if(isPlay && deepEqual(arr, exp)) {
    gamePause ();
    saveResult(moves, timer, size)
    showModalInfo(`Hooray! You solved the puzzle in ${blockTimer.textContent} and ${moves} moves!`)
    gameShuffle();
  }
  if(useSaver) {
    saveCurrentPosition(arr, exp, size, moves, timer, volume);
  }
  document.getElementById('gameScore').textContent = moves;
}

setInterval(() => window.requestAnimationFrame(() => gameFrame()), 20);

setInterval(() => {
  if(isPlay) {
    timer += 1;
    blockTimer.textContent = timerToHMS(timer);
  }
}, 1000)

canvas.addEventListener('click', function(e) {
  if(canClick) {
    canClick = false;
    const {mouseX, mouseY} = getCursorPosition(canvas, e);
    // console.log(mouseX, mouseY);
    arr.forEach((a, i) => {
      a.forEach((obj, j) => {
        const { xStart, yStart, xEnd, yEnd} = getComponentPosition(size, j, i);
        if(mouseX > xStart && mouseX < xEnd && mouseY > yStart && mouseY < yEnd) {

          // MOVE UP
          if(arr[i - 1] && arr[i - 1][j] && arr[i - 1][j].n == 'free') {
            const from = arr[i][j].y;
            const to = arr[i - 1][j].y;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 5;
              arr[i][j].y = from - position;
              if(arr[i][j].y < to) arr[i][j].y = to;
              else setTimeout(() => animStep(), 18)
            }
            animStep()
            setTimeout(() => {
              arr[i - 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = from;
            }, 200)
            moves += 1;
            gamePlay();
            if(volume) sound.play();
          }

          // // MOVE DOWN
          if(arr[i + 1] && arr[i + 1][j] && arr[i + 1][j].n == 'free') {
            const from = arr[i][j].y;
            const to = arr[i + 1][j].y;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 5;
              arr[i][j].y = from + position;
              if(arr[i][j].y > to) arr[i][j].y = to;
              else setTimeout(() => animStep(), 18)
            }
            animStep()
            setTimeout(() => {
              arr[i + 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = from;
            }, 200)
            moves += 1;
            isPlay = true;
            gamePlay();
            if(volume) sound.play();
          }

          // MOVE LEFT
          if(arr[i][j - 1] && arr[i][j - 1].n == 'free') {
            const from = arr[i][j].x;
            const to = arr[i][j - 1].x;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 5;
              arr[i][j].x = from - position;
              if(arr[i][j].x < to) arr[i][j].x = to;
              else setTimeout(() => animStep(), 18)
            }
            animStep();
            setTimeout(() => {
              arr[i][j - 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = from;
            }, 200)
            moves += 1;
            isPlay = true;
            gamePlay();
            if(volume) sound.play();
          }

          // MOVE RIGHT
          if(arr[i][j + 1] && arr[i][j + 1].n == 'free') {
            const from = arr[i][j].x;
            const to = arr[i][j + 1].x;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 5;
              arr[i][j].x = from + position;
              if(arr[i][j].x > to) arr[i][j].x = to;
              else setTimeout(() => animStep(), 18)
            }
            animStep();

            setTimeout(() => {
              arr[i][j + 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = from;
            }, 200)
            moves += 1;
            isPlay = true;
            gamePlay();
            if(volume) sound.play();
          }
        }
      })
    })
  }
  setTimeout(() => canClick = true, 250)
})

// HELPERS
function gameShuffle() {
  arr = createMatrix(size, createRandomSet);
  exp = createMatrix(size, createSet);
  gameClear();
}

function gameClear() {
  isPlay = false;
  moves = 0;
  timer = 0;
  blockTimer.textContent = '00:00:00';
  buttonPause.classList.add('active');
}

function gamePlay() {
  isPlay = true;
  buttonPause.classList.remove('active');
}

function gamePause() {
  isPlay = false;
  buttonPlay.classList.remove('active');
  buttonPause.classList.add('active');
}
