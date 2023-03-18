import mongoose from "mongoose";

const Connection = async (password = "1A96dUJOp3ZV4zgL") => {
  const URL = `mongodb+srv://vanshul_dahiya:${password}@cluster0.ozbxsve.mongodb.net/?retryWrites=true&w=majority`;
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
