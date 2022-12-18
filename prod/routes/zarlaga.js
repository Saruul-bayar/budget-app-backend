"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Zarlaga_1 = require("../models/Zarlaga");
const verify_1 = require("../utils/verify");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.status(403).send();
});
router.get("/getZarlaga", verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const budgets = yield Zarlaga_1.Zarlaga.find({ userId });
    const formatted = budgets.map((d) => ({
        _id: d._id,
        zarlaga: d.zarlaga,
        date: d.date,
        detail: d.detail,
    }));
    res.status(200).send({ result: formatted, success: true });
}));
router.post("/addZarlaga", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const budget = new Zarlaga_1.Zarlaga({
        zarlaga,
        date,
        detail,
        userId,
    });
    yield budget.save();
    return res.status(200).send({
        result: budget,
        success: true,
        message: "Амжилттай бүртгэгдлээ.",
    });
}));
router.delete("/deleteZarlaga", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id) {
        return res
            .status(200)
            .send({ result: "zarlagaId-г оруулна уу.", success: false });
    }
    yield Zarlaga_1.Zarlaga.findByIdAndDelete({ _id: id });
    res.status(200).send({
        result: id,
        success: true,
    });
}));
module.exports = router;
