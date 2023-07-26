const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");
const Coupan = require("../Models/Coupan");

const CreateCoupan = asyncHandler(async (req, res) => {
  try {
    const newCoupan = await Coupan.create(req.body);
    res.json(newCoupan);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllcoupan = asyncHandler(async (req, res) => {
  try {
    const getallcoupan = await Coupan.find();
    res.json(getallcoupan);
  } catch (error) {
    throw new Error(error);
  }
});

const UpdateCoupan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatecoupan = await Coupan.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecoupan);
  } catch (error) {
    throw new Error(error);
  }
});

const DelateCoupan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecoupan = await Coupan.findByIdAndDelete(id);
    res.json(deletecoupan);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { CreateCoupan, getAllcoupan, UpdateCoupan, DelateCoupan };
