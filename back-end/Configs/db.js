const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};
