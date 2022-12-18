const config = require("@nicepack/eslint-ts");

config.parserOptions.project = "./tsconfig.base.json";

config.rules["import/no-extraneous-dependencies"] = "off";
config.rules["import/no-cycle"] = "off";
module.exports = config;
