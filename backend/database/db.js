import mongoose from "mongoose";

require("dotenv").config();

const Connection = async (
  username = process.env.USERNAME,
  password = process.env.PASSWORD
) => {
  const URL = `mongodb+srv://${username}:${password}@cluster0.ozbxsve.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("connected db");
  } catch (error) {
    console.log(error);
  }
};

export default Connection;
