"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformDate = void 0;
const class_transformer_1 = require("class-transformer");
exports.TransformDate = (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined);
