const wordcut = require("thai-wordcut");

wordcut.init();

function thaiWordTokenied(sentence) {
  return wordcut
    .cut(sentence)
    .split("|")
    .map((word) => word.trim())
    .filter((word) => word !== "");
}

module.exports = thaiWordTokenied;
