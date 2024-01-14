const market = require("../marketMap");

const cryptocurrencyPageGenerator = (page, isSocket = false) => {
  page = parseInt(page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  return market.CryptocurrencySymbolsSortedByMarketCap.slice(isSocket ? 0 : offset, offset + limit);
};

module.exports = cryptocurrencyPageGenerator;
