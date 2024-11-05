// Get references to the buttons
const helpButton = document.getElementById('help-button');
const aboutButton = document.getElementById('about-button');
const openPuzzleDlgBtn = document.getElementById('open-puzzle-dlg-btn');
const openDiceDlgBtn = document.getElementById('open-dice-dlg-btn');
// Add event listeners to the buttons
openPuzzleDlgBtn.addEventListener('click', (event) => {
    Array.from(document.body['popups']).forEach(p => {
        if (p.title === 'Puzzle') {
            p.show();
            return;
        }
    })
    const ce = document.createElement('slider-puzzle');
    const pu = new PopupBox('Puzzle', [ce]);
    document.body['popups'].push(pu);
    pu.show();

})
document.body['popups'] = [];
// Add event listeners to the buttons
helpButton.addEventListener('click', () => {
    Array.from(document.body['popups']).forEach(p => {
        if (p.title === 'Help') {
            p.show();
            return;
        }
    })
    const ce = document.createElement('div');
    ce.innerHTML = `
                        <style>
                            p {
                                font-size: 0.9rem; 
                        }

                            b {
                                color: #0000009f;
                                background-color: #ffffffaa;
                                font-size: 1.1rem;
                            }

                        </style>    
                        
                        
                        <dl><dt><b>How to Play</b></dt>
                            <dd>
                            <p>
                            <b>Objective:</b>
                            <br>
                            The puzzle consists of a grid of numbered tiles. The goal is to rearrange the tiles to correctly display the image.
                            </p>
                            <p>
                            <b>Moving Tiles</b>
                            <br>
                            To move a tile it must be adjacent to the free space in the puzzle. The tile will slide into the empty space when you click or tap it.
                            </p>
                            <p>
                            <b>Resetting the Puzzle</b>
                            <br>
                            If you get stuck or want to start over, you can reset the puzzle by clicking the "Reset" button.
                            </p>
                            <p>
                            <b>Winning the Game</b>
                            <br>
                            The game is won when the puzzle is solved.
                            </p>
                            <p>
                            <b>Tips</b>
                            <br>
                            - Try to solve the puzzle in the fewest moves possible.
                            <br>
                            - Use the "Reset" button to start over if you get stuck.
                            <br>
                            - Use the "Help" button to get tips and hints.
                            </p>
                            </dd>
                            <dt><b>General</b></dt>
                            <dd>
                            <p>
                            <b>Reference</b>
                            <br>
                            To view the image as it should look, click the "HINT" button.
                            </p>
                            <p>
                            <b>Move and Resize</b>
                            <br>
                            To move the puzzle around, click and drag the puzzle.
                            <br>
                            To resize the puzzle, click and drag the bottom right corner.
                            </p>
                            <p>
                            <b>Keyboard Shortcuts</b>
                            <br>
                            - Press "R" to reset the puzzle.
                            <br>
                            - Press "H" to show the hint.
                            <br>
                            - Use the arrow keys to move the empty space of the puzzle.
                            <sup>As opposed to moving the pieces of the puzzle into the empty space.</sup>
                            <br>
                        </p>
                        </dd>


                            </dl>`;
    ce.style.color = '#44aa119f';
    ce.style.fontSize = '1.2em';
    ce.style.fontFamily = 'Arial';

    let pu = new PopupBox('HELP', [ce]);
    document.body['popups'].push(pu);
    pu.show();
    // Handle the "Help" button click event
});


aboutButton.addEventListener('click', () => {
    // Handle the "About" button click event
});

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
    constructor(_title = 'Popup', _contentElements = []) {
        super();
        this.attachShadow({ mode: 'open' });
        this.args = {
            title: _title,
            content: [...Array.from(_contentElements)]
        };
        // Create styles
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
                                  }
                                  .dialog {
                                      background: white;
                                      padding: 20px;
                                      border-radius: 8px;
                                      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                      max-width: 80%;
                                      max-height: 80vh;
                                      overflow: auto;
                                      padding-top: 0px;
                                  }
                                  .dialog-header {
                                      display: inline-flex;
                                      justify-content: space-between;
                                      align-items: center;
                                      margin-bottom: 1%;
                                      margin-right: -10px;
                                      width: 100%;
                                      font-size: 1.2rem;
                                      background-color: #f5f5f5;
                                      padding: 0px;
                                      position: relative;
                                      top: 0;
                                      left: 0;
                                      right: 0;
                                  }
                                  .dialog-content {
                                      margin-bottom: 20px;
                                  }
                                  .dialog-inputs {
                                      display: flex;
                                      justify-content: flex-end;
                                      gap: 10px;
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
                                  .dialog-footer {
                                      border-top: 1px solid #eee;

                                  }

                              `;

        // Create the dialog structure
        const dialog = document.createElement('div');
        dialog.classList.add('dialog');
        dialog.innerHTML = `
                                  <div class="dialog-header">
                                      <span id="dialog-title">${_title}
                                      </span>
                                      <span class="spacer"></span>
                                      <button class="dialog-header-button close-button dlg-close-btn"id="dlg-X-btn">
                                      ✕
                                      </button>
</div>
                                  <div class="dialog-content" id="dialog-content">
                                      ${Array.from(_contentElements).map(el => el.outerHTML).join('')}
                                                                                                              <div class="dialog-inputs">

                                  </div>
                                  </div>
                                  <div class="dialog-footer">
                                      <slot name="footer">
</slot>
                                  </div>
                              `;

        Array.from(dialog.querySelectorAll('.dlg-close-btn')).forEach(btn => {
            btn.addEventListener('click', () => {
                this.hide();
            });
        });
        // Close on background click
        this.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                this.hide();
            }
        });

        // Close on escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isConnected) {
                this.hide();
            }
        });

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(dialog);
        this.dialog = dialog;
    }

    show() {
        document.body.appendChild(this);
    }

    hide() {
        if (this.isConnected) {
            document.body.removeChild(this);
        }
    }

    // Lifecycle callbacks
    connectedCallback() {
        document.body.style.overflow = 'hidden';
        this.setContent(this.args.content)
    }

    disconnectedCallback() {
        document.body.style.overflow = 'auto';

    }

    // Method to update content
    setContent(content) {
        const contentDiv = this.shadowRoot.querySelector('#dialog-content');
        contentDiv.innerHTML = '';
        if (typeof content === 'string') {
            contentDiv.innerHTML = content;
        } else if (content instanceof Element) {
            contentDiv.appendChild(content);
        }
        else {
            contentDiv.innerHTML = content.map(el => el.outerHTML).join('');
        }

    // Method to update title
    setTitle(title) {
        this.shadowRoot.querySelector('#dialog-title').textContent = title;
    }
}

customElements.define('popup-box', PopupBox);