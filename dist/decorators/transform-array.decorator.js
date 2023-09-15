"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformArray = void 0;
const class_transformer_1 = require("class-transformer");
exports.TransformArray = (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value) ? value : [value]);
