import { resultData } from './data';

export const saveCurrentPosition = (arr, exp, size, moves, timer, volume) => {
  document.getElementById('gameSave').classList.add('active');
  const data = {
    'arr': arr,
    'exp': exp,
    'size': size,
    'moves': moves,
    'timer': timer,
    'volume': volume
  }
  localStorage.setItem('gameSave', JSON.stringify(data));
}

export const unsaveCurrentPosition = () => {
  document.getElementById('gameSave').classList.remove('active');
  localStorage.removeItem('gameSave');
}

export const saveResult = (moves, timer, size) => {
  let data = JSON.parse(localStorage.getItem('gameResults')) || resultData;
  let balls = -1;
  if(moves > 0 && timer > 0) balls = (size * size) / (moves * timer);
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
  // console.log(data)
  data = data.slice(0, 10);
  // console.log(data)
  localStorage.setItem('gameResults', JSON.stringify(data))
}