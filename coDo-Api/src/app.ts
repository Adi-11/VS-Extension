require("dotenv-safe").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./model/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import Todo from "./model/Todo";
import { isAuth } from "./isAuth";

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
  connectDB();
  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });
  app.use(passport.initialize());
  app.use(express.json());
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/github/callback",
      },
      async (_accessToken: string, _refreshToken: string, profile, cb) => {
        console.log(profile);
        let user = await User.findOne({ gitHubId: profile.id });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await (
            await User.create({
              name: profile.displayName,
              gitHubId: profile.id,
            })
          ).save();
        }
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.gitHubId },
            process.env.JWT_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
      }
    )
  );
  app.use(cors({ origin: "*" }));
  console.log({ User });

  app.get("/", (_req: any, res: any) => {
    res.send("Hello world");
  });

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res: any) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
  app.get("/me", async (req: any, res: any) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
      res.send({ user: null });
      return;
    }
    const token = authToken.split(" ")[1];
    if (!token) {
      res.send({ user: null });
      return;
    }
    let gitHubId: any = "";
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);
      gitHubId = payload.userId;
    } catch (error) {
      res.send({ user: null });
      return;
    }

    if (!gitHubId) {
      res.send({ user: null });
      return;
    }
    const user = await User.findOne({ gitHubId });
    res.send({ user });
  });

  app.get("/todo", isAuth, async (req, res: any) => {
    const todos: any = await Todo.find({ createrId: req.UserId });
    res.send({ todos });
  });

  app.post("/todo", isAuth, async (req, res: any) => {
    const todo = await (
      await Todo.create({ text: req.body.text, createrId: req.UserId })
    ).save();
    res.send({ todo });
  });

  app.put("/todo", isAuth, async (req, res: any) => {
    const todo = await Todo.findOne({ _id: req.body.id });
    if (!todo) {
      res.send({ todo: null });
      return;
    }

    if (todo.createrId !== req.UserId) {
      throw new Error("Not Authorized");
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.send({ todo });
  });

  app.listen(4000, () => {
    console.log(`Server is up on http://localhost:4000`);
  });
})();
