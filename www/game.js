// 游戏状态管理
class GameManager {
    constructor() {
        this.currentScreen = 'mainMenu';
        this.gameMode = null;
        this.selectedColor = null;
        this.currentPlayer = 'red';
        this.playerPositions = { red: 0, blue: 0 };
        this.gameBoard = [];
        this.websocket = null;
        this.isMultiplayer = false;
        
        this.initializeBoard();
        this.bindEvents();
        this.drawBoard();
    }

    // 初始化棋盘
    initializeBoard() {
        this.gameBoard = [];
        for (let i = 0; i < 40; i++) {
            this.gameBoard.push({
                position: i,
                type: this.getSquareType(i),
                name: this.getSquareName(i)
            });
        }
    }

    // 获取方块类型
    getSquareType(position) {
        if (position === 0) return 'start';
        if (position === 20) return 'free-parking';
        if (position === 30) return 'go-to-jail';
        if (position === 10) return 'jail';
        if (position % 5 === 0) return 'railroad';
        if (position % 3 === 0) return 'utility';
        return 'property';
    }

    // 获取方块名称
    getSquareName(position) {
        const names = [
            '起点', '地中海大道', '社区基金', '波罗的海大道', '所得税',
            '东方铁路', '东方大道', '机会', '佛蒙特大道', '康涅狄格大道',
            '监狱', '圣查尔斯广场', '电力公司', '州大道', '弗吉尼亚大道',
            '宾夕法尼亚铁路', '圣詹姆斯广场', '社区基金', '田纳西大道', '纽约大道',
            '免费停车', '肯塔基大道', '机会', '印第安纳大道', '伊利诺伊大道',
            'B&O铁路', '大西洋大道', '文特诺大道', '自来水公司', '马文花园',
            '进监狱', '太平洋大道', '北卡罗来纳大道', '社区基金', '宾夕法尼亚大道',
            '短途铁路', '机会', '公园广场', '奢侈税', '博德沃克'
        ];
        return names[position] || `位置 ${position}`;
    }

