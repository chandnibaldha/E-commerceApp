const Blog = require("../Models/Blog");
const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newblog = await Blog.create(req.body);
    res.json(newblog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id);
    const numViews = parseInt(getBlog.numViews) || 0;
    const Updatesblog = await Blog.findByIdAndUpdate(
      id,
      { $set: { numViews: numViews + 1 } },
      { new: true }
    );
    res.json(Updatesblog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlog = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  try {
    const GetallBlog = await Blog.find();
    res.json(GetallBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const DeleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteblog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteblog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const LikedBlog = asyncHandler(async (req, res) => {
  blogId = req.body;
  const blog = await Blog.findByIdAndUpdate(
    req.body.blogId,
    {
      $push: { Likes: req.user._id },
    },
    { new: true }
  );
  res.json(blog);
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploder = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = uploder(path);
      console.log(newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
      console.log(path);
    }
    const finalBlogs = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(finalBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  DeleteBlog,
  LikedBlog,
  uploadImages,
};
