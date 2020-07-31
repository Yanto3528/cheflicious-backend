const mongoose = require("mongoose");

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to database");
};

module.exports = connectDB;
