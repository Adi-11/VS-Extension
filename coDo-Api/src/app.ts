require("dotenv-safe").config();
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";
import passport from "passport";
import cors from "cors";
import { Strategy as GitHubStrategy } from "passport-github";
import jwt from "jsonwebtoken";
import { isAuth } from "./isAuth";
import { Todo } from "./entities/Todo";

(async () => {
  const app = express();
  await createConnection({
    type: "postgres",
    database: "vstodo",
    logging: !__prod__,
    username: process.env.POSGRESS_DB_USERNAME,
    password: process.env.POSGRESS_DB_PASSWORD,
    entities: [join(__dirname, "./entities/*.*")],
    synchronize: !__prod__,
  });
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
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }

        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1y",
          }),
        });
      }
    )
  );
  app.use(cors({ origin: "*" }));

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
    const user = await User.findOne({});
    res.send({ user });
  });

  app.get("/todo", isAuth, async (req, res: any) => {
    const todos: any = await Todo.find({
      where: { creatorId: req.UserId },
      order: { id: "DESC" },
    });
    res.send({ todos });
  });

  app.post("/todo", isAuth, async (req: any, res: any) => {
    const todo = await Todo.create({
      text: req.body.text,
      creatorId: req.UserId,
    }).save();
    res.send({ todo });
  });

  app.put("/todo", isAuth, async (req, res: any) => {
    const todo = await Todo.findOne(req.body.id);
    if (!todo) {
      res.send({ todo: null });
      return;
    }

    todo.completed = !todo?.completed;
    await todo.save();
    res.send({ todo });
  });

  app.listen(4000, () => {
    console.log(`Server is up and running on http://localhost:4000`);
  });
})();
