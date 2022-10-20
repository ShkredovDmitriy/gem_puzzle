export const createLayout = () => {

  // BUTTONS TOP
  const btnTop = document.createElement('div');
  btnTop.innerHTML = `
  <div class="score-top">
  <span>Moves: </span>
  <span id="gameScore">0</span>
  <span>Time: </span>
  <span id="gameTimer">00:00:00</span>
  </div>
  <div class="buttons-top">
    <button id="gameShuffle">Shuffle</button>
    <button id="gamePlay">Play</button>
    <button id="gamePause" class="active">Pause</button>
    <button id="gameSave">Save</button>
    <button id="gameResults">Results</button>
    <button id="gameSound" class="active">Sound On</button>
  </div>
  `
  document.querySelector('.content').append(btnTop);

  // CANVAS
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.width = '500';
  canvas.height = '500';
  canvas.className = 'game-canvas';
  document.querySelector('.content').append(canvas);

  // BUTTONS BOTTOM
  const btnBottom = document.createElement('div');
  btnBottom.className = "buttons-bottom";
  btnBottom.innerHTML = `
    <button class="active" id="gameSize3">3x3</button>
    <button id="gameSize4">4x4</button>
    <button id="gameSize5">5x5</button>
    <button id="gameSize6">6x6</button>
    <button id="gameSize7">7x7</button>
    <button id="gameSize8">8x8</button>
  `
  document.querySelector('.content').append(btnBottom);

  // ADD MODAL
  const modal = document.createElement('div');
  modal.className = "modal-info";
  modal.innerHTML = `
    <div class="modal-info__message">xxxxxxx</div>
    <button class="modal-info__button">OK</button>
  `
  document.querySelector('.content').append(modal);
}
