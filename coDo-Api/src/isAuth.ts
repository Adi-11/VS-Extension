import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export type ReqWithUserId = Request<{}, any, any, {}> & { UserId: string };

export const isAuth: RequestHandler<{}, any, any, {}> = (
  req: any,
  _res: any,
  next
) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    throw new Error("not authenticated");
  }
  const token = authToken.split(" ")[1];
  if (!token) {
    throw new Error("not authenticated");
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    req.UserId = payload.userId;
    next();
    return;
  } catch (error) {}

  throw new Error("not authenticated");
};
