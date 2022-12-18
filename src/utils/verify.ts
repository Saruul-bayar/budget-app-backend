import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(200).send({
      success: false,
      result: "Та нэвтрээгүй байна.",
    });
  }

  const token = authHeader?.toString().split(" ")[1];

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
  }

  if (!token) {
    return res.status(200).send({
      success: false,
      result: "Та нэвтрээгүй байна.",
    });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.status(403);
      req.user = decoded.id;
      next();
    }
  );
};
