const connectDB = require("../config/db");
connectDB();

const categoryData = require("./categories");
const productData = require("./products");
const reviewData = require("./reviews");
const userData = require("./users");
const orderData = require("./orders");

const Category = require("../Model/CategoryModel");
const Product = require("../Model/ProductModel");
const Review = require("../Model/ReviewModel");
const User = require("../Model/UserModel");
const Order = require("../Model/OrderModel");
const importData = async () => {
  try {
    await Category.collection.dropIndexes();
    await Product.collection.dropIndexes();

    await Category.collection.deleteMany({})
    await Product.collection.deleteMany({})
    await Review.collection.deleteMany({})
    await User.collection.deleteMany({})
    await Order.collection.deleteMany({})

    if (process.argv[2] !== "-d") {
      await Category.insertMany(categoryData);
      const reviews = await Review.insertMany(reviewData);
      const sampleProducts = productData.map((product) => {
        reviews.map((review) => {
          product.reviews.push(review._id);
        });
        return { ...product };
      });
      await Product.insertMany(sampleProducts);
      await User.insertMany(userData);
      await Order.insertMany(orderData);

      console.log("Seeder data proceeded successfully");
      process.exit();
    }
    console.log("Seeder data deleted successfully")
    process.exit()
  } catch (error) {
    console.error("Error while proccessing seeder data", error);
    process.exit(1);
  }
};
importData();
