"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(200).send({
            success: false,
            result: "Та нэвтрээгүй байна.",
        });
    }
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.toString().split(" ")[1];
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(200).send({ success: false, result: "Алдаа гарлаа" });
    }
    if (!token) {
        return res.status(200).send({
            success: false,
            result: "Та нэвтрээгүй байна.",
        });
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403);
        req.user = decoded.id;
        next();
    });
};
exports.verifyToken = verifyToken;
