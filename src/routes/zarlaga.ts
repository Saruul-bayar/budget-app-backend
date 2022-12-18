import express from "express";
import { Zarlaga } from "../models/Zarlaga";
import { verifyToken } from "../utils/verify";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(403).send();
});

router.get("/getZarlaga", verifyToken, async (req, res) => {
  const { userId } = req.query;

  const budgets = await Zarlaga.find({ userId });
  const formatted = budgets.map((d) => ({
    _id: d._id,
    zarlaga: d.zarlaga,
    date: d.date,
    detail: d.detail,
  }));
  res.status(200).send({ result: formatted, success: true });
});

router.post("/addZarlaga", async (req, res) => {
  const { userId } = req.query;
  const { zarlaga, date, detail } = req.body;

  if (!req.body.zarlaga) {
    return res
      .status(200)
      .send({ result: "Зарлагаа оруулна уу.", success: false });
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

  const budget = new Zarlaga({
    zarlaga,
    date,
    detail,
    userId,
  });

  await budget.save();
  return res.status(200).send({
    result: budget,
    success: true,
    message: "Амжилттай бүртгэгдлээ.",
  });
});

router.delete("/deleteZarlaga", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(200)
      .send({ result: "zarlagaId-г оруулна уу.", success: false });
  }
  await Zarlaga.findByIdAndDelete({ _id: id });
  res.status(200).send({
    result: id,
    success: true,
  });
});

module.exports = router;
