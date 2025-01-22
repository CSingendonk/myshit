/** Combo input element mixing selects with inputs 
 * @author CSingendonk &copy; 2025
 * @email *@*.*
 * @license MIT
 * @source https://github.com/CSingendonk/htmlcombobox/tree/main
*/
class CustomSelectInput extends HTMLElement {
        constructor() {
            super();
            this.#shadow = this.attachShadow({ mode: 'closed' });
            
            this.state = {
                value: '',
                options: [],
                placeholder: '',
                selectionMode: 'multiple',
                selections: [],
                innerstyles: '',
            };
            this.textbox = null;
            this.dropdown = null;
            this.announcementRegion = null;
            this.contextMenu = this.#contextMenu;
            this.contextMenu.create();
            const inputs = class extends HTMLInputElement {
                constructor() {
                    super();
                    this.state = {
                        value: '',
                        options: [],
                        placeholder: '',
                        selectionMode: 'single',
                        selections: [],
                        innerstyles: '',
                    };
                    this.textbox = null;
                    this.dropdown = null;
                    this.announcementRegion = null;
                    this.contextMenu = this.#contextMenu;
                    this.contextMenu.create();
                    this.#render();
                }
            };
            const selects = class extends HTMLSelectElement {
                constructor () {
                    super();
                    return Object.create(this);
                }
            }           
            const _ipoe = Array.from({...inputs.prototype});
            const _spoe = Object.entries(selects.prototype);
            Object.assign(inputs.prototype, _spoe);
            
        }
        #shadow;
        #textbox = (() => { return this.textbox != null ? this.textbox : this.render; })();
        #dropdown = (() => { return this.dropdown; })();
        static get observedAttributes() {
            return ['data-placeholder', 'data-options', 'data-value', 'data-selection-mode', 'data-style'];
        }
    
    
        connectedCallback() {
            this.#render();
            this.#initializeState();
            this.#initializeAttributes();
            this.#setupEventListeners();
            this.#startlisteningforallevents(this,this.#textbox);
        }
    
