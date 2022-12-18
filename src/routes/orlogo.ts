import { verifyToken } from "../utils/verify";
import { Orlogo } from "../models/Orlogo";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(403).send();
});

router.get("/getOrlogo", verifyToken, async (req, res) => {
  const { userId } = req.query;

  const budgets = await Orlogo.find({ userId });

  const formatted = budgets.map((d) => ({
    _id: d._id,
    orlogo: d.orlogo,
    date: d.date,
    detail: d.detail,
  }));
  res.status(200).send({ result: formatted, success: true });
});

router.post("/addOrlogo", async (req, res) => {
  const { userId } = req.query;
  const { orlogo, date, detail } = req.body;

  if (!req.body.orlogo) {
    return res
      .status(200)
      .send({ result: "Орлогоо оруулна уу.", success: false });
  }
  if (!req.body.date) {
    return res
      .status(200)
      .send({ result: "Өдрөө оруулна уу.", success: false });
  }
  if (!req.body.detail) {
    return res
      .status(200)
      .send({ result: "Утгаа оруулна уу.", success: false });
  }
  const newOrlogo = new Orlogo({
    orlogo,
    date,
    detail,
    userId,
  });
  await newOrlogo.save();

  return res.status(200).send({
    result: newOrlogo,
    success: true,
    message: "Амжилттай бүртгэгдлээ.",
  });
});

router.delete("/deleteOrlogo", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  if (!id) {
    return res
      .status(200)
      .send({ result: "Орлогын ID-г оруулна уу.", success: false });
  }
  await Orlogo.findByIdAndDelete({ _id: id });
  res.status(200).send({
    result: id,
    success: true,
  });
});

module.exports = router;
