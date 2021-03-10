import express from "express";

(async () => {
  const app = express();
  app.get("/", (_req: any, res: any) => {
    res.send("Hello world");
  });
  app.listen(4000, () => {
    console.log(`Server is up and running on http://localhost:4000`);
  });
})();
