"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN = exports.COMMON_COLLECTION = exports.COMMON_STATUS = exports.STATUS = void 0;
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "ACTIVE";
    STATUS["INACTIVE"] = "INACTIVE";
})(STATUS || (exports.STATUS = STATUS = {}));
exports.COMMON_STATUS = Object.values(STATUS);
var COMMON_COLLECTION;
(function (COMMON_COLLECTION) {
    COMMON_COLLECTION["attachments"] = "attachments";
    COMMON_COLLECTION["tenants"] = "tenants";
    COMMON_COLLECTION["locations"] = "locations";
    COMMON_COLLECTION["departments"] = "departments";
    COMMON_COLLECTION["currencies"] = "currencies";
    COMMON_COLLECTION["employees"] = "employees";
})(COMMON_COLLECTION || (exports.COMMON_COLLECTION = COMMON_COLLECTION = {}));
var TOKEN;
(function (TOKEN) {
    TOKEN["USER"] = "USER";
    TOKEN["TENANT"] = "TENANT";
})(TOKEN || (exports.TOKEN = TOKEN = {}));
__exportStar(require("./employee"), exports);
