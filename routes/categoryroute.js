const express = require("express");
const router = express.Router();
const {
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  GetCategory,
  GetAllcategory
} = require("../controller/category");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");

router.post("/createcategory", authMiddleware, isAdmin, CreateCategory);
router.put("/:id", authMiddleware, isAdmin, UpdateCategory);
router.delete("/:id", authMiddleware, isAdmin, DeleteCategory);
router.get("/:id", GetCategory);
router.get("/",GetAllcategory)
module.exports = router;
