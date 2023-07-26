const jwt = require("jsonwebtoken");
const JWT_SC = "ABC";

const JsonToken = (id) => {
  return jwt.sign({ id },JWT_SC, { expiresIn: "1d" });
};

module.exports = { JsonToken };