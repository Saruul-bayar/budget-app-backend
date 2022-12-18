"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const main = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(
      (0, cors_1.default)({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );
    // parse application/json
    app.use(body_parser_1.default.json());
    app.use("/auth", require("./routes/auth"));
    app.use("/user", require("./routes/user"));
    app.use("/orlogo", require("./routes/orlogo"));
    app.use("/zarlaga", require("./routes/zarlaga"));
    app.get("/", (req, res) => {
      res.send("we are on home");
    });
    yield (0, models_1.connectToDB)();
    app.listen(port);
  });
main();
