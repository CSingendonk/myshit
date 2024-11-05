class MenuBar extends HTMLElement {
    constructor(title = '', host = document.body, items = []) {
        super();
        this._title = title;
        this.htmlString = `
        <style>
        .menu-bar {
    display: inline-flex;
    justify-content: space-between;
    align-items: top;
    flex-direction: row;
    width: 100%;
    height: min-content;
    max-height: fit-content;
    background-color: #00900077;   
}
h2, h1, h3 {
    font-size: 1rem;
    margin-left: 2%;
    margin-top: 1%;;
    margin-bottom: 1%;
    padding: 0px;
    color: #000000;
    width: fit-content;
    height: fit-content;
    wrap: nowrap;
    word-wrap: normal;
    white-space: nowrap;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}</style>
<div id="menu-bar" class="menu-bar">
    <span class="header-main-title">
        <h1 class="bar-title">${this._title}</h1>
        </span>
        <span class="header-main-menu">

        <div class="menu-bar-item">
        <a href="index.html">Home</a>
        </div>
        <div class="menu-bar-item">
        <a href="about.html">About</a>
        </div>
        </span>
        </div>
        `;
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = this.htmlString;
        items.forEachEach(item => {
            this.addItem(item);
        });
        this.buttons = [];
        this.links = [];
        this.submenus = [];
        this.inputs = [];
        this.labels = [];
        this.selects = [];
        this.element = this.shadowRoot.getElementById('menu-bar');
    }
    addItem(item) {
        let menuItem = document.createElement('div');
        menuItem.classList.add('menu-bar-item');
        menuItem.appendChild(item);
        this.element.appendChild(menuItem);
    }
    get title() {
        return this._title ? this._title : this.title ? this.title : 'Menu';
    }
    set title(value) {
        this._title = value;
    }
    get htmlString() {
        return this._htmlString ? this._htmlString : this.htmlString ? this.htmlString : '';
    }
    set htmlString(value) {
        this._htmlString = value;
    }
    get shadow() {
        return this._shadow ? this._shadow : this.shadow ? this.shadow : '';
    }
    set shadow(value) {
        this._shadow = value;
    }
    addButton(txt = "Button", func) {
        let button = document.createElement('button');
        button.innerHTML = txt;
        button.addEventListener('click', func);
        this.buttons.push(button);
        this.shadow.appendChild(button);
    }
    addLink(txt = "Link", func) {
        let link = document.createElement('a');
        link.innerHTML = txt;
        link.addEventListener('click', func);
        this.links.push(link);
        this.shadow.appendChild(link);
    }
    addSubmenu(host, txt = "Submenu", func) {
        let submenu = document.createElement('div');
        submenu.innerHTML = txt;
        submenu.addEventListener('click', func);
        this.submenus.push(submenu);
        host.appendChild(submenu);
    }
    addInput(host, txt = "Input", type, func) {
        let input = document.createElement('input');
        input.innerHTML = txt;
        input.type = type;
        input.addEventListener('input', func);
        this.inputs.push(input);
        host.appendChild(input);
    }
}
customElements.define('menu-bar', MenuBar);
