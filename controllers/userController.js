const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const Product = require("../Model/ProductModel");
const User = require("../Model/UserModel");
const Review = require("../Model/ReviewModel");
const generateAuthToken = require("../utils/generateAuthToken");
const getUser = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users || users.length === 0) {
      return res.json([]); // or return an empty array []
    }
    return res.json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  console.log("registerUser");
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }
    const userExists = await User.findOne({ email: email }).exec();
    if (userExists) {
      console.log(userExists);
      return res.status(400).send("user exists");
    }
    console.log("yes1");
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      name,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    res
      .cookie(
        "access_token",
        generateAuthToken(user._id, name, lastName, email, user.isAdmin),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        }
      )
      .status(201)
      .json({
        success: "User Created",
        userCreated: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    res.end();
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    console.log("login");
    const { email, password, doNotLogout } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }
    const user = await User.findOne({ email }).orFail();
    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
      }

      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        )
        .status(201)
        .json({
          success: "User Logged in",
          userLoggedIn: {
            id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const writeReview = async (req, res, next) => {
  try {
    //transaction
    const session = await Review.startSession();
    const { comment, rating } = req.body;
    //validate req
    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required");
    }
    const objectId = require("mongodb").ObjectId;
    let reviewId = objectId();

    session.startTransaction();
    await Review.create(
      [
        {
          _id: reviewId,
          comment: comment,
          rating: Number(rating),
          user: {
            _id: req.user._id,
            name: req.user.name + " " + req.user.lastName,
          },
        },
      ],
      { session: session }
    );
    const product = await Product.findById(req.params.product_Id)
      .populate("reviews")
      .session(session);
    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("proudct already received");
    }
    let prc = [...product.reviews];
    prc.push({
      rating: rating,
    });
    product.reviews.push(reviewId);
    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      product.rating =
        prc
          .map((item) => Number(item.rating))
          .reduce((sum, item) => sum + item, 0) / reviewsNumber;
    }
    await product.save();

    await session.commitTransaction();
    session.endSession();
    res.send("review created");
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send("user found");
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name lastName email isAdmin")
      .orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    await user.save();
    res.send("user Updated");
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    await user.remove();
    res.send("user deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  writeReview,
  updateUser,
  deleteUser,
};
//basic structure,
// const name=async(req,res,next)=>{
//   try {

//   } catch (error) {
//     next(error)
//   }
// }
