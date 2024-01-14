const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");

const TableName = tableName.Transaction;

const addTransaction = async (req, res) => {
  const { portfolio_id } = req.user;
  const { transaction_type, price, amount, cryptocurrency_id, transaction_date, transaction_note } = req.body;

  try {
    if (!portfolio_id || transaction_type == null || !price || !amount || !cryptocurrency_id || !transaction_date) {
      return res.status(400).json({ status: false, message: "Bad payload." });
    }

    const { data, error } = await supabase.from(TableName).insert({ transaction_type, price, amount, transaction_date, portfolio_id, cryptocurrency_id, transaction_note }).select("*");

    if (error) throw error;

    return res.status(201).json({ status: true, message: "Transaction created successfully.", data });
  } catch (error) {
    print(error);
    return res.status(500).json(error);
  }
};

const getTransactions = async (req, res) => {
  const { portfolio_id } = req.user;
  const { cryptocurrency_id } = req.body;

  try {
    if (!portfolio_id || !cryptocurrency_id) {
      return res.status(400).json({ status: false, message: "Bad payload." });
    }
    const { data, error } = await supabase.from(TableName).select("*").eq("portfolio_id", portfolio_id).eq("cryptocurrency_id", cryptocurrency_id);

    if (error) throw error;

    return res.status(200).json({ status: false, message: "Transaction retrived successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { addTransaction, getTransactions };
