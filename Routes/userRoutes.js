const express=require("express")
const { registerUser,loginUser,updateUserProfile,getUserProfile ,writeReview,updateUser,getUsers ,getUser,deleteUser} = require("../controllers/userController")
const router=express()
const {verifyIsLoggedIn ,verifyIsAdmin} = require("../middleware/verifyAuthToken");


router.post("/register", registerUser)
router.post("/login", loginUser)

//user logged in routes
router.use(verifyIsLoggedIn)
router.put("/profile",updateUserProfile)
router.get("/profile/:id",getUserProfile)
router.post("/review/:productTd", writeReview)


//user logged in routes

//admin Routes
router.use(verifyIsAdmin)
router.get("/",getUser)
router.get("/:id",getUsers)
router.put("/:id",updateUser)
router.delete("/:id",deleteUser)

module.exports=router