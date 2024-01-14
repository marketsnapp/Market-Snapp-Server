const axios = require("axios");
const market = require("./marketMap");

const TickerSymbols = market.CryptocurrencyTickerSymbols;

const sortMarket = async () => {
  try {
    const { data: priceData } = await axios.get("https://api.binance.com/api/v3/ticker/price", { params: { symbols: TickerSymbols } });

    priceData.forEach(({ symbol, price }) => {
      const symbolParsed = symbol.split("USDT")[0];

      if (market.Cryptocurrency[symbolParsed].price && market.Cryptocurrency[symbolParsed].price < +price) {
        market.Cryptocurrency[symbolParsed].is_last_price_up = true;
      } else {
        market.Cryptocurrency[symbolParsed].is_last_price_up = false;
      }

      market.Cryptocurrency[symbolParsed].price = +price;
      market.Cryptocurrency[symbolParsed].market_cap = market.Cryptocurrency[symbolParsed].price * market.Cryptocurrency[symbolParsed]["circulating_supply"];
    });

    const temporaryMarketSortedByMarketCap = Object.entries(market.Cryptocurrency)
      .sort((a, b) => b[1].market_cap - a[1].market_cap)
      .map((marketObject) => marketObject[0]);

    market.CryptocurrencySymbolsSortedByMarketCap = temporaryMarketSortedByMarketCap;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sortMarket;
