const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");

const TableName = tableName.Portfolio;

const getPortfolioMiddleware = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const { data, error } = await supabase.from(TableName).select("id").eq("user_id", userId).single();

    if (error) throw error;

    req.user.portfolio_id = data.id;

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { getPortfolioMiddleware };
