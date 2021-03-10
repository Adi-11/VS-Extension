require("dotenv-safe").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./model/User";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`DataBase connected ${conn.connection.host}`);
    mongoose.set("debug", true);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

(async () => {
  const app = express();
  app.use(cors({ origin: "*" }));
  connectDB();
  console.log(User);
  app.get("/", (_req: any, res: any) => {
    res.send("Hello world");
  });
  app.listen(4000, () => {
    console.log(`Server is up and running on http://localhost:4000`);
  });
})();
