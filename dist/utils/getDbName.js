"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbName = void 0;
function getDbName(tenant) {
    return `${global.GlobalConfig.MONGODB_NAME}${tenant ? `_${tenant}` : ''}`;
}
exports.getDbName = getDbName;