    // 绑定事件
    bindEvents() {
        // 主菜单按钮
        document.getElementById('singlePlayerBtn').addEventListener('click', () => {
            this.showScreen('colorScreen');
            this.gameMode = 'single';
        });

        document.getElementById('multiPlayerBtn').addEventListener('click', () => {
            this.showScreen('connectionScreen');
            this.gameMode = 'multi';
        });

        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showScreen('helpScreen');
        });

        // 连接设置
        document.getElementById('connectBtn').addEventListener('click', () => {
            this.connectToServer();
        });

        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });

        // 颜色选择
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectColor(e.currentTarget.dataset.color);
            });
        });

        // 游戏控制
        document.getElementById('rollDiceBtn').addEventListener('click', () => {
            this.rollDice();
        });

        document.getElementById('endTurnBtn').addEventListener('click', () => {
            this.endTurn();
        });

        document.getElementById('quitGameBtn').addEventListener('click', () => {
            this.quitGame();
        });

        // 帮助返回
        document.getElementById('backFromHelpBtn').addEventListener('click', () => {
            this.showScreen('mainMenu');
        });
    }

    // 显示指定屏幕
    showScreen(screenName) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 显示指定屏幕
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;
    }

    // 选择颜色
    selectColor(color) {
        this.selectedColor = color;
        this.currentPlayer = color;
        
        // 更新UI
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('selected');

        // 延迟显示游戏界面
        setTimeout(() => {
            this.showScreen('gameScreen');
            this.updateGameUI();
        }, 500);
    }

    // 连接到服务器
    connectToServer() {
        const ip = document.getElementById('serverIP').value;
        const port = document.getElementById('serverPort').value;

        try {
            // 这里应该实现WebSocket连接
            // 为了演示，我们直接进入颜色选择
            this.isMultiplayer = true;
            this.showScreen('colorScreen');
        } catch (error) {
            alert('连接失败: ' + error.message);
        }
    }

    // 掷骰子
    rollDice() {
        const diceResult = Math.floor(Math.random() * 6) + 1;
        document.getElementById('diceResult').textContent = `骰子: ${diceResult}`;
        
        // 移动棋子
        this.movePlayer(diceResult);
        
        // 禁用掷骰子按钮
        document.getElementById('rollDiceBtn').disabled = true;
        document.getElementById('endTurnBtn').disabled = false;
    }

    // 移动玩家
    movePlayer(steps) {
        const newPosition = (this.playerPositions[this.currentPlayer] + steps) % 40;
        this.playerPositions[this.currentPlayer] = newPosition;
        
        this.drawBoard();
        this.updateGameUI();
        
        // 检查是否获胜
        if (newPosition >= 39) {
            this.endGame();
        }
    }

    // 结束回合
    endTurn() {
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
        
        // 重置UI
        document.getElementById('rollDiceBtn').disabled = false;
        document.getElementById('endTurnBtn').disabled = true;
        document.getElementById('diceResult').textContent = '骰子: -';
        
        this.updateGameUI();
    }

    // 更新游戏UI
    updateGameUI() {
        const playerNames = { red: '红色', blue: '蓝色' };
        document.getElementById('currentPlayer').textContent = `当前玩家: ${playerNames[this.currentPlayer]}`;
    }

    // 绘制棋盘
    drawBoard() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const squareSize = size / 11; // 11x11的网格

        // 清空画布
        ctx.clearRect(0, 0, size, size);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, size, size);

        // 绘制边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, size, size);

        // 绘制方块
        for (let i = 0; i < 40; i++) {
            const pos = this.getSquarePosition(i, squareSize);
            this.drawSquare(ctx, pos.x, pos.y, squareSize, this.gameBoard[i]);
        }

        // 绘制棋子
        this.drawPawn(ctx, this.playerPositions.red, squareSize, '#ff4757');
        this.drawPawn(ctx, this.playerPositions.blue, squareSize, '#3742fa');
    }

    // 获取方块位置
    getSquarePosition(index, squareSize) {
        if (index <= 10) {
            return { x: (10 - index) * squareSize, y: 10 * squareSize };
        } else if (index <= 20) {
            return { x: 0, y: (20 - index) * squareSize };
        } else if (index <= 30) {
            return { x: (index - 20) * squareSize, y: 0 };
        } else {
            return { x: 10 * squareSize, y: (index - 30) * squareSize };
        }
    }

    // 绘制方块
    drawSquare(ctx, x, y, size, square) {
        // 根据方块类型设置颜色
        let color = '#fff';
        switch (square.type) {
            case 'start':
                color = '#90EE90';
                break;
            case 'jail':
                color = '#FFB6C1';
                break;
            case 'free-parking':
                color = '#87CEEB';
                break;
            case 'go-to-jail':
                color = '#FFA500';
                break;
            case 'railroad':
                color = '#DDA0DD';
                break;
            case 'utility':
                color = '#F0E68C';
                break;
            default:
                color = '#fff';
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);

        // 绘制方块名称
        ctx.fillStyle = '#333';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        const text = square.name.length > 4 ? square.name.substring(0, 4) : square.name;
        ctx.fillText(text, x + size/2, y + size/2);
    }

    // 绘制棋子
    drawPawn(ctx, position, squareSize, color) {
        const pos = this.getSquarePosition(position, squareSize);
        const pawnSize = squareSize * 0.3;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x + squareSize/2, pos.y + squareSize/2, pawnSize, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 结束游戏
    endGame() {
        const winner = this.currentPlayer === 'red' ? '红色' : '蓝色';
        alert(`游戏结束！${winner}玩家获胜！`);
        this.showScreen('mainMenu');
        this.resetGame();
    }

    // 退出游戏
    quitGame() {
        if (confirm('确定要退出游戏吗？')) {
            this.showScreen('mainMenu');
            this.resetGame();
        }
    }

    // 重置游戏
    resetGame() {
        this.currentPlayer = 'red';
        this.playerPositions = { red: 0, blue: 0 };
        this.selectedColor = null;
        this.gameMode = null;
        this.isMultiplayer = false;
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
}); 