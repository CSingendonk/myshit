function createButton(label = 'BUTTON', onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
}


function createNewPopup(_title, _contentElements) {
    const popup = new PopupBox(_title, _contentElements);
    popup.setAttribute('title', _title);
    let dlgBody = popup.dialog.querySelector('.dialog-content');
    let dlgFooter = popup.dialog.querySelector('.dialog-footer');
    document.body.appendChild(popup);
    return popup;
}


class PopupBox extends HTMLElement {
    constructor(title = 'Popup', contentElements = [], menuOptions = []) {
        super();
        this.attachShadow({ mode: 'open' });
        this.args = {
            title: title,
            content: contentElements,
            menuOptions: menuOptions,
        };
        this.content = this.args.content.length > 0 ? {...this.args.content} : {...Array.from(this.shadowRoot.children)}; 
        this.dialog = this.createDialogStructure(title, contentElements);
        this.shadowRoot.append(this.createStyles(), this.dialog);
        this.setMenuOptions(menuOptions);
        this.#updateDialogContent();
        this.show();
        this.dialog.addEventListener('click', (event) => {
            if (event.target != this.dialog && !this.shadowRoot.contains(event.target)) {
                event.preventDefault();
                this.hide();
            }

        });
    }
        // Attach styles and dialog content to the shadow DOM    }
    static get observedAttributes() {
        return ['title', 'content'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.dialog.querySelector('.dialog-header').textContent = newValue;
        } else if (name === 'content') {
            this.#updateDialogContent();
        }
    }

    static updateDialogContent() {
        const _this = document.querySelector('popup-box');
        _this.updateDialogContent();
    }

