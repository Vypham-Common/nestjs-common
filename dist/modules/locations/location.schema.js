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
exports.LocationModel = exports.Location = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const abstracts_1 = require("../../abstracts");
const enums_1 = require("../../enums");
let HeadQuarterAddress = class HeadQuarterAddress {
    addressLine1;
    addressLine2;
    state;
    zipCode;
    city;
    country;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "addressLine1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "addressLine2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "zipCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], HeadQuarterAddress.prototype, "country", void 0);
HeadQuarterAddress = __decorate([
    (0, mongoose_1.Schema)()
], HeadQuarterAddress);
let Coordinates = class Coordinates {
    lat;
    long;
};
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Coordinates.prototype, "lat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Coordinates.prototype, "long", void 0);
Coordinates = __decorate([
    (0, mongoose_1.Schema)()
], Coordinates);
let Location = class Location {
    name;
    timezone;
    headQuarterAddress;
    isHeadQuarter;
    status;
    company;
    coordinates;
    wifiAccessIds;
    distance;
    phone;
    googleMapsUrl;
    currency;
};
exports.Location = Location;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Location.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Location.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)(HeadQuarterAddress),
    __metadata("design:type", HeadQuarterAddress)
], Location.prototype, "headQuarterAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Location.prototype, "isHeadQuarter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enums_1.COMMON_STATUS, default: enums_1.STATUS.ACTIVE }),
    __metadata("design:type", String)
], Location.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Location.prototype, "company", void 0);
__decorate([
    (0, mongoose_1.Prop)(Coordinates),
    __metadata("design:type", Coordinates)
], Location.prototype, "coordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: String }]),
    __metadata("design:type", Array)
], Location.prototype, "wifiAccessIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Location.prototype, "distance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Location.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Location.prototype, "googleMapsUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Location.prototype, "currency", void 0);
exports.Location = Location = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Location);
let LocationModel = class LocationModel extends abstracts_1.AbstractModel {
    constructor(connection, tenant) {
        super(connection, enums_1.COMMON_COLLECTION.locations, Location, tenant, {
            hooks(model) {
                model.schema.index({
                    name: 'text',
                });
            },
        });
    }
};
exports.LocationModel = LocationModel;
exports.LocationModel = LocationModel = __decorate([
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)(enums_1.TOKEN.TENANT)),
    __metadata("design:paramtypes", [mongoose_2.Connection, String])
], LocationModel);
