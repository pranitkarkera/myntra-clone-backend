const jwt = require("jsonwebtoken");

const ensureAuthenticated = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  try {
    const token = auth.split(" ")[1];
    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