    #updateDialogContent() {
        this.shadowRoot.querySelector('#dialog-content').innerHTML = '';
        this.shadowRoot.querySelector('#dialog-content').append((Array.from(this.content)).flatMap(content => {
            if (content instanceof HTMLElement) {
                return content;
            } else if (typeof content === 'string') {
                const div = document.createElement('div');
                div.innerHTML = content;
                return div.children;
            } else if (Array.isArray(content)) {
                return content;
            } else {
                return [];
            }
        }));
    }

    addContents(contentElements) {
        this.content = Array.from(contentElements);
        this.#updateDialogContent();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                resize: both;
                @touch-action: none;
                
            }
            .dialog {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 80%;
                max-height: 80vh;
                overflow: auto;
            }
            .dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                font-size: 1.2rem;
                color: black;
                background-color: #f5f5f5;
                padding: 8px;
            }
            .dialog-content {
                margin-bottom: 20px;
            }
            .dialog-footer {
                border-top: 1px solid #eee;
                padding-top: 10px;
                text-align: right;
            }
            button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background: #007bff;
                color: white;
                cursor: pointer;
            }
            button:hover {
                background: #0056b3;
            }
        `;
        return style;
    }

    createDialogStructure(title, contentElements) {
        const dialog = document.createElement('div');
        dialog.classList.add('dialog');
        dialog.innerHTML = `
                            <drag-grip></drag-grip>
            <div class="dialog-header">
                <span>
                    <h1 id="dialog-title">${title}</h1>
                </span>
                <span id="dialog-menubar">
                    <slot id="menubar-slot" name="menubar"></slot>
                </span>
                <button class="close-button dlg-close-btn" id="dlg-X-btn">✕</button>
            </div>
            <div class="dialog-content" id="dialog-content">
                <slot id="content-slot" name="content">
                    <script>
                        const contentElements.map(element => element.outerHTML).join('')
                        document.getElementById('content-slot').innerHTML = 
                    </script>
                        <div>${[...Array.from(contentElements)]?.forEach(element => element.outerHTML)?.join('')}
                    </script>
                </slot>
            </div>
            <div class="dialog-footer">
                <slot name="footer-slot">
                    <span>\&copy\;
                </slot>
            </div>
        `;

        dialog.querySelector('.dlg-close-btn').addEventListener('click', () => this.hide());
        dialog.addEventListener('click', (e) => {
            if (e.target === this) this.hide();
        });

        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isConnected) this.hide();
        });

        this.dialog = dialog;
        return dialog;
    }

    show() {
        document.body.appendChild(this);
        document.body.style.overflow = 'hidden';
    }

    hide() {
        if (this.isConnected) {
            document.body.removeChild(this);
            document.body.style.overflow = 'auto';
        }
    }

    connectedCallback() {
        this.setContent(this.args.content);
    }

    setMenuOptions(options = [], index = 0) {
        this.options = options;
        if (!Array.isArray(options)) {
            console.error('Menu options must be an array.');
            return;
        }
        if (options.length > 0) {
            let i = 0;
            const defaultOption = {
                label: options[i].lable || 'File',
                onClick: () => {
                    const menu = this.shadowRoot.querySelector('#dialog-menubar');
                    const menuOptions = menu.querySelectorAll('.menu-option');
                    if (menu.childElementCount > 0) {
                        menuOptions.forEach(option => {
                            option.classList.remove('active');
                        });
                    }
                    else {
                        menuOptions.forEach(option => {
                            option.classList.add('active');
                        });
                    }
                    menuOptions.forEach(option => {
                        option.style.display = option.style.display === 'block' ? 'none' : 'block';
                    });
                    menu.childElementCount > 0 ? menu.style.display = 'inline' : menu.style.display = 'inline-flex';
                }
            };
            this.options.push(defaultOption);
        }
        const menuBar = this.shadowRoot.querySelector('#dialog-menubar');
        menuBar.innerHTML = '';
        this.options.forEach(option => {
            const optsdiv = document.createElement('div');
            const button = document.createElement('button');
            optsdiv.appendChild(button);
            optsdiv.classList.add('menu-option');
            button.setAttribute('data-index', index);
            button.textContent = option.label;
            button.addEventListener('click', option.onClick);
            menuBar.appendChild(optsdiv);
        });
    }

    // Method to update content
    setContent(content) {
        const contentDiv = this.shadowRoot.querySelector('#dialog-content');
        contentDiv.innerHTML = '';
        if (typeof content === 'string') {
            contentDiv.innerHTML = content;
        } else if (Array.isArray(content)) {
            contentDiv.innerHTML = content.map(el => el.outerHTML).join('');
        } else if (content instanceof Element) {
            contentDiv.appendChild(content);
        }
    }

    // Method to update title
    setTitle(title) {
        this.shadowRoot.querySelector('#dialog-title').textContent = title;
    }

    // Method to update footer
    setFooter(footer) {
        const footerDiv = this.shadowRoot.querySelector('.dialog-footer');
        footerDiv.innerHTML = '';
        if (typeof footer === 'string') {
            footerDiv.innerHTML = footer;
            footerDiv.style.textAlign = 'center';
        }
        else if (footer instanceof Element) {
            footerDiv.appendChild(footer);
        }
        else {
            footerDiv.innerHTML = footer;
            footerDiv.style.textAlign = 'center';
        }
        footerDiv.style.fontSize = '12px';
        footerDiv.style.color = 'white';
        footerDiv.style.fontWeight = 'bold';
        footerDiv.style.fontFamily = 'Arial, sans-serif';
        footerDiv.style.fontStyle = 'italic';
        footerDiv.style.fontVariant = 'small-caps';
        footerDiv.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        footerDiv.style.textDecoration = 'underline';
        footerDiv.style.textDecorationColor = 'white';
        footerDiv.style.textDecorationStyle = 'double';
        footerDiv.style.textDecorationThickness = '2px';
        footerDiv.style.textDecorationLine = 'underline';
        footerDiv.style.textDecorationSkipInk = 'none';
        footerDiv.style.textDecorationSkip = 'none';
    }
}

customElements.define('popup-box', PopupBox);
