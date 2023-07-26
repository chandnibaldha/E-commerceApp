const express = require("express");
const router = express.Router();
const {
    CreateblogCategory,
    UpdateblogCategory,
    DeleteblogCategory,
    GetblogCategory,
    GetAllblogcategory,
} = require("../controller/blogcat");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");

router.post("/", authMiddleware, isAdmin, CreateblogCategory);
router.put("/:id", authMiddleware, isAdmin, UpdateblogCategory);
router.delete("/:id", authMiddleware, isAdmin, DeleteblogCategory);
router.get("/:id", GetblogCategory);
router.get("/",GetAllblogcategory)


module.exports = router;
