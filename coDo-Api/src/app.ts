import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from "path";

(async () => {
  await createConnection({
    type: "postgres",
    database: "vstodo",
    logging: !__prod__,
    username: process.env.POSGRESS_DB_USERNAME,
    password: process.env.POSGRESS_DB_PASSWORD,
    entities: [join(__dirname, "./entities/*.*")],
    synchronize: !__prod__,
  });
  const app = express();
  app.get("/", (_req: any, res: any) => {
    res.send("Hello world");
  });
  app.listen(4000, () => {
    console.log(`Server is up and running on http://localhost:4000`);
  });
})();
