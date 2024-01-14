const market = require("../marketMap");

const cryptocurrencySortByMarketcap = (data) => {
  return data.sort((a, b) => {
    const indexA = market.CryptocurrencySymbolsSortedByMarketCap.indexOf(a.symbol);
    const indexB = market.CryptocurrencySymbolsSortedByMarketCap.indexOf(b.symbol);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
};

module.exports = cryptocurrencySortByMarketcap;
