class DiceRoller extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.wglrenderer;
        // Create the container for the dice
        const container = document.createElement('div');
        container.setAttribute('id', 'dice-container');
        container.innerHTML = `
            <div id="titlebar">
            ⁞⁝⁚
                <span id="title">Dice</span>
                <div id="window-controls">
                    <button id="minimize-button">—</button>
                    <button id="maximize-button">🗖</button>
                    <button id="close-button">✕</button>
                </div>
            </div>

            <div id="dice-controls"> 
            <div id="webgl-output"></div>
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
                         /* Titlebar Styling */
            #titlebar {
                background-color: #2c3e50;
                color: white;
                padding: 10px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                user-select: none;
            }

            #titlebar #title {
                font-size: 16px;
                font-weight: bold;
            }

            #window-controls button {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0 5px;
                line-height: 1;
                transition: color 0.2s;
            }

            #window-controls button:hover {
                color: #ff6666;
            }

            /* Fade-out Animation */
            .fade-out {
                animation: fadeOut 0.3s forwards;
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
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
        //this.initDragGrip();
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

        // Add event listeners
        rollButton.addEventListener('click', () => this.rollDice());
        diceTypeSelect.addEventListener('change', () => {
            this.createDice(parseInt(diceTypeSelect.value), parseInt(diceCountInput.value));
        });
        diceCountInput.addEventListener('change', () => {
            this.createDice(parseInt(diceTypeSelect.value), parseInt(diceCountInput.value));
        });
        closeButton.addEventListener('click', () => this.closePanel());
        minimizeButton.addEventListener('click', () => this.minimizePanel());
        maximizeButton.addEventListener('click', () => this.maximizePanel());

        // Initialize Three.js and Cannon.js
        this.initThreeJS();
        this.initCannonJS();

        // Create initial dice
        this.createDice(parseInt(diceTypeSelect.value), parseInt(diceCountInput.value));
    }

    rendererdomElement = this.wglrenderer;
    /**
     * Initialize Three.js components
     */
    initThreeJS() {
        // Three.js scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(600, 400);
        const webglOutput = this.shadowRoot.getElementById('webgl-output');
        webglOutput.innerHTML = ''; // Clear previous renderer
        webglOutput.appendChild(this.renderer.domElement);
        this.wglrenderer = this.renderer;
        this.rendererdomElement = this.renderer.domElement;
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 25, 0);
        directionalLight.castShadow = false;
        this.scene.add(directionalLight);

        // Position the camera
        this.camera.position.z = -10;
        this.camera.position.y = 5;
        this.camera.position.x = 0;

        // Update camera position based on dice count
        const diceCountInput = this.shadowRoot.getElementById('dice-count');
        diceCountInput.addEventListener('change', () => {
            const diceCount = parseInt(diceCountInput.value);
            this.camera.position.y = (5 + (diceCount - 1) * 2); // Adjust y based on dice count
            this.camera.lookAt(0, 0, 0);
        });

        this.camera.lookAt(0, 0, 0);
    }

    
    /**
     * Initialize Cannon.js physics world
     */
    initCannonJS() {
        // Initialize Cannon.js world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // Earth gravity

        // Broadphase
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        // Add a floor plane

        const groundMaterial = new CANNON.Material();
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        const wall = new CANNON.Plane();
        const wallbody = new CANNON.Body({ mass: 0, material: groundMaterial });
        wallbody.addShape(wall);
        wallbody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        wallbody.position.set(5, 0, 0);
        this.world.addBody(groundBody);
        this.world.addBody(wallbody);
    }

    /**
     * Reset the scene by removing existing dice and bodies
     */
    resetScene() {
        // Remove existing dice meshes and bodies from the scene
        this.diceMeshes.forEach(mesh => this.scene.remove(mesh));
        this.diceBodies.forEach(body => this.world.removeBody(body));
        this.diceMeshes = [];
        this.diceBodies = [];
        this.diceValues = [];

        // Cancel any ongoing animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Create dice based on type and count
     * @param {number} sides - Number of sides on the dice
     * @param {number} count - Number of dice to create
     */
    createDice(sides, count = 1) {
        this.resetScene();

        for (let i = 0; i < count; i++) {
            let geometry, shape, faceLabels;

            // Determine geometry and shape based on dice type
            switch (sides) {
                case 4:
                    geometry = this.createD4Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = ['1', '2', '3', '4'];
                    break;
                case 6:
                    geometry = this.createD6Geometry();
                    shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
                    faceLabels = ['1', '2', '3', '4', '5', '6'];
                    break;
                case 8:
                    geometry = this.createD8Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];
                    break;
                case 10:
                    geometry = this.createD10Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
                    break;
                case 12:
                    geometry = this.createD12Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
                    break;
                case 20:
                    geometry = this.createD20Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
                    break;
                case 100:
                    geometry = this.createD100Geometry();
                    shape = this.createConvexShape(geometry);
                    faceLabels = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
                    break;
                default:
                    geometry = this.createD6Geometry();
                    shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
                    faceLabels = ['1', '2', '3', '4', '5', '6'];
            }
            const materials = this.createFaceMaterials(geometry, faceLabels, sides);

            // Create Three.js mesh
            const diceMesh = new THREE.Mesh(geometry, materials);
            diceMesh.userData.faceLabels = faceLabels;
            this.scene.add(diceMesh);
            // Create materials with face label

            // Create Cannon.js body
            const diceBody = new CANNON.Body({ mass: 1, shape: shape });
            diceBody.position.set(Math.random() * 2 - 1, 2 + i * 2, Math.random() * 2 - 1); // Random start positions
            diceBody.quaternion.set(Math.random(), Math.random(), Math.random(), Math.random());
            diceBody.quaternion.normalize();
            diceBody.angularDamping = 0.1;
            diceBody.linearDamping = 0.1;
            this.world.addBody(diceBody);

            // Store references
            this.diceMeshes.push(diceMesh);
            this.diceBodies.push(diceBody);
            this.diceValues.push({ sides: sides, value: Math.floor(Math.random() * sides) + 1 });
        }
    }
    /** 
 * Create materials for each face of the dice with labels
 * @param {THREE.BufferGeometry} geometry - The geometry of the dice
 * @param {Array<string>} faceLabels - Labels for each face
 * @param {number} sides - Number of sides on the dice
 * @returns {Array<THREE.Material>} - Array of materials for the dice
 */
    createFaceMaterials(geometry, faceLabels, sides) {
    const materials = [];
    const numFaces = sides;

    for (let i = 0; i < numFaces; i++) {
        const label = faceLabels[i % faceLabels.length];

        // Create canvas for each face texture
        const canvas = document.createElement('canvas');
        canvas.width = 256; // Smaller width for better performance, but should be enough to see details
        canvas.height = 256;
        const context = canvas.getContext('2d');

        // Set up the background
        context.fillStyle = '#ffffff'; // Set white background to ensure visibility of numbers
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the face number
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = `bold 150px Arial`;
        context.fillStyle = '#000000'; // Use black text to ensure high contrast
        context.fillText(label, canvas.width / 2, canvas.height / 2);

        // Create texture from the canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;  // Mark texture as needing an update

        // Create material with the texture
        const material = new THREE.MeshBasicMaterial({ map: texture });
        materials.push(material);
    }

    // Assign materials to geometry faces
    geometry.clearGroups();
    for (let i = 0; i < numFaces; i++) {
        geometry.addGroup(i * (geometry.index.count / numFaces), geometry.index.count / numFaces, i);
    }

    return materials;
}





    /**
     * Convert Three.js geometry to Cannon.js ConvexPolyhedron
     * @param {THREE.Geometry} geometry - The geometry to convert
     * @returns {CANNON.ConvexPolyhedron} - The ConvexPolyhedron shape
     */
    createConvexShape(geometry) {
        // Converts a Three.js BufferGeometry to a Cannon.js ConvexPolyhedron shape
        const positionAttribute = geometry.attributes.position;
        const vertices = [];
        const faces = [];

        for (let i = 0; i < positionAttribute.count; i++) {
            vertices.push(new CANNON.Vec3(
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
            ));
        }

        if (geometry.index) {
            const indices = geometry.index.array;
            for (let i = 0; i < indices.length; i += 3) {
                faces.push([indices[i], indices[i + 1], indices[i + 2]]);
            }
        } else {
            for (let i = 0; i < positionAttribute.count; i += 3) {
                faces.push([i, i + 1, i + 2]);
            }
        }

        return new CANNON.ConvexPolyhedron(vertices, faces);
    }

    /**
     * Roll the dice by applying random velocities
     */
    rollDice() {
        const diceCount = parseInt(this.shadowRoot.getElementById('dice-count').value, 10);
        const diceType = parseInt(this.shadowRoot.getElementById('dice-type').value, 10);

        this.createDice(diceType, diceCount); // Recreate dice with the selected type and count

        // Apply random velocity and angular velocity for realistic dice roll
        this.diceBodies.forEach(diceBody => {
            diceBody.velocity.set(
                0,
                (Math.random() + 1) * 5,
                0
            );
            diceBody.angularVelocity.set(
                (Math.random() + 1) * 20,
                (Math.random() + 1) * 20,
                (Math.random() + 1) * 20
            );
            diceBody.angularDamping = 0.1;
            diceBody.linearDamping = 0.1;
            diceBody.sleepThreshold = 0.1;
            diceBody.sleepSpeedLimit = 0.1;
        });

        this.updatePhysics();
    }

    /**
     * Update physics and render the scene
     */
    updatePhysics() {
        const timeStep = 1 / 60;
        let lastTime;
        const maxSimulationTime = 10000; // Max simulation time in ms
        const startTime = performance.now();
        let biggestX = this.diceBodies[0].position.x;
        let biggestY = this.diceBodies[0].position.y + 15;
        let biggestZ = this.diceBodies[0].position.z;
        let lowestX = this.diceBodies[0].position.x;
        let lowestY = this.diceBodies[0].position.y;
        let lowestZ = this.diceBodies[0].position.z;
        const update = (time) => {
            if (!lastTime) lastTime = time;
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            // Limit simulation time
            if (time - startTime > maxSimulationTime) {
                this.getDiceResult();
                return;
            }

            this.world.step(timeStep, delta, 3);

            // Update Three.js mesh positions and rotations from Cannon.js physics
            this.diceBodies.forEach((diceBody, i) => {
                this.diceMeshes[i].position.copy(diceBody.position);
                this.diceMeshes[i].quaternion.copy(diceBody.quaternion);
            });

            this.renderer.render(this.scene, this.camera);
            this.animationFrameId = requestAnimationFrame(update);
            this.camera.position.x = this.diceBodies[0].position.x;
            this.camera.position.y = this.diceBodies.length * 2 + 10;
            this.camera.position.z = -5 - Math.abs(this.diceBodies[0].position.z);
            this.camera.lookAt(0, 0, 0);
            this.world.step(timeStep, delta, 3);
            // Update Three.js mesh positions and rotations from Cannon.js physics

            // Check if dice have stopped moving
            if (this.diceBodies.every(body => body.sleepState === CANNON.Body.SLEEPING)) {
                this.getDiceResult();
            }
        };

        this.animationFrameId = requestAnimationFrame(update);
    }

    /**
     * Calculate and display the result based on dice orientation
     */
    getDiceResult() {
        let totalResult = 0;

        this.diceBodies.forEach((diceBody, index) => {
            const result = this.calculateResultFromQuaternion(
                this.diceValues[index].sides,
                diceBody.quaternion,
                index
            );
            if (result !== null) { // Ensure result is valid
                this.diceValues[index].value = result;
                totalResult += result;
            } else {
                // Fallback in case of calculation failure
                this.diceValues[index].value = Math.floor(Math.random() * this.diceValues[index].sides) + 1;
            }
        });

        const individualResults = this.diceValues.map(d => d.value).join(', ');
        totalResult = 0;
        Array.from(individualResults.split(', ')).forEach((result, index) => {
            totalResult += parseInt(result, 10);
        });
        this.shadowRoot.getElementById('result').textContent = `Result: ${individualResults} (Total: ${totalResult})`;
    }

    /**
     * Determine the result of a dice based on its final orientation
     * @param {number} sides - Number of sides on the dice
     * @param {CANNON.Quaternion} quaternion - The final quaternion of the dice
     * @param {number} index - Index of the dice
     * @returns {number|null} - The result value or null if undetermined
     */
    calculateResultFromQuaternion(sides, quaternion, index) {
        // For each dice type, determine the face that is upwards
        const upVector = new THREE.Vector3(0, 1, 0);
        const diceMesh = this.diceMeshes[index];

        let maxDot = -Infinity;
        let faceIndex = -1;

        const positionAttribute = diceMesh.geometry.attributes.position;
        const indexAttribute = diceMesh.geometry.index;
        const faceNormals = [];

        if (indexAttribute) {
            const indices = indexAttribute.array;
            for (let i = 0; i < indices.length; i += 3) {
                const a = indices[i];
                const b = indices[i + 1];
                const c = indices[i + 2];

                const vertexA = new THREE.Vector3(
                    positionAttribute.getX(a),
                    positionAttribute.getY(a),
                    positionAttribute.getZ(a)
                );
                const vertexB = new THREE.Vector3(
                    positionAttribute.getX(b),
                    positionAttribute.getY(b),
                    positionAttribute.getZ(b)
                );
                const vertexC = new THREE.Vector3(
                    positionAttribute.getX(c),
                    positionAttribute.getY(c),
                    positionAttribute.getZ(c)
                );

                // Compute the face normal
                const edge1 = new THREE.Vector3().subVectors(vertexB, vertexA);
                const edge2 = new THREE.Vector3().subVectors(vertexC, vertexA);
                const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

                normal.applyQuaternion(quaternion);

                faceNormals.push(normal);
            }
        }

        // Find the face most aligned with the up vector
        for (let i = 0; i < faceNormals.length; i++) {
            const dot = faceNormals[i].dot(upVector);
            if (dot > maxDot) {
                maxDot = dot;
                faceIndex = i;
            }
        }

        if (faceIndex === -1) {
            console.warn(`Could not determine face for dice index ${index}`);
            return null;
        }

        // Get the dice value from faceLabels
        const faceLabels = diceMesh.userData.faceLabels;
        if (!faceLabels || faceIndex >= faceLabels.length) {
            console.warn(`Invalid face index ${faceIndex} for dice index ${index}`);
            return null;
        }

        let value = faceLabels[faceIndex];

        // Additional check for D100 to ensure valid parsing
        if (sides === 100) {
            // For D100, it's common to roll two D10 dice: one for tens and one for units.
            // Here, we'll assume each D100 face represents a unique number from 1 to 100.
            // Adjust as needed based on your design.
            value = faceLabels[faceIndex];
        }

        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
            console.warn(`Parsed value is NaN for face index ${faceIndex} on dice index ${index}`);
            return null;
        }

        return parsedValue;
    }

    /**
     * Create custom geometry for D4 dice
     * @returns {THREE.BufferGeometry} - The D4 geometry
     */
    createD4Geometry() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            // Vertex coordinates for a tetrahedron
            1, 1, 1,
            -1, -1, 1,
            -1, 1, -1,
            1, -1, -1
        ]);

        const indices = [
            0, 2, 1,
            0, 1, 3,
            0, 3, 2,
            1, 2, 3
        ];

        // UV coordinates mapped per face
        const uvs = [
            // Each face has its own UV mapping
            0.5, 1, 0, 0, 1, 0,  // Face 1
            0.5, 1, 0, 0, 1, 0,  // Face 2
            0.5, 1, 0, 0, 1, 0,  // Face 3
            0.5, 1, 0, 0, 1, 0   // Face 4
        ];

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs.flat()), 2));
        geometry.computeVertexNormals();

        return geometry;
    }

    /**
     * Create custom geometry for D6 dice (standard cube)
     * @returns {THREE.BoxGeometry} - The D6 geometry
     */
    createD6Geometry() {
        return new THREE.BoxGeometry(1, 1, 1);
    }

    /**
     * Create custom geometry for D8 dice (octahedron)
     * @returns {THREE.OctahedronGeometry} - The D8 geometry
     */
    createD8Geometry() {
        return new THREE.OctahedronGeometry(1);
    }

    /**
     * Create custom geometry for D10 dice (pentagonal trapezohedron)
     * @returns {THREE.BufferGeometry} - The D10 geometry
     */
    createD10Geometry() {
        const geometry = new THREE.BufferGeometry();
        const angle = Math.PI / 5; // 36 degrees
        const height = 1;
        const radius = Math.sqrt(2) / 2; // Radius to ensure unit length edges

        const vertices = [];
        const indices = [];
        const uvs = [];

        // Create top and bottom vertices
        for (let i = 0; i < 10; i++) {
            const theta = i * 2 * angle;
            const z = height / 2;
            vertices.push(
                radius * Math.cos(theta),
                radius * Math.sin(theta),
                z
            );
        }
        for (let i = 0; i < 10; i++) {
            const theta = i * 2 * angle + angle;
            const z = -height / 2;
            vertices.push(
                radius * Math.cos(theta),
                radius * Math.sin(theta),
                z
            );
        }

        // Create faces (each trapezoid split into two triangles)
        for (let i = 0; i < 10; i++) {
            const topCurrent = i;
            const topNext = (i + 1) % 10;
            const bottomCurrent = i + 10;
            const bottomNext = ((i + 1) % 10) + 10;

            // First triangle of the trapezoid
            indices.push(topCurrent, bottomCurrent, topNext);

            // Second triangle of the trapezoid
            indices.push(topNext, bottomCurrent, bottomNext);
        }

        // Simple UV mapping (this may need refinement for better texture alignment)
        for (let i = 0; i < indices.length; i += 3) {
            uvs.push(
                0.5, 1,
                0, 0,
                1, 0
            );
        }

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs.flat()), 2));
        geometry.computeVertexNormals();

        return geometry;
    }

    /**
     * Create custom geometry for D12 dice (dodecahedron)
     * @returns {THREE.DodecahedronGeometry} - The D12 geometry
     */
    createD12Geometry() {
        return new THREE.DodecahedronGeometry(1);
    }

    /**
     * Create custom geometry for D20 dice (icosahedron)
     * @returns {THREE.IcosahedronGeometry} - The D20 geometry
     */
    createD20Geometry() {
        return new THREE.IcosahedronGeometry(1);
    }

    /**
     * Create custom geometry for D100 dice (subdivided icosahedron)
     * @returns {THREE.IcosahedronGeometry} - The D100 geometry
     */
    createD100Geometry() {
        // D100 is complex; using a subdivided Icosahedron for demonstration
        return new THREE.IcosahedronGeometry(1, 2); // Subdivided icosahedron
    }

    /**
     * Initialize drag functionality for the panel
     */
    initDragGrip() {
        this.container.prepend(document.createElement('drag-grip'));
        let dgscript = document.createElement('script');
        dgscript.src = 'https://csingendonk.github.io/htmlpanels/sliderPuzzle/elements_js/draggrip.js';
        this.container.appendChild(dgscript);
     }

    /**
     * Close the dice roller panel
     */
    closePanel() {
        this.container.classList.add('fade-in');
        this.container.style.display = 'none';
    }

    /**
     * Minimize the dice roller panel
     */
    minimizePanel() {
        const webglOutput = this.shadowRoot.getElementById('webgl-output');
        const diceControls = this.shadowRoot.getElementById('dice-controls');
        const result = this.shadowRoot.getElementById('result');

        // Toggle visibility
        const isHidden = webglOutput.style.display === 'none';
        webglOutput.style.display = isHidden ? 'block' : 'none';
        diceControls.style.display = isHidden ? 'block' : 'none';
        result.style.display = isHidden ? 'block' : 'none';
    }

    /**
     * Maximize the dice roller panel
     */
    maximizePanel() {
        const panel = this.shadowRoot.getElementById('dice-container');
        const isMaximized = panel.classList.contains('maximized');

        if (isMaximized) {
            // Restore to original size
            panel.style.width = 'auto';
            panel.style.height = 'auto';
            panel.classList.remove('maximized');
        } else {
            // Maximize
            panel.style.width = '100%';
            panel.style.height = '100%';
            panel.classList.add('maximized');
        }
    }
}

customElements.define('dice-roller', DiceRoller);
