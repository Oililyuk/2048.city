class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.previousBoard = null;
        this.previousScore = 0;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.messageDisplay = document.getElementById('game-message');
        this.newGameButton = document.getElementById('new-game');
        this.undoButton = document.getElementById('undo');
        
        this.setRandomBackground();
        this.init();
    }

    setRandomBackground() {
        const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg'];
        const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        document.documentElement.style.backgroundImage = `url('${randomBg}')`;
    }

    init() {
        this.setupEventListeners();
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.newGameButton.addEventListener('click', () => this.newGame());
        this.undoButton.addEventListener('click', () => this.undo());
        document.getElementById('try-again').addEventListener('click', () => this.newGame());
        
        // Touch events
        let touchStartX, touchStartY;
        this.gameBoard.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.gameBoard.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.move('right');
                else this.move('left');
            } else {
                if (dy > 0) this.move('down');
                else this.move('up');
            }
        });
    }

    handleKeyPress(event) {
        const keyActions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const action = keyActions[event.key];
        if (action) {
            event.preventDefault();
            this.move(action);
        }
    }

    newGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.previousBoard = null;
        this.previousScore = 0;
        this.score = 0;
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.messageDisplay.classList.add('hidden');
        this.undoButton.disabled = true;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    saveState() {
        this.previousBoard = JSON.parse(JSON.stringify(this.board));
        this.previousScore = this.score;
        this.undoButton.disabled = false;
    }

    undo() {
        if (this.previousBoard) {
            this.board = JSON.parse(JSON.stringify(this.previousBoard));
            this.score = this.previousScore;
            this.previousBoard = null;
            this.previousScore = 0;
            this.undoButton.disabled = true;
            this.updateScore();
            this.updateDisplay();
        }
    }

    move(direction) {
        const oldBoard = JSON.stringify(this.board);
        
        switch(direction) {
            case 'up': this.moveUp(); break;
            case 'down': this.moveDown(); break;
            case 'left': this.moveLeft(); break;
            case 'right': this.moveRight(); break;
        }

        if (oldBoard !== JSON.stringify(this.board)) {
            this.saveState();
            this.addRandomTile();
            this.updateDisplay();
            this.checkGameOver();
        }
    }

    moveLeft() {
        for (let i = 0; i < 4; i++) {
            let row = this.board[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            this.board[i] = row;
        }
        this.updateScore();
    }

    moveRight() {
        for (let i = 0; i < 4; i++) {
            let row = this.board[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            while (row.length < 4) row.unshift(0);
            this.board[i] = row;
        }
        this.updateScore();
    }

    moveUp() {
        for (let j = 0; j < 4; j++) {
            let column = this.board.map(row => row[j]).filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            while (column.length < 4) column.push(0);
            for (let i = 0; i < 4; i++) {
                this.board[i][j] = column[i];
            }
        }
        this.updateScore();
    }

    moveDown() {
        for (let j = 0; j < 4; j++) {
            let column = this.board.map(row => row[j]).filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            while (column.length < 4) column.unshift(0);
            for (let i = 0; i < 4; i++) {
                this.board[i][j] = column[i];
            }
        }
        this.updateScore();
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        this.bestScoreDisplay.textContent = this.bestScore;
    }

    updateDisplay() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                const value = this.board[i][j];
                if (value !== 0) {
                    tile.textContent = value;
                    tile.setAttribute('data-value', value);
                }
                this.gameBoard.appendChild(tile);
            }
        }
    }

    checkGameOver() {
        // Check for win
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 2048) {
                    this.showMessage('You Win!');
                    return;
                }
            }
        }

        // Check for possible moves
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) return;
                if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return;
                if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return;
            }
        }

        this.showMessage('Game Over!');
    }

    showMessage(message) {
        this.messageDisplay.querySelector('p').textContent = message;
        this.messageDisplay.classList.remove('hidden');
    }
}

// Social sharing functions
function shareToTwitter() {
    const score = document.getElementById('score').textContent;
    const text = `I scored ${score} points in Wicked 2048 - Frosted Edition! Play wicked, win smarter! `;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`);
}

function shareToReddit() {
    const score = document.getElementById('score').textContent;
    const title = `I scored ${score} points in Wicked 2048 - Frosted Edition! Play wicked, win smarter! `;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${url}`);
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game2048();
}); 