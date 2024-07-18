const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId

const users = [
  {
    _id: ObjectId('6697248f52a69707592ebf17'),
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin@admin.com', 10),
    isAdmin: true,
  },
  {
    _id: ObjectId("6697242f67f854a35a8e91e4"),
    name: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: bcrypt.hashSync('john@doe.com', 10),
  },
]

module.exports = users
