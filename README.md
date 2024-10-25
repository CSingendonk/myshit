# <h1>Hey there! 👋</h1>
#### <p>Welcome to my personal playground for my eclectic ideas and side-projects, currently that is just some HTML custom elements.. so nothing revolutionary... unexpectedly entertaining though. This repo is where I experiment, test, and build, but you can totally grab and use the code here too if you so desire. It’s all accessible with short and simple client-side HTML or JavaScript retrieval.</p>

<h2>How to Get Started</h2>
To use the code from this repo in your program without duplicating it into your code, the following structure can be inserted to any html page at any time.

<pre><code>&lt;custom-element&gt;&lt;/custom-element&gt;
&lt;script src="https://<domain>/<repo>/<file.ext>"&gt;&lt;/script&gt;
</code></pre>

<p>For example, if you want to add the slider puzzle:</p>

<pre><code>&lt;slider-puzzle&gt;&lt;/slider-puzzle&gt;
&lt;script src="https://csingendonk.github.io/htmlpanels/slider-puzzle.js"&gt;&lt;/script&gt;
</code></pre>

<p>To import the element to your client-side via JavaScript a basic fetch('url') call will bring the code and and you can use the defined tag to add the new element directly to the dom</p>

<pre><code>// ...
    fetch('https://csingendonk.github.io/htmlpanels/slider-puzzle.js);
    document.body.appendChild(document.createElement('slider-puzzle'))
  // ...
</code></pre>

### <p>That's all you need to do.</p>



### <h3>🖱️ Draggrip</h3>
<p>Want to make parts of your page draggable? The <code>&lt;draggrip&gt;</code> element lets you click and drag its parent container anywhere within the draggrips' grandparent element. </p>

<pre><code> 
  &lt;element to drag-tag.&gt;
&lt;draggrip&gt;&lt;/draggrip&gt;
  &lt;/element to drag-tag.&gt;

&lt;script src="https://csingendonk.github.io/htmlpanels/draggrip.js"&gt;&lt;/script&gt;
</code></pre>

#### <h3>🧩 Slider Puzzle</h3>
<p>Love puzzles? The <code>&lt;slider-puzzle&gt;</code> element creates a fun slider puzzle with random images every time it loads. You can even upload your own images, or take a brand new picture with your devices camera to make a unique puzzle from it.</p>

<pre><code>&lt;slider-puzzle&gt;&lt;/slider-puzzle&gt;
&lt;script src="https://csingendonk.github.io/htmlpanels/slider-puzzle.js"&gt;&lt;/script&gt;
</code></pre>


## <h3>🎲 Dice Panel</h3>
<p>The <code>&lt;dice-panel&gt;</code> generates and renders 3D dice with realistic physics. It waits for the dice to settle and then gives you the result based on the highest faces. Smooth and reliable, though I’m still tweaking the styles and textures a bit.</p>

<pre><code>&lt;dice-panel&gt;&lt;/dice-panel&gt;
&lt;script src="https://csingendonk.github.io/htmlpanels/dice-panel.js"&gt;&lt;/script&gt;
</code></pre>

<h2>Why This Repo?</h2>
<p>This is my personal stash of custom HTML elements that I’ve built for fun and utility. Whether you’re looking to add some interactivity, games, or just play around with custom elements, feel free to use and tweak them as you like. It’s all about making web development a bit more playful and interactive!</p>

<h2>Wanna Contribute?</h2>
<p>I’m keeping this repo mainly for my own use, but if you have thoughts feel free to shoot me a message or w/e.</p>

<p><strong>Happy Coding! 🚀</strong><br>
Thanks for stopping by. Dive in, have fun, and let me know what you think!</p>

<p>Written by csingendonk</p>

