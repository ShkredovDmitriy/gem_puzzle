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
    <button id="gamePlay">Shuffle and play</button>
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
    <button id="gameSize3">3x3</button>
    <button id="gameSize4" class="active">4x4</button>
    <button id="gameSize5">5x5</button>
    <button id="gameSize6">6x6</button>
    <button id="gameSize7">7x7</button>
    <button id="gameSize8">8x8</button>
  `
  document.querySelector('.content').append(btnBottom);

  // ADD MODAL INFO
  const modalInfo = document.createElement('div');
  modalInfo.className = "modal modal-info";
  modalInfo.innerHTML = `
    <div class="modal__title modal-info__title"></div>
    <button class="modal__button modal-info__button">Close</button>
  `
  document.querySelector('.content').append(modalInfo);

  // ADD MODAL RESULT
  const modalResult = document.createElement('div');
  modalResult.className = "modal modal-results";
  modalResult.innerHTML = `
    <div class="modal__title">Top 10 results</div>
    <ul class="modal__table modal-result__table"></ul>
    <button class="modal__button modal-results__button">Close</button>
  `
  document.querySelector('.content').append(modalResult);
}
