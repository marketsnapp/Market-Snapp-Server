const router = require("express").Router();
const CryptocurrencyController = require("../../controllers/Cryptocurrency");
const HistoricalDataController = require("../../controllers/HistoricalData");

router.get("/search", CryptocurrencyController.searchCryptocurrencies);

router.get("/:symbol", CryptocurrencyController.getCryptocurrency);

router.get("/:symbol/historicalData", HistoricalDataController.getChartData);

router.get("/", CryptocurrencyController.getAllCryptocurrencies);

module.exports = router;
