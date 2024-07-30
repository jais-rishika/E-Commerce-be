const express=require("express")
const router=express()
// const {verifyIsLoggedIn ,verifyIsAdmin} = require("../middleware/verifyAuthToken");


const {getCategories, saveAttr, newCategory,deleteCategory}=require("../controllers/categoryController")

// router.use(verifyIsLoggedIn)
// router.use(verifyIsAdmin)
router.get("/",getCategories)
router.post("/",newCategory)
router.delete("/:category",deleteCategory)
router.post("/attribute",saveAttr)

module.exports=router