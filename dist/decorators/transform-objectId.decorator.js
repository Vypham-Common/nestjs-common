"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformObjectId = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
exports.TransformObjectId = (0, class_transformer_1.Transform)(({ value }) => {
    if (Array.isArray(value)) {
        return value.map(o => {
            if ((0, mongoose_1.isValidObjectId)(o))
                return new mongoose_1.Types.ObjectId(o);
            return o;
        });
    }
    else {
        if ((0, mongoose_1.isValidObjectId)(value))
            return new mongoose_1.Types.ObjectId(value);
        return value;
    }
});
