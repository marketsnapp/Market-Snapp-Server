const TransactionController = require("../../controllers/Transaction");

const router = require("express").Router();

router.post("/add", TransactionController.addTransaction);

router.get("/", TransactionController.getTransactions);

module.exports = router;
