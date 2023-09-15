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
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const abstracts_1 = require("../../abstracts");
const enums_1 = require("../../enums");
const location_schema_1 = require("./location.schema");
let LocationService = class LocationService extends abstracts_1.AbstractService {
    constructor(user, model) {
        super(model, user, {
            populate: [
                {
                    path: 'currency',
                    model: enums_1.COMMON_COLLECTION.currencies,
                },
            ],
        });
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    __param(0, (0, common_1.Inject)(enums_1.TOKEN.USER)),
    __metadata("design:paramtypes", [Object, location_schema_1.LocationModel])
], LocationService);
