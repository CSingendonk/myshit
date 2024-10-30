
class SliderPuzzle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.puzzleState = {
            size: 4, // Default puzzle size (4x4)
            tiles: [],
            tilePositions: [],
            moveCount: 0,
            estimatedMinimumMoves: 0,
            timerStart: null,
            timerInterval: null,
            timerRunning: false,
            imageUrl: 'https://picsum.photos/600'
        };
        this.render();
    }

    connectedCallback() {
        this.loadDefaultImage();
    }

    disconnectedCallback() {
        this.stopTimer();
    }

    // Render the component's HTML and CSS
    render() {
        const style = document.createElement('style');
        style.textContent = `
        
        *{background-color: transparent; color: #f00f00ff; font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.5; margin: 0; padding: 0; box-sizing: border-box; }
        #bigkahuna {
                background-color: transparent;
                min-width: 100%;


            
        }

        #slider-panel {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                margin: 0 auto;
                border: 1px solid #ccc;
                border-radius: 10px;
                overflow: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
                background: pink;
            }

            #slider-panel #controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ccc;
                scale: 0.25;
            }
            :host {
                display: block;
                font-family: 'Open Sans', sans-serif;
                background-color: #00000001;
                text-align: center;
                width: fit-content;
                max-width: 90vmin;
                margin: 0 auto;
                /*! color: #333; */
                box-shadow: 10px 4px 8px rgba(0, 0, 0, 0.5);
                border-radius: 10px;
                padding: 1%;
                box-sizing: border-box;
            }

            #controls {
                display: flex;
                justify-content: stretch;
                flex-direction: row;
                min-width: 50vmin;
                width: 75vmin;
                margin: 0 auto;
                margin-bottom: 10px;
                align-items: stretch;
                justify-content: safe;

            }



            button, select, input[type="file"] {
                padding:  2px 1% 2px 1%;
                font-size: 1rem;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                background-color: #3498db;
                color: white;
                transition: background-color 0.2s, transform 0.1s;
                outline: outset brown 0.5px;
            }

            button:hover, select:hover, input[type="file"]:hover {
                background-color: #2980b9;
            }

            button:active, select:active, input[type="file"]:active {
                transform: scale(0.98);
            }

            #timer, #moveCount {
                margin: 0px;
                font-size: 1rem;
                display: inline-flex;
                border-right: 2px double red;
                padding: 0px 5%;
                border-left: 2px double red;
            }

            #moveCount.optimal {
                color: green;
            }

            #moveCount.good {
                color: orange;
            }

            #moveCount.needs-improvement {
                color: red;
            }

            #ogimage {
                display: contents;
                padding: 1% 2%;
                background-color: #2ecc71;
                color: black;
                /*! border-radius: 5px; */
                cursor: help;
                transition: all 0.2s, transform 0.1s;
                user-select: none;
            }

            #ogimage:hover {
                background-color: #27ae60;
            }

            #ogimage:active {
                transform: scale(0.98);
            }

            #ogimg {
                display: none;
                max-width: 100%;
                margin: 1% auto;
                max-height: 90vmin;
                border: 2px solid #2980b9;
                border-radius: 5px;
                box-shadow: 10px 4px 8px 10 rgba(10, 10, 10, 0.4);
            }

            #puzzleGrid {
                display: grid;
                gap: 2px;
                margin: 0 auto;
                width: 100%;
                max-width: 90vmin;
                border: 2px solid #2980b9;
                border-radius: 10px;
                overflow: auto;
                background-color: #ecf0f1;
                padding: 0.5%;
                margin-bottom: 1%;
            }

            .tile {
                background-size: cover;
                background-position: center;
                cursor: src("https://picsum.photos/600");
                aspect-ratio: 1 / 1;
                transition: transform 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                color: transparent;
                user-select: none;
            }

            .tile:hover {
                transform: scale(0.98);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .hidden {
                visibility: hidden;
                cursor: default;
            }

            /* Responsive Design */
            @media (max-width: 75vmin) {
                #puzzleGrid {
                    max-width: 90vmin;
                }
            }

            span {
                margin: 0 5px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: bold;
                flex-wrap: nowrap;
                flex-direction: row;
            }


            slider-puzzle {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-width: 90vmin;
                margin: 0 auto;
                padding: 10px;
                box-sizing: border-box;
            }

            :root {
                box-sizing: border-box;
            }

            #shuffleButton {
                
            }

.first_shuffle {
    display: flex;
    position: absolute;
    float: left;
    clear: both;

    width: fit-content;
    height: fit-content;
    transform: translate(-25vmin, -45vmin), scale(0.25);
    transition: all 0.75s;
    font-size: 4rem;
    background-color: #2ecc71;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}

.first_shuffle:hover {
    background-color: #27ae60;
}
.first_shuffle:active {

    transition: all 1s;
    transform: translate(-25vmin, -45vmin), scale(0.25);
    }

    drag-grip {
        opacity: 0.5;
    position: absolute;
    top: 10px;
    left: -1px;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    float: left;
    clear: both;
    z-index: 9999;
    
    }

    aside {
        position: relative;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
#infotoggle {
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    float: right;
    clear: both;
    }

    #puzzleInfo {
    position: relative;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    width: fit-content;
    height: fit-content;
        }

        input, select, label, #puzzleInfo {
          scale: 0.8;
        }
        input {
            display: flex;
            max-width: 100px;
        }

        section > * {
          line-height: 1;
          margin: 0px;
          padding: 0px;

        }

        section, #controls, #puzzleInfo {
          display: contents;
        }
        #controls {
          display: flex;
          flex-direction: row;
        }


        
        *{background-color: transparent; color: #f00f00ff; font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.5; margin: 0; padding: 0; box-sizing: border-box; }
        #bigkahuna {
                background-color: transparent;


            
        }

        #slider-panel {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                margin: 0 auto;
                border: 1px solid #ccc;
                border-radius: 10px;
                overflow: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
                background: pink;
            }

            #slider-panel #controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ccc;
                scale: 0.25;
            }
            :host {
                display: block;
                font-family: 'Open Sans', sans-serif;
                background-color: #00000001;
                text-align: center;
                width: fit-content;
                max-width: 90vmin;
                margin: 0 auto;
                /*! color: #333; */
                box-shadow: 10px 4px 8px rgba(0, 0, 0, 0.5);
                border-radius: 10px;
                padding: 1%;
                box-sizing: border-box;
            }

            #controls {
                display: flex;
                justify-content: stretch;
                flex-direction: row;
                min-width: 50vmin;
                width: 75vmin;
                margin: 0 auto;
                margin-bottom: 10px;
                align-items: stretch;
                justify-content: safe;

            }



            button, select, input[type="file"] {
                padding:  2px 1% 2px 1%;
                font-size: 1rem;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                background-color: #3498db;
                color: white;
                transition: background-color 0.2s, transform 0.1s;
                outline: outset brown 0.5px;
            }

            button:hover, select:hover, input[type="file"]:hover {
                background-color: #2980b9;
            }

            button:active, select:active, input[type="file"]:active {
                transform: scale(0.98);
            }

            #timer, #moveCount {
                margin: 0px;
                font-size: 1rem;
                display: inline-flex;
                border-right: 2px double red;
                padding: 0px 5%;
                border-left: 2px double red;
            }

            #moveCount.optimal {
                color: green;
            }

            #moveCount.good {
                color: orange;
            }

            #moveCount.needs-improvement {
                color: red;
            }

            #ogimage {
                display: contents;
                padding: 1% 2%;
                background-color: #2ecc71;
                color: black;
                /*! border-radius: 5px; */
                cursor: help;
                transition: all 0.2s, transform 0.1s;
                user-select: none;
            }

            #ogimage:hover {
                background-color: #27ae60;
            }

            #ogimage:active {
                transform: scale(0.98);
            }

            #ogimg {
                display: none;
                max-width: 100%;
                margin: 1% auto;
                max-height: 90vmin;
                border: 2px solid #2980b9;
                border-radius: 5px;
                box-shadow: 10px 4px 8px 10 rgba(10, 10, 10, 0.4);
            }

            #puzzleGrid {
                display: grid;
                gap: 2px;
                margin: 0 auto;
                width: 100%;
                max-width: 90vmin;
                border: 2px solid #2980b9;
                border-radius: 10px;
                overflow: auto;
                background-color: #ecf0f1;
                padding: 0.5%;
                margin-bottom: 1%;
            }

            .tile {
                background-size: cover;
                background-position: center;
                cursor: src("https://picsum.photos/600");
                aspect-ratio: 1 / 1;
                transition: transform 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                color: transparent;
                user-select: none;
            }

            .tile:hover {
                transform: scale(0.98);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .hidden {
                visibility: hidden;
                cursor: default;
            }

            /* Responsive Design */
            @media (max-width: 75vmin) {
                #puzzleGrid {
                    max-width: 90vmin;
                }
            }

            span {
                margin: 0 5px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: bold;
                flex-wrap: nowrap;
                flex-direction: row;
            }


            slider-puzzle {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-width: 90vmin;
                margin: 0 auto;
                padding: 10px;
                box-sizing: border-box;
            }

            :root {
                box-sizing: border-box;
            }

            #shuffleButton {
                
            }

.first_shuffle {
    display: flex;
    position: absolute;
    float: left;
    clear: both;

    width: fit-content;
    height: fit-content;
    transform: translate(-25vmin, -45vmin), scale(0.25);
    transition: all 0.75s;
    font-size: 4rem;
    background-color: #2ecc71;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}

.first_shuffle:hover {
    background-color: #27ae60;
}
.first_shuffle:active {

    transition: all 1s;
    transform: translate(-25vmin, -45vmin), scale(0.25);
    }

    drag-grip {
        opacity: 0.5;
    position: absolute;
    top: 10px;
    left: -1px;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    float: left;
    clear: both;
    z-index: 9999;
    
    }

    aside {
        position: relative;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
    }
#infotoggle {
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    float: right;
    clear: both;
    }

    #puzzleInfo {
    position: relative;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    width: fit-content;
    height: fit-content;
        }

        input, select, label, #puzzleInfo {
          scale: 0.8;
        }
        input {
            display: flex;
            max-width: 100px;
        }

        section > * {
          line-height: 1;
          margin: 0px;
          padding: 0px;

        }

        section, #controls, #puzzleInfo {
          display: contents;
        }
        #controls {
          display: flex;
          flex-direction: row;
        }


            
            
            
            `;

        

        const template = document.createElement('div');
        template.id = 'bigkahuna';
        template.innerHTML = `
          <button id="infotoggle"> ℹ️</button>
            <section id="puzzleInfo">

            
            <div id="controls">

                <input type="file" id="uploadButton" accept="image/*" aria-label="Upload Image">
                <label for="puzzleSize" style="display: flex; align-items: center; gap: 5px;">
                    Size:
                    <select name="puzzleSize" id="puzzleSize" aria-label="Select Puzzle Size">
                        <option value="3">3 x 3</option>
                        <option value="4" selected>4 x 4</option>
                        <option value="5">5 x 5</option>
                        <option value="6">6 x 6</option>
                        <option value="7">7 x 7</option>
                        <option value="9">9 x 9</option>
                        <option value="8">9 x 7</option>
                    </select>
                </label>                            <div id="ogimage" tabindex="0" aria-label="Toggle Original Image">Show Original Image</div>
            </div>
            <span>
            <button class="first_shuffle" id="shuffleButton">Shuffle</button>
            <div id="timer">Elapsed Time: 00:00</div>
            <div id="moveCount">Moves Made: 0</div>
                <button id="resetButton">Reset</button>
            </span>
            </section>
            <img id="ogimg" aria-hidden="true" style="display: none;">
            <div id="puzzleGrid" aria-label="Puzzle Grid"></div>
        `;

        const grip = document.createElement('drag-grip');
        grip.setAttribute('aria-label', 'Drag to Relocate Puzzle');
        grip.id = 'puzzleDragGrip';
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template);
        const dragScript = document.createElement('script');
        dragScript.src = '../customelements/drag-grip.js';
        this.shadowRoot.appendChild(dragScript);
        grip.style.border = '1px solid green';
        template.appendChild(grip);

        this.bindEvents();
            // Local storage functions for game data
            this.saveGameData = () => {
                const gameData = {
                    puzzleState: this.puzzleState,
                    moveCount: this.moveCount,
                    elapsedTime: this.elapsedTime
                };
                localStorage.setItem('sliderpuzzle_gamedata', JSON.stringify(gameData));
            };
            this.loadGameData = () => {
                const savedData = localStorage.getItem('sliderpuzzle_gamedata');
                if (savedData) {
                    const gameData = JSON.parse(savedData);
                    this.puzzleState = gameData.puzzleState;
                    this.moveCount = gameData.moveCount;
                    this.elapsedTime = gameData.elapsedTime;
                    return true;
                }
                return false;
            };

            let idlemotioninterval = setInterval(() => {
                this.elapsedTime++;
                this.updateTimer();
                if (this.shadowRoot.getElementById('shuffleButton').classList.contains('first_shuffle')) {
                    let xORy = Math.random() > 0.5 ? 'X' : 'Y';
                    let plusOrMinus = Math.random() > 0.5 ? '' : '-';
                    const sb = this.shadowRoot.getElementById('shuffleButton');
                    sb.style.transform = `rotate${xORy}(${plusOrMinus}${Math.random() * 45}deg) translate${xORy}(${Math.random() * 100}px)`;
                    sb.style.transition = 'transform 1s linear';

                }
                else {
                    const sb = this.shadowRoot.getElementById('shuffleButton');
                    sb.style.transform = `rotate(0deg) translate(0px, 0px)`;
                    clearInterval(idlemotioninterval);
                }
            }, 1001);
    }


    initializeTiles() {
        const totalTiles = this.puzzleState.size * this.puzzleState.size;
        this.puzzleState.tiles = [];
        this.puzzleState.tilePositions = [];

        for (let i = 1; i < totalTiles; i++) {
            this.puzzleState.tiles.push(i);
            this.puzzleState.tilePositions.push(i);
        }
        this.puzzleState.tilePositions.push(0); // Empty tile

        // Set initialState to remember the starting positions
        this.puzzleState.initialState = [...this.puzzleState.tilePositions];
    }


    // Update the grid layout based on puzzle size
    updateGridStyle() {
        const puzzleGrid = this.shadowRoot.getElementById('puzzleGrid');
        puzzleGrid.style.gridTemplateColumns = `repeat(${this.puzzleState.size}, 1fr)`;
        puzzleGrid.style.gridTemplateRows = `repeat(${this.puzzleState.size}, 1fr)`;
    }

    // Render the puzzle grid based on current tile positions
    initializePuzzle() {
        const puzzleGrid = this.shadowRoot.getElementById('puzzleGrid');
        puzzleGrid.innerHTML = '';
        this.updateGridStyle();

        this.puzzleState.tilePositions.forEach((value, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.setAttribute('role', 'button');
            tile.setAttribute('aria-label', value === 0 ? 'Empty Tile' : `Tile ${value}`);
            tile.setAttribute('tabindex', value === 0 ? '-1' : '0');

            if (value === 0) {
                tile.classList.add('hidden');
            } else {
                const row = Math.floor((value - 1) / this.puzzleState.size);
                const col = (value - 1) % this.puzzleState.size;
                tile.style.backgroundImage = `url(${this.puzzleState.imageUrl})`;
                tile.style.backgroundSize = `${this.puzzleState.size * 100}% ${this.puzzleState.size * 100}%`;
                tile.style.backgroundPosition = `${(col * 100) / (this.puzzleState.size - 1)}% ${(row * 100) / (this.puzzleState.size - 1)}%`;
                tile.textContent = value; // 
                tile.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.moveTile(index);
                    }
                });
            }

            // Click event for tile movement
            tile.addEventListener('click', () => this.moveTile(index));
            puzzleGrid.appendChild(tile);
        });
        const ctrls = this.shadowRoot.getElementById('controls');
        this.updateMoveCountDisplay();
    }

    // Handle tile movement logic
    moveTile(index) {
        const emptyIndex = this.puzzleState.tilePositions.indexOf(0);
        const size = this.puzzleState.size;

        const rowEmpty = Math.floor(emptyIndex / size);
        const colEmpty = emptyIndex % size;
        const rowTile = Math.floor(index / size);
        const colTile = index % size;

        const rowDiff = Math.abs(rowTile - rowEmpty);
        const colDiff = Math.abs(colTile - colEmpty);

        // Allow only adjacent moves (up, down, left, right)
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            [this.puzzleState.tilePositions[index], this.puzzleState.tilePositions[emptyIndex]] = [this.puzzleState.tilePositions[emptyIndex], this.puzzleState.tilePositions[index]];
            this.puzzleState.moveCount++;
            this.initializePuzzle();
            this.updateMoveCountDisplay();
            this.checkWinCondition();
        } else {

            console.log("Invalid move");
        }
    }
    shufflePuzzle() {
        if (this.shadowRoot.querySelector('#shuffleButton') &&  this.shadowRoot.querySelector('#shuffleButton').classList.contains('first_shuffle')) {
            this.shadowRoot.querySelector('#shuffleButton').classList.remove('first_shuffle');
        }
        do {
            for (let i = this.puzzleState.tilePositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.puzzleState.tilePositions[i], this.puzzleState.tilePositions[j]] = [this.puzzleState.tilePositions[j], this.puzzleState.tilePositions[i]];
            }
        } while (!this.isSolvable());

        this.initializePuzzle();
        this.puzzleState.moveCount = 0;
        this.calculateEstimatedMinimumMoves();
        this.updateMoveCountDisplay();
        this.resetTimer();
    }


    // Reset the puzzle to the initial state
    resetPuzzle() {
        this.puzzleState.tilePositions = [...this.puzzleState.initialState];
        this.initializePuzzle();
        this.puzzleState.moveCount = 0;
        this.updateMoveCountDisplay();
        this.resetTimer();
    }

    // Check if the current puzzle state is solvable
    isSolvable() {
        const inversionCount = this.getInversionCount(this.puzzleState.tilePositions);
        const size = this.puzzleState.size;
        if (size % 2 !== 0) {
            return inversionCount % 2 === 0;
        } else {
            const emptyRow = Math.floor(this.puzzleState.tilePositions.indexOf(0) / size);
            return (inversionCount + emptyRow) % 2 !== 0;
        }
    }

    // Calculate the number of inversions in the puzzle
    getInversionCount(arr) {
        let invCount = 0;
        const tiles = arr.filter(n => n !== 0);
        for (let i = 0; i < tiles.length - 1; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i] > tiles[j]) {
                    invCount++;
                }
            }
        }
        return invCount;
    }

    // Check if the puzzle is solved
    isSolved() {
        for (let i = 0; i < this.puzzleState.tilePositions.length - 1; i++) {
            if (this.puzzleState.tilePositions[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    // Check for win condition and handle accordingly
    checkWinCondition() {
        if (this.isSolved()) {
            this.stopTimer();
            const efficiencyStatus = this.getEfficiencyStatus();
            let efficiencyMessage = '';
            if (efficiencyStatus === 'optimal') {
                efficiencyMessage = 'Excellent! You solved the puzzle optimally.';
            } else if (efficiencyStatus === 'good') {
                efficiencyMessage = 'Great job! You solved the puzzle efficiently.';
            } else {
                efficiencyMessage = 'Good effort! Try solving it in fewer moves next time.';
            }
            alert(`🎉 Congratulations! You solved the puzzle in ${this.formatTime(Date.now() - this.puzzleState.timerStart)}!\n${efficiencyMessage}`);

            // Dispatch a custom event for puzzle completion
            this.dispatchEvent(new CustomEvent('puzzle-completed', {
                detail: {
                    time: this.formatTime(Date.now() - this.puzzleState.timerStart),
                    moves: this.puzzleState.moveCount,
                    efficiency: efficiencyStatus
                }
            }));
        }
    }

    // Start or reset the timer
    resetTimer() {
        this.stopTimer();
        this.puzzleState.timerStart = Date.now();
        this.puzzleState.timerRunning = true;
        this.updateTimerDisplay(0);
        this.puzzleState.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    // Stop the timer
    stopTimer() {
        this.puzzleState.timerRunning = false;
        if (this.puzzleState.timerInterval) {
            clearInterval(this.puzzleState.timerInterval);
            this.puzzleState.timerInterval = null;
        }
    }

    // Update the timer display
    updateTimer() {

        if (this.puzzleState.timerRunning) {
            const elapsed = Date.now() - this.puzzleState.timerStart;
            this.updateTimerDisplay(elapsed);
        }
    }

    // Format time from milliseconds to MM:SS
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    // Update the timer element's text
    updateTimerDisplay(ms) {
        const timerElement = this.shadowRoot.getElementById('timer');
        timerElement.textContent = `Elapsed Time: ${this.formatTime(ms)}`;
    }

    // Calculate the estimated minimum number of moves using Manhattan Distance
    calculateEstimatedMinimumMoves() {
        let estimatedMoves = 0;
        const size = this.puzzleState.size;

        for (let i = 0; i < this.puzzleState.tilePositions.length; i++) {
            const tileNumber = this.puzzleState.tilePositions[i];
            if (tileNumber !== 0) {
                const currentRow = Math.floor(i / size);
                const currentCol = i % size;
                const targetRow = Math.floor((tileNumber - 1) / size);
                const targetCol = (tileNumber - 1) % size;
                estimatedMoves += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
            }
        }

        this.puzzleState.estimatedMinimumMoves = estimatedMoves;
    }

    // Update the move count display with efficiency feedback
    updateMoveCountDisplay() {
        const moveCountElement = this.shadowRoot.getElementById('moveCount');
        moveCountElement.textContent = `Moves Made: ${this.puzzleState.moveCount}`;

        // Remove existing efficiency classes
        moveCountElement.classList.remove('optimal', 'good', 'needs-improvement');

        // Add the current efficiency class
        const efficiencyStatus = this.getEfficiencyStatus();
        moveCountElement.classList.add(efficiencyStatus);
    }

    // Determine the efficiency status based on moves made vs estimated minimum
    getEfficiencyStatus() {
        const minMoves = this.puzzleState.estimatedMinimumMoves;
        const movesMade = this.puzzleState.moveCount;

        if (movesMade <= minMoves * 1.5) { // Adjust multiplier as needed
            return 'optimal';
        } else if (movesMade <= minMoves * 3) {
            return 'good';
        } else {
            return 'needs-improvement';
        }
    }

    // Load the default image for the puzzle
    loadDefaultImage() {
        this.shadowRoot.getElementById('ogimg').src = this.puzzleState.imageUrl;
        this.initializeTiles();
        this.initializePuzzle();
        this.resetTimer();
    }

    // Handle image upload by the user
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.puzzleState.imageUrl = e.target.result;
                this.shadowRoot.getElementById('ogimg').src = this.puzzleState.imageUrl;
                this.initializeTiles();
                this.initializePuzzle();
                this.resetTimer();
            };
            reader.readAsDataURL(file);
        }
    }
    // Split the image into tiles and initialize the puzzle 
    changePuzzleSize() {
        const selectedSize = this.shadowRoot.getElementById('puzzleSize').value;
        const validSizes = ['3', '4', '5', '6', '7', '9', '8'];

        if (validSizes.includes(selectedSize)) {
            this.puzzleState.size = selectedSize.includes('x') ? parseInt(selectedSize.split('x')[0]) : parseInt(selectedSize);
            this.initializeTiles();
            this.initializePuzzle();
            this.resetTimer();
        }
    }


    // Toggle the display of the original image hint
    toggleOriginalImage() {
        const ogimg = this.shadowRoot.getElementById('ogimg');
        const ogimage = this.shadowRoot.getElementById('ogimage');
        const isActive = ogimage.classList.toggle('active');
        ogimg.style.display = isActive ? 'block' : 'none';
        ogimg.style.position = isActive ? 'relative' : 'absolute';

    }

    showInfo() {

        const info = this.shadowRoot.getElementById('puzzleInfo');
        info.style.display = info.style.display === 'none' ? 'contents' : 'none';
    }
    // Define the custom element

    // Bind event listeners to controls and interactive elements
    bindEvents() {
        const shadow = this.shadowRoot;
        shadow.getElementById('infotoggle').addEventListener('click', () => this.showInfo());
        shadow.getElementById('shuffleButton').addEventListener('click', () => this.shufflePuzzle());
        shadow.getElementById('resetButton').addEventListener('click', () => this.resetPuzzle());
        shadow.getElementById('uploadButton').addEventListener('change', (e) => this.handleImageUpload(e));
        shadow.getElementById('puzzleSize').addEventListener('change', () => this.changePuzzleSize());
        shadow.getElementById('ogimage').addEventListener('click', () => this.toggleOriginalImage());

        // Accessibility: Allow toggling original image via keyboard
        shadow.getElementById('ogimage').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key == 'Backspace' || e.key == 'Esc') {
                e.preventDefault();
                this.toggleOriginalImage();
            }
        });
    }
    
        }
    customElements.define('slider-puzzle', SliderPuzzle);
