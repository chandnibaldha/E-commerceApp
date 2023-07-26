const express = require("express");
const {
  Createproduct,
  getProduct,
  getAllproduct,
  UpdateProduct,
  DeleteProduct,
  addToWishList,
  rating,
  uploadImages
} = require("../controller/product");
const { isAdmin, authMiddleware } = require("../Middelware/authmiddelware");
const { uploadPhoto,productImgResize } = require("../Middelware/uploadImage");

const router = express.Router();

router.post("/createproduct", authMiddleware, isAdmin, Createproduct);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/ratings",authMiddleware,rating)
router.put("/:id", authMiddleware, isAdmin, UpdateProduct);
router.delete("/:id", authMiddleware, isAdmin, DeleteProduct);
router.get("/", getAllproduct);

module.exports = router;
