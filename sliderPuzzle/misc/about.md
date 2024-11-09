# 🎮 **Slider Puzzle Web Component**

## **Overview**
The `<slider-puzzle>` web component creates an interactive slider puzzle game that loads a random image each time it initializes. Additionally, you can **upload your own custom images** or **capture a new picture** using your device's camera to generate a unique puzzle.

---

## 🧩 **The Puzzle**
Once loaded, the puzzle is ready to play. Simply tap the **Puzzle** button to the left of the **About** and **Help** buttons to open the interface, where you can:

- 🟢 **Continue** a saved puzzle
- 🔄 **Replay** a solved puzzle
- 🖼️ **Create** a new puzzle using:
  - 📷 A **new random image**
  - 📁 **Your own uploaded image**
  - 💾 A **previously saved image**
- 🔧 **Set the complexity** and dimensions of a new puzzle

---

## 📺 **The Display**
On a desktop browser the entire element can be dragged and moved to another area on the page from the top left corner. You may also drag the bottom right corner to resize it.
On mobile we are limited to pinching to zoom in or out and cannot drag the elemebt.

## 🛠️ **Code Integration**
To include the slider puzzle on your webpage, use the `<slider-puzzle>` custom element. The component is designed to generate a fully functional slider puzzle without any additional configuration.

<details>
  <summary>📜 <strong>Click to see how to integrate this component into your HTML page:</strong></summary>
  
```html
<slider-puzzle></slider-puzzle>
<script src="https://csingendonk.github.io/htmlpanels/sliderPuzzle/elements_js/slider-puzzle.js"></script>
```
The component uses the slider-puzzle.js script hosted on GitHub and written by © CSingendonk, to handle the game logic, image loading, and user interactions.
</details>

