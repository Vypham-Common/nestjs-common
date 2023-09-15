"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueryRange = void 0;
function generateQueryRange({ from, to, }) {
    const query = {};
    let isHaveQuery = false;
    if (from || Number.isInteger(from)) {
        query.$gte = from;
        isHaveQuery = true;
    }
    if (to || Number.isInteger(to)) {
        query.$lte = to;
        isHaveQuery = true;
    }
    return isHaveQuery ? query : null;
}
exports.generateQueryRange = generateQueryRange;
