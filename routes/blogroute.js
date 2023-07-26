const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  DeleteBlog,
  LikedBlog,
  uploadImages
} = require("../controller/blog");
const { authMiddleware, isAdmin } = require("../Middelware/authmiddelware");
const { uploadPhoto,blogImgResize } = require("../Middelware/uploadImage");

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),blogImgResize,uploadImages)
router.put("/likes", authMiddleware, LikedBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/getallblog", getAllBlog);
router.get("/:id", getBlog);
router.delete("/:id", authMiddleware, isAdmin, DeleteBlog);
module.exports = router;
