const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");
const market = require("../../marketMap");
const cryptocurrencyWindowSizeGenerator = require("../../utils/cryptocurrencyWindowSizeGenerator");

const TableName = tableName.Cryptocurrency;

const getCryptocurrency = async (req, res) => {
  const cryptocurrencySymbol = req.params.symbol;
  const windowSize = cryptocurrencyWindowSizeGenerator(req.query.windowSize);

  try {
    const { data, error } = await supabase.from(TableName).select("id,symbol,name,icon,decimal,circulating_supply,total_supply,max_supply").eq("symbol", cryptocurrencySymbol).single();

    if (error) throw error;

    return res.status(200).json({
      status: true,
      message: "Cryptocurrency retrieved successfully.",
      data: [
        {
          ...data,
          price: market.Cryptocurrency[cryptocurrencySymbol].price,
          market_cap: market.Cryptocurrency[cryptocurrencySymbol].market_cap,
          [windowSize]: {
            ...market.Cryptocurrency[cryptocurrencySymbol][windowSize],
          },
        },
      ],
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = getCryptocurrency;
