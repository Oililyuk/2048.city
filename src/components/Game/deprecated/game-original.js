// 全局变量
let touchStartX = null;
let touchStartY = null;
let animationId = null;

class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        
        // 撤销系统
        this.stateHistory = []; // 历史状态栈
        this.maxHistorySize = 100; // 最多保存100个历史状态
        this.initialUndoCount = 3; // 初始撤销次数
        this.undoCount = this.initialUndoCount; // 当前可用撤销次数
        this.maxUndoCount = 10; // 最大累计撤销次数
        this.undoRewardValue = 256; // 每合成256的倍数获得撤销次数
        
        this.tileContainer = document.getElementById('tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.messageContainer = document.getElementById('game-message');
        
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        
        this.tiles = {}; // 保存方块DOM元素的引用
        this.tileId = 0; // 用于生成唯一的方块ID
        
        // 随机数生成器
        this.randomSeed = Date.now(); // 初始种子
        this.random = this.createSeededRandom(this.randomSeed);
        
        // 动画状态标志
        this.isAnimating = false;
        
        // 拖动预览相关
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.currentDragX = 0;
        this.currentDragY = 0;
        this.dragDirection = null;
        this.dragDistance = 0;
        this.previewOffset = { x: 0, y: 0 };
        this.minDragDistance = 30; // 触发移动的最小距离
        this.dragThreshold = 3; // 开始显示拖动效果的阈值，降低以提高响应速度
        
        // 快速滑动检测
        this.dragStartTime = 0;
        this.quickSwipeThreshold = 300; // 增加到300ms，让更多滑动被识别为快速滑动
        this.quickSwipeEnabled = true;
        this.lastTouchMoveTime = 0;
        this.touchMoveThrottle = 32; // 约30fps的节流，减少性能开销
        
        // 拖动预览开关（可以在低端设备上禁用）
        this.dragPreviewEnabled = true;
        // 检测是否是移动设备
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // 在旧设备上默认禁用拖动预览
        if (isMobile && window.innerWidth <= 400) {
            this.dragPreviewEnabled = true; // 保持开启，但可以根据需要改为false
        }
        
        this.setup();
        this.updateDisplay();
        
        // 防止页面滚动
        this.preventPageScroll();
        
        // 修复iOS视口高度问题
        this.fixViewportHeight();
    }
    
    preventPageScroll() {
        // 暂时注释掉，可能影响iOS全屏显示
        // document.body.addEventListener('touchmove', (e) => {
        //     e.preventDefault();
        // }, { passive: false });
    }
    
    fixViewportHeight() {
        // 设置正确的视口高度，修复iOS上的问题
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        // 初始设置
        setVH();
        
        // 监听窗口大小变化
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
    
    setup() {
        // 初始化网格
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = null;
            }
        }
        
        // 添加两个初始方块
        this.addNewTile();
        this.addNewTile();
        
        // 保存初始状态
        this.saveState();
        
        // 设置事件监听器
        this.setupEventListeners();
        
        // 更新最高分显示
        this.bestScoreDisplay.textContent = this.bestScore;
        
        // 更新撤销按钮
        this.updateUndoButton();
        
        // 启动液态玻璃动画
        this.startLiquidAnimation();
    }
    
    createSeededRandom(seed) {
        // 创建基于种子的伪随机数生成器
        let currentSeed = seed;
        
        return {
            // 生成0到1之间的随机数
            random: () => {
                // 使用线性同余生成器（LCG）算法
                currentSeed = (currentSeed * 1664525 + 1013904223) % 2147483647;
                return currentSeed / 2147483647;
            },
            // 获取当前种子
            getSeed: () => currentSeed,
            // 设置新种子
            setSeed: (newSeed) => {
                currentSeed = newSeed;
            }
        };
    }
    
    setupEventListeners() {
        // 避免重复绑定，先存储事件处理器
        if (!this.keydownHandler) {
            this.keydownHandler = (e) => {
                const keyMap = {
                    37: 'left',  // Left arrow
                    65: 'left',  // A
                    38: 'up',    // Up arrow
                    87: 'up',    // W
                    39: 'right', // Right arrow
                    68: 'right', // D
                    40: 'down',  // Down arrow
                    83: 'down'   // S
                };
                
                const direction = keyMap[e.keyCode];
                if (direction) {
                    e.preventDefault();
                    this.move(direction);
                }

                // 测试快捷键
                if (e.keyCode === 57) { // "9" key
                    e.preventDefault();
                    this.showMessage('你赢了!', 'game-won');
                }
                if (e.keyCode === 48) { // "0" key
                    e.preventDefault();
                    this.showMessage('无路可走!', 'game-stuck');
                }
            };
        }
        
        // 移除可能存在的旧监听器，然后添加新的
        document.removeEventListener('keydown', this.keydownHandler);
        document.addEventListener('keydown', this.keydownHandler);
        
        // 触摸事件 - 实现拖动预览效果
        document.addEventListener('touchstart', (e) => {
            // 排除按钮点击
            if (e.target.closest('button')) return;
            
            // 如果还在动画中，不开始新的拖动
            if (this.isAnimating) return;
            
            this.isDragging = true;
            this.dragStartX = e.touches[0].clientX;
            this.dragStartY = e.touches[0].clientY;
            this.currentDragX = this.dragStartX;
            this.currentDragY = this.dragStartY;
            this.dragDirection = null;
            this.dragDistance = 0;
            this.dragStartTime = Date.now(); // 记录开始时间
            
            // 只在必要时重置砖块状态
            // 检查是否有砖块还有残留的transform
            const needsReset = Object.values(this.tiles).some(tile => {
                const transform = tile.style.transform;
                return transform && transform !== '' && transform !== 'translate(0, 0) scale(1) rotate(0deg)';
            });
            
            if (needsReset) {
                this.forceResetAllTiles();
            }
            
            // 添加拖动状态类到游戏容器
            this.tileContainer.classList.add('dragging-active');
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging || this.isAnimating) return;
            
            const currentTime = Date.now();
            
            // 节流处理，减少更新频率
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
                
                // 游戏状态检查
                if (this.checkWin()) {
                    this.showMessage('你赢了!', 'game-won');
                } else if (this.checkGameOver()) {
                    // 只有在没有撤销次数时才真正结束游戏
                    if (this.undoCount === 0) {
                        this.showMessage('游戏结束', 'game-over');
                    } else {
                        // 如果还有撤销次数，给用户提示
                        this.showMessage('无路可走!', 'game-stuck');
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
n