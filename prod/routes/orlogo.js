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
const verify_1 = require("../utils/verify");
const Orlogo_1 = require("../models/Orlogo");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.status(403).send();
});
router.get("/getOrlogo", verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const budgets = yield Orlogo_1.Orlogo.find({ userId });
    const formatted = budgets.map((d) => ({
        _id: d._id,
        orlogo: d.orlogo,
        date: d.date,
        detail: d.detail,
    }));
    res.status(200).send({ result: formatted, success: true });
}));
router.post("/addOrlogo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const newOrlogo = new Orlogo_1.Orlogo({
        orlogo,
        date,
        detail,
        userId,
    });
    yield newOrlogo.save();
    return res.status(200).send({
        result: newOrlogo,
        success: true,
        message: "Амжилттай бүртгэгдлээ.",
    });
}));
router.delete("/deleteOrlogo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    console.log(id);
    if (!id) {
        return res
            .status(200)
            .send({ result: "Орлогын ID-г оруулна уу.", success: false });
    }
    yield Orlogo_1.Orlogo.findByIdAndDelete({ _id: id });
    res.status(200).send({
        result: id,
        success: true,
    });
}));
module.exports = router;
