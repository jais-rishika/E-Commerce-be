const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7h" }
  );
};
module.exports = generateAuthToken;
