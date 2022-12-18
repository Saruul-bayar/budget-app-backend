import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerator";

const router = express.Router();

router.get("/", async (_, res) => {
  res.status(403).send();
});

router.get(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401);
    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: "FORBIDDEN" });

        const foundUser = await User.findOne({ email: decoded.email });
        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = generateAccessToken(foundUser);

        res.cookie("jwt", accessToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.status(200).json({ accessToken });
        next();
      }
    );
  }
);

router.post("/logout", async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "COOKIE CLEARED" });
});

router.post("/login", async (req, res) => {
  const message = "Имэйл эсвэл нууц үг буруу байна.";

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).send({ success: false, result: message });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).send({ success: false, result: message });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(200).send({ success: false, result: message });
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).send({
    accessToken: accessToken,
    private: user,
    success: true,
  });
});

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email) {
    return res
      .status(200)
      .send({ result: "Нэвтрэх нэрээ оруулна уу.", success: false });
  }
  if (!password) {
    return res
      .status(200)
      .send({ result: "Нууц үгээ оруулна уу.", success: false });
  }
  if (!firstName) {
    return res
      .status(200)
      .send({ result: "Нэрээ оруулна уу.", success: false });
  }
  if (!lastName) {
    return res
      .status(200)
      .send({ result: "Овгоо оруулна уу.", success: false });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res
      .status(200)
      .send({ result: "Бүртгэлтэй хэрэглэгч байна.", success: false });
  }

  const user = new User({
    email,
    password,
    firstName,
    lastName,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
  }

  await user.save();
  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).send({
    result: accessToken,
    private: email,
    success: true,
  });
});

module.exports = router;
