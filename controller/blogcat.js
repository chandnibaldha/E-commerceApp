const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");
const BlogCat = require("../Models/BlogCat");

const CreateblogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCat.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const UpdateblogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatecategory = await BlogCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecategory);
    // console.log(updatecategory);
  } catch (error) {
    throw new Error(error);
  }
});

const DeleteblogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecategory = await BlogCat.findByIdAndDelete(id);
    res.json(deletecategory);
  } catch (error) {
    throw new Error(error);
  }
});

const GetblogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCategory = await BlogCat.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const GetAllblogcategory = asyncHandler(async (req, res) => {
  try {
    const getsCategory = await BlogCat.find();
    res.json(getsCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  CreateblogCategory,
  UpdateblogCategory,
  DeleteblogCategory,
  GetblogCategory,
  GetAllblogcategory,
};
