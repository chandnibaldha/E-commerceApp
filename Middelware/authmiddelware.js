const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const JWT_SC = "ABC";
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      throw new Error("No token attached to the header");
    }
    const decode = jwt.verify(token, JWT_SC);
    const user = await User.findById(decode.id);
    req.user = user;
    next();
   // console.log(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  //console.log(req.user);
  const { email } = req.user;
  const adminuser = await User.findOne({ email });
  if (adminuser.role !== "admin") {
    throw new Error("You are not Admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
