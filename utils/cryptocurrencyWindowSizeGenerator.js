const WindowSize = require("../enums/WindowSize");

const cryptocurrencyWindowSizeGenerator = (windowSize) => {
  if (windowSize !== WindowSize["1 Hour"] && windowSize !== WindowSize["7 Days"]) windowSize = WindowSize["24 Hours"];

  return windowSize;
};

module.exports = cryptocurrencyWindowSizeGenerator;
