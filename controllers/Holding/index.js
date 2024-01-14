const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");

const TableName = tableName.Holding;

const getHoldings = async (req, res) => {
  const { portfolio_id } = req.user;

  try {
    if (!portfolio_id) {
      return res.status(400).json({ status: false, message: "Bad payload." });
    }
    const { data, error } = await supabase.from(TableName).select("*").eq("portfolio_id", portfolio_id);

    if (error) throw error;

    return res.status(200).json({ status: true, message: "Portfolio retrived successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { getHoldings };
