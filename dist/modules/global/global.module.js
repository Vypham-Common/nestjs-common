"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const enums_1 = require("../../enums");
const provideUser = {
    provide: enums_1.TOKEN.USER,
    inject: [core_1.REQUEST],
    useFactory(request) {
        return request?.user;
    },
};
const provideTenant = {
    provide: enums_1.TOKEN.TENANT,
    inject: [core_1.REQUEST],
    useFactory(request) {
        return request?.user?.employee?.tenant;
    },
};
let GlobalModule = class GlobalModule {
};
exports.GlobalModule = GlobalModule;
exports.GlobalModule = GlobalModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [provideUser, provideTenant],
        exports: [provideUser, provideTenant],
    })
], GlobalModule);
