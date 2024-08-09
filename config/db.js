const mongoose=require("mongoose")


const url = process.env.MONGO_DB.replace('<password>', process.env.PASSWORD);

const dbConnect = () => {
  try {
     mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected truly');
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnect;