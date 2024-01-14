const market = require("../../marketMap");
const cryptocurrencySortByMarketcap = require("../../utils/cryptocurrencySortByMarketcap");

const sortByMarketcap = (data, windowSize, isSlimData = false) => {
  return cryptocurrencySortByMarketcap(data).map((e) => {
    const windowSizeData = {
      price_change: market.Cryptocurrency[e.symbol][windowSize].price_change,
      price_change_percent: market.Cryptocurrency[e.symbol][windowSize].price_change_percent,
    };
    const dataExpanded = isSlimData
      ? {
          [windowSize]: {
            ...windowSizeData,
          },
        }
      : {
          [windowSize]: {
            ...windowSizeData,
            open_price: market.Cryptocurrency[e.symbol][windowSize].open_price,
            high_price: market.Cryptocurrency[e.symbol][windowSize].high_price,
            low_price: market.Cryptocurrency[e.symbol][windowSize].low_price,
            volume: market.Cryptocurrency[e.symbol][windowSize].volume,
          },
        };
    return {
      ...e,
      price: market.Cryptocurrency[e.symbol].price,
      market_cap: market.Cryptocurrency[e.symbol].market_cap,
      ...dataExpanded,
    };
  });
};

module.exports = sortByMarketcap;
