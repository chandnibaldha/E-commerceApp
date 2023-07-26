const User = require("../Models/User");
const asyncHandler = require("express-async-handler");
const { JsonToken } = require("../config/Token");
const uniqid = require("uniqid");
const validateMongoDbId = require("../utils/validateMongodb");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const Product = require("../Models/Product");
const Cart = require("../Models/Cart");
const Coupan = require("../Models/Coupan");
const Order = require("../Models/Order");
//const Order = require("../Models/Order");
const JWT_SC = "ABC";

// signup user
const CreateUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  // console.log(email)
  const newUser = await User.findOne({ email });
  if (!newUser) {
    const newone = await User.create(req.body);
    res.json(newone);
    // console.log(req.body)
  } else {
    throw new Error("User Already Exists");
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  //console.log(findUser);
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const Updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      Token: JsonToken(findUser?._id),
    });
  } else {
    throw new Error("invalid Credentials");
  }
});

const loginAdminUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const Updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      Token: JsonToken(findAdmin?._id),
    });
  } else {
    throw new Error("invalid Credentials");
  }
});

//save the user
const SaveUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const saveuser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(saveuser);
  } catch (error) {
    throw new Error(error);
  }
});

// getAll user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// get the singal user

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getuser = await User.findById(id);
    res.json({
      getuser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// handle refresh token
const handalRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present in db or not matched");
  jwt.verify(refreshToken, JWT_SC, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = JsonToken(user?._id);
    res.json({ accessToken });
  });
});

//logout functionality
const Logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204);
  }
  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    {
      refreshToken: " ",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

// update the user
const UpdateUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const Updateuser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true,
      }
    );
    res.json(Updateuser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete the user

const DeleteUser = asyncHandler(async (req, res) => {
  // console.log(id);
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteuser = await User.findByIdAndDelete(id);
    res.json({
      deleteuser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedpassword = await User.save();
    res.json(updatedpassword);
  } else {
    res.json(user);
  }
});

const forgotpasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi,please follow this link to reset Your password.This link is valid till 10 minutes from now.`;
  } catch (error) {
    throw new Error(error);
  }
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
    //console.log(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    await Cart.deleteOne({ orderby: user._id });
    let products = [];
    let cartTotal = 0;
    if (Array.isArray(cart)) {
      products = await Promise.all(
        cart.map(async (item) => {
          const getPrice = await Product.findById(item.product)
            .select("price")
            .exec();
          const product = {
            product: item.product,
            count: item.count,
            color: item.color,
            price: parseInt(getPrice.price, 10),
          };
          return product;
          // console.log(map);
        })
      );
      const cartTotal = products.reduce((total, product) => {
        // console.log(`Calculating: ${product.price} * ${product.count}`);
        return total + product.price * product.count;
        // console.log(cartTotal);
      }, 0);
    }
    console.log("Cart Total:", cartTotal);
    const newCart = await Cart.create({
      products,
      cartTotal,
      orderby: user._id,
    });
    res.json(newCart);
    console.log(products, cartTotal);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).exec();
    //console.log(cart);
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupan } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  // console.log(`Coupan: ${coupan}`);
  //console.log(req.body.coupan);
  const validCoupon = await Coupan.findOne({ name: coupan });
  if (!validCoupon) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let cartTotal = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, coupanApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  //console.log(COD,coupanApplied);
  try {
    if (!COD) throw new Error("Create cash order failed");
    //console.log(COD);
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (coupanApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
      console.log(userCart);
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "IND",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    console.log(newOrder);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  CreateUser,
  loginUser,
  getAllUser,
  getUser,
  DeleteUser,
  UpdateUser,
  blockUser,
  unblockUser,
  handalRefreshToken,
  Logout,
  updatePassword,
  loginAdminUser,
  getWishlist,
  SaveUser,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
};
