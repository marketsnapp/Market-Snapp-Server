const { tableName } = require("../../enums/Supabase");
const WindowSize = require("../../enums/WindowSize");
const market = require("../../marketMap");
const supabase = require("../../services/Supabase");
const cryptocurrencyWindowSizeGenerator = require("../../utils/cryptocurrencyWindowSizeGenerator");
const sortByMarketcap = require("./shared");

const TableName = tableName.Cryptocurrency;

const getAllCryptocurrencies = async (req, res) => {
  const windowSize = cryptocurrencyWindowSizeGenerator(req.query.windowSize);

  try {
    if (windowSize === WindowSize["24 Hours"]) {
      const { data: cryptocurrencyDataList, error } = await supabase.from(TableName).select("id,symbol,name,icon,decimal");

      if (error) throw error;

      const data = sortByMarketcap(cryptocurrencyDataList, windowSize, true);
      console.log(data);

      return res.status(200).json({ status: true, message: "Cryptocurrencies retrieved successfully.", data });
    }

    const cryptocurrencyDataList = Object.entries(market.Cryptocurrency).map(([symbol, { id }]) => {
      return { id, symbol };
    });
    const data = sortByMarketcap(cryptocurrencyDataList, windowSize, true);

    console.log(data);

    return res.status(200).json({ status: true, message: "Cryptocurrencies retrieved successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = getAllCryptocurrencies;
