const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");
const BrandModel = require("../Models/BrandModel");

const CreateBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await BrandModel.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const UpdateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBrand = await BlogCat.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBrand);
    // console.log(updatecategory);
  } catch (error) {
    throw new Error(error);
  }
});

const DeleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBrand = await BlogCat.findByIdAndDelete(id);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const GetBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBrand = await BlogCat.findById(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const GetAllBrand = asyncHandler(async (req, res) => {
  try {
    const getsBrand = await BlogCat.find();
    res.json(getsBrand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  CreateBrand,
  UpdateBrand,
  DeleteBrand,
  GetBrand,
  GetAllBrand,
};
