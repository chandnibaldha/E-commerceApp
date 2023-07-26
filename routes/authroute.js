const express = require("express");
const {
  CreateUser,
  updatePassword,
  loginUser,
  getAllUser,
  getUser,
  handalRefreshToken,
  Logout,
  DeleteUser,
  UpdateUser,
  blockUser,
  unblockUser,
  loginAdminUser,
  getWishlist,
  SaveUser,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
} = require("../controller/user");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");
const router = express.Router();
router.post("/register", CreateUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post("/admin-user", loginAdminUser);
router.post("/cart", authMiddleware, userCart);

router.get("/get-cart", authMiddleware, getUserCart);
router.delete("/empty", authMiddleware, emptyCart);
router.post("/cart/coupan", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.post("/getwish", authMiddleware, getWishlist);
router.get("/get-alluser", getAllUser);
router.get("/refreshToken", handalRefreshToken);
router.get("/logout", Logout);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", DeleteUser);
router.put("/edit-user", authMiddleware, UpdateUser);
router.put("/save-address", authMiddleware, SaveUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.post("/create-order", authMiddleware, createOrder);
module.exports = router;
