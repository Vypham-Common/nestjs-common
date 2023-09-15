"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentModule = void 0;
const common_1 = require("@nestjs/common");
const attachment_schema_1 = require("./attachment.schema");
const attachment_service_1 = require("./attachment.service");
let AttachmentModule = class AttachmentModule {
};
exports.AttachmentModule = AttachmentModule;
exports.AttachmentModule = AttachmentModule = __decorate([
    (0, common_1.Module)({
        providers: [attachment_service_1.AttachmentService, attachment_schema_1.AttachmentModel],
        exports: [attachment_service_1.AttachmentService, attachment_schema_1.AttachmentModel],
    })
], AttachmentModule);
