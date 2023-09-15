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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const utils_1 = require("../utils");
let AbstractModel = class AbstractModel {
    Doc;
    name;
    tenant;
    connection;
    schema;
    model;
    constructor(connection, name, decoratorSchema, tenant = undefined, { hooks, staticHook, virtualPopulate } = {}) {
        this.name = name;
        this.tenant = tenant;
        this.connection = connection.useDb((0, utils_1.getDbName)(this.tenant));
        this.schema = mongoose_1.SchemaFactory.createForClass(decoratorSchema);
        if (staticHook) {
            staticHook(this);
        }
        if (hooks) {
            hooks(this);
        }
        if (virtualPopulate) {
            this.generateVirtualPopulate(virtualPopulate);
        }
        this.model = this.getModel();
    }
    generateVirtualPopulate(virtualPopulate) {
        virtualPopulate.forEach(({ name, option }) => {
            this.schema.virtual(name, option);
        });
    }
    getModel() {
        let modelObject = this.connection.models[this.name];
        if (!modelObject) {
            modelObject = this.connection.model(this.name, this.schema);
        }
        return modelObject;
    }
};
exports.AbstractModel = AbstractModel;
exports.AbstractModel = AbstractModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongoose_2.Connection, String, Function, Object, Object])
], AbstractModel);
