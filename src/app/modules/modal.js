import { resultData } from './data';
import { timerToHMS } from './time';

export const showModalInfo = (message) => {
  document.querySelector('.modal-info__title').textContent = message;
  document.querySelector('.modal-info').classList.add('active');
}

export const showModalResult = () => {
  const data = JSON.parse(localStorage.getItem('gameResults')) || resultData;
  console.log(data)
  document.querySelector('.modal-results').classList.add('active');
  document.querySelector('.modal-result__table').innerHTML = `
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

export const modalCloseButton = () => {

  document.querySelector('.modal-info__button').addEventListener('click', () => {
    document.querySelector('.modal-info').classList.remove('active');
  })

  document.querySelector('.modal-results__button').addEventListener('click', () => {
    document.querySelector('.modal-results').classList.remove('active');
  })
}