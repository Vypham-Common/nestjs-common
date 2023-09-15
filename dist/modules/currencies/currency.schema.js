"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyModel = exports.Currency = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const abstracts_1 = require("../../abstracts");
const enums_1 = require("../../enums");
let Currency = class Currency {
    name;
    code;
    symbol;
    rate;
    modifyAmount;
    status;
};
exports.Currency = Currency;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Currency.prototype, "symbol", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Currency.prototype, "modifyAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enums_1.COMMON_STATUS, default: enums_1.STATUS.ACTIVE }),
    __metadata("design:type", String)
], Currency.prototype, "status", void 0);
exports.Currency = Currency = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Currency);
let CurrencyModel = class CurrencyModel extends abstracts_1.AbstractModel {
    constructor(connection, tenant) {
        super(connection, enums_1.COMMON_COLLECTION.currencies, Currency, tenant, {
            hooks(model) {
                model.schema.index({
                    name: 'text',
                    code: 'text',
                    symbol: 'text',
                });
            },
        });
    }
};
exports.CurrencyModel = CurrencyModel;
exports.CurrencyModel = CurrencyModel = __decorate([
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)(enums_1.TOKEN.TENANT)),
    __metadata("design:paramtypes", [mongoose_2.Connection, String])
], CurrencyModel);
