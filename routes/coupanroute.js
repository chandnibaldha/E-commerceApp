const express = require("express");
const {
  CreateCoupan,
  getAllcoupan,
  UpdateCoupan,
  DelateCoupan,
} = require("../controller/coupan");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, CreateCoupan);
router.get("/", authMiddleware, getAllcoupan);
router.put("/:id", authMiddleware, isAdmin, UpdateCoupan);
router.delete("/:id", authMiddleware, isAdmin, DelateCoupan);

module.exports = router;
