const jwt=require("jsonwebtoken")
const verifyIsLoggedIn = (req, res, next) => {
  return next()
  try {
    console.log("verifyLoggedIn")
    const token = req.cookies.access_token;
    if(!token){
        return res.status(403).send("A token is required for authentication")
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    } catch (error) {
        return res.status(403).send("Unauthorized Invalid Token")
    }
  } catch (error) {
    next(error);
  }
};

const verifyIsAdmin=(req,res,next)=>{
  return next()
  console.log("verifyIsAdmin")
    if(req.user && req.user.isAdmin){
        next()
    }
    else{
        res.status(401).send("Unauthorized , Admin Re quired")
    }
}
module.exports = {verifyIsLoggedIn , verifyIsAdmin};
