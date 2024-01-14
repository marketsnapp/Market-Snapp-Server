const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const cryptocurrencyRouter = require("./routes/Cryptocurrency");
const authRouter = require("./routes/Auth");
const watchlistRouter = require("./routes/Watchlist");
const transactionRouter = require("./routes/Transaction");
const holdingRouter = require("./routes/Holding");
const sortMarket = require("./marketSorterWorker");
const windowMarket = require("./marketWindowWorker");
const market = require("./marketMap");
const WindowSize = require("./enums/WindowSize");
const cryptocurrencyWindowSizeGenerator = require("./utils/cryptocurrencyWindowSizeGenerator");
const { jwtMiddleware } = require("./middlewares/JWT");
const { getPortfolioMiddleware } = require("./middlewares/Transaction");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5000;

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/cryptocurrency", cryptocurrencyRouter);
app.use("/auth", authRouter);
app.use("/watchlist", jwtMiddleware, watchlistRouter);
app.use("/transaction", jwtMiddleware, getPortfolioMiddleware, transactionRouter);
app.use("/portfolio", jwtMiddleware, getPortfolioMiddleware, holdingRouter);

const setInitialDataAndStartServer = async () => {
  await sortMarket();
  await windowMarket();

  server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    setInterval(sortMarket, 5 * 1000);
    setInterval(windowMarket, 60 * 1000);
  });
};

io.of("/cryptocurrency").on("connection", (socket) => {
  console.log("Kullanıcı bağlandı:", socket.id);
  const symbol = socket.handshake.query.symbol;

  let currentWindowSize = WindowSize["24 Hours"];

  const sendMarketData = () => {
    let marketData = [];

    if (!symbol) {
      market.CryptocurrencySymbolsSortedByMarketCap.forEach((key) => {
        const { id, price, market_cap, is_last_price_up } = market.Cryptocurrency[key];
        const { price_change, price_change_percent, open_price, high_price, low_price, volume } = market.Cryptocurrency[key][currentWindowSize];

        marketData.push({
          id,
          symbol: key,
          price,
          market_cap,
          is_last_price_up,
          [currentWindowSize]: {
            price_change,
            price_change_percent,
          },
        });
      });
    } else {
      const { price, market_cap, is_last_price_up } = market.Cryptocurrency[symbol];

      marketData = {
        price,
        market_cap,
        is_last_price_up,
        ...market.Cryptocurrency[symbol][currentWindowSize],
      };
    }
    socket.emit("marketData", marketData);
  };

  const marketDataInterval = setInterval(sendMarketData, 3000);

  socket.on("changeWindowSize", (newWindowSize) => {
    currentWindowSize = cryptocurrencyWindowSizeGenerator(newWindowSize);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
    clearInterval(marketDataInterval);
  });
});

setInitialDataAndStartServer();
