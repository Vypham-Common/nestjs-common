"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercent = void 0;
function calculatePercent(input, key) {
    let total = 0;
    input.forEach((value) => {
        let recursValue = null;
        key.split('.').forEach(k => {
            recursValue = value[k];
        });
        total += recursValue;
    });
    const output = input.map((value) => {
        let recursValue = null;
        key.split('.').forEach(k => {
            recursValue = value[k];
        });
        return {
            ...value,
            percent: recursValue / total * 100
        };
    });
    return output;
}
exports.calculatePercent = calculatePercent;
