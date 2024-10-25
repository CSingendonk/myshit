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
                    imageUrl: null,
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
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        text-align: center;
                        width: 100%;
                        max-width: 700px;
                        margin: 20px auto;
                        color: black;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                        padding: 20px;
                        box-sizing: border-box;
                    }

                    #controls {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 10px;
                        margin-bottom: 20px;
                    }

                    button, select, input[type="file"] {
                        padding: 10px 15px;
                        font-size: 16px;
                        cursor: pointer;
                        border: none;
                        border-radius: 5px;
                        background-color: #3498db;
                        color: white;
                        transition: background-color 0.2s;
                    }

                    button:hover, select:hover, input[type="file"]:hover {
                        background-color: #2980b9;
                    }

                    #timer, #moveCount {
                        margin: 10px;
                        font-size: 18px;
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 10px;
                        background-color: limegreen;
                        color: white;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        margin-bottom: 10px;
                        user-select: none;
                    }

                    #ogimage.active {
                        background-color: darkgreen;
                    }

                    #ogimg {
                        display: none;
                        max-width: 100%;
                        max-height: 300px;
                        margin: 10px auto;
                        border: 2px solid #2980b9;
                        border-radius: 5px;
                    }

                    #puzzleGrid {
                        display: grid;
                        gap: 2px;
                        margin: 0 auto;
                        width: 100%;
                        max-width: 600px;
                        border: 2px solid #2980b9;
                        border-radius: 10px;
                        overflow: hidden;
                        background-color: #fff;
                    }

                    .tile {
                        background-size: cover;
                        background-position: center;
                        cursor: pointer;
                        aspect-ratio: 1 / 1;
                        transition: transform 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: transparent;
                        user-select: none;
                    }

                    .tile:hover {
                        transform: scale(0.98);
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                    }

                    .hidden {
                        visibility: hidden;
                        cursor: default;
                    }

                    /* Responsive Design */
                    @media (max-width: 600px) {
                        #puzzleGrid {
                            max-width: 90vw;
                        }
                    }
                `;

                const template = document.createElement('div');
                template.innerHTML = `
                    <div id="ogimage" tabindex="0" aria-label="Toggle Original Image">HINT</div>
                    <img id="ogimg" alt="Original Image" />
                    
                    <div id="controls">
                        <button id="shuffleButton">Shuffle</button>
                        <button id="resetButton">Reset</button>
                        <input type="file" id="uploadButton" accept="image/*" aria-label="Upload Image">
                        <label for="puzzleSize" style="display: flex; align-items: center; gap: 5px;">
                            Size:
                            <select name="puzzleSize" id="puzzleSize" aria-label="Select Puzzle Size">
                                <option value="3">3 x 3</option>
                                <option value="4" selected>4 x 4</option>
                                <option value="5">5 x 5</option>
                            </select>
                        </label>
                    </div>
                    
                    <div id="timer">Elapsed Time: 00:00</div>
                    <div id="moveCount">Moves Made: 0</div>
                    
                    <div id="puzzleGrid" aria-label="Puzzle Grid"></div>
                `;

                this.shadowRoot.appendChild(style);
                this.shadowRoot.appendChild(template);

                this.bindEvents();
            }

            // Bind event listeners to controls and interactive elements
            bindEvents() {
                const shadow = this.shadowRoot;

                shadow.getElementById('shuffleButton').addEventListener('click', () => this.shufflePuzzle());
                shadow.getElementById('resetButton').addEventListener('click', () => this.resetPuzzle());
                shadow.getElementById('uploadButton').addEventListener('change', (e) => this.handleImageUpload(e));
                shadow.getElementById('puzzleSize').addEventListener('change', () => this.changePuzzleSize());
                shadow.getElementById('ogimage').addEventListener('click', () => this.toggleOriginalImage());

                // Accessibility: Allow toggling original image via keyboard
                shadow.getElementById('ogimage').addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleOriginalImage();
                    }
                });
            }

            // Initialize tiles based on current size and image
            initializeTiles() {
                const totalTiles = this.puzzleState.size * this.puzzleState.size;
                this.puzzleState.tiles = [];
                this.puzzleState.tilePositions = [];

                for (let i = 1; i < totalTiles; i++) {
                    this.puzzleState.tiles.push(i);
                    this.puzzleState.tilePositions.push(i);
                }
                this.puzzleState.tilePositions.push(0); // Empty tile
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
                        tile.textContent = value; // Optional: Display tile number for debugging
                        
                        // Keyboard accessibility: Allow tile movement via Enter or Space
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
                    // Optional: Provide feedback for invalid moves
                    // For example, shake the tile or display a message
                    console.log("Invalid move");
                }
            }

            // Shuffle the puzzle ensuring it's solvable
            shufflePuzzle() {
                do {
                    for (let i = this.puzzleState.tilePositions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [this.puzzleState.tilePositions[i], this.puzzleState.tilePositions[j]] = [this.puzzleState.tilePositions[j], this.puzzleState.tilePositions[i]];
                    }
                } while (!this.isSolvable() || this.isSolved());

                this.initializePuzzle();
                this.puzzleState.moveCount = 0;
                this.calculateEstimatedMinimumMoves();
                this.updateMoveCountDisplay();
                this.resetTimer();
            }

            // Reset the puzzle to the initial state
            resetPuzzle() {
                this.puzzleState.tilePositions = [...this.puzzleState.tiles];
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
                this.puzzleState.imageUrl = 'https://picsum.photos/600';
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

            // Change the puzzle size based on user selection
            changePuzzleSize() {
                const selectedSize = parseInt(this.shadowRoot.getElementById('puzzleSize').value);
                if ([3, 4, 5].includes(selectedSize)) {
                    this.puzzleState.size = selectedSize;
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
            }
        }

        // Define the custom element
        customElements.define('slider-puzzle', SliderPuzzle);
      
