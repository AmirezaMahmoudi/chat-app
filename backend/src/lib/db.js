import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log(`DB connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
