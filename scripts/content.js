const CONFIG = {
  // Configuration settings for each website
  inputSelector: "#prompt-textarea p",
  buttonStyles:
    "position: absolute; right: calc(var(--spacing)*13); bottom: calc(var(--spacing)*2); z-index: 9999; height: calc(var(--spacing)*9); width: calc(var(--spacing)*9); display: flex; justify-content: center; align-items:center; color: #b4b4b4; border: 1px solid #ffffff1a; border-radius: 50%; cursor: pointer;",
};

const findInput = () => {
  const input = document.querySelector(CONFIG.inputSelector);
  if (!input) {
    console.error("Input element not found");
    return null;
  }
  return input;
};

const createButton = () => {
  const targetInput = findInput();
  if (!targetInput) return null;

  const formatButton = document.createElement("button");
  formatButton.innerHTML =
    '<svg width="18px" height="18px" viewBox="0 0 108.30541 97.688282" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.0446032,0,0,1.0446032,-58.392936,-96.04417)" id="g1"><path fill="currentColor" d="m 108.00524,185.40688 c -10.445331,-1.25465 -19.900361,-5.48748 -26.915928,-12.04972 -1.999623,-1.87041 -2.452826,-2.55177 -2.452826,-3.68766 0,-2.18017 1.490948,-3.58552 3.556876,-3.35266 0.967095,0.10901 1.517585,0.4575 3.620463,2.29196 5.818123,5.07549 12.043264,8.1602 19.310865,9.56902 18.87537,3.65899 37.79323,-6.74259 44.92768,-24.70252 1.01261,-2.5491 2.01819,-6.37355 2.41443,-9.18257 0.42429,-3.00792 0.19078,-10.84409 -0.4021,-13.49375 -1.78689,-7.98583 -5.47536,-14.81395 -10.99535,-20.35464 -10.75789,-10.798246 -26.38794,-14.517846 -41.00161,-9.75747 -10.918952,3.55683 -20.367341,12.42354 -24.616121,23.10065 -1.068785,2.68584 -2.094051,6.13619 -2.101248,7.07136 l -0.0056,0.72136 4.564062,0.0724 c 4.541125,0.072 4.564498,0.0755 4.650611,0.68297 0.08071,0.56941 -0.73423,1.81647 -2.656827,4.0656 -0.332597,0.38909 -2.555607,3.2186 -4.940023,6.28781 -4.474278,5.75926 -4.968198,6.20375 -6.246522,5.6213 -0.34151,-0.1556 -1.434058,-1.2851 -2.427885,-2.50999 -0.993827,-1.2249 -3.652427,-4.45208 -5.908,-7.17153 -4.15468,-5.00911 -4.709197,-5.83926 -4.414117,-6.60822 0.143391,-0.37367 0.812627,-0.42784 5.286121,-0.42784 h 5.121945 l 0.324075,-1.78593 c 1.745955,-9.62177 7.388558,-19.42919 15.052247,-26.16237 18.341912,-16.114846 45.634892,-15.519166 63.271512,1.38093 8.04452,7.70858 12.9062,17.4405 14.18842,28.40183 0.45613,3.89937 0.48729,6.65534 0.11237,9.9395 -1.65061,14.45884 -8.88662,26.44732 -20.76755,34.40727 -4.93372,3.30548 -10.40397,5.59787 -16.46512,6.89995 -2.55824,0.54958 -3.9895,0.68256 -8.13177,0.75558 -2.7649,0.0487 -5.4438,0.0386 -5.95313,-0.0226 z M 92.971398,159.61835 c 0.0766,-0.20716 0.99047,-2.93725 2.03082,-6.06686 l 1.89154,-5.69021 11.338922,-11.33661 11.33891,-11.33662 4.03973,4.02777 4.03973,4.02777 -11.34259,11.34489 -11.3426,11.3449 -5.690201,1.89155 c -3.129621,1.04034 -5.859711,1.95421 -6.066871,2.03081 -0.24467,0.0905 -0.32786,0.007 -0.23739,-0.23739 z m 33.081992,-32.86384 -4.03966,-4.04598 2.46595,-2.41827 c 3.67573,-3.60466 4.15094,-3.59273 7.99494,0.20061 l 2.65042,2.61548 v 1.33108 c 0,1.32867 -0.005,1.33562 -2.51599,3.84707 l -2.516,2.51599 z" id="path1" /></g></svg>';
  formatButton.style.cssText = CONFIG.buttonStyles;

  formatButton.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submit
    const original_text = targetInput.textContent;
    if (original_text == "") return;

    // chrome.storage.sync.get(
    //   ["transformationTemplates", "activeTemplateIndex"],
    //   (data) => {
    //     const templates = data.transformationTemplates || [];
    //     const activeIndex = data.activeTemplateIndex || 0;

    //     if (templates.length > activeIndex) {
    //       const activeTemplate = templates[activeIndex].template;
    //       const transformedText = transformPromptText(
    //         original_text,
    //         activeTemplate,
    //       );
    //       targetInput.textContent = transformedText;
    //       targetInput.dispatchEvent(new Event("input", { bubbled: true }));
    //     }
    //   },
    // );

    const transformedText = "bruh, " + original_text;

    targetInput.textContent = transformedText;
    targetInput.dispatchEvent(new Event("input", { bubbled: true }));
    // input event created for webpage error handling
  });

  // Place the button near the input field
  const inputParent =
    targetInput.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode.parentNode.parentNode.parentNode;
  inputParent.style.position = "relative";
  inputParent.appendChild(formatButton);
};

window.addEventListener("load", () => {
  setTimeout(createButton, 1000); // Slight delay to ensure dynamic elements are loaded
});
