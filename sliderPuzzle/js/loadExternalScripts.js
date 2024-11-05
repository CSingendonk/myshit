class Import {
    constructor(src = 'file:///C:/Users/CPS13/Desktop/S123OD/OneDrive/Documents/fuckintpg/authclass/backpacks/myApp/public/page/v2/limbo/sliderPuzzle/elements_js/dummyUri.js') {
        this.sources = Array.isArray(src) ? [...src].map(str => {
            return {...src, src: str} }) : src;

        
        /**
         * Load scripts
         * @param {string|string[]} sourceUrl - URL or array of URLs to load
         * @param {HTMLElement} targetElement - The element to append the loaded scripts to
         * @returns {Promise} - Resolves when all scripts are loaded
         */
        this.load = function(sourceUrl, targetElement) {
            return this.#loadScripts(sourceUrl, targetElement);
        };

        }


    /**
     * Dynamically load external scripts
     * @param {string|string[]} sourceUrl - URL or array of URLs to load
     * @param {HTMLElement} targetElement - The element to append the loaded scripts to
     * @returns {Promise} - Resolves when all scripts are loaded
     */
    #loadScripts = function(sourceUrl, targetElement) {
        // Create a shadow DOM for the target element
        let shadow = !targetElement.shadowRoot ? targetElement.attachShadow({ mode: 'open' }) : targetElement.shadowRoot;
        const loadScript = (url) => {
            return new Promise((scriptResolve, scriptReject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => scriptResolve();
                script.onerror = (error) => scriptReject(new Error(`Failed to load script: ${url}`));
                shadow.appendChild(script);
            });
        };

        if (Array.isArray(sourceUrl)) {
            // If sourceUrl is an array, load all scripts
            return Promise.all(sourceUrl.map(url => loadScript(url)));
        } else {
            // If sourceUrl is a single string, load that script
            return loadScript(sourceUrl);
        }
    };
}