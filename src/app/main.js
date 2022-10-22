import '../styles/scss/main.scss';
import component from './modules/component';
import { createMatrix, createRandomSet, createSet } from './modules/createMatrix';
import { coordinates } from './modules/coordinates';
import { createLayout } from './modules/layout';
import { audio } from './modules/audio';
import { resultData } from './modules/data';

require('./modules/roundRect');

createLayout();

let arr = [];
let exp = [];
let size = 4;
let moves = 0;
let timer = 0;
let isPlay = false;
let canClick = true;
let balls = -1;
let saveStep = false;

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

buttonPlay.addEventListener('click', () => {
  gameShuffle();
  gamePlay()
})

buttonPause.addEventListener('click', (e) => {
  if(e.target.classList.contains('active')) gamePlay();
  else gamePause();
})

buttonSave.addEventListener('click', (e) => {
  if(e.target.classList.contains('active')) {
    unsaveCurrentPosition();
    saveStep = false;
  }
  else {
    saveCurrentPosition();
    saveStep = true;
  }
});

buttonResults.addEventListener('click', () => showResult())

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

const savedData = JSON.parse(localStorage.getItem('gameSave'));
console.log('savedData', savedData);

if(savedData &&
  savedData.arr &&
  savedData.exp &&
  savedData.size &&
  savedData.moves >= 0 &&
  savedData.timer >= 0
) {
  arr = savedData.arr;
  exp = savedData.exp;
  size = savedData.size;
  moves = savedData.moves;
  timer = savedData.timer;
  blockTimer.textContent = timerToHMS(timer);
  buttonSave.classList.add('active');
  document.querySelector('.buttons-bottom .active').classList.remove('active');
  document.getElementById(`gameSize${size}`).classList.add('active');
  saveStep = true;
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
    saveResult();
    showInfo(`Hooray! You solved the puzzle in ${blockTimer.textContent} and ${moves} moves!`)
    gameShuffle();
  }
  if(saveStep) {
    saveCurrentPosition();
  }
  document.getElementById('gameScore').textContent = moves;
}

setInterval(update, 20);

setInterval(() => {
  if(isPlay) {
    timer += 1;
    blockTimer.textContent = timerToHMS(timer);
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
    arr.forEach((a, i) => {
      a.forEach((obj, j) => {
        const { xStart, yStart, xEnd, yEnd} = coordinates(size, j, i);
        if(mouseX > xStart && mouseX < xEnd && mouseY > yStart && mouseY < yEnd) {

          // MOVE UP
          if(arr[i - 1] && arr[i - 1][j] && arr[i - 1][j].n == 'free') {
            const from = arr[i][j].y;
            const to = arr[i - 1][j].y;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 15;
              arr[i][j].y = from - position;
              if(arr[i][j].y < to) arr[i][j].y = to;
              else setTimeout(() => animStep(), 20)
            }
            animStep()
            setTimeout(() => {
              arr[i - 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = from;
            }, 400)
            moves += 1;
            gamePlay();
            sound.play();
          }

          // // MOVE DOWN
          if(arr[i + 1] && arr[i + 1][j] && arr[i + 1][j].n == 'free') {
            const from = arr[i][j].y;
            const to = arr[i + 1][j].y;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 15;
              arr[i][j].y = from + position;
              if(arr[i][j].y > to) arr[i][j].y = to;
              else setTimeout(() => animStep(), 20)
            }
            animStep()
            setTimeout(() => {
              arr[i + 1][j].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].y = from;
            }, 400)
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }

          // MOVE LEFT
          if(arr[i][j - 1] && arr[i][j - 1].n == 'free') {
            const from = arr[i][j].x;
            const to = arr[i][j - 1].x;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 15;
              arr[i][j].x = from - position;
              if(arr[i][j].x < to) arr[i][j].x = to;
              else setTimeout(() => animStep(), 20)
            }
            animStep();
            setTimeout(() => {
              arr[i][j - 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = from;
            }, 400)
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }

          // MOVE RIGHT
          if(arr[i][j + 1] && arr[i][j + 1].n == 'free') {
            const from = arr[i][j].x;
            const to = arr[i][j + 1].x;
            let position = 0;
            //
            const animStep = () => {
              position += 1 / 15;
              arr[i][j].x = from + position;
              if(arr[i][j].x > to) arr[i][j].x = to;
              else setTimeout(() => animStep(), 20)
            }
            animStep();

            setTimeout(() => {
              arr[i][j + 1].n = obj.n;
              arr[i][j].n = 'free';
              arr[i][j].x = from;
            }, 400)
            moves += 1;
            isPlay = true;
            gamePlay();
            sound.play();
          }
        }
      })
    })
  }
  setTimeout(() => canClick = true, 400)
})

// HELPERS
function showInfo(message) {
  document.querySelector('.modal-info__title').textContent = message;
  document.querySelector('.modal-info').classList.add('active');
}

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


function saveCurrentPosition() {
  buttonSave.classList.add('active');
  const data = {
    'arr': arr,
    'exp': exp,
    'size': size,
    'moves': moves,
    'timer': timer
  }
  // console.log('saveCurrentPosition', data)
  localStorage.setItem('gameSave', JSON.stringify(data));
}

function unsaveCurrentPosition() {
  buttonSave.classList.remove('active');
  localStorage.removeItem('gameSave');
}

function saveResult() {
  let data = JSON.parse(localStorage.getItem('gameResults')) || resultData;
  if(moves > 0 && timer > 0) balls = (size * size) / (moves * timer);
  else balls = -1;
  const date = new Date();
  const yy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const dd = `${date.getDate()}`.padStart(2, '0');
  const h = `${date.getHours()}`.padStart(2, '0');
  const m = `${date.getMinutes()}`.padStart(2, '0');
  const s = `${date.getSeconds()}`.padStart(2, '0');
  data.push({
    date: dd + '.' + mm + '.' + yy,
    time: h + ':' + m + ':' + s,
    size: size + 'x' + size,
    moves: moves,
    timer: timer,
    balls: balls
  },)
  data.sort((a, b) =>  b.balls - a.balls)
  console.log(data)
  data = data.slice(0, 10);
  console.log(data)
  localStorage.setItem('gameResults', JSON.stringify(data))
}

function showResult() {
  const data = JSON.parse(localStorage.getItem('gameResults')) || resultData;
  console.log(data)
  document.querySelector('.modal-results').classList.add('active');
  document.querySelector('.modal-result__table').innerHTML =
    `
    <li>
      <span>Date</span>
      <span>Time</span>
      <span>Size</span>
      <span>Moves</span>
      <span>Timer</span>
    </li>
    ${data.map((row) => {
      if(typeof(row.timer) == 'number') row.timer = timerToHMS(row.timer)
      return `
        <li>
          <span>${row.date}</span>
          <span>${row.time}</span>
          <span>${row.size}</span>
          <span>${row.moves}</span>
          <span>${row.timer}</span>
        </li>
      `
    }).join('')}`
}

function timerToHMS(timer) {
  const h = `${Math.floor(timer / 3600)}`.padStart(2, '0');
  const m = `${Math.floor((timer % 3600) / 60)}`.padStart(2, '0');
  const s = `${Math.floor((timer % 3600) % 60)}`.padStart(2, '0');
  return `${h}:${m}:${s}`;
}

document.querySelector('.modal-info__button').addEventListener('click', () => {
  document.querySelector('.modal-info').classList.remove('active');
})

document.querySelector('.modal-results__button').addEventListener('click', () => {
  document.querySelector('.modal-results').classList.remove('active');
})

