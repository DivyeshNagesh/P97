// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRM4DXOrcUL19Uz8SJJRPaiCqhSBUpVNM",
    authDomain: "project97-45119.firebaseapp.com",
    databaseURL: "https://project97-45119-default-rtdb.firebaseio.com",
    projectId: "project97-45119",
    storageBucket: "project97-45119.appspot.com",
    messagingSenderId: "481778912449",
    appId: "1:481778912449:web:b116e6f99ea648749cd840"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const cellsRef = db.ref('cells');

let currentPlayer = 'X';
let gameOver = false;

// Initialize the game board
function initializeBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        document.querySelector('.board').appendChild(cell);
    }
}

// Handle cell clicks
function handleCellClick(index) {
    if (!gameOver) {
        const cellRef = cellsRef.child(index);

        cellRef.transaction((currentValue) => {
            if (!currentValue) {
                currentValue = currentPlayer;
                return currentValue;
            }
        });

        checkForWin();
        togglePlayer();
    }
}

// Check if a player has won
function checkForWin() {
    const cells = document.querySelectorAll('.cell');
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            gameOver = true;
            document.querySelector('#message').textContent = `${currentPlayer} wins!`;
        }
    }

    if (!cellsRef.toArray().some((cell) => cell === null)) {
        gameOver = true;
        document.querySelector('#message').textContent = "It's a draw!";
    }
}

// Toggle between X and O
function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.querySelector('#message').textContent = `Player ${currentPlayer}'s turn`;
}

// Listen for changes to the cells in Firebase
cellsRef.on('child_changed', (snapshot) => {
    const index = snapshot.key;
    const value = snapshot.val();
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = value;
});

// Initialize the game
initializeBoard();
togglePlayer();
