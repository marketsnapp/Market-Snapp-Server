const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");
const sortByMarketcap = require("./shared");

const TableName = tableName.Cryptocurrency;

const searchCryptocurrencies = async (req, res) => {
  const searchQuery = req.query.q;

  try {
    if (!searchQuery) {
      return res.status(200).json({ status: true, message: "Cryptocurrencies retrieved successfully.", data: [] });
    }

    const { data: cryptocurrencyDataList, error } = await supabase
      .from(TableName)
      .select("id,symbol,name,icon,decimal,circulating_supply,total_supply,max_supply")
      .or(`name.ilike.${searchQuery}%,symbol.ilike.%${searchQuery}%`)
      .limit(25);

    if (error) throw error;

    const data = sortByMarketcap(cryptocurrencyDataList, "1d");

    return res.status(200).json({ status: true, message: "Cryptocurrencies retrieved successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = searchCryptocurrencies;
