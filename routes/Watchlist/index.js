const WatchlistController = require("../../controllers/Watchlist");

const router = require("express").Router();

router.post("/add", WatchlistController.addWatchlist);

router.post("/remove", WatchlistController.removeWatchlist);

router.get("/", WatchlistController.getWatchlistedCryptocurrenciesSymbol);

module.exports = router;
