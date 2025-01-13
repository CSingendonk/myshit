const puzzle = document.querySelector('#puzzle');
const st = document.createElement('style');
st.innerHTML = `#start-ui {
    z-index: ${`${Number.MAX_SAFE_INTEGER + 1}`};
}`
document.body.appendChild(st);
let classStatus = 'standby hidden';

let startcheck = setInterval(() => {
    startui = document.querySelector('#start-ui');
    if (!startui || startui == null || startui == undefined) {
        classStatus = 'started';
        puzzle.className = classStatus;
        puzzle.parentElement.className = classStatus;
        clearInterval(startcheck);
    }
}, 25);
puzzle.className = classStatus;
class CustomIframe extends HTMLIFrameElement {
    constructor() {
        super();
        this.src = this.getIframeSrc();
        this.innerHTML = '';
        this.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';
        this.allow = '*';
    }

    getIframeSrc() {
        return this.fileName || 'about:blank';
    }

    updateSource(newFileName) {
        this.fileName = newFileName;
        this.src = this.getIframeSrc();
    }

    removeIframe() {
        this.remove();
    }
}
customElements.define('u-frame', CustomIframe, { extends: 'iframe' });

