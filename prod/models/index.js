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
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI environment variable was not set");
            process.exit(1);
        }
        mongoose_1.default.connect(process.env.MONGODB_URI, (err) => {
            if (err)
                console.error(err);
            else
                console.log("🚀 Successfully Connected to Mongoose!");
        });
    });
}
exports.connectToDB = connectToDB;
