const axios = require("axios");
const market = require("./marketMap");
const WindowSize = require("./enums/WindowSize");

const TickerSymbols = market.CryptocurrencyTickerSymbols;

const windowSizeList = [WindowSize["1 Hour"], WindowSize["24 Hours"], WindowSize["7 Days"]];

const windowMarket = async () => {
  const TickerSymbolsList = JSON.parse(TickerSymbols);

  const TickerSymbolsSplittedList = [];

  while (TickerSymbolsList.length) {
    TickerSymbolsSplittedList.push(TickerSymbolsList.splice(0, 100));
  }

  for (const TickerSymbolsSplitted of TickerSymbolsSplittedList) {
    const windowSizeFetchPromises = windowSizeList.map(
      (windowSize) =>
        new Promise(async (resolve, reject) => {
          try {
            const { data: windowData } = await axios.get("https://api.binance.com/api/v3/ticker", { params: { symbols: JSON.stringify(TickerSymbolsSplitted), windowSize } });
            resolve({ windowSize, windowData });
          } catch (error) {
            reject(error);
          }
        })
    );

    await Promise.all(windowSizeFetchPromises).then((data) => {
      data.forEach(({ windowData, windowSize }) => {
        windowData.forEach(({ symbol, priceChange, priceChangePercent, openPrice, highPrice, lowPrice, quoteVolume }) => {
          const symbolParsed = symbol.split("USDT")[0];

          const windowSizeData = {
            price_change: +priceChange,
            price_change_percent: +priceChangePercent,
            open_price: +openPrice,
            high_price: +highPrice,
            low_price: +lowPrice,
            volume: +quoteVolume,
          };

          if (!market.Cryptocurrency[symbolParsed][windowSize]) market.Cryptocurrency[symbolParsed][windowSize] = {};

          market.Cryptocurrency[symbolParsed][windowSize] = {
            ...market.Cryptocurrency[symbolParsed][windowSize],
            ...windowSizeData,
          };
        });
      });
    });
  }
};

module.exports = windowMarket;
