const express = require("express");
const {
  getProduct,
  getProductById,
  getBestsellers,
  getAdminProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
} = require("../controllers/productController");
const {verifyLoggedIn ,verifyIsAdmin} = require("../middleware/verifyAuthToken");
const router = express();

router.get("/", getProduct);
router.get("category/:categoryName/search/:searchQuery", getProduct);
router.get("/category/:categoryName", getProduct);
router.get("search/:searchQuery", getProduct);
router.get("/bestsellers", getBestsellers);
router.get("/get-one/:id", getProductById);

//adminRoutes
// router.use(verifyLoggedIn)
// router.use(verifyIsAdmin)
router.get("/admin", getAdminProducts);
router.delete("/admin/:id", adminDeleteProduct);
router.delete("/admin/image/:imagePath/:productId", adminDeleteProductImage);
router.put("/admin/:id", adminUpdateProduct);
router.post("/admin/upload", adminUpload);
router.post("/admin", adminCreateProduct);
module.exports = router;

// 668ec2c2edc6ecedf1238821
