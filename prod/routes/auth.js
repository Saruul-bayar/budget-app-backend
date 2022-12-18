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
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenGenerator_1 = require("../utils/tokenGenerator");
const router = express_1.default.Router();
router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(403).send();
}));
router.get("/refresh", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.status(401);
    const refreshToken = cookies.jwt;
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: "FORBIDDEN" });
        const foundUser = yield User_1.User.findOne({ email: decoded.email });
        if (!foundUser)
            return res.status(401).json({ message: "Unauthorized" });
        const accessToken = (0, tokenGenerator_1.generateAccessToken)(foundUser);
        res.cookie("jwt", accessToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(200).json({ accessToken });
        next();
    }));
}));
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!cookies.jwt)
        return res.status(401);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ message: "COOKIE CLEARED" });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = "Имэйл эсвэл нууц үг буруу байна.";
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(200).send({ success: false, result: message });
    }
    const user = yield User_1.User.findOne({ email });
    if (!user) {
        return res.status(200).send({ success: false, result: message });
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return res.status(200).send({ success: false, result: message });
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
    }
    const accessToken = (0, tokenGenerator_1.generateAccessToken)(user);
    const refreshToken = (0, tokenGenerator_1.generateRefreshToken)(user);
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
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const existUser = yield User_1.User.findOne({ email });
    if (existUser) {
        return res
            .status(200)
            .send({ result: "Бүртгэлтэй хэрэглэгч байна.", success: false });
    }
    const user = new User_1.User({
        email,
        password,
        firstName,
        lastName,
    });
    const accessToken = (0, tokenGenerator_1.generateAccessToken)(user);
    const refreshToken = (0, tokenGenerator_1.generateRefreshToken)(user);
    const salt = yield bcrypt_1.default.genSalt(10);
    user.password = yield bcrypt_1.default.hash(user.password, salt);
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
    }
    yield user.save();
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
}));
module.exports = router;
