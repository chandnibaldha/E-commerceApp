const Product = require("../Models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../Models/User");
const validateMongoDbId = require("../utils/validateMongodb");
const cloudinaryUploadImg = require("../utils/Cloudinary");

const Createproduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllproduct = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte)\b/g, (match) => `${match}`);
    let query = Product.find(JSON.parse(queryStr));
    console.log(query, excludeFields);

    // Sorting
    if (req.query.sort) {
      const SortBy = req.query.sort.split(",").join(" ");
      query = query.sort(SortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exists");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const UpdateProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  // console.log(id)
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json(updateProduct);
    //console.log(updateProduct);
  } catch (error) {
    throw new Error(error);
    //console.log(error);
  }
});

const DeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const Deleteproduct = await Product.findOneAndDelete(id);
    res.json(DeleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prod_id } = req.body;
  try {
    const user = await User.findById(_id);
    const allreadyuser = user.wishlist.find((id) => id.toString() === prod_id);
    if (allreadyuser) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prod_id },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prod_id },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prod_id, comment } = req.body;
  console.log(req.body.comment);
  try {
    const product = await Product.findById(prod_id);
    const allreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (allreadyRated) {
      const updateRating = await Product.updateOne(
        { ratings: { $elemMatch: allreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
      // console.log(allreadyRated.comment);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prod_id,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      // console.log(rateProduct);
    }

    const getAllRating = await Product.findById(prod_id);
    let totalRating = getAllRating.ratings.length;
    let ratingsum = getAllRating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prod_id,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
    //console.log(finalProduct);
  } catch (error) {
    throw new Error(error);
    // console.log(error);
  }
});

const uploadImagess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploder = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = uploder(path);
      //console.log(newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const finalProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
          // console.log(file)
        }),
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
    // console.log(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  validateMongoDbId(id);
  try {
    const uploader = async (path) => {
      const result = await cloudinaryUploadImg(path, "images");
      return result.url; // Assuming `cloudinaryUploadImg` returns an object with `url` property
    };
    // console.log(uploader);
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const finalProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls,
      },
      {
        new: true,
      }
    );

    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  Createproduct,
  getProduct,
  getAllproduct,
  UpdateProduct,
  DeleteProduct,
  addToWishList,
  rating,
  uploadImages,
};
