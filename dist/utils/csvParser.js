"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvParser = void 0;
const plainjs_1 = require("@json2csv/plainjs");
const csvParser = (opts) => {
    const parser = new plainjs_1.Parser(opts);
    return (data) => {
        return parser.parse(data);
    };
};
exports.csvParser = csvParser;
