const puzzleContainer = document.getElementById('puzzle-container');
const message = document.getElementById('message');
const timerDisplay = document.getElementById('timer');

const gridSize = 3;
let tiles = [];
let draggedTile = null;
let timer;
let timeLeft = 60;

function createTiles() {
  tiles = [];
  puzzleContainer.innerHTML = "";

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.setAttribute('draggable', 'true');

    // ✅ Original correct index (used for win check)
    tile.dataset.index = i;

    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

    // ✅ Drag and Drop Event Listeners
    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('dragover', handleDragOver);
    tile.addEventListener('drop', handleDrop);
    tile.addEventListener('dragend', () => tile.classList.remove('dragging'));

    tiles.push(tile);
  }

  // Don't append here — shuffle will do it and set correct .dataset.position
}

function shuffleTiles() {
  puzzleContainer.innerHTML = "";
  const shuffled = [...tiles];
  shuffled.sort(() => Math.random() - 0.5);

  shuffled.forEach((tile, index) => {
    puzzleContainer.appendChild(tile);
    tile.dataset.position = index; // New: current position in grid
  });
}

function handleDragStart(e) {
  draggedTile = this;
  this.classList.add('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  if (!draggedTile || this === draggedTile) return;

  const draggedIndex = [...puzzleContainer.children].indexOf(draggedTile);
  const targetIndex = [...puzzleContainer.children].indexOf(this);

  if (draggedIndex > -1 && targetIndex > -1) {
    puzzleContainer.insertBefore(draggedTile, this);
    puzzleContainer.insertBefore(this, puzzleContainer.children[draggedIndex]);
  }

  setTimeout(checkWin, 300);
}

function checkWin() {
  const currentOrder = [...puzzleContainer.children].map(tile => tile.dataset.index);
  const correctOrder = [...Array(gridSize * gridSize).keys()];

  if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
    clearInterval(timer);
    message.innerText = "🎉 You solved the puzzle!";
  }
}

function startTimer() {
  timeLeft = 60;
  timerDisplay.innerText = timeLeft;
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      message.innerHTML = "⏳ <span style='color:#ff5c5c'>Time's up!</span>";
      alert("⏰ Time is over! You didn't solve the puzzle.");
      disableTiles();
    }
  }, 1000);
}

function startGame() {
  message.innerText = "";
  createTiles();
  shuffleTiles();
  startTimer();
}

function checkWin() {
  const currentOrder = [...puzzleContainer.children].map(tile => tile.dataset.index);
  const correctOrder = [...Array(gridSize * gridSize).keys()].map(String); // same type

  if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
    clearInterval(timer);
    message.innerHTML = "🎉 <span style='color:#00ff7f'>Puzzle Solved!</span>";
    alert("🎉 Congratulations! You solved the puzzle!");
    disableTiles();
  } else {
    message.innerHTML = "❌ <span style='color:#ff5c5c'>Not solved yet. Keep trying!</span>";
  }
}

function disableTiles() {
  const allTiles = document.querySelectorAll('.tile');
  allTiles.forEach(tile => {
    tile.setAttribute('draggable', 'false');
  });
}

startGame();
