
class DragGrip extends HTMLElement {
    constructor() {
        super();
        this.isDragging = false;
        this.initialMousePosition = { x: 0, y: 0 };
        this.initialParentPosition = { x: 0, y: 0 };
    }

    connectedCallback() {
        this.setStyle();
        this.attachDragListeners();
    }

    setStyle() {
        Object.assign(this.style, {
            cursor: 'grab',
            display: 'inline-flex',
            backgroundColor: 'skyblue',
            padding: '0.1rem',
            userSelect: 'none',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '0.9rem',
            height: '0.9rem',
            fontSize: '0.75rem'
        });
        this.textContent = '⁛';
        const parent = this.parentElement;
        if (parent) parent.style.position = 'absolute';
    }

    attachDragListeners() {
        this.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.initialMousePosition = { x: e.clientX, y: e.clientY };
        this.style.cursor = 'grabbing';

        const parent = this.parentElement;
        if (parent) {
            this.initialParentPosition = { x: parent.offsetLeft, y: parent.offsetTop };
        }
        e.preventDefault(); // Prevent text selection
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.initialMousePosition.x;
        const deltaY = e.clientY - this.initialMousePosition.y;
        const newX = this.initialParentPosition.x + deltaX;
        const newY = this.initialParentPosition.y + deltaY;

        const parent = this.parentElement;
        if (parent) {
            parent.style.left = `${newX}px`;
            parent.style.top = `${newY}px`;
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.style.cursor = 'grab';
        }
    }
}

class DiceRoller extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Create the container for the dice
        const container = document.createElement('div');
        container.setAttribute('id', 'dice-container');
        container.innerHTML = `
            <div id="titlebar" class="titlebar">
                <div id="drag-grip" class="grip">⁞⁞</div>
                <span id="title">Dice Roller</span>
                <button id="minimize-button">—</button>
                <button id="maximize-button">🗖</button>
                <button id="close-button">✕</button>
            </div>

            <div id="dice-controls">                        <div id="webgl-output"></div>

                <br/><hr/>
                <label for="dice-type">Choose Dice Type:</label>
                <select id="dice-type">
                    <option value="4">D4</option>
                    <option value="6">D6</option>
                    <option value="8">D8</option>
                    <option value="10">D10</option>
                    <option value="12">D12</option>
                    <option value="20">D20</option>
                    <option value="100">D100</option>
                </select>
                <label for="dice-count">How many dice?</label>
                <input type="number" id="dice-count" min="1" max="10" value="1">
                <button id="roll-button">🎲 Roll Dice</button>
            </div>
            <div id="result"></div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            /* Container Styling */
            #dice-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                perspective: 1000px;
                position: absolute; /* Ensure the container can be positioned */
                top: 100px;
                left: 100px;
                width: 650px;
                background-color: #f0f0f0;
                border: 2px solid #ccc;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                transition: all 0.3s ease;
            }

            /* WebGL Output Styling */
            #webgl-output {
                width: 600px;
                height: 400px;
            }

            /* Titlebar Styling */
            .titlebar {
                background-color: #2c3e50;
                padding: 5px;
                display: flex;
                align-items: center;
                width: 100%;
                cursor: move;
                user-select: none;
                position: relative;
                box-sizing: border-box;
            }

            #drag-grip {
                margin-right: 10px;
                font-size: 1.2rem;
                color: white;
            }

            #title {
                flex-grow: 1;
                text-align: center;
                font-size: 1.1rem;
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            }

            .titlebar button {
                background-color: #ffffff29;
                border: 1px outset #ffffff99;
                color: purple;
                cursor: pointer;
                font-size: 1rem;
                padding: 3px 6px;
                margin-left: 5px;
                border-radius: 3px;
                transition: background-color 0.3s;
            }

            .titlebar button:hover {
                background-color: #00000009;
            }

            .titlebar button:active {
                background-color: #34495e;
            }

            /* Dice Controls Styling */
            #dice-controls {
                margin-top: 20px;
                text-align: center;
            }

            #roll-button {
                padding: 10px 20px;
                margin-left: 10px;
                cursor: pointer;
                border: none;
                background-color: #ff6666;
                color: white;
                font-size: 16px;
                font-weight: bold;
                border-radius: 10px;
                transition: background-color 0.3s;
            }

            #roll-button:hover {
                background-color: #ff4d4d;
            }

            /* Result Display Styling */
            #result {
                margin-top: 10px;
                font-size: 24px;
                color: #333333;
            }

            /* Animations */
            .fade-in {
                animation: fadeIn 1s forwards;
            }

            .slide-in {
                animation: slideIn 1s forwards;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes slideIn {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            /* Scrollbar Styling */
            ::-webkit-scrollbar {
                width: 10px;
            }

            ::-webkit-scrollbar-track {
                background: #2c3e50;
            }

            ::-webkit-scrollbar-thumb {
                background: #34495e;
                border-radius: 5px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #4a6278;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(container);
        container.classList.add('slide-in');
        this.container = container;

        // Initialize properties
        this.diceMeshes = [];
        this.diceBodies = [];
        this.diceValues = [];
        this.animationFrameId = null;

        // Initialize drag functionality
        this.initDragGrip();
    }

    connectedCallback() {
        this.loadScripts()
            .then(() => {
                this.initializeDiceRoller();
            })
            .catch(error => console.error('Failed to load libraries:', error));
    }

    /**
     * Dynamically load external scripts (Three.js and Cannon.js)
     */
    loadScripts() {
        return new Promise((resolve, reject) => {
            // Load Three.js
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            threeScript.onload = () => {
                // Load Cannon.js after Three.js has been loaded
                const cannonScript = document.createElement('script');
                cannonScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js';
                cannonScript.onload = resolve;
                cannonScript.onerror = reject;
                this.shadowRoot.appendChild(cannonScript);
            };
            threeScript.onerror = reject;
            this.shadowRoot.appendChild(threeScript);
        });
    }

    /**
     * Initialize the Dice Roller after scripts are loaded
     */
    initializeDiceRoller() {
        // Get DOM elements
        const rollButton = this.shadowRoot.getElementById('roll-button');
        const diceTypeSelect = this.shadowRoot.getElementById('dice-type');
        const diceCountInput = this.shadowRoot.getElementById('dice-count');
        const closeButton = this.shadowRoot.getElementById('close-button');
        const minimizeButton = this.shadowRoot.getElementById('minimize-button');
        const maximizeButton = this.shadowRoot.getElementById('maximize-button');

        // Add…
