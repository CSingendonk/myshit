class Import {
    constructor(src = '') {        
        this.src = src;
        this.loaded = false;
        this.loadedScripts = [];
        this.paths = [];
        this.queuedScripts = [];
        this.failedScripts = [];
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
                document.body.appendChild(script);
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

document.loadExternalScripts = () => {    // Usage example
        const paths = ['./elements_js/sliderPuzzle.js', './elements_js/popup.js', './elements_js/draggrip.js'];
            const importer = new Import();
            const nest = document.createElement('div');
            nest.id = 'scripts-div';
            document.body.appendChild(nest);
            const targetElement = document.querySelector('#scripts-div'); // Replace with your target element selector
            if (paths.length > 0) {
                importer.load(paths, targetElement)
                    .then(() => {
                        console.log('All scripts loaded successfully.');
                    })
                    .catch((error) => {
                        console.error('Error loading scripts:', error);
                    });
            }
            else {
                console.log('No paths provided.');
            }

        }