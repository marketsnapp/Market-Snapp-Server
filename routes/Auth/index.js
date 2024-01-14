const router = require("express").Router();
const AuthController = require("../../controllers/Auth");

router.get("/user", AuthController.getUser);

router.post("/login", AuthController.loginUser);

router.post("/sign-up", AuthController.registerUser);

module.exports = router;
