import bcrypt from "bcrypt";
import express from "express";

import { verifyToken } from "../utils/verify";
import { User } from "../models/User";

const router = express.Router();

router.get("/", async (_, res) => {
  res.status(403).send();
});

router.get("/getUsers", verifyToken, async (req, res) => {
  const users = await User.find();
  const formatted = users.map((d) => ({
    _id: d._id,
    email: d.email,
    firstName: d.firstName,
    lastName: d.lastName,
  }));
  res.status(200).send({ result: formatted, success: true });
});

router.get("/getUser", verifyToken, async (req, res) => {
  const { userId } = req.query;
  const userData = await User.find({ _id: userId });

  res.status(200).send({ result: userData, success: true });
});

router.put("/edit", verifyToken, async (req, res) => {
  const { id, firstName, lastName } = req.body;

  if (!id || !firstName || !lastName) {
    return res
      .status(200)
      .send({ result: "Хэрэглэгч олдсонгүй", success: false });
  }

  const result = await User.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      firstName,
      lastName,
    }
  );
  if (!result?._id)
    return res.status(500).send({
      result: null,
      success: false,
    });

  return res
    .status(200)
    .send({ result: "Амжилттай хадгалагдлаа", success: true });
});

router.post("/reset", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(200)
      .send({ result: "Хэрэглэгч олдсонгүй", success: false });
  }

  const hashPass = bcrypt.hashSync(password, 12);

  const result = await User.findByIdAndUpdate(
    {
      _id: id,
    },
    Object.assign({ password: hashPass })
  );

  if (!result?._id)
    return res.status(500).send({
      result: null,
      success: false,
    });

  return res
    .status(200)
    .send({ result: "Амжилттай хадгалагдлаа", success: true });
});

router.post("/delete", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res
      .status(200)
      .send({ success: false, result: "Хэрэглэгчийн userId-г оруулна уу." });
  }
  await User.findByIdAndDelete({ _id: userId });
  res.status(200).send({
    result: userId,
    success: true,
  });
});

module.exports = router;
