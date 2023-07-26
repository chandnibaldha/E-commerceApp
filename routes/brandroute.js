const express = require("express");
const router = express.Router();
const {
  CreateBrand,
  UpdateBrand,
  DeleteBrand,
  GetBrand,
  GetAllBrand,
} = require("../controller/brand");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");

router.post("/create-Brand", authMiddleware, isAdmin, CreateBrand);
router.put("/:id",authMiddleware,isAdmin, UpdateBrand);
router.delete("/:id",authMiddleware,isAdmin, DeleteBrand);
router.get("/:id", GetBrand);
router.get("/", GetAllBrand);

module.exports = router;
