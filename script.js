// Global variables
let touchStartX = null;
let touchStartY = null;
let animationId = null;

class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        
        // Undo system
        this.stateHistory = []; // History stack
        this.maxHistorySize = 100; // Max 100 history states
        this.initialUndoCount = 3; // Initial undo count
        this.undoCount = this.initialUndoCount; // Current available undo count
        this.maxUndoCount = 10; // Max accumulated undo count
        this.undoRewardValue = 256; // Get an undo chance for every 256-multiple tile merged
        
        this.tileContainer = document.getElementById('tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.messageContainer = document.getElementById('game-message');
        
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        
        this.tiles = {}; // References to tile DOM elements
        this.tileId = 0; // Used to generate unique tile IDs
        
        // Random number generator
        this.randomSeed = Date.now(); // Initial seed
        this.random = this.createSeededRandom(this.randomSeed);
        
        // Animation state flag
        this.isAnimating = false;
        
        // Drag preview related
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.currentDragX = 0;
        this.currentDragY = 0;
        this.dragDirection = null;
        this.dragDistance = 0;
        this.previewOffset = { x: 0, y: 0 };
        this.minDragDistance = 30; // Min distance to trigger a move
        this.dragThreshold = 3; // Threshold to start showing drag effect, lowered for better responsiveness
        
        // Quick swipe detection
        this.dragStartTime = 0;
        this.quickSwipeThreshold = 300; // Increased to 300ms to recognize more swipes as quick swipes
        this.quickSwipeEnabled = true;
        this.lastTouchMoveTime = 0;
        this.touchMoveThrottle = 32; // Throttled at ~30fps to reduce performance overhead
        
        // Drag preview switch (can be disabled on low-end devices)
        this.dragPreviewEnabled = true;
        // Detect if it is a mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // Drag preview is disabled by default on older devices
        if (isMobile && window.innerWidth <= 400) {
            this.dragPreviewEnabled = true; // Keep it on, but can be set to false if needed
        }
        
        this.setup();
        this.updateDisplay();
        
        // Prevent page scrolling
        this.preventPageScroll();
        
        // Fix iOS viewport height issue
        this.fixViewportHeight();
        
        // Random background switch
        (function() {
            const bgs = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg'];
            const idx = Math.floor(Math.random() * bgs.length);
            document.addEventListener('DOMContentLoaded', function() {
                document.body.style.setProperty('--wicked-bg', `url('${bgs[idx]}')`);
                // Compatible with body::before
                const style = document.createElement('style');
                style.innerHTML = `body::before { background-image: var(--wicked-bg) !important; }`;
                document.head.appendChild(style);
            });
        })();
    }
    
    preventPageScroll() {
        // Prevent page scrolling on touch devices when interacting with the game
        document.body.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false }); // Use passive: false to allow preventDefault
    }
    
    fixViewportHeight() {
        // Set correct viewport height to fix issues on iOS
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        // Initial setup
        setVH();
        
        // Listen for window resize
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
    
    setup() {
        // Initialize grid
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = null;
            }
        }
        
        // Add two initial tiles
        this.addNewTile();
        this.addNewTile();
        
        // Save initial state
        this.saveState();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update best score display
        this.bestScoreDisplay.textContent = this.bestScore;
        
        // Update Undo button
        this.updateUndoButton();
        
        // Start liquid glass animation
        this.startLiquidAnimation();
    }
    
    createSeededRandom(seed) {
        // Create a seed-based pseudo-random number generator
        let currentSeed = seed;
        
        return {
            // Generate a random number between 0 and 1
            random: () => {
                // Using Linear Congruential Generator (LCG) algorithm
                currentSeed = (currentSeed * 1664525 + 1013904223) % 2147483647;
                return currentSeed / 2147483647;
            },
            // Get current seed
            getSeed: () => currentSeed,
            // Set new seed
            setSeed: (newSeed) => {
                currentSeed = newSeed;
            }
        };
    }
    
    setupEventListeners() {
        // Avoid duplicate bindings, store the event handler first
        if (!this.keydownHandler) {
            this.keydownHandler = (e) => {
                const keyMap = {
                    'ArrowLeft': 'left',
                    'a': 'left',
                    'ArrowUp': 'up',
                    'w': 'up',
                    'ArrowRight': 'right',
                    'd': 'right',
                    'ArrowDown': 'down',
                    's': 'down'
                };
                
                const direction = keyMap[e.key.toLowerCase()]; // Use e.key and convert to lowercase
                if (direction) {
                    e.preventDefault();
                    this.move(direction);
                }

                // Test shortcuts (using e.key)
                if (e.key === '9') {
                    e.preventDefault();
                    this.showMessage('You Win!', 'game-won');
                }
                if (e.key === '0') {
                    e.preventDefault();
                    this.showMessage('Game Over!', 'game-stuck');
                }
            };
        }
        
        // Remove any existing old listeners, then add the new one
        document.removeEventListener('keydown', this.keydownHandler);
        document.addEventListener('keydown', this.keydownHandler);
        
        // Touch events - for implementing drag preview effect
        document.addEventListener('touchstart', (e) => {
            // Exclude button clicks
            if (e.target.closest('button')) return;
            
            // If still animating, don't start a new drag
            if (this.isAnimating) return;
            
            this.isDragging = true;
            this.dragStartX = e.touches[0].clientX;
            this.dragStartY = e.touches[0].clientY;
            this.currentDragX = this.dragStartX;
            this.currentDragY = this.dragStartY;
            this.dragDirection = null;
            this.dragDistance = 0;
            this.dragStartTime = Date.now(); // Record start time
            
            // Only reset tile state when necessary
            // Check if any tiles have residual transforms
            const needsReset = Object.values(this.tiles).some(tile => {
                const transform = tile.style.transform;
                return transform && transform !== '' && transform !== 'translate(0, 0) scale(1) rotate(0deg)';
            });
            
            if (needsReset) {
                this.forceResetAllTiles();
            }
            
            // Add dragging state class to the game container
            this.tileContainer.classList.add('dragging-active');
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.isAnimating) return;
            
            const currentTime = Date.now();
            
            // Throttle to reduce update frequency
            if (currentTime - this.lastTouchMoveTime < this.touchMoveThrottle) {
                return;
            }
            this.lastTouchMoveTime = currentTime;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - this.dragStartX;
            const diffY = currentY - this.dragStartY;
            
            this.currentDragX = currentX;
            this.currentDragY = currentY;
            
            // 计算拖动方向和距离
            const absDiffX = Math.abs(diffX);
            const absDiffY = Math.abs(diffY);
            
            // 只有超过阈值才开始显示拖动效果
            if (absDiffX > this.dragThreshold || absDiffY > this.dragThreshold) {
                e.preventDefault(); // 防止页面滚动
                
                // 确定主要拖动方向
                if (absDiffX > absDiffY) {
                    this.dragDirection = diffX > 0 ? 'right' : 'left';
                    this.dragDistance = absDiffX;
                } else {
                    this.dragDirection = diffY > 0 ? 'down' : 'up';
                    this.dragDistance = absDiffY;
                }
                
                // 检测是否是快速滑动
                const dragDuration = currentTime - this.dragStartTime;
                const isQuickSwipe = dragDuration < this.quickSwipeThreshold && this.dragDistance > this.minDragDistance;
                
                // 只有在慢速拖动且启用了拖动预览时才更新预览效果
                if (!isQuickSwipe && this.quickSwipeEnabled && this.dragPreviewEnabled) {
                    this.updateDragPreview(diffX, diffY);
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            
            // 移除拖动状态类
            this.tileContainer.classList.remove('dragging-active');
            
            // 计算滑动时长
            const dragDuration = Date.now() - this.dragStartTime;
            const isQuickSwipe = dragDuration < this.quickSwipeThreshold;
            
            // 对于快速滑动，降低移动阈值
            const effectiveMinDistance = isQuickSwipe ? this.minDragDistance * 0.5 : this.minDragDistance;
            
            // 执行移动动画
            if (this.dragDirection && this.dragDistance > effectiveMinDistance) {
                if (isQuickSwipe && this.quickSwipeEnabled) {
                    // 快速滑动：先立即重置所有transform，避免残留
                    Object.values(this.tiles).forEach(tile => {
                        tile.classList.remove('dragging');
                        tile.style.transition = 'none';
                        tile.style.transform = '';
                    });
                    // 强制重绘
                    void this.tileContainer.offsetHeight;
                    // 恢复transition后执行移动
                    Object.values(this.tiles).forEach(tile => {
                        tile.style.transition = '';
                    });
                    this.move(this.dragDirection);
                } else {
                    // 慢速拖动：从拖动预览状态平滑过渡到实际移动
                    this.transitionFromDragToMove(this.dragDirection);
                }
            } else {
                // 如果没有达到移动阈值
                if (isQuickSwipe) {
                    // 快速滑动但距离不够：立即重置，避免卡在中间
                    this.forceResetAllTiles();
                } else {
                    // 慢速拖动：平滑恢复原位
                    this.resetTileTransforms();
                }
            }
        }, { passive: true });
        
        // 处理触摸取消事件
        document.addEventListener('touchcancel', (e) => {
            if (this.isDragging) {
                this.isDragging = false;
                this.tileContainer.classList.remove('dragging-active');
                this.resetTileTransforms();
            }
        }, { passive: true });
        
        // 鼠标事件支持（桌面端）
        let mouseDown = false;
        
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            
            // 如果还在动画中，不开始新的拖动
            if (this.isAnimating) return;
            
            mouseDown = true;
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            this.currentDragX = this.dragStartX;
            this.currentDragY = this.dragStartY;
            this.dragDirection = null;
            this.dragDistance = 0;
            this.dragStartTime = Date.now(); // 记录开始时间
            
            // 确保所有砖块都在正确的位置
            this.forceResetAllTiles();
            this.tileContainer.classList.add('dragging-active');
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!mouseDown || !this.isDragging || this.isAnimating) return;
            
            const diffX = e.clientX - this.dragStartX;
            const diffY = e.clientY - this.dragStartY;
            
            this.currentDragX = e.clientX;
            this.currentDragY = e.clientY;
            
            const absDiffX = Math.abs(diffX);
            const absDiffY = Math.abs(diffY);
            
            if (absDiffX > this.dragThreshold || absDiffY > this.dragThreshold) {
                if (absDiffX > absDiffY) {
                    this.dragDirection = diffX > 0 ? 'right' : 'left';
                    this.dragDistance = absDiffX;
                } else {
                    this.dragDirection = diffY > 0 ? 'down' : 'up';
                    this.dragDistance = absDiffY;
                }
                
                this.updateDragPreview(diffX, diffY);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!mouseDown) return;
            
            mouseDown = false;
            this.isDragging = false;
            this.tileContainer.classList.remove('dragging-active');
            
            // 检查是否是快速滑动（鼠标也支持快速滑动）
            const dragDuration = Date.now() - this.dragStartTime;
            const isQuickSwipe = dragDuration < this.quickSwipeThreshold;
            
            // 对于快速滑动，降低移动阈值
            const effectiveMinDistance = isQuickSwipe ? this.minDragDistance * 0.5 : this.minDragDistance;
            
            if (this.dragDirection && this.dragDistance > effectiveMinDistance) {
                if (isQuickSwipe && this.quickSwipeEnabled) {
                    // 快速滑动：先立即重置所有transform，避免残留
                    Object.values(this.tiles).forEach(tile => {
                        tile.classList.remove('dragging');
                        tile.style.transition = 'none';
                        tile.style.transform = '';
                    });
                    // 强制重绘
                    void this.tileContainer.offsetHeight;
                    // 恢复transition后执行移动
                    Object.values(this.tiles).forEach(tile => {
                        tile.style.transition = '';
                    });
                    this.move(this.dragDirection);
                } else {
                    // 慢速拖动：从拖动预览状态平滑过渡到实际移动
                    this.transitionFromDragToMove(this.dragDirection);
                }
            } else {
                // 如果没有达到移动阈值
                if (isQuickSwipe) {
                    // 快速滑动但距离不够：立即重置，避免卡在中间
                    this.forceResetAllTiles();
                } else {
                    // 慢速拖动：平滑恢复原位
                    this.resetTileTransforms();
                }
            }
        });
    }
    
    handleSwipe() {
        const diffX = this.endX - this.startX;
        const diffY = this.endY - this.startY;
        const minSwipeDistance = 30; // 降低最小滑动距离，让滑动更容易触发
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平滑动
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    this.move('right');
                } else {
                    this.move('left');
                }
            }
        } else {
            // 垂直滑动
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    this.move('down');
                } else {
                    this.move('up');
                }
            }
        }
    }
    
    move(direction) {
        // 如果正在动画中或正在拖动，忽略移动
        if (this.isAnimating || this.isDragging) return;
        
        // 移除所有砖块的dragging类，确保使用正常的移动动画
        Object.values(this.tiles).forEach(tile => {
            tile.classList.remove('dragging');
        });
        
        const movements = [];
        const merges = [];
        let moved = false;
        
        // 创建新的网格来存储结果
        const newGrid = [];
        for (let i = 0; i < this.size; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.size; j++) {
                newGrid[i][j] = null;
            }
        }
        
        // 根据方向处理移动
        if (direction === 'left') {
            for (let row = 0; row < this.size; row++) {
                const result = this.processLine(this.getRow(row), row, 0, 0, 1);
                moved = result.moved || moved;
                movements.push(...result.movements);
                merges.push(...result.merges);
                this.setRow(newGrid, row, result.line);
            }
        } else if (direction === 'right') {
            for (let row = 0; row < this.size; row++) {
                const result = this.processLine(this.getRow(row).reverse(), row, 3, 0, -1);
                moved = result.moved || moved;
                movements.push(...result.movements);
                merges.push(...result.merges);
                this.setRow(newGrid, row, result.line.reverse());
            }
        } else if (direction === 'up') {
            for (let col = 0; col < this.size; col++) {
                const result = this.processLine(this.getColumn(col), 0, col, 1, 0);
                moved = result.moved || moved;
                movements.push(...result.movements);
                merges.push(...result.merges);
                this.setColumn(newGrid, col, result.line);
            }
        } else if (direction === 'down') {
            for (let col = 0; col < this.size; col++) {
                const result = this.processLine(this.getColumn(col).reverse(), 3, col, -1, 0);
                moved = result.moved || moved;
                movements.push(...result.movements);
                merges.push(...result.merges);
                this.setColumn(newGrid, col, result.line.reverse());
            }
        }
        
        if (moved) {
            // 设置动画标志
            this.isAnimating = true;
            this.resetAnimationStateFallback(); // Add fallback
            
            // 更新网格
            this.grid = newGrid;
            
            // 执行动画
            this.animateMovements(movements, merges, () => {
                // 动画完成后添加新方块
                this.addNewTile();
                
                // 修复：先保存状态，再更新显示
                this.saveState();
                this.updateDisplay();
                
                // 清除动画标志
                this.isAnimating = false;
                if (this._animationTimeout) clearTimeout(this._animationTimeout);
                
                // 游戏状态检查
                if (this.checkWin()) {
                    this.showMessage('You Win!', 'game-won');
                } else if (this.checkGameOver()) {
                    // 只有在没有Undo次数时才真正结束游戏
                    if (this.undoCount === 0) {
                        this.showMessage('Try Again', 'game-over');
                    } else {
                        // 如果还有Undo次数，给用户提示
                        this.showMessage('Game Over!', 'game-stuck');
                    }
                }
            });
        }
    }
    
    processLine(line, startRow, startCol, rowDir, colDir) {
        const movements = [];
        const merges = [];
        const result = [];
        let moved = false;
        
        // 第一步：移除空格，收集所有非空方块
        const tiles = [];
        for (let i = 0; i < line.length; i++) {
            if (line[i] !== null) {
                tiles.push({
                    tile: line[i],
                    originalIndex: i
                });
            }
        }
        
        // 第二步：处理合并
        let resultIndex = 0;
        let i = 0;
        
        while (i < tiles.length) {
            const currentTile = tiles[i];
            const fromRow = startRow + currentTile.originalIndex * rowDir;
            const fromCol = startCol + currentTile.originalIndex * colDir;
            const toRow = startRow + resultIndex * rowDir;
            const toCol = startCol + resultIndex * colDir;
            
            // 检查是否需要移动
            if (fromRow !== toRow || fromCol !== toCol) {
                movements.push({
                    tile: currentTile.tile,
                    from: { row: fromRow, col: fromCol },
                    to: { row: toRow, col: toCol }
                });
                moved = true;
            }
            
            // 检查是否可以合并
            if (i + 1 < tiles.length && 
                currentTile.tile.value === tiles[i + 1].tile.value &&
                !currentTile.tile.merged) {
                
                // 创建合并后的方块
                const mergedTile = {
                    id: this.tileId++,
                    value: currentTile.tile.value * 2,
                    merged: true
                };
                
                // 记录第二个方块的移动（移动到合并位置）
                const nextTile = tiles[i + 1];
                const nextFromRow = startRow + nextTile.originalIndex * rowDir;
                const nextFromCol = startCol + nextTile.originalIndex * colDir;
                
                movements.push({
                    tile: nextTile.tile,
                    from: { row: nextFromRow, col: nextFromCol },
                    to: { row: toRow, col: toCol }
                });
                
                // 记录合并
                merges.push({
                    tiles: [currentTile.tile, nextTile.tile],
                    result: mergedTile,
                    position: { row: toRow, col: toCol }
                });
                
                result.push(mergedTile);
                this.score += mergedTile.value;
                moved = true;
                
                // 检查是否合成了256的倍数，奖励Undo次数
                if (mergedTile.value >= this.undoRewardValue && 
                    mergedTile.value % this.undoRewardValue === 0) {
                    this.earnUndoReward();
                }
                
                i += 2; // 跳过已合并的两个方块
            } else {
                result.push(currentTile.tile);
                i += 1;
            }
            
            resultIndex++;
        }
        
        // 第三步：填充空格
        while (result.length < this.size) {
            result.push(null);
        }
        
        return { line: result, moved, movements, merges };
    }
    
    getRow(row) {
        return this.grid[row].slice();
    }
    
    setRow(grid, row, values) {
        grid[row] = values;
    }
    
    getColumn(col) {
        const column = [];
        for (let i = 0; i < this.size; i++) {
            column.push(this.grid[i][col]);
        }
        return column;
    }
    
    setColumn(grid, col, values) {
        for (let i = 0; i < this.size; i++) {
            grid[i][col] = values[i];
        }
    }
    
    animateMovements(movements, merges, callback) {
        // 先清除所有砖块的transform，确保从当前位置平滑过渡
        Object.values(this.tiles).forEach(tile => {
            if (tile.style.transform) {
                // 保持原有的transition以确保平滑过渡
                tile.style.transform = '';
            }
        });
        
        // 移动所有方块
        movements.forEach(movement => {
            const tile = this.tiles[movement.tile.id];
            if (tile) {
                const { top, left } = this.getPosition(movement.to.row, movement.to.col);
                tile.style.top = top;
                tile.style.left = left;
            }
        });
        
        // 120ms后处理合并（与CSS动画时间一致）
        setTimeout(() => {
            merges.forEach(merge => {
                // 移除被合并的方块
                merge.tiles.forEach(tile => {
                    if (this.tiles[tile.id]) {
                        this.tiles[tile.id].remove();
                        delete this.tiles[tile.id];
                    }
                });
                
                // 创建新的合并后的方块
                this.createTileElement(
                    merge.position.row, 
                    merge.position.col, 
                    merge.result,
                    false,
                    true
                );
            });
            
            // 触发液态爆发效果
            if (merges.length > 0) {
                this.liquidBurst();
            }
            
            // 更新分数显示
            this.scoreDisplay.textContent = this.score;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                this.bestScoreDisplay.textContent = this.bestScore;
                localStorage.setItem('bestScore', this.bestScore);
            }
            
            // 再等待一小段时间后执行回调
            setTimeout(callback, 30);
        }, 120);
    }
    
    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === null) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(this.random.random() * emptyCells.length)];
            const value = this.random.random() < 0.9 ? 2 : 4;
            const newTile = {
                id: this.tileId++,
                value: value,
                merged: false
            };
            this.grid[randomCell.row][randomCell.col] = newTile;
            this.createTileElement(randomCell.row, randomCell.col, newTile, true, false);
        }
    }
    
    updateDisplay() {
        // 清理已标记为合并的方块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] && this.grid[i][j].merged) {
                    this.grid[i][j].merged = false;
                }
            }
        }
        
        // 更新分数显示
        this.scoreDisplay.textContent = this.score;
        
        // 更新Undo按钮状态
        this.updateUndoButton();
    }
    
    earnUndoReward() {
        if (this.undoCount < this.maxUndoCount) {
            this.undoCount++;
            this.showUndoReward();
        }
    }
    
    showUndoReward() {
        // 创建一个临时的提示元素显示获得Undo次数
        const reward = document.createElement('div');
        reward.className = 'undo-reward';
        reward.textContent = '+1 Undo';
        document.querySelector('.score-container').appendChild(reward);
        
        // 1秒后移除提示
        setTimeout(() => {
            reward.remove();
        }, 1000);
    }
    
    updateUndoButton() {
        const undoButton = document.querySelector('.btn-undo');
        if (undoButton) {
            // 更新按钮内部content层的文本显示剩余次数
            const contentSpan = undoButton.querySelector('.liquidGlass-content');
            if (contentSpan) {
                contentSpan.textContent = `Undo (${this.undoCount})`;
            }
            
            // 修复：当历史记录大于1时就应该启用Undo
            if (this.undoCount > 0 && this.stateHistory.length > 1) {
                undoButton.disabled = false;
                undoButton.classList.remove('disabled');
            } else {
                undoButton.disabled = true;
                undoButton.classList.add('disabled');
            }
        }
    }
    
    createTileElement(row, col, tileData, isNew = false, isMerged = false, isReappear = false) {
        const tileWrapper = document.createElement('div'); // This is the .ui-liquid-wrapper
        tileWrapper.className = `tile ui-liquid-wrapper tile-${tileData.value}`;
        tileWrapper.id = `tile-${tileData.id}`;

        if (isNew) {
            tileWrapper.classList.add('tile-new');
        }
        if (isMerged) {
            tileWrapper.classList.add('tile-merged');
        }
        if (isReappear) {
            tileWrapper.classList.add('tile-reappear');
        }

        // 创建与示例代码一致的内部结构
        const effectDiv = document.createElement('div');
        effectDiv.className = 'liquidGlass-effect';

        const tintDiv = document.createElement('div');
        tintDiv.className = 'liquidGlass-tint';

        const shineDiv = document.createElement('div');
        shineDiv.className = 'liquidGlass-shine';

        const textDiv = document.createElement('div');
        textDiv.className = 'liquidGlass-text';
        textDiv.textContent = tileData.value;

        // 将内部结构添加到包装器中
        tileWrapper.appendChild(effectDiv);
        tileWrapper.appendChild(tintDiv);
        tileWrapper.appendChild(shineDiv);
        tileWrapper.appendChild(textDiv);
        
        const { top, left } = this.getPosition(row, col);
        tileWrapper.style.top = top;
        tileWrapper.style.left = left;
        
        this.tileContainer.appendChild(tileWrapper);
        this.tiles[tileData.id] = tileWrapper; // 引用现在指向包装器
    }
    
    getPosition(row, col) {
        // 检查是否在小屏幕上（响应式）
        const isSmallScreen = window.innerWidth <= 520;
        const gap = isSmallScreen ? 8 : 10; // 响应式间隙
        
        // 计算每个格子的大小
        const cellSize = `(100% - ${gap * 3}px) / 4`;
        
        // 计算位置：格子大小 * 索引 + 间隙 * 索引
        const position = {
            top: `calc(${cellSize} * ${row} + ${gap}px * ${row})`,
            left: `calc(${cellSize} * ${col} + ${gap}px * ${col})`
        };
        
        return position;
    }
    
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] && this.grid[i][j].value === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkGameOver() {
        // 检查是否还有空格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === null) {
                    return false;
                }
            }
        }
        
        // 检查是否还能合并
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if (!current) continue;
                
                // 检查右边
                if (j < this.size - 1 && this.grid[i][j + 1] && 
                    current.value === this.grid[i][j + 1].value) {
                    return false;
                }
                // 检查下边
                if (i < this.size - 1 && this.grid[i + 1][j] && 
                    current.value === this.grid[i + 1][j].value) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    saveState() {
        // 保存当前状态到历史栈
        const state = {
            grid: JSON.parse(JSON.stringify(this.grid)),
            score: this.score,
            undoCount: this.undoCount,
            randomSeed: this.random.getSeed(), // 保存随机种子
            tileId: this.tileId // 保存方块ID计数器
        };
        
        // 检查是否与最后一个状态相同（避免重复保存）
        if (this.stateHistory.length > 0) {
            const lastState = this.stateHistory[this.stateHistory.length - 1];
            // 比较分数作为简单的重复检查（如果分数相同，很可能是重复状态）
            if (lastState.score === state.score && lastState.tileId === state.tileId) {
                return;
            }
        }
        
        this.stateHistory.push(state);
        
        // 限制历史栈大小
        if (this.stateHistory.length > this.maxHistorySize) {
            this.stateHistory.shift();
        }
    }
    
    undo() {
        // 如果正在动画中，忽略Undo
        if (this.isAnimating) return;
        
        // 检查是否有Undo次数和历史记录
        if (this.undoCount > 0 && this.stateHistory.length > 1) {
            this.isAnimating = true;
            this.resetAnimationStateFallback(); // Add fallback
            
            // 保存当前游戏状态的快照，用于计算动画
            const currentGridSnapshot = JSON.parse(JSON.stringify(this.grid));
            
            // 移除历史栈最后一个状态（当前状态）
            this.stateHistory.pop();
            
            // 获取要恢复到的状态（上一个状态）
            const previousState = this.stateHistory[this.stateHistory.length - 1];
            
            // 使用快照的grid计算动画，而不是this.grid
            const animations = this.calculateUndoAnimations(currentGridSnapshot, previousState.grid);
            
            // 执行Undo动画
            this.animateUndo(animations, () => {
                // 动画完成后，更新游戏状态
                this.grid = JSON.parse(JSON.stringify(previousState.grid));
                this.score = previousState.score;
                
                // 恢复随机种子和方块ID
                this.random.setSeed(previousState.randomSeed);
                this.tileId = previousState.tileId;
                
                // 减少Undo次数
                this.undoCount--;
                
                // 更新显示
                this.updateDisplay();
                this.updateUndoButton();
                
                // 清除动画标志
                this.isAnimating = false;
                if (this._animationTimeout) clearTimeout(this._animationTimeout);
            });
        }
    }
    
    // Add a fallback to reset isAnimating if animation callback fails
    resetAnimationStateFallback() {
        if (this._animationTimeout) clearTimeout(this._animationTimeout);
        this._animationTimeout = setTimeout(() => {
            if (this.isAnimating) {
                this.isAnimating = false;
                console.error('Animation fallback triggered: isAnimating reset.');
                this.updateDisplay();
            }
        }, 1000); // 1 second fallback
    }

    calculateUndoAnimations(currentGrid, previousGrid) {
        const animations = {
            movements: [],      // 方块移动
            disappears: [],     // 方块消失（合并后的方块）
            appears: []         // 方块出现（分裂回原来的方块）
        };
        
        // 创建一个映射来追踪方块
        const currentTiles = new Map();
        const previousTiles = new Map();
        
        // 收集当前状态的所有方块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (currentGrid[i][j]) {
                    currentTiles.set(currentGrid[i][j].id, {
                        tile: currentGrid[i][j],
                        row: i,
                        col: j
                    });
                }
            }
        }
        
        // 收集之前状态的所有方块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (previousGrid[i][j]) {
                    previousTiles.set(previousGrid[i][j].id, {
                        tile: previousGrid[i][j],
                        row: i,
                        col: j
                    });
                }
            }
        }
        
        // 查找需要移动的方块
        previousTiles.forEach((prevInfo, id) => {
            const currInfo = currentTiles.get(id);
            if (currInfo) { // Tile exists in both current and previous state
                // 方块在两个状态都存在，检查是否需要移动
                if (currInfo.row !== prevInfo.row || currInfo.col !== prevInfo.col) {
                    animations.movements.push({ // Tile moved
                        tile: prevInfo.tile,
                        from: { row: currInfo.row, col: currInfo.col },
                        to: { row: prevInfo.row, col: prevInfo.col }
                    });
                }
            } else {
                // 方块在当前状态不存在，需要重新出现（被合并的方块）
                animations.appears.push({ // Tile reappeared (was merged away, now back)
                    tile: prevInfo.tile,
                    position: { row: prevInfo.row, col: prevInfo.col }
                });
            }
        });
        
        // 查找需要消失的方块（当前有但之前没有的，如新生成的方块或合并产生的方块）
        currentTiles.forEach((currInfo, id) => {
            if (!previousTiles.has(id)) { // Tile exists in current state but not previous (newly generated or merged result)
                animations.disappears.push({
                    tile: currInfo.tile,
                    position: { row: currInfo.row, col: currInfo.col }
                });
            }
        });
        
        return animations;
    }
    
    animateUndo(animations, callback) {
        this.isAnimating = true;
        this.resetAnimationStateFallback();

        const animationPromises = [];

        // 1. Animate disappearing tiles (newly generated or merged results)
        animations.disappears.forEach(item => {
            const tile = this.tiles[item.tile.id];
            if (tile) {
                tile.classList.add('tile-disappear');
                animationPromises.push(new Promise(resolve => {
                    tile.addEventListener('animationend', function onEnd() {
                        tile.removeEventListener('animationend', onEnd);
                        tile.remove(); // Remove from DOM after animation
                        delete this.tiles[item.tile.id]; // Remove from map
                        resolve();
                    }.bind(this), { once: true });
                }));
            }
        });

        // 2. Animate movements of existing tiles
        animations.movements.forEach(movement => {
            const tile = this.tiles[movement.tile.id];
            if (tile) {
                const { top, left } = this.getPosition(movement.to.row, movement.to.col);
                // Ensure transition is active for movement
                tile.style.transition = 'top 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                tile.style.top = top; // Set final position
                tile.style.left = left; // Set final position
                // Remove any lingering transform from drag preview
                tile.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';

                animationPromises.push(new Promise(resolve => {
                    tile.addEventListener('transitionend', function onEnd(event) {
                        // Only resolve for position transitions to avoid multiple calls
                        if (event.propertyName === 'top' || event.propertyName === 'left') {
                            tile.removeEventListener('transitionend', onEnd);
                            resolve();
                        }
                    }, { once: true });
                }));
            }
        });

        // 3. Wait for all disappearing and moving animations to complete
        Promise.all(animationPromises).then(() => {
            // 4. Create/re-create tiles that "reappear" (were merged away)
            animations.appears.forEach(item => {
                // Ensure the tile doesn't already exist (e.g., if it was a merged tile that was removed)
                if (!this.tiles[item.tile.id]) {
                    this.createTileElement(item.position.row, item.position.col, item.tile, false, false, true); // isReappear = true
                }
            });

            // 5. Final cleanup and callback
            // Ensure all tiles are in their correct final state (no lingering classes/transforms)
            this.forceResetAllTiles();

            // Clear animation flag
            this.isAnimating = false;
            if (this._animationTimeout) clearTimeout(this._animationTimeout);

            // Execute callback
            if (callback) {
                callback();
            }
        });
    }
    
    restart() {
        // Clear tiles
        this.tileContainer.innerHTML = '';
        this.tiles = {};
        
        this.grid = [];
        this.score = 0;
        this.stateHistory = [];
        this.undoCount = this.initialUndoCount;
        this.tileId = 0;
        
        // Reset random number generator
        this.randomSeed = Date.now();
        this.random = this.createSeededRandom(this.randomSeed);
        
        this.hideMessage();
        this.setup();
    }
    
    showMessage(text, className) {
        this.messageContainer.innerHTML = ''; // Clear content first
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        this.messageContainer.appendChild(messageText);

        this.messageContainer.className = 'game-message ' + className;
        
        // When the game is stuck, show "Undo" and "Try Again" buttons
        if (className === 'game-stuck') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'message-buttons';
            
            const undoButton = document.createElement('button');
            undoButton.className = 'restart-button';
            undoButton.textContent = `Undo (${this.undoCount})`;
            undoButton.onclick = () => {
                this.hideMessage();
                this.undo();
            };
            
            const restartButton = document.createElement('button');
            restartButton.className = 'restart-button';
            restartButton.textContent = 'Try Again';
            restartButton.onclick = () => game.restart();
            
            buttonContainer.appendChild(undoButton);
            buttonContainer.appendChild(restartButton);
            this.messageContainer.appendChild(buttonContainer);

        } else if (className !== 'game-won' && className !== 'game-over') {
            const restartButton = document.createElement('button');
            restartButton.className = 'restart-button';
            restartButton.textContent = 'Try Again';
            restartButton.onclick = () => game.restart();
            this.messageContainer.appendChild(restartButton);
        } else {
             const restartButton = document.createElement('button');
            restartButton.className = 'restart-button';
            restartButton.textContent = 'Try Again';
            restartButton.onclick = () => game.restart();
            this.messageContainer.appendChild(restartButton);
        }

        this.messageContainer.style.display = 'flex';
        this.messageContainer.style.alignItems = 'center';
        this.messageContainer.style.justifyContent = 'center';
        this.messageContainer.style.flexDirection = 'column';
    }
    
    hideMessage() {
        this.messageContainer.style.display = 'none';
        this.messageContainer.className = 'game-message';
    }
    
    startLiquidAnimation() {
        // Remove liquid animation, as the new implementation doesn't need to dynamically modify filter parameters
        // The liquid effect is now static and only shown on the background layer
    }
    
    // Liquid burst effect - for merge animation
    liquidBurst() {
        const displacementMap = document.querySelector('#liquid-burst feDisplacementMap');
        if (!displacementMap) return;
        
        // Temporarily increase distortion intensity
        const originalScale = displacementMap.getAttribute('scale');
        displacementMap.setAttribute('scale', '60');
        
        // Restore after 300ms
        setTimeout(() => {
            displacementMap.setAttribute('scale', originalScale);
        }, 300);
    }
    
    // Update drag preview effect
    updateDragPreview(offsetX, offsetY) {
        // Calculate the size of a single cell
        const cellSize = this.tileContainer.offsetWidth / 4;
        const gap = 10; // Cell gap
        const unitDistance = cellSize + gap;
        
        // Calculate preview offset, use easing to make animation smoother
        const dampingFactor = 0.7; // Increase damping factor for more responsive following
        const maxOffset = unitDistance * 3.5; // Can move a maximum distance of 3.5 cells
        
        // Limit offset based on drag direction
        let basePreviewX = 0;
        let basePreviewY = 0;
        
        if (this.dragDirection === 'left' || this.dragDirection === 'right') {
            basePreviewX = Math.max(-maxOffset, Math.min(maxOffset, offsetX * dampingFactor));
            basePreviewY = 0;
        } else if (this.dragDirection === 'up' || this.dragDirection === 'down') {
            basePreviewX = 0;
            basePreviewY = Math.max(-maxOffset, Math.min(maxOffset, offsetY * dampingFactor));
        }
        
        // Batch update transforms for all tiles
        const transforms = [];
        
        // Apply transform to all movable tiles
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.grid[row][col];
                if (tile && this.tiles[tile.id]) {
                    const element = this.tiles[tile.id];
                    
                    // Check if this tile can move in the current direction
                    if (this.canTileMove(row, col, this.dragDirection)) {
                        // Add dragging class
                        if (!element.classList.contains('dragging')) {
                            element.classList.add('dragging');
                        }
                        
                        // Calculate progressive offset
                        // Use a more linear progress calculation to avoid excessive reduction in the initial phase
                        const linearProgress = Math.min(this.dragDistance / this.minDragDistance, 1);
                        // Use a more linear response in the initial phase, then add easing
                        const progress = linearProgress < 0.5 
                            ? linearProgress * 1.5  // Amplify response in the initial phase
                            : this.easeOutCubic(linearProgress);
                        
                        // Calculate the maximum distance each tile can move
                        let maxMoveDistance = 0;
                        
                        if (this.dragDirection === 'left') {
                            maxMoveDistance = col * unitDistance;
                        } else if (this.dragDirection === 'right') {
                            maxMoveDistance = (this.size - 1 - col) * unitDistance;
                        } else if (this.dragDirection === 'up') {
                            maxMoveDistance = row * unitDistance;
                        } else if (this.dragDirection === 'down') {
                            maxMoveDistance = (this.size - 1 - row) * unitDistance;
                        }
                        
                        // Calculate the actual offset, but not exceeding the maximum possible distance for the tile
                        const targetOffset = this.dragDirection === 'left' || this.dragDirection === 'right' 
                            ? basePreviewX : basePreviewY;
                        // Use progress directly instead of easedProgress, as it's already handled above
                        const actualOffset = Math.sign(targetOffset) * 
                            Math.min(Math.abs(targetOffset * progress), maxMoveDistance * 0.9);
                        
                        const actualX = this.dragDirection === 'left' || this.dragDirection === 'right' 
                            ? actualOffset : 0;
                        const actualY = this.dragDirection === 'up' || this.dragDirection === 'down' 
                            ? actualOffset : 0;
                        
                        // Add a slight scaling and tilting effect
                        // Only add scaling and rotation when the drag distance is large to avoid abrupt changes in the initial phase
                        const visualProgress = Math.max(0, (linearProgress - 0.2) / 0.8);
                        const scale = 1 + (visualProgress * 0.02);
                        const rotate = this.dragDirection === 'left' ? -1 : 
                                     this.dragDirection === 'right' ? 1 : 
                                     this.dragDirection === 'up' ? -0.5 : 0.5;
                        const rotateAngle = rotate * visualProgress * 2;
                        
                        // Set transform directly, without requestAnimationFrame
                        element.style.transform = `translate(${actualX}px, ${actualY}px) scale(${scale}) rotate(${rotateAngle}deg)`;
                    } else {
                        element.classList.remove('dragging');
                        // Tiles on the edge stay in place
                        element.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                    }
                }
            }
        }
    }
    
    // Easing function
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Reset transform for all tiles
    resetTileTransforms() {
        Object.values(this.tiles).forEach(tile => {
            tile.classList.remove('dragging');
            tile.classList.remove('moving');
            tile.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            tile.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
        });
    }
    
    // Force reset all tiles to their correct positions (a more thorough reset)
    forceResetAllTiles() {
        // Iterate through the grid to ensure every tile is in its correct position
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const gridTile = this.grid[row][col];
                if (gridTile && this.tiles[gridTile.id]) {
                    const tile = this.tiles[gridTile.id];
                    const { top, left } = this.getPosition(row, col);
                    
                    // Remove all classes
                    tile.classList.remove('dragging', 'moving');
                    
                    // Reset styles
                    tile.style.transition = 'none';
                    tile.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                    tile.style.top = top;
                    tile.style.left = left;
                    
                    // Force a reflow
                    void tile.offsetHeight;
                    
                    // Restore transition
                    tile.style.transition = '';
                }
            }
        }
        
        // Remove any orphaned tiles not in the grid
        Object.keys(this.tiles).forEach(id => {
            let found = false;
            for (let row = 0; row < this.size && !found; row++) {
                for (let col = 0; col < this.size && !found; col++) {
                    if (this.grid[row][col] && this.grid[row][col].id === parseInt(id)) {
                        found = true;
                    }
                }
            }
            if (!found && this.tiles[id]) {
                this.tiles[id].remove();
                delete this.tiles[id];
            }
        });
    }
    
    // Animate slide to target position
    animateTilesToTarget(direction, callback) {
        // Immediately set the animation flag to prevent repeated triggers
        this.isAnimating = true;
        
        const movements = [];
        const merges = [];
        
        // Pre-calculate all movements
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.grid[row][col];
                if (tile && this.tiles[tile.id] && this.canTileMove(row, col, direction)) {
                    const element = this.tiles[tile.id];
                    const movement = this.calculateMovement(row, col, direction);
                    
                    if (movement) {
                        movements.push({
                            element: element,
                            from: { row, col },
                            to: movement.to,
                            distance: movement.distance,
                            willMerge: movement.willMerge
                        });
                    }
                }
            }
        }
        
        // Execute smooth movement animation
        const cellSize = this.tileContainer.offsetWidth / 4;
        const gap = 10;
        const unitDistance = cellSize + gap;
        
        movements.forEach(m => {
            const element = m.element;
            const distance = m.distance * unitDistance;
            
            let translateX = 0;
            let translateY = 0;
            
            switch (direction) {
                case 'left':
                    translateX = -distance;
                    break;
                case 'right':
                    translateX = distance;
                    break;
                case 'up':
                    translateY = -distance;
                    break;
                case 'down':
                    translateY = distance;
                    break;
            }
            
            // 移除dragging类，使用快速过渡
            element.classList.remove('dragging');
            element.style.transition = 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            
            // 如果会合并，添加轻微的缩放效果
            if (m.willMerge) {
                element.style.transform += ' scale(0.95)';
            }
        });
        
        // 在动画完成后执行回调
        setTimeout(() => {
            // 重置所有transform
            this.resetTileTransforms();
            
            // 清除动画标志
            this.isAnimating = false;
            
            // 执行真正的移动逻辑
            if (callback) {
                callback();
            }
        }, 120);
    }
    
    calculateMovement(row, col, direction) {
        const tile = this.grid[row][col];
        if (!tile) return null;
        
        let targetRow = row;
        let targetCol = col;
        let distance = 0;
        let willMerge = false;
        
        // 根据方向计算目标位置
        if (direction === 'left') {
            for (let c = col - 1; c >= 0; c--) {
                if (this.grid[row][c] === null) {
                    targetCol = c;
                    distance++;
                } else if (this.grid[row][c].value === tile.value && !this.grid[row][c].merged) {
                    targetCol = c;
                    distance++;
                    willMerge = true;
                    break;
                } else {
                    break;
                }
            }
        } else if (direction === 'right') {
            for (let c = col + 1; c < this.size; c++) {
                if (this.grid[row][c] === null) {
                    targetCol = c;
                    distance++;
                } else if (this.grid[row][c].value === tile.value && !this.grid[row][c].merged) {
                    targetCol = c;
                    distance++;
                    willMerge = true;
                    break;
                } else {
                    break;
                }
            }
        } else if (direction === 'up') {
            for (let r = row - 1; r >= 0; r--) {
                if (this.grid[r][col] === null) {
                    targetRow = r;
                    distance++;
                } else if (this.grid[r][col].value === tile.value && !this.grid[r][col].merged) {
                    targetRow = r;
                    distance++;
                    willMerge = true;
                    break;
                } else {
                    break;
                }
            }
        } else if (direction === 'down') {
            for (let r = row + 1; r < this.size; r++) {
                if (this.grid[r][col] === null) {
                    targetRow = r;
                    distance++;
                } else if (this.grid[r][col].value === tile.value && !this.grid[r][col].merged) {
                    targetRow = r;
                    distance++;
                    willMerge = true;
                    break;
                } else {
                    break;
                }
            }
        }
        
        if (distance > 0) {
            return {
                to: { row: targetRow, col: targetCol },
                distance: distance,
                willMerge: willMerge
            };
        }
        
        return null;
    }
    
    canTileMove(row, col, direction) {
        const tile = this.grid[row][col];
        if (!tile) return false;

        switch (direction) {
            case 'left':
                for (let c = col - 1; c >= 0; c--) {
                    if (this.grid[row][c] === null) return true; // Found empty space
                    if (this.grid[row][c].value === tile.value) return true; // Found mergeable tile
                    // If neither empty nor mergeable, and it's a different tile, it's blocked
                    if (this.grid[row][c].value !== tile.value) return false;
                }
                return false; // Reached edge, no move possible
            case 'right':
                for (let c = col + 1; c < this.size; c++) {
                    if (this.grid[row][c] === null) return true;
                    if (this.grid[row][c].value === tile.value) return true;
                    if (this.grid[row][c].value !== tile.value) return false;
                }
                return false;
            case 'up':
                for (let r = row - 1; r >= 0; r--) {
                    if (this.grid[r][col] === null) return true;
                    if (this.grid[r][col].value === tile.value) return true;
                    if (this.grid[r][col].value !== tile.value) return false;
                }
                return false;
            case 'down':
                for (let r = row + 1; r < this.size; r++) {
                    if (this.grid[r][col] === null) return true;
                    if (this.grid[r][col].value === tile.value) return true;
                    if (this.grid[r][col].value !== tile.value) return false;
                }
                return false;
            default:
                return false;
        }
    }
    
    transitionFromDragToMove(direction) {
        // If no actual move happened during the drag, just reset transforms and return
        // This prevents calling move() if the drag didn't result in a valid game move
        if (!this.canMoveInDirection(direction)) {
            this.resetTileTransforms();
            return;
        }

        // This function smooths the transition from a user-dragged preview
        // to the final tile movement animation.
        
        // Immediately set the animation flag
        this.isAnimating = true;
        
        const movements = [];
        const merges = [];
        const animationPromises = []; // To track when all tiles have finished their transition
        
        // Pre-calculate all movements
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c]) { // Check all tiles, not just those that can move in preview
                    const movement = this.calculateMovement(r, c, direction);
                    if (movement) {
                        movements.push({
                            element: this.tiles[this.grid[r][c].id],
                            to: movement.to, // Target position in grid coordinates
                            willMerge: movement.willMerge
                        });
                    }
                }
            }
        }
        
        // Animate each tile from its current dragged position
        movements.forEach(m => {
            if (m.element) { // Ensure element exists
                animationPromises.push(new Promise(resolve => {
                    const element = m.element;
                    const { top, left } = this.getPosition(m.to.row, m.to.col);
                    
                    // Use a consistent, fast transition for this part
                    element.style.transition = 'top 0.1s ease-out, left 0.1s ease-out, transform 0.1s ease-out';
                    element.style.top = top;
                    element.style.left = left;
                    // Reset transform to its natural state as it moves
                    element.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
                    
                    // Listen for the end of the 'transform' transition
                    element.addEventListener('transitionend', function onEnd(event) {
                        if (event.propertyName === 'transform' || event.propertyName === 'top' || event.propertyName === 'left') {
                            element.removeEventListener('transitionend', onEnd);
                            resolve();
                        }
                    }, { once: true });
                }));
            }
        });
        
        // Once all tiles have animated to their new positions,
        // proceed with the game logic (merging, adding new tiles).
        Promise.all(animationPromises).then(() => {
            this.move(direction); // Call the main move logic
        });
    }

    // A more advanced animation function that handles moving from the current
    // dragged position instead of resetting first.
    animateFromCurrentPosition(movements, merges, callback) {
        // This is a complex function. For simplicity, we'll stick with the
        // current implementation of `transitionFromDragToMove`.
        // The core idea would be to:
        // 1. Not reset transforms.
        // 2. Calculate the final `top` and `left` for each moving tile.
        // 3. Apply a transition to `top`, `left`, and `transform`.
        // 4. In the `transitionend` handler, call the main game logic callback.
    }

    // Helper to check if any move is possible in a given direction
    canMoveInDirection(direction) {
        // Create a temporary grid to simulate a move without modifying the actual grid
        const tempGrid = JSON.parse(JSON.stringify(this.grid));
        let moved = false;

        // Simulate the move using processLine, but don't apply changes to this.grid
        // This is a simplified check, just to see if *any* tile would move
        for (let i = 0; i < this.size; i++) {
            const line = (direction === 'left' || direction === 'right') ? this.getRow(i) : this.getColumn(i);
            const processed = this.processLine(
                (direction === 'right' || direction === 'down') ? line.reverse() : line,
                0, 0, 0, 0 // Dummy coords, only interested in 'moved' flag
            );
            if (processed.moved) moved = true;
        }
        return moved;
    }

}

// Initialize the game
const game = new Game2048();

// Add global error handler for debugging
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});