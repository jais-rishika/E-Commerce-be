const express=require("express")
const router=express()
// const {verifyIsLoggedIn ,verifyIsAdmin} = require("../middleware/verifyAuthToken");


getCategories=require("../controllers/categoryController")

// router.use(verifyIsLoggedIn)
// router.use(verifyIsAdmin)
router.get("/",getCategories)

module.exports=router