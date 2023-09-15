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
exports.EmployeeModel = exports.Employee = exports.GeneralInfo = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const abstracts_1 = require("../../abstracts");
const enums_1 = require("../../enums");
let GeneralInfo = class GeneralInfo {
    legalName;
    firstName;
    middleName;
    lastName;
    shortName;
    DOB;
    legalGender;
    workEmail;
    userId;
    workNumber;
    nationality;
    linkedIn;
    personalNumber;
    personalEmail;
    isShowPersonalNumber;
    isShowPersonalEmail;
    isShowAvatar;
    Blood;
    maritalStatus;
    passportNo;
    passportIssueCountry;
    passportIssueOn;
    passportValidDate;
    preJobTitle;
    preCompany;
    pastExp;
    totalExp;
    qualification;
    avatar;
    employeeId;
    bioInfo;
    isNewComer;
};
exports.GeneralInfo = GeneralInfo;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "legalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "middleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "shortName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], GeneralInfo.prototype, "DOB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "legalGender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "workEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "workNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "nationality", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "linkedIn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "personalNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "personalEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], GeneralInfo.prototype, "isShowPersonalNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], GeneralInfo.prototype, "isShowPersonalEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], GeneralInfo.prototype, "isShowAvatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "Blood", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "maritalStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "passportNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "passportIssueCountry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "passportIssueOn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "passportValidDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "preJobTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "preCompany", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], GeneralInfo.prototype, "pastExp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], GeneralInfo.prototype, "totalExp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "qualification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeneralInfo.prototype, "bioInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], GeneralInfo.prototype, "isNewComer", void 0);
exports.GeneralInfo = GeneralInfo = __decorate([
    (0, mongoose_1.Schema)()
], GeneralInfo);
let Employee = class Employee {
    generalInfo;
    employeeId;
    employeeCode;
    employeeType;
    title;
    manager;
    department;
    company;
    location;
    locationCustomer;
    managePermission;
    tenant;
    status;
    statusType;
    grade;
    schedule;
};
exports.Employee = Employee;
__decorate([
    (0, mongoose_1.Prop)({ type: GeneralInfo }),
    __metadata("design:type", GeneralInfo)
], Employee.prototype, "generalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Employee.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Employee.prototype, "employeeCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "employeeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "manager", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "company", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "locationCustomer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Employee.prototype, "managePermission", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Employee.prototype, "tenant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Object.values(enums_1.STATUS), default: enums_1.STATUS.ACTIVE }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(enums_1.EMPLOYEE.TYPE.STATUS),
        default: enums_1.EMPLOYEE.TYPE.STATUS.EMPLOYED,
    }),
    __metadata("design:type", String)
], Employee.prototype, "statusType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "grade", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "schedule", void 0);
exports.Employee = Employee = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Employee);
let EmployeeModel = class EmployeeModel extends abstracts_1.AbstractModel {
    constructor(connection, tenant) {
        super(connection, enums_1.COMMON_COLLECTION.employees, Employee, tenant, {
            hooks(model) {
                model.schema.index({
                    'generalInfo.firstName': 'text',
                    'generalInfo.middleName': 'text',
                    'generalInfo.lastName': 'text',
                    'generalInfo.userId': 'text',
                    'generalInfo.workEmail': 'text',
                    employeeId: 'text',
                });
            }
        });
    }
};
exports.EmployeeModel = EmployeeModel;
exports.EmployeeModel = EmployeeModel = __decorate([
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)(enums_1.TOKEN.TENANT)),
    __metadata("design:paramtypes", [mongoose_2.Connection, String])
], EmployeeModel);
