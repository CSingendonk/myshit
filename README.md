# Hey there! 👋

**Y**ou have found your way to my collection of eclectic side-projects! <sup> <i>&lt;&gt;Sorry for your luck!</i></sup>  
**T**his repo is where I experiment, test, and build things from stuff I don't know about <sub>(but intend to learn about in due time through screwing around with stuff and things)</sub>. As such, the content herein is not guaranteed to adhere to any preconceived notions of conformity and norms, but you can totally grab and use the code here too if you so desire. It’s all accessible with short and simple client-side HTML or JavaScript retrieval.

## How to Get Started

To use the code from this repo in your program without duplicating it into your code, the following structure can be inserted into any HTML page at any time.

<custom-element></custom-element>
<script src="https://domain>/<repo>/<file.ext>"></script>


**T**o import the element's constructing code to your client-side via JavaScript for processing, simply insert a `<script>` element with the `src` attribute set to the file path (e.g., `https://your-domain.com/filename.ext`). This script can then be edited to change/add styles and structure of the sequestered element, allowing you to manipulate the custom element's core properties directly in the DOM.

<details>
  <summary>Here is a function that can be run locally in the DevTools console (or something similar) to add a custom element from this repo to your DOM:</summary>

  ```javascript
  // The new HTML tag name will match with that of the file that contains the script definition.
  // Example: 
  function loadCustomElement(customTag = '') {
      if (customTag === '') { return; }
      const script = document.createElement('script');
      let customElement;
      script.src = `https://csingendonk.github.io/htmlpanels/${customTag}.js`;
      script.onload = () => {
          customElement = document.createElement(customTag);
          document.body.appendChild(customElement);
      };
      script.onerror = () => {
          console.error(`Failed to load the ${customTag} script.`);
      };
      document.body.appendChild(script);
      return customElement;
  }

  let puz = loadCustomElement('slider-puzzle');
  ```
  
</details>

### 🖱️ Draggrip

Want to make parts of your page draggable? The `<draggrip>` element lets you click and drag its parent container anywhere within the draggrip's grandparent element.

```html
<element-to-drag>
  <draggrip></draggrip>
</element-to-drag>

<script src="https://csingendonk.github.io/htmlpanels/draggrip.js"></script>
```

#### 🧩 Slider Puzzle

Love puzzles? The `<slider-puzzle>` element creates a fun slider puzzle with random images every time it loads. You can even upload your own images or take a brand new picture with your device's camera to make a unique puzzle from it.

```html
<slider-puzzle></slider-puzzle>
<script src="https://csingendonk.github.io/htmlpanels/slider-puzzle.js"></script>
```

### 🎲 Dice Panel

The `<dice-panel>` generates and renders 3D dice with realistic physics. It waits for the dice to settle and then gives you the result based on the highest faces. Smooth and reliable, though I’m still tweaking the styles and textures a bit.

```html
<dice-panel></dice-panel>
<script src="https://csingendonk.github.io/htmlpanels/dice-panel.js"></script>
```

## Why This Repo?

This is my personal stash of custom HTML elements that I’ve built for fun and utility. Whether you’re looking to add some interactivity, games, or just play around with custom elements, feel free to use and tweak them as you like. It’s all about making web development a bit more playful and interactive!

## Wanna Contribute?

I’m keeping this repo mainly for my own use, but if you have thoughts, feel free to shoot me a message or whatever.

**Happy Coding! 🚀**  
Thanks for stopping by. Dive in, have fun, and let me know what you think!

Written by [csingendonk](https://github.com/csingendonk)
```
