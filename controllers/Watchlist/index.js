const supabase = require("../../services/Supabase");
const { tableName } = require("../../enums/Supabase");

const TableName = tableName.Watchlist;

const addWatchlist = async (req, res) => {
  const { userId } = req.user;
  const { cryptocurrency_id } = req.body;

  let data = [];
  try {
    const { data: exists, error: existsError } = await supabase.from(TableName).select("*").eq("user_id", userId).eq("cryptocurrency_id", cryptocurrency_id);

    if (existsError) throw existsError;

    if (exists.length == 0) {
      const { data: newData, error: newDataError } = await supabase.from(TableName).insert({ user_id: userId, cryptocurrency_id: cryptocurrency_id }).select("*");

      if (newDataError) throw newDataError;
      data = newData;
    } else {
      return res.status(400).json({ status: false, message: "Already watchlisted" });
    }

    return res.status(201).json({ status: true, message: "Watchlist created successfully.", data });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const removeWatchlist = async (req, res) => {
  const { userId } = req.user;
  const { cryptocurrency_id } = req.body;

  let data = [];
  try {
    const { data: exists, error: existsError } = await supabase.from(TableName).select("*").eq("user_id", userId).eq("cryptocurrency_id", cryptocurrency_id);

    if (existsError) throw existsError;

    if (exists.length == 0) {
      return res.status(200).json({ status: false, message: "Content not found" });
    } else {
      const { data: newData, error: newDataError } = await supabase.from(TableName).delete().eq("user_id", userId).eq("cryptocurrency_id", cryptocurrency_id).select("*");

      if (newDataError) throw newDataError;
      data = newData;
    }

    return res.status(200).json({ status: true, message: "Watchlist removed successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getWatchlistedCryptocurrenciesSymbol = async (req, res) => {
  const { userId } = req.user;

  try {
    const { data, error } = await supabase.from(TableName).select("cryptocurrency_id").eq("user_id", userId);

    if (error) throw error;

    return res.status(200).json({ status: false, message: "Watchlist retrived successfully.", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { addWatchlist, removeWatchlist, getWatchlistedCryptocurrenciesSymbol };
