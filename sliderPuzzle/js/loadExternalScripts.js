/**
 * @class Import
 * @description Dynamically loads external scripts and manages their loading state.
 * @param {string} [src=''] An optional string can be used in instantiation to shortcut the importation of the specified script.
 * @property {string} src - The source URL of the script to load
 * @property {boolean} loaded - Flag indicating if the script has been loaded
 * @property {Array<string>} loadedScripts - Array of successfully loaded script URLs
 * @property {Array<string>} paths - Array of script paths
 * @property {Array<string>} queuedScripts - Array of scripts waiting to be loaded
 * @property {Array<string>} failedScripts - Array of scripts that failed to load
 * This class provides a convenient way to load scripts from an array of URLs and attach them to a target element.
 * It also keeps track of loaded, queued, and failed scripts to avoid redundant loading.
 */class Import {
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
    /**
     * Handles the import of scripts, managing their loading state and attaching them to the target element.
     * @param {string[]} [srcs=[]] - An array of script URLs to be imported.
     * @param {HTMLElement} [target=null] - The target element to which the scripts will be attached.
     * @returns {Import} - The current Import instance.
     */
    handleImport = (srcs = [], target = document.body) => {    
        document.fullscreenEnabled = true;
           let paths = ['https://csingendonk.github.io/htmlpanels/sliderPuzzle/elements_js/sliderpuzzle.js', 'https://csingendonk.github.io/htmlpanels/sliderPuzzle/elements_js/popup.js', 'https://csingendonk.github.io/htmlpanels/sliderPuzzle/elements_js/draggrip.js', 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'];
           if (srcs.length > 0) {
               paths = srcs;
           }
               const importer = this;

               const nest = document.querySelector('#scripts-div') != null ? document.querySelector('#scripts-div') : document.createElement('div');
               nest.id = nest.hasAttribute('id') && nest.id?.length > 0 ? nest.id : 'scripts-div';
               if (!document.querySelector('#scripts-div')) {
                   document.body.appendChild(nest);
               }
               const targetElement = target != null ? target : document.querySelector('#scripts-div'); 
               paths.forEach(p => {
                    if (!importer.loadedScripts.includes(p)) {
                        if (!importer.queuedScripts.includes(p)) {
                            importer.queuedScripts.push(p);
                        }
                    }
                    else {
                        console.log('Skipping already loaded script:', p);
                        paths.splice(paths.indexOf(p), 1);
                    }
               })
               if (importer.queuedScripts.length > 0) {
                   importer.load(importer.queuedScripts, targetElement)
                       .then(() => {
                           console.log('All scripts loaded successfully.');
                           importer.loadedScripts.push(...this.queuedScripts);
                           this.queuedScripts = [];
                           importer.queuedScripts = [];

   
                       })
                       .catch((error) => {
                           console.error('Error loading scripts:', error);
                           importer.failedScripts.push(...importer.queuedScripts);
                       });
               }
               else {
                   console.log('No paths provided.');
               }
               return importer;
       }
       static initialize = function() {
        // Initialize the Import instance
        // You can add any initialization logic here if needed
        const importer = new Import();
        document.loadExternalScripts = (srcs = [], target = null) => {  importer.handleImport(srcs, target); };
        return importer;
    }
 }

 /**
 *@argument {string} [srcs=[]] - An array of script URLs to be imported.
 *@argument {HTMLElement} [target=null] - The target element to which the scripts will be attached.
 *@returns {Import} - The current Import instance.
 */
const importer = Import.initialize();
document.loadExternalScripts();

