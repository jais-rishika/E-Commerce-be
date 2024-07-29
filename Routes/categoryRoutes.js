const express=require("express")
const router=express()
// const {verifyIsLoggedIn ,verifyIsAdmin} = require("../middleware/verifyAuthToken");


const {getCategories, saveAttr}=require("../controllers/categoryController")

// router.use(verifyIsLoggedIn)
// router.use(verifyIsAdmin)
router.get("/",getCategories)
router.post("/attribute",saveAttr)

module.exports=router