const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");
const Category = require("../Models/Category");

const CreateCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const UpdateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatecategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecategory);
  } catch (error) {
    throw new Error(error);
  }
});

const DeleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecategory = await Category.findByIdAndDelete(id);
    res.json(deletecategory);
  } catch (error) {
    throw new Error(error);
  }
});

const GetCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getCategory = await Category.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const GetAllcategory = asyncHandler(async (req, res) => {
  try {
    const getsCategory = await Category.find();
    res.json(getsCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  GetCategory,
  GetAllcategory
};
