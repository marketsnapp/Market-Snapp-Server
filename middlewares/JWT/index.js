const { validateToken } = require("../../services/JWT");

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ status: false, message: "You are not logged in" });

  try {
    const verified = validateToken(token);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { jwtMiddleware };
