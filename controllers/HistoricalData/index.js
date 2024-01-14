const axios = require("axios");
const cryptocurrencyWindowSizeGenerator = require("../../utils/cryptocurrencyWindowSizeGenerator");
const WindowSize = require("../../enums/WindowSize");

const getChartData = async (req, res) => {
  const cryptocurrencySymbol = req.params.symbol;
  let windowSize = cryptocurrencyWindowSizeGenerator(req.query.windowSize);
  let limit = 24;

  try {
    if (windowSize == WindowSize["24 Hours"]) windowSize = "1h";
    else if (windowSize == WindowSize["1 Hour"]) {
      limit = 60;
      windowSize = "1m";
    } else if (windowSize == WindowSize["7 Days"]) {
      limit = 42;
      windowSize = "4h";
    }

    const { data } = await axios.get(`https://api.binance.com/api/v3/uiKlines?symbol=${cryptocurrencySymbol}USDT&limit=${limit}&interval=${windowSize}`);
    const processedData = data.map(([open_time, , , , close_price]) => {
      return { open_time, close_price };
    });

    return res.status(200).json({ status: true, message: "Historical data retrieved successfully.", data: processedData });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { getChartData };
