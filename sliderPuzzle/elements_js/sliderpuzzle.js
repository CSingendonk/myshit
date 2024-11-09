class SliderPuzzle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        let rndmimg = () => { return `https://picsum.photos/600/600/?random=${Math.random()}`};
        this.defaultImgUrl = rndmimg();
        this.imageUrl = this.defaultImgUrl;
        this.imgUrl = this.imageUrl;
        this.history = [];
        this.puzzleState = {
            size: 3, // Default puzzle size (3x3)
            tiles: [],
            tilePositions: [],
            moveCount: 0,
            estimatedMinimumMoves: 0,
            timerStart: null,
            timerInterval: null,
            timerRunning: false,
            time: 0,
            elapsedTime: 0,
            imageUrl: this.defaultImgUrl
        }
        this.timer = {
            time: Date.now(),
            interval: this.puzzleState.timerInterval,
            elapsedTime: 0,
            limit: Number.POSITIVE_INFINITY,
            startedAt: 0,
            pausedAt: 0,
            endsAt: 0,
            isRunning: false,
            isPaused: false,
            isStopped: false,
            isReset: false,
            isStarted: false,
            isLimited: false,
            isEnded: false,

        }
        this.defaultImages = {
                gif: ['https://csingendonk.github.io/htmlpanels/sliderPuzzle/pics/activegridanimation.gif',
                'https://csingendonk.github.io/htmlpanels/sliderPuzzle/pics/bouncingBallingManGiphy.gif'
                ],
                png: ['https://csingendonk.github.io/htmlpanels/sliderPuzzle/pics/tbird.png',
                'https://csingendonk.github.io/htmlpanels/sliderPuzzle/pics/runningb.png'],
                random: [
                    `https://picsum.photos/600/600/?random=${Math.random()}`, this.defaultImgUrl
                ]
            };
            let storedImages = localStorage.getItem('userImages');
            if (storedImages) {
                this.userImages = JSON.parse(storedImages);
            }
            else {
                this.userImages = [];
            }
            this.size = {
                get() {
                    return this.puzzleState.size;
                },
                set(newSize) {
                    let short = newSize['l'] * newSize['w'];
                    if (short % 2 === 0) {
                        newSize.l = newSize.w * 1.25;
                    }
                    if (newSize >= 2 && newSize <= 8) {
                        this.puzzleState.size = newSize;
                        this.resetPuzzle();
                        this.render();
                    }
                }
            }; 
            this.elements = {
            ...this.shadowRoot.querySelectorAll('*')
            };
            this.isNewPuzzle = true;
            window.addEventListener('keydown', (event) => this.handleArrowKeyInput(event));
            this.render();
            this.addrszListener();
    }

    #defaultImgUrl = () => {return this.puzzleState.imageUrl}


    connectedCallback() {
        this.displayStartUI();
        this.loadDefaultImage();
        this.addResizeListener();
    }

    disconnectedCallback() {
        this.stopTimer();
    }

    getRandomValue255() {
        return Math.floor(Math.random() * 256);

    }

    random255toHex(num) {
        return num.toString(16).padStart(2, '0');
    }

    getRandomHexValueFF() {
        return this.random255toHex(this.getRandomValue255());
    }

    getRandomColorHex() {
        let code = `#`;
        for (let i = 0; i < 3; i++) {
            code += this.getRandomHexValueFF();
        }
        return code;
    }

    // Render the component's HTML and CSS
    render() {
        console.log(this.getRandomColorHex());
        const style = document.createElement('style');
        style.textContent = `
                
                 *{background-color: ${this.getRandomColorHex()} }; color: #00f000ff; font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.5; margin: 0; padding: 0; box-sizing: border-box; }
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
        
                    #slider-panel {
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
        
        
        
                    button, select, input[type="file"] {
                        padding:  2px 1% 2px 1%;
                        font-size: 1rem;
                        cursor: pointer;
                        border: none;
                        border-radius: 5px;
                        background-color: #3498db;
                        color: white;
                        transition: all 0.2s, transform 0.1s;
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
                        color: #0000009f;
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
                
                        section, #puzzleInfo {
                          display: contents;
                        }

                
                
                        
                        *{background-color: transparent; color: #f00f00ff; font-family: 'Arial', sans-serif; font-size: 16px; line-height: 1.5; margin: 0; padding: 0; box-sizing: border-box; }
                        #bigkahuna {
                                background-color: transparent;
                                display: inline-flex;
                
                            
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
                
                            #slider-panel {
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
                
                        section {
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          align-content: center;
                          width: fit-content;
                          height: fit-content;
                        }

                
                        #puzzleInfo {
                            display: inline-flex;
                        }
                
                        slider-puzzle {
                         resize: both;
                        }
                        
                
                        #puzzleGrid{
                            resize: both;
                            touch-action: manipulation;
                        }


                            
                            
                            
                            `;

        const template = document.createElement('div');
        template.id = 'bigkahuna';
        template.innerHTML = `
          <button id="infotoggle"> ℹ️</button>
            <section id="puzzleInfo">
            <button id="ogimage">PEEK</button>
            <button id="savepuzzle">SAVE</button>
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
        template.style.minWidth = 'initial';
        template.style.position = 'relative';

        const grip = document.createElement('drag-grip');
        grip.setAttribute('aria-label', 'Drag to Relocate Puzzle');
        grip.id = 'puzzleDragGrip';
        this.shadowRoot.appendChild(style);

        this.shadowRoot.appendChild(template);
        this.displayStartUI();
        this.bindEvents();
        // Local storage functions for game data
        this.saveGameData = () => {
            const gameData = {
                puzzleState: this.puzzleState,
                moveCount: this.puzzleState.moveCount,
                elapsedTime: this.puzzleState.time
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
                sb.textContent = 'START';
            }
            else {
                const sb = this.shadowRoot.getElementById('shuffleButton');
                sb.style.transform = `rotate(0deg) translate(0px, 0px)`;
                sb.textContent = 'SHUFFLE';
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
        this.updateMoveCountDisplay();
        const info = this.shadowRoot.getElementById('puzzleInfo');

        const bk = info.parentElement;
        const bks = bk.style;
        bks.flexDirection = 'column';
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
        this.puzzleTileScale();
    }
    shufflePuzzle() {
        if (this.shadowRoot.querySelector('#shuffleButton') && this.shadowRoot.querySelector('#shuffleButton').classList.contains('first_shuffle')) {
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
        this.puzzleTileScale();
    }


    // Reset the puzzle to the initial state
    resetPuzzle() {
        this.puzzleState.tilePositions = [...this.puzzleState.initialState];
        this.initializePuzzle();
        this.puzzleState.moveCount = 0;
        this.updateMoveCountDisplay();
        this.resetTimer();
        this.puzzleTileScale();
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
            this.puzzleState.time = elapsed;
            this.elapsedTime = elapsed;
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
        this.initializePuzzle();
        this.initializeTiles();
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
                this.userImages.push(this.puzzleState.imageUrl);
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
        info.style.display = info.style.display === 'none' ? 'inline-flex' : 'none';
        if (info.style.display === 'inline-flex') {
            const bk = info.parentElement;
            const bks = bk.style;
            bks.flexDirection = 'column';
        }
    }
    // Define the custom element

    // Bind event listeners to controls and interactive elements
    bindEvents() {
        const shadow = this.shadowRoot;
        shadow.getElementById('infotoggle').addEventListener('click', () => this.showInfo());
        shadow.getElementById('shuffleButton').addEventListener('click', () => this.shufflePuzzle());
        shadow.getElementById('resetButton').addEventListener('click', () => this.resetPuzzle());
        shadow.getElementById('ogimage').addEventListener('click', () => this.toggleOriginalImage());
        // Accessibility: Allow toggling original image via keyboard
        shadow.getElementById('ogimage').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key == 'Backspace' || e.key == 'Esc') {
                e.preventDefault();
                this.toggleOriginalImage();
            }
        });
        shadow.getElementById('savepuzzle').addEventListener('click', () => this.saveGameData());
    }
    
    loadRandomImage() {
                this.puzzleState.imageUrl = 'https://picsum.photos/600/600/?random=' + Math.random();
                this.shadowRoot.querySelector('#ogimg').src = this.puzzleState.imageUrl;
                this.puzzleState.size = 3;
                this.initializeTiles();
                this.initializePuzzle();
                this.shadowRoot.querySelector('#resetButton').click();
                return this.puzzleState.imageUrl;
    }

    addResizeListener() {
        this.shadowRoot.host.addEventListener('touch', (event) => {
            this.resizePuzzle(event);
        });
        this.shadowRoot.host.addEventListener('resize', (event) => {
            this.resizePuzzle(event);
        });
        this.shadowRoot.getElementById('puzzleGrid').addEventListener('change', (event) => {
            this.resizePuzzle(event);
        });
        this.shadowRoot.getElementById('puzzleGrid').addEventListener('resize', (event) => {
            this.resizePuzzle(event);
        });
        const puzzleGrid = this.shadowRoot.getElementById('puzzleGrid');
        const observer = new MutationObserver((mutations) => {
            const names = ['children', 'style'];
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && names.includes(mutation.attributeName)) {
                    this.resizePuzzle(new Event('resize'));
                }
            });
        });
        observer.observe(puzzleGrid, { attributes: true, attributeFilter: ['style'] });
        window.addEventListener('resize', (event) => {
            this.resizePuzzle(event);
        });
        this.shadowRoot.getRootNode().addEventListener('resize', (event) => {
            this.resizePuzzle(event);
        });
        const resizeLoop = setInterval((event) => {
            const hsc = this.shadowRoot.host.style;
            if (hsc.height != hsc.width) {
                this.resizePuzzle(event);
            }
        }, 1000);
    }

    rsz = class rsz extends Event {
        constructor(host, type = 'resize', detail = {}) {
            super('resize');
            const rszEvent = new CustomEvent('rszEvent', {
                bubbles: true,
                cancelable: true,
                detail: {
                    type: type,
                    detail: detail
                }
            });


            host.rszHappening = true;
            this.host = host;
        }


    };

    //listen for rsz events on the host
    rszListener(event) {
        if (event.type === 'rszEvent') {
            if (event.detail.type === 'resize') {
                this.resizePuzzle(event);
            }
        }
        if (event.type === 'resize') {
            
            this.resizePuzzle(event);
        }
    }

    addrszListener =() => { this.shadowRoot.host.addEventListener('rszEvent', (event) => {

        this.rszListener(event);
        return true;
    });
    return false;
    }



    puzzleTileScale() {
        let puzzleGrid = this.shadowRoot.getElementById('puzzleGrid') ? this.shadowRoot.getElementById('puzzleGrid') : false;
        if (!puzzleGrid) {
            return;
        }
        let tileCount = Array.from(puzzleGrid.children).length || this.puzzleState.size * this.puzzleState.size;
        let gridSize = Math.sqrt(tileCount);
        let tileSize = (parseInt(puzzleGrid.style.width) / gridSize) - (2 * gridSize); // Account for borders/gaps

        Array.from(puzzleGrid.children).forEach(tile => {
            tile.style.minHeight = `${tileSize}px`;
            tile.style.maxHeight = `${tileSize}px`;
            tile.style.minWidth = `${tileSize}px`;
            tile.style.maxWidth = `${tileSize}px`;
        });

        const _a = parseInt(document.body.style.width) * 0.75;
        const _b = parseInt(document.body.style.height) * 0.75;
        const _c = Math.min(_a, _b);
        const _d = Math.max(_a, _b);
        const _e = _c / _d;
        const _f = _e * 100;
        puzzleGrid.style.maxWidth = `${_f}%`;
        puzzleGrid.style.maxHeight = `${_f}%`;
        puzzleGrid.style.minWidth = `${_f / 2}%`;
        puzzleGrid.style.minHeight = `${_f / 2}%`;
        puzzleGrid.style.width = `${_f}%`;
        puzzleGrid.style.height = `${_f}%`;
       }

    puzzleInfoScale() {
        const puzzleInfo = this.shadowRoot.getElementById('puzzleInfo');
        const container = this.shadowRoot.getElementById('bigkahuna');
        const containerWidth = parseInt(container.style.width);
        
        container.style.maxWidth = '100%';
        puzzleInfo.style.width = `${containerWidth}px`;
        puzzleInfo.style.maxWidth = '100%';
        
        const scale = Math.min(1, containerWidth / puzzleInfo.offsetWidth);
        puzzleInfo.style.transform = `scale(${scale})`;
        puzzleInfo.style.transformOrigin = 'top left';
    }

    resizePuzzle(event) {
        if (event) event.preventDefault();
        
        const puzzleGrid = this.shadowRoot.getElementById('puzzleGrid');
        const container = this.shadowRoot.getElementById('bigkahuna');
        const containerWidth = parseInt(container.style.width);
        
        // Make puzzle grid square based on container width
        puzzleGrid.style.width = `${containerWidth}px`;
        puzzleGrid.style.height = `${containerWidth}px`;
        
        // Ensure puzzle doesn't overflow container
        const maxSize = Math.min(containerWidth, parseInt(container.style.width));
        puzzleGrid.style.width = `${maxSize}px`;
        puzzleGrid.style.height = `${maxSize}px`;
        
        this.puzzleTileScale();
        this.puzzleInfoScale();
        
        // Dispatch resize event
        const rszEvent = new this.rsz(this, 'resize', event);
    }        handleArrowKeyInput(event) {
        const emptyIndex = this.puzzleState.tilePositions.indexOf(0);
        const size = this.puzzleState.size;

        // Calculate the row and column of the empty tile
        const rowEmpty = Math.floor(emptyIndex / size);
        const colEmpty = emptyIndex % size;

        let targetIndex = -1;

        switch (event.key) {
            case 'ArrowDown':
                // Move tile below the empty space up
                if (rowEmpty < size - 1) {
                    targetIndex = emptyIndex + size;
                }
                break;
            case 'ArrowUp':
                // Move tile above the empty space down
                if (rowEmpty > 0) {
                    targetIndex = emptyIndex - size;
                }
                break;
            case 'ArrowRight':
                // Move tile to the right of the empty space left
                if (colEmpty < size - 1) {
                    targetIndex = emptyIndex + 1;
                }
                break;
            case 'ArrowLeft':
                // Move tile to the left of the empty space right
                if (colEmpty > 0) {
                    targetIndex = emptyIndex - 1;
                }
                break;
            case 'r':
                // Reset the puzzle
                this.resetPuzzle();
                break;
            case 's':
                if (event.altKey) {
                    localStorage.setItem('puzzleState', JSON.stringify(this.puzzleState));
                    if (localStorage.getItem('sliderpuzzleHistory')) {
                        let history = JSON.parse(localStorage.getItem('sliderpuzzleHistory'));
                        this.history = !history || history.length === 0 ? this.history : [...history, ...this.history];
                        history.push(this.puzzleState);
                        localStorage.setItem('sliderpuzzleHistory', JSON.stringify(history));
                    } else {
                        localStorage.setItem('sliderpuzzleHistory', JSON.stringify([this.puzzleState]));
                    }
                    break;
                }
                // Shuffle the puzzle
                this.shufflePuzzle();
                break;
            case 'n':
                this.puzzleState.imageUrl = 'https://picsum.photos/600/600/?random=' + Math.random();
                this.shadowRoot.querySelector('#ogimg').src = this.puzzleState.imageUrl;
                this.puzzleState.size = 3;
                this.initializeTiles();
                this.initializePuzzle();
                break;
            case 'h':
                this.toggleOriginalImage();
                break;
            case 'p':
                if (!document.body.querySelector('popup-box') || document.body.querySelector('popup-box')?.args?.title != 'Puzzle'){
                    document.body.querySelector('#open-puzzle-dlg-btn').click();
                }
                else {
                    document.body.querySelector('popup-box').hide();
                };
                break;
            case '':
                break;
            default:
                
                return;
        }

        // If a valid targetIndex was determined, call moveTile
        if (targetIndex !== -1) {
            this.moveTile(targetIndex);
        }
    }

    loadStartUIImages(imgcontainer){ 
        if (imgcontainer.children.length > 0) {
            imgcontainer.innerHTML = '';
        }
        let flat = [...this.userImages, ...this.defaultImages.random, ...this.defaultImages.png, ...this.defaultImages.gif];
          flat.forEach((imageUrl) => {
              const img = document.createElement('img');
              img.src = imageUrl;
              img.addEventListener('click', () => {
                  const allImages = imgcontainer.querySelectorAll('img');
                  allImages.forEach(img => img.style.border = 'none');
                  img.style.border = '3px solid #4CAF50';
                  this.selectedImage = imageUrl;
              });
              imgcontainer.appendChild(img);
          });
          
    }

  displayStartUI() {
        let ui = document.body.querySelector('#start-ui') || document.createElement('div');
        ui.id = 'start-ui';
        let ih = `
            <style>
              #start-ui-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 75vh;
                width: 100%;
                background-color: #f5f5f5;
                padding: 20px;
                box-sizing: border-box;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                position: relative;
                z-index: 1000;
              }
              #start-ui-image-container {
                display: flex;
                flex-wrap: nowrap;
                gap: 10px;
                width: 100%;
                margin: 20px 0;
                justify-content: flex-start;
                align-items: center;
                overflow-x: auto;
                overflow-y: hidden;
                max-height: 200px;
                padding-bottom: 15px;
              }
              #start-ui-image-container img {
                width: 150px;
                height: 150px;
                object-fit: cover;
                cursor: pointer;
                border-radius: 5px;
                transition: transform 0.2s;
              }
              #start-ui-image-container img:hover {
                transform: scale(1.05);
              }
              button {
                padding: 10px 20px;
                font-size: 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              }
              button:hover {
                background-color: #45a049;
              }
            </style>
            <div id="start-ui-container">
                <h1>Welcome to the Slider Puzzle!</h1>
                <p>Choose your puzzle image:</p>
                <br/>
              <label for="uploadButton" style="display: flex; align-items: center; gap: 5px;">
              Custom Image:
              <input name="uploadButton" type="file" id="uploadCustomImg" accept="image/*" aria-label="Upload Image"/>
              </label>
              </span>
            </div>
        `;
        ui.innerHTML = ih;
        document.body.appendChild(ui);
        let uploadButton = document.body.querySelector('#uploadCustomImg');
        uploadButton.addEventListener('change', (event) => {
          const file = event.target.files[0];
          const imgurl = URL.createObjectURL(file);
          this.userImages.push(imgurl);
          this.loadStartUIImages(imgcontainer);
        });
        let imgcontainer = document.createElement('div');
        imgcontainer.id = 'start-ui-image-container';
        this.loadStartUIImages(imgcontainer);

        const container = ui.querySelector('#start-ui-container');
        container.appendChild(imgcontainer);
        const sizespan  = document.createElement('span');
        sizespan.innerHTML = `                            <label for="puzzleSize" style="display: flex; align-items: center; gap: 5px;">
                  Size:
                  <select name="puzzleSize" id="puzzleSize" aria-label="Select Puzzle Size">
                      <option value="3" selected>3 x 3</option>
                      <option value="4">4 x 4</option>
                      <option value="5">5 x 5</option>
                      <option value="6">6 x 6</option>
                      <option value="7">7 x 7</option>
                      <option value="9">9 x 9</option>
                      <option value="8">9 x 7</option>
                  </select>
              </label>
              `;
        let breakline = () => { return document.createElement('br') };
        container.appendChild(sizespan);
        this.puzzleState.size = sizespan.getElementById('puzzleSize').value;
        sizespan.getElementById('puzzleSize').addEventListener('change', (event) => {
            this.puzzleState.size = sizespan.getElementById('puzzleSize').value;
        });
        let historybtn = document.createElement('button');
        historybtn.innerText = 'History';
        historybtn.addEventListener('click', (event) => {
          this.showHistory(event);
        });
        container.appendChild(breakline());
        container.appendChild(historybtn);
        container.appendChild(breakline());
        const startButton = document.createElement('button');
        startButton.innerText = 'Create Puzzle';
        startButton.addEventListener('click', () => {
            if (this.selectedImage || (!this.puzzleState.imageUrl == false && this.puzzleState.imageUrl != this.defaultImgUrl )) {
                this.puzzleState.imageUrl = this.selectedImage;
                this.shadowRoot.querySelector('#ogimg').src = this.selectedImage;
                this.initializeTiles();
                this.initializePuzzle();
                ui.remove();
            } else {
                alert('Please select an image first!');
            }
        });
        
        container.appendChild(startButton);
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', () => {
            ui.remove();
        });
        container.appendChild(breakline());
        container.appendChild(cancelButton);
        document.body.appendChild(ui);
        this.startui = container;

    }

    showHistory(e) {
      const historyContainer = document.createElement('div');
      historyContainer.id = 'history-container';
      historyContainer.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1001;
          width: 80%;
          max-width: 600px;
      `;

      let history = JSON.parse(localStorage.getItem('sliderpuzzleHistory'));
      if (history) {
          const historyGrid = document.createElement('div');
          historyGrid.style.cssText = `
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
          `;

          history.forEach((item) => {
              const historyItem = document.createElement('div');
              historyItem.classList.add('history-item');
              historyItem.style.cssText = `
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  padding: 10px;
                  cursor: pointer;
                  transition: transform 0.2s;
              `;
              historyItem.innerHTML = `
                  <img src="${item.imageUrl}" alt="Puzzle Image" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
                  <div style="margin-top: 10px;">
                      <p style="margin: 5px 0;"><strong>Size:</strong> ${item.size}x${item.size}</p>
                      <p style="margin: 5px 0;"><strong>Moves:</strong> ${item.moveCount}</p>
                      <p style="margin: 5px 0;"><strong>Time:</strong> ${item.time}</p>
                  </div>
              `;
              historyItem.addEventListener('mouseover', () => {
                  historyItem.style.transform = 'scale(1.02)';
              });
              historyItem.addEventListener('mouseout', () => {
                  historyItem.style.transform = 'scale(1)';
              });
              historyItem.addEventListener('click', () => {
                  this.puzzleState.imageUrl = item.imageUrl;
                  this.puzzleState.size = item.size;
                  this.puzzleState.moveCount = item.moveCount;
                  this.puzzleState.time = item.time;
                  this.initializeTiles();
                  this.initializePuzzle();
                  this.updateMoveCountDisplay();
                  this.puzzleState.timerStart = Date.now() - item.time;
                  this.updateTimerDisplay();
                  historyContainer.remove();
                  document.querySelector('#start-ui').remove();
              });
              historyGrid.appendChild(historyItem);
          });
          historyContainer.appendChild(historyGrid);
      } else {
          historyContainer.innerHTML = '<p style="text-align: center; color: #666;">No history available.</p>';
      }

      const closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.style.cssText = `
          display: block;
          margin: 20px auto 0;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
      `;
      closeButton.addEventListener('click', () => {
          historyContainer.remove();
      });
      historyContainer.appendChild(closeButton);
      this.startui.appendChild(historyContainer);
  }}
customElements.define('slider-puzzle', SliderPuzzle);    
