const HoldingController = require("../../controllers/Holding");

const router = require("express").Router();

router.post("/", HoldingController.getHoldings);

module.exports = router;
