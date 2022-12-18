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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const verify_1 = require("../utils/verify");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(403).send();
}));
router.get("/getUsers", verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find();
    const formatted = users.map((d) => ({
        _id: d._id,
        email: d.email,
        firstName: d.firstName,
        lastName: d.lastName,
    }));
    res.status(200).send({ result: formatted, success: true });
}));
router.get("/getUser", verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const userData = yield User_1.User.find({ _id: userId });
    res.status(200).send({ result: userData, success: true });
}));
router.put("/edit", verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, firstName, lastName } = req.body;
    if (!id || !firstName || !lastName) {
        return res
            .status(200)
            .send({ result: "Хэрэглэгч олдсонгүй", success: false });
    }
    const result = yield User_1.User.findByIdAndUpdate({
        _id: id,
    }, {
        firstName,
        lastName,
    });
    if (!(result === null || result === void 0 ? void 0 : result._id))
        return res.status(500).send({
            result: null,
            success: false,
        });
    return res
        .status(200)
        .send({ result: "Амжилттай хадгалагдлаа", success: true });
}));
router.post("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = req.body;
    if (!id || !password) {
        return res
            .status(200)
            .send({ result: "Хэрэглэгч олдсонгүй", success: false });
    }
    const hashPass = bcrypt_1.default.hashSync(password, 12);
    const result = yield User_1.User.findByIdAndUpdate({
        _id: id,
    }, Object.assign({ password: hashPass }));
    if (!(result === null || result === void 0 ? void 0 : result._id))
        return res.status(500).send({
            result: null,
            success: false,
        });
    return res
        .status(200)
        .send({ result: "Амжилттай хадгалагдлаа", success: true });
}));
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res
            .status(200)
            .send({ success: false, result: "Хэрэглэгчийн userId-г оруулна уу." });
    }
    yield User_1.User.findByIdAndDelete({ _id: userId });
    res.status(200).send({
        result: userId,
        success: true,
    });
}));
module.exports = router;
