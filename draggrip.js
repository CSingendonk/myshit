
class DragGrip extends HTMLElement {
    constructor() {
        super();
        this.isDragging = false;
        this.initialMousePosition = { x: 0, y: 0 };
        this.initialParentPosition = { x: 0, y: 0 };
    }

    connectedCallback() {
        this.style.cursor = 'grab';
        this.style.display = 'inline-flex';
        this.style.backgroundColor = 'skyblue';
        this.style.padding = '0.1rem';
        this.style.userSelect = 'none';
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.width = '0.9rem';
        this.style.height = '0.9rem';
        this.textContent = `⁛`
        this.style.fontSize = '0.75rem';

        // Ensure the parent is positioned absolutely for movement to work
        const parent = this.parentElement;
        if (parent) {
            parent.style.position = 'absolute';
        }

        // Attach drag event listeners
        this.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.initialMousePosition.x = e.clientX;
        this.initialMousePosition.y = e.clientY;
        this.style.cursor = 'grabbing';
        const parent = this.parentElement;
        if (parent) {
            this.initialParentPosition.x = parent.offsetLeft;
            this.initialParentPosition.y = parent.offsetTop;
        }

        e.preventDefault(); // Prevent text selection
    }

    onMouseMove(e) {
        if (!this.isDragging){
            this.removeEventListener('mousemove', this.onMouseMove);
             return;
        }
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

// Define the custom element
customElements.define('drag-grip', DragGrip);
