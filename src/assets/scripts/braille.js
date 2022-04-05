const TEXT_NODE = 3;
const TAG_BLACKLIST = ["svg", "style", "script", "tooltip"];
const BRAILLE_MAPPING = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  ".": "⠲",
  ",": "⠂",
  ";": "⠆",
  ":": "⠒",
  "(": "⠐",
  ")": "⠘",
  "-": "⠤",
  "'": "⠄",
  '"': "⠶",
  "/": "⠸",
  _: "⠨",
  " ": " ",
  "\n": "\n",
  1: "⠼⠁",
  2: "⠼⠃",
  3: "⠼⠉",
  4: "⠼⠙",
  5: "⠼⠑",
  6: "⠼⠋",
  7: "⠼⠛",
  8: "⠼⠓",
  9: "⠼⠊",
  0: "⠼⠚",
};

const stringToBraille = (string) => {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    const newChar = BRAILLE_MAPPING[string[i].toLowerCase()] || "";
    newString += newChar;
  }
  return newString;
};

const rewriteBraille = () => {
  const elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (TAG_BLACKLIST.includes(element.tagName.toLowerCase())) {
      continue;
    }
    const originalTextArray = new Array(element.childNodes.length);
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j];
      if (node.nodeType === TEXT_NODE) {
        originalTextArray[j] = node.nodeValue;
        const text = node.nodeValue;
        node.nodeValue = stringToBraille(text);
      }
    }
    if (originalTextArray.some((str) => !!str)) {
      element.setAttribute(
        "data-original-text",
        JSON.stringify(originalTextArray)
      );
    }
  }
};

const undoRewrite = () => {
  const elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const originalTextAttr = element.getAttribute("data-original-text");
    if (!originalTextAttr) {
      continue;
    }
    const originalTextArray = JSON.parse(originalTextAttr);
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j];
      if (node.nodeType === TEXT_NODE && originalTextArray[j]) {
        node.nodeValue = originalTextArray[j];
      }
    }
  }
};

(() => {
  const ENABLE_ID = "enable-visually-impaired";
  const DISABLE_ID = "disable-visually-impaired";
  const LOCAL_STORAGE_KEY = "visually-impaired-enabled";

  const enable = () => {
    rewriteBraille();
    document.getElementById(DISABLE_ID).classList.remove("hidden");
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    } catch (e) {
      // Do nothing
    }
  };

  const disable = () => {
    undoRewrite();
    document.getElementById(DISABLE_ID).classList.add("hidden");
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      // Do nothing
    }
  };

  document.getElementById(ENABLE_ID).addEventListener("click", enable);
  document.getElementById(DISABLE_ID).addEventListener("click", disable);

  // Check if enabled
  try {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      enable();
    }
  } catch (e) {
    // Do nothing
  }
})();