        disconnectedCallback() {
            this.#cleanupEventListeners();
        }
    
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue || (!oldValue && !newValue) || !name) return;
            const handlers = {
                'data-value': () => this.#updateValue(newValue),
                'data-options': () => {
                    this.state.options = this.#parseOptions(newValue);
                    this.#syncOptionsWithSelect();
                },
                'data-placeholder': () => this.#updatePlaceholder(newValue),
                'data-selection-mode': () => this.#updateSelectionMode(newValue),
                'data-style': () => this.#updateStyles(newValue)
            };
            handlers[name]?.();
        }

            #events = {
                input: ['input', 'change', 'focus', 'blur', 'keydown', 'keyup', 'keypress',
                    'compositionstart', 'compositionend', 'compositionupdate',
                    'paste', 'cut', 'copy', 'select', 'invalid'],
            
                form: ['submit', 'reset', 'formdata', 'formdataentryadded', 'formdataentryremoved'],
            
                validation: ['invalid', 'beforeinput'],
            
                focus: ['focusin', 'focusout'],
            
                mouse: ['mousedown', 'mouseup', 'click', 'dblclick',
                    'mouseover', 'mouseout', 'mouseenter', 'mouseleave'],
            
                touch: ['touchstart', 'touchend', 'touchmove', 'touchcancel'],
            
                pointer: ['pointerdown', 'pointerup', 'pointermove',
                    'pointerover', 'pointerout', 'pointerenter', 'pointerleave',
                    'gotpointercapture', 'lostpointercapture'],
            
                drag: ['dragstart', 'dragend', 'drag', 'dragenter', 'dragleave', 'dragover', 'drop']
            };
        #startlisteningforallevents(target, source) {
            const events = Object.values(this.#events).flat();
            events.forEach(eventName => {
                source.addEventListener(eventName, event => {
                    // Handle form-specific events
                    if (['submit', 'reset', 'formdata'].includes(eventName)) {
                        this.#handleFormIntegration(event);
                    }
                    
                    // Handle validation events
                    if (eventName === 'invalid') {
                        event.preventDefault();
                        source.setCustomValidity('invalid');
                        source.reportValidity();
                    }
                    
                    // Relay the event
                    this.#relayEvent(target, source, eventName, event);
                    
                    // Ensure form integration
                    const form = source.closest('form');
                    if (form && ['input', 'change'].includes(eventName)) {
                        form.dispatchEvent(new Event('formdata'));
                    }
                });
            });
            
            // Add form association
            if (source.form) {
                source.form.addEventListener('submit', e => this.#handleSubmit(e));
                source.form.addEventListener('reset', e => this.#handleReset(e));
            }
        }
        #relayEvent(target, source, eventName, originalEvent) {
            const clonedEvent = new CustomEvent(eventName, {
                detail: {
                    originalEvent,
                    sourceElement: source,
                    timestamp: Date.now(),
                    eventType: eventName
                },
                bubbles: originalEvent.bubbles,
                cancelable: originalEvent.cancelable,
                composed: originalEvent.composed
            });

            target.dispatchEvent(clonedEvent);

            if (clonedEvent.defaultPrevented && originalEvent.preventDefault) {
                originalEvent.preventDefault();
            }

            if (clonedEvent.cancelBubble) {
                if (originalEvent.stopPropagation) {
                    originalEvent.stopPropagation();
                }
                if (originalEvent.stopImmediatePropagation) {
                    originalEvent.stopImmediatePropagation();
                }
            }

            console.log('relayed event:', { clonedEvent, originalEvent, source, target });
        }   

        #handleFormIntegration(event) {
            const form = event.target.closest('form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                this.dispatchEvent(new CustomEvent('form-data', { detail: data }));
            }
        }
        #handleSubmit(event) {
            const form = event.target.closest('form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                this.dispatchEvent(new CustomEvent('form-data', { detail: data }));
            }
        }

        #handleReset(event) {
            const form = event.target.closest('form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                this.dispatchEvent(new CustomEvent('form-data', { detail: data }));
            }
        }

        #handleInput(event) {
            const form = event.target.closest('form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                this.dispatchEvent(new CustomEvent('form-data', { detail: data }));
            }
        }
        #handleChange(event) {
            const form = event.target.closest('form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (const [key, value] of formData.entries()) {
                    data[key] = value;
                }
                this.dispatchEvent(new CustomEvent('form-data', { detail: data }));
            }
        }

        
        
        /* 
        * @param {string} dataStyles - The data-style attribute value
        * @Example usage:
        * - CSS format: "div { color: red; background: blue; } input { border: 1px solid black; }"
        * - JSON format: {"div": {"color": "red", "background": "blue"}, "input": {"border": "1px solid black"}}
        * - Object format: {div: {color: "red", background: "blue"}, input: {border: "1px solid black"}}
        */
        #updateStyles(dataStyles) {
            let styleRules = null;
            let element = null;
            
            if (typeof dataStyles === 'string') {
                // Try parsing as CSS format first
                styleRules = dataStyles.split('}').filter(rule => rule.trim());
                try {
                    parts = styleRules.forEach(pair => {
                        let [selector, styles] = pair.split('{');
                        selector = selector.trim();
                        styles = styles?.trim();
                        if (selector && styles) {
                            element = this.#shadow.querySelector(selector);
                            if (element != null) {
                                styles.split(';').forEach(style => {
                                    const [key, value] = style.split(':').map(s => s.trim());
                                    if (key && value) {
                                        element.style[key] = value;
                                    }
                                });
                            }
                        }
                    });
                } catch (error) {
                    // Fallback to JSON format
                    try {
                        const jsontry = JSON.parse(dataStyles);
                        styleRules = Object.entries(jsontry);
                        styleRules.forEach(([selector, styles]) => {
                            element = this.#shadow.querySelector(selector);
                            if (element != null) {
                                Object.entries(styles).forEach(([key, value]) => {
                                    element.style[key] = value;
                                });
                            }
                        });
                    } catch (error) { console.log('Failed to parse styles'); }
                }
            } else if (typeof dataStyles === 'object') {
                styleRules = Object.entries(dataStyles);
                styleRules.forEach(([selector, styles]) => {
                    element = this.#shadow.querySelector(selector);
                    if (element != null) {
                        Object.entries(styles).forEach(([key, value]) => {
                            element.style[key] = value;
                        });
                    }
                });
            }
        }
        
    
        #applyStyles(element, styles) {
            if (!element || !styles) return;
            Object.entries(styles).forEach(([property, value]) => {
                element.style[property] = value;
            });
        }
        #initializeState() {
            this.#textbox = this.#shadow.querySelector('input');
            this.#dropdown = this.#shadow.querySelector('select');
        }
    
        #initializeAttributes() {
            this.state.placeholder = this.getAttribute('data-placeholder') || 'Type/Select an option';
            this.state.options = this.#parseOptions(this.getAttribute('data-options'));
            this.state.value = this.getAttribute('data-value') || '';
            this.state.selectionMode = this.getAttribute('data-selection-mode') || 'single';
            this.state.innerstyles = this.getAttribute('data-style') || '[["this":"{color":"black";}]]';
            this.#updateUI();
        }
    
        #setupEventListeners() {
            this.#textbox?.addEventListener('input', this.#handleTextInput.bind(this));
            this.#textbox?.addEventListener('keydown', this.#handleKeyPress.bind(this));
            this.#dropdown?.addEventListener('keydown', this.#handleTextInput.bind(this));
            this.#dropdown?.addEventListener('change', this.#handleSelectChange.bind(this));
            this.#dropdown?.addEventListener('focus', this.#handleFocus.apply(this));
            this.addEventListener('dblclick', this.#handleDblClick.bind(this));
            this.addEventListener('contextmeu', this.#handleRightClick.bind(this));
            this.#dropdown.addEventListener('contextmenu', this.#handleRightClick.bind(this));
    
        }
    
        #cleanupEventListeners() {
            this.#textbox?.removeEventListener('input', this.#handleTextInput);
            this.#textbox?.removeEventListener('keydown', this.#handleKeyPress);
    
            this.#dropdown.removeEventListener('keydown', this.#handleTextInput);
            this.#dropdown?.removeEventListener('change', this.#handleSelectChange);
            this.#dropdown?.removeEventListener('focus', this.#handleFocus);
            
            this.removeEventListener('dblclick', this.#handleDblClick);
            this.removeEventListener('contextmenu', this.#handleRightClick);
        }
    
        #render() {
            const template = `<style>:host {display: inline-block;width: 200px;height: 1.5rem;contain: strict;position: initial;color: black;border: 2px groove #000;background-color: #fff}* {background-color: #282c34;color: #fff;font-family: 'Arial', sans-serif;font-size: 14px;line-height: 1.25rem;margin: 0;padding: 0;width: 100%;box-sizing: border-box;min-height: 1.5rem;}input {all:inherit;}input, select {border: 1px solid #555;border-radius: 4px;padding: 0.25rem;position: absolute;left: 0;top: 0;float: left;position: relative;clear: none;z-index: 1;}select {width: fit-coontent;height: 2rem;max-height: 0px;overflow: hidden;z-index: 0;}input {width: 90%;z-index: 9999999999;position: absolute;float: left;clear: none;bottom: 0;right: 10%;}option {}div, div * {height: 100%;} div {padding: 0px;min-height: 100%;}div:nth-child(2) > select:nth-child(1) {top: 0;bottom:0;border: initial;outline: initial;box-shadow: initial;}:host * {background-color: inherit;color: inherit;font-family: inherit;font-size: inherit;line-height: inherit;margin: 0;border: none;border-radius: 0;}select {color: transparent;background-color: transparent;}option {border: 1px solid black;border-radius: 50%;}</style><div><select style="top: 0px;"><option value=""></option><option value="fuck">fuck</option><option value="fuckit">fuckit</option><option value="it">]</option></select><input type="text" placeholder="Type/Select an option" style="width: 90%;z-index: 9999999999;position: absolute;float: left;clear: none;bottom: 0;right: 10%;"></div>`;
            this.#shadow.innerHTML = template;
            this.style.padding = '0px';
            this.#initializeState();
        }
    
        #updateUI() {
            this.#updatePlaceholder(this.state.placeholder);
            this.#updateValue(this.state.value || this.state.options[0]?.value || '');
            this.#syncOptionsWithSelect();
            this.#positionDropdown();
        }
    
        #updateSelectionMode(mode) {
            this.state.selectionMode = ['single', 'multiple'].includes(mode) ? mode : 'single';
            this.#dropdown.multiple = this.state.selectionMode === 'multiple';
            this.#syncOptionsWithSelect();
        }

        #parseOptions(optionsData) {
            if (!optionsData || !(typeof optionsData == 'string' && optionsData?.length > 0)) return this.#getDefaultOptions();
            try {
                if (optionsData.startsWith('[{')) {
                    const parsedOptions = JSON.parse(optionsData);
                    return parsedOptions.map(opt => {
                        if (!opt.value && !opt.text) {
                            return { value: '', text: '' };
                        }
                        if (!opt.value && opt.text) {
                            return { value: opt.text, text: opt.text };
                        }
                        if (!opt.text && opt.value) {
                            return { value: opt.value, text: opt.value };
                        }
                        return { value: opt.value, text: opt.text };
                    });
                }
                let od = optionsData
                    .trim()
                    .replace(/^[\[\]]/g, '')
                    .split(',')
                    .map(opt => {
                        const parts = opt.trim().split(':').map(part => 
                            part.trim()
                                .replace(/^['"]|['"]$/g, '') // Remove quotes at start/end
                                .replace(/[\[\]]/g, '') // Remove any brackets
                                .replace(/^[\s]*$/, '') // Handle empty or whitespace-only parts
                        );
                        
                        if (parts.length === 1) {
                            const value = parts[0];
                            return { value: value || '', text: value || '' };
                        }
                        
                        const [value, text] = parts;
                        if (!value && text) {
                            return { value: text, text: text };
                        }
                        return { value: value || text || '', text: text || value || '' };
                    });
                    od.forEach(o => {
                        if (o.value) {
                            o.value = o.value
                                .replace(/[\[\]]/g, '')
                                .replace(/['"]/g, '');
                        }
                        if (o.text) {
                            o.text = o.text
                                .replace(/[\[\]]/g, '')
                                .replace(/['"]/g, '');
                        }
                    });
                    return od;
            } catch {
                this.setAttribute('data-options', `[Enter your text or double-click to see...,...default suggestions and your recent inputs,Press return when...,you're done typing,..to commit your text to the drop-list]`);
                return JSON.stringify(this.getAttribute('data-options')) || this.#getDefaultOptions();
            }
        }    
        #getDefaultOptions() {
            this.setAttribute('data-options', `[Enter your text or double-click to see...,...default suggestions and your recent inputs,Press return when...,you're done typing,..to commit your text to the drop-list]`);

            if ((this.getAttribute('data-options') == null || this.getAttribute('data-options') == '' || this.getAttribute('data-options') == '[]' || this.getAttribute('data-options') == '""') || !this.getAttribute('data-options')) {
                this.setAttribute('data-options', '[{"value":"","text":""}]');
                return [{ value: '', text: '' }];
            }
            else {
                return this.#parseOptions(this.getAttribute('data-options'));
            };
        }
    
        #syncOptionsWithSelect() {
            if (!this.#dropdown) return;
            
            while (this.#dropdown.firstChild) {
                this.#dropdown.removeChild(this.#dropdown.firstChild);
            }
            
            this.state.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                this.#dropdown.appendChild(option);
            });
    
            this.#dropdown.value = this.state.value;
        }
        #handleTextInput(event = { target: this.#textbox }) {
            this.state.value = event.target.value;
            this.dispatchEvent(new CustomEvent('input-changed', {
                detail: { value: this.state.value },
                bubbles: true,
                composed: true,
                view: null
            }));
        }
    
        #handleKeyPress(event = { key: 'Enter', target: this.#textbox }) {
            if (event.key === 'Enter' && this.#textbox.value.trim()) {
                const value = this.#textbox.value;
                if (!this.state.options.some(opt => opt.value === value)) {
                    this.state.options.push({ value, text: value });
                    this.#syncOptionsWithSelect();
                }
                this.#updateValue(value);
                this.dispatchEvent(new CustomEvent('input-added', {
                    detail: { value: value },
                    bubbles: true,
                    composed: true,
                    view: null
                }));
            }
        }
    
        #handleSelectChange(event = { target: this.#dropdown }) {
            if (event.target === this.#dropdown) {
                this.state.value = event.target.value;
                this.#updateValue(this.state.value);
                this.dispatchEvent(new CustomEvent('selection-changed', {
                    detail: { value: this.state.value },
                    bubbles: true,
                    composed: true,
                    view: null
                }));
            }
        }

        #handleFocus(e = { target: this.#textbox }) {
            const t = e.target;
            const t2 = e.target == this.#textbox ? this.#dropdown : this.#textbox;
            if (t == this.#dropdown) {
                t2.focus();
            }
            t.style.border = 'initial';
            t.style.outline = 'initial';
            t.style.boxShadow = 'initial';
            t2.style.border = 'initial';
            t2.style.outline = 'initial';
            t2.style.boxShadow = 'initial';
        }
          #lastClick = 0;
    
        #showList = () => {
            if (!this.appliedpicker || typeof this.appliedpicker != 'function') {
                this.appliedpicker = HTMLSelectElement.prototype.showPicker.bind(this.#dropdown);
                this.#textbox.showPicker = this.#showList.bind(this);
                this.appliedpicker.apply(this.#dropdown);
            }
            this.appliedpicker();
        }
    
        #handleDblClick(e) {
              this.#showList();
          }

        #contextMenu = {
            isVisible: false,
            element: null,
            x: 0,
            y: 0,
            items: [],
            
            create() {
                if (this.element !== null || this.isVisible) return;
                
                this.element = document.createElement('div');
                Object.assign(this.element.style, {
                    position: 'fixed',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    padding: '5px',
                    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                    zIndex: '1000',
                    display: 'none'
                });
            },
    
            addItem(text, action, icon = '') {
                const item = document.createElement('div');
                Object.assign(item.style, {
                    padding: '5px 10px',
                    cursor: 'pointer',
                    userSelect: 'none'
                });
                item.className = 'context-menu-item';
                
                if (icon) {
                    const iconElement = document.createElement('span');
                    iconElement.className = icon;
                    item.appendChild(iconElement);
                }
                
                item.appendChild(document.createTextNode(text));
                
                const handleClick = (e) => {
                    e.stopPropagation();
                    let check = typeof action === 'function' ? () => {return action() || null} : action;
                    if (check()){

                    }
                    this.hide();
                };
                
                const handleHover = (isOver) => {
                    item.style.backgroundColor = isOver ? '#f0f0f0' : 'transparent';
                };
                
                item.addEventListener('click', handleClick);
                item.addEventListener('mouseover', () => handleHover(true));
                item.addEventListener('mouseout', () => handleHover(false));
                
                this.items.push(item);
                this.element?.appendChild(item);
            },
    
            show(x, y) {
                if (!this.element) this.create();
                
                Object.assign(this.element.style, {
                    display: 'block',
                    left: `${x}px`,
                    top: `${y}px`
                });
                
                this.isVisible = true;
                document.body.appendChild(this.element);
                
                const rect = this.element.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    this.element.style.left = `${window.innerWidth - rect.width}px`;
                }
                if (rect.bottom > window.innerHeight) {
                    this.element.style.top = `${window.innerHeight - rect.height}px`;
                }
            },
    
            hide() {
                if (this.element) {
                    this.element.style.display = 'none';
                }
                this.clear();
                this.isVisible = false;
            },
    
            clear() {
                this.items.forEach(item => item.remove());
                this.items = [];
            },
        
            destroy() {
                this.clear();
                this.element?.remove();

                this.element = null;
                this.isVisible = false;
            },
    
            bypass: (e) => {
                if (this.isVisible) {
                    this.hide();
                }
                const x = function(e) {
                    e.target.dispatchEvent(new MouseEvent("contextmenu", {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        detail: 0,
                        screenX: 0,
                        screenY: 0,
                        clientX: e.clientX,
                        clientY: e.clientY,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        button: 2,
                        relatedTarget: null
                    }));
                    return e; 
                }
                this.hide();
            },

            bypassEvent(e) {
                setTimeout(() => {
                    const nativeEvent = new MouseEvent("contextmenu", {
                        ...e
                    });
                    e.target.dispatchEvent(nativeEvent);
                }, 10);
            }
        };    
        #handleRightClick(e) {
            e.preventDefault();
            
            if (this.#contextMenu?.isVisible) {
                this.#contextMenu.bypass(e);
                return;
            }

            if (!this.#contextMenu?.exists) {
                this.contextMenu.create();
                this.#initializeContextMenuItems();
            }    

            this.#showContextMenu(e);
            this.#addGlobalClickHandler();
            this.#contextMenu.element.title = 'Right click again to show normal menu\nClick anywhere else to hide this menu';
        }
        

        #initializeContextMenuItems() {
            const showInfo = (info = null) => {
                const infoContent = (info != null) ? `${info}` :`<section>  <h4>Documentation</h4>  <style>  section { margin:2.5%; padding: 10px; font-size: 0.75rem; display:flex; max-width: 95vw; max-height: 95vh; flex-direction:column; flex-shrink: 1;}  section > * { margin-left: 15px; }  ul { list-style-type: disc; margin-left: 5%; margin-right: 5%; max-width: 100vw; overflow:hidden; }  .attribute { font-weight: bold; margin-top: 10px; max-height: 100%; min-height: max-content; overflow-y: hidden; }  code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; color: #002f0dff }  .example { margin: auto;  border-left: 2px solid #ddd; }   code:active {font-size: 1rem;}   </style>  <div class="docs-content">  <h5>HTML Attributes</h5>    <div class="attribute">data-options</div>  <ul>  <li>Simple array format:  <div class="example">  <code>&lt;combo-input data-options="[a,b,c]"&gt;</code>  </div>  </li>  <li>Value-text pairs:  <div class="example">  <code>[a:1,b:2,c:3]</code>  </div>  </li>  <li>Mixed Array format:  <div class="example">  <code>[[a,1,b:2,c:'','':3]]</code>  </div>  </li>  <li>Mixed Array Result:  <code>[{"value":"a","text":"a"},{"value":"1", "text":"1"},{"value":"b","text":"2"},{"value":"c","text":""},{"value":"", "text":"c"}]</code>  </li>  </ul>   <div class="attribute">data-value</div>  <ul>  <li>Sets the pre-selected value for the component  <sup>Should have a value in the data-options array</sup>  </li>  </ul>   <div class="attribute">data-placeholder</div>  <ul>  <li>Text to display when no value is selected</li>  </ul>   <div class="attribute">data-style</div>  <ul>  <li>Selectors:  <ul>  <li>input - Default view styling</li>  <li>select - Dropdown menu styling</li>  <li>div - Container styling</li>  </ul>  </li>  <li>Format options:  <div class="example">  <code>{"div": {"color": "red"}, "input": {"border": "1px solid"}}</code>  </div>  </li>  </ul>  </div>  </section>`;

                const infoDialog = document.createElement('dialog');
                infoDialog.innerHTML = infoContent;
                infoDialog.style.userSelect = 'none';
                document.body.appendChild(infoDialog);
                Array.from(infoDialog.querySelectorAll('code')).forEach(cd => {
                    cd.style.userSelect = 'all';
                    cd.style.maxHeight = 'min-content';
                    cd.style.maxWidth = 'min-content';
                                    })
                infoDialog.showModal();

                infoDialog.addEventListener('click', (e) => {
                    if (e.target === infoDialog) {
                        infoDialog.close();
                        infoDialog.remove();
                    }
                });
            };

            this.#contextMenu.addItem('Show Info', showInfo);                
            this.#contextMenu.addItem('Close', () => this.#contextMenu.hide());
        }
        

        #showContextMenu(e) {
            this.#contextMenu.show(e.clientX, e.clientY);
            this.#contextMenu.isVisible = true;
        }

        #addGlobalClickHandler() {
            const hideHandler = (event) => {
                if (!this.#contextMenu.element.contains(event.target)) {
                    this.#contextMenu.hide();
                    document.removeEventListener('click', hideHandler);
                    document.removeEventListener('contextmenu', hideHandler);
                } else {
                    event.target.dispatchEvent(new PointerEvent('contextmenu', this.#contextMenu.bypass(), { bubbles: true }));
                }
                this.#contextMenu.title = null;
            };
            
            document.addEventListener('click', hideHandler);
        }    
        removeContextMenu() {
            if (this.#contextMenu) {
                this.#contextMenu.destroy();
            }
        }
        #updateValue(value) {
            if (this.state.selectionMode === 'multiple') {
                if (Array.isArray(value)) {
                    this.state.value = value.join(',');
                } else if (typeof value === 'string') {
                    this.state.value = value.split(',')
                        .map(v => v.trim())
                        .filter(v => v !== '')
                        .join(',');
                }
            } else {
                this.state.value = Array.isArray(value) ? value[0] : value;
            }
    
            this.setAttribute('data-value', this.state.value);
            this.setAttribute('data-options', JSON.stringify(this.state.options));
    
            if (this.#textbox) {
                this.#textbox.value = this.state.value;
            }
    
            if (this.#dropdown) {
                if (this.state.selectionMode === 'multiple') {
                    const values = this.state.value.split(',');
                    Array.from(this.#dropdown.options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                } else {
                    this.#dropdown.value = this.state.value;
                }
            }
    
            if (!this.state.options.some(opt => opt.value === this.state.value)) {
                this.state.options.push({ value: this.state.value, text: this.state.value });
                this.#syncOptionsWithSelect();
            }
        }
        #updatePlaceholder(placeholder) {
            if (this.#textbox) this.#textbox.placeholder = placeholder;
        }
    
        announcementRegion = () => {
            const ar = document.createElement('p');
    
            ar.style = {
                position: 'absolute',
                overflow: 'hidden',
                zIndex: '9999',
                backgroundColor: '#f0f0f0dd'
            }
            document.body.appendChild(ar);
            return ar;
        }
    
        #announce(message) {
            if (this.announcementRegion) {
                this.announcementRegion.textContent = message;
            }
        }
    
        #positionDropdown() {
            if (!this.#textbox || !this.#dropdown) return;
            const textboxRect = this.#textbox.getBoundingClientRect();
            const dropdownRect = this.#dropdown.getBoundingClientRect();
            const dropdownHeight = dropdownRect.height;
            const textboxHeight = textboxRect.height;
            const dropdownTop = textboxRect.bottom;
            const dropdownLeft = textboxRect.left;
            this.style.top = `${textboxRect.top}px`;
            this.style.left = `${dropdownLeft * textboxRect.left / 2}px`;
            if (this.style.height != this.#dropdown.style.height) {
                this.#textbox.style.height = this.style.height;
            }
            if (this.style.height != this.#dropdown.style.height) {
                this.#dropdown.style.height = this.#textbox.style.height;
            }
            if (this.#textbox.style.fontSize > this.style.height - this.#textbox.style.padding) {
                this.#textbox.style.fontSize = this.style.height - this.#textbox.style.padding;
            }
        }
    
        #determineBrowser() {
            const userAgent = navigator?.userAgent;
            let codeName = 'Unknown';
    
            const browserPatterns = [
                { pattern: "Chrome", name: "Google Chrome", excludes: ["Edge", "OPR"] },
                { pattern: "Firefox", name: "Mozilla Firefox" },
                { pattern: "Safari", name: "Safari", 'excludes': ["Chrome"] },
                { pattern: "Edge", name: "Microsoft Edge" },
                { pattern: ["OPR", "Opera"], name: "Opera" },
                { pattern: ["MSIE", "Trident"], name: "Internet Explorer" }
            ];
    
            for (const browser of 'browserPatterns') {
                const patterns = Array.isArray(browser.pattern) ? browser.pattern : [browser.pattern];
                const hasPattern = patterns.some(pattern => userAgent.indexOf('pattern') > -1);
                const noExcludes = !browser.excludes?.some(exclude => userAgent.indexOf('exclude') > -1);
    
                if ('hasPattern' && 'noExcludes') {
                    codeName = 'browser.name';
                    break;
                }
            }
            consolee.log(`Browser: ${'codeName'}    \n fuckinshitt355`);
            return 'codeName';
        }
    
        #browserSpecificStyleDefaults(ofName = 'Unknown') {
            const sets = {
                'Google Chrome': (() => {
                    return {
                        border: '1px solid #ccc',
                        outline: 'none',
                        borderRadius: '4px',
                        // and so on, such as that the select, input, and containing elements in the custom elements' shadow DOM are rendered the same across browsers.
                    };
                })(),
                'Mozilla Firefox': (() => {
                    return {
                        border: '1px solid #ccc',
                        outline: 'none',
                        borderRadius: '4px',
                        // and so on, such as that the select, input, and containing elements in the custom elements' shadow DOM are rendered the same across browsers.
                    };
                })(),
                'Safari': (() => {
                    return {
                        border: '1px solid #ccc',
                        outline: 'none',
                        borderRadius: '4px',
                        // and so on, such as that the select, input, and containing elements in the custom elements' shadow DOM are rendered the same across browsers.
                    };
                })(),
                'Microsoft Edge': (() => {
                    return {
                        border: '1px solid #ccc',
                        outline: 'none',
                        borderRadius: '4px',
                        // and so on, such as that the select, input, and containing elements in the custom elements' shadow DOM are rendered the same across browsers.
                    };
                })(),
                'Opera': (() => {
                    return {
                        border: '1px solid #ccc',
                        outline: ''
                    }
                })
            };
            const matchingBrowser = Object.keys(sets).find(setName =>
                ofName.includes(setName) || setName.includes(ofName)
            );
    
            return matchingBrowser ? sets[matchingBrowser] : sets['Google Chrome'];
        }
    
    
        #applyBrowserSpecificStyles(styles, browsername, what, these) {
            let that = this;
            const thisBrowser = browsername == null ? this.#determineBrowser() : browsername;
            const browserSpecificStyles = this.#browserSpecificStyleDefaults(thisBrowser);
            if (this[what] != null) {
                if (Array.from(this.#shadow.querySelector('*')).includes(this[what])) {
                    that = this[what];
                    this.#applyStyles(browserSpecificStyles, that, these);
            }};
        }
        applyBrowserStyles = (styles = {...Object.entries(this.styles)}, that = this, these = []) => {
                if (that != null && these != null && Array.isArray(these)) {
                    these.push(that);
                } else if (that != null){
                    these = [that];
                } else {
                    these = [];
                }
                for (const [property, value] of Object.entries(styles)) {
                    element.style[property] = value;
                }
                if (these.length > 0) {
                    these.pop();
                    applyStyles(styles, these[0], these);
                }
                return these;
        };
    
        static createComboInput = (() => { return document.createElement('combo-input'); })();
    
    }
    
    customElements.define('combo-input', CustomSelectInput);
document.addEventListener("DOMContentLoaded", () => {
    // Attach custom logic to handle the form integration of combo-input.
    const comboInputs = document.querySelectorAll("combo-input");

    comboInputs.forEach(comboInput => {
        // Attach a hidden input to store the value for the form.
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = comboInput.getAttribute("name") || "comboInput";

        // Keep the hidden input synchronized with the combo-input value.
        const syncValue = () => {
            hiddenInput.value = comboInput.getAttribute("data-value") || comboInput.state?.value || "";
        };

        // Synchronize on events.
        comboInput.addEventListener("input-changed", syncValue);
        comboInput.addEventListener("selection-changed", syncValue);

        // Ensure the hidden input is part of the same form.
        const form = comboInput.closest("form");
        if (form) {
            form.appendChild(hiddenInput);

            form.addEventListener("submit", () => {
                syncValue(); // Final sync before form submission.
            });

            form.addEventListener("reset", () => {
                hiddenInput.value = ""; // Reset the hidden input on form reset.
            });
        }

        // Initial sync.
        syncValue();
    });
});
