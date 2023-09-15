"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYEE = void 0;
var EMPLOYEE;
(function (EMPLOYEE) {
    let TYPE;
    (function (TYPE) {
        let OTHER;
        (function (OTHER) {
            OTHER["Regular"] = "Regular";
            OTHER["Contingent"] = "Contingent Worker";
        })(OTHER = TYPE.OTHER || (TYPE.OTHER = {}));
        let STATUS;
        (function (STATUS) {
            STATUS["EMPLOYED"] = "EMPLOYED";
            STATUS["LEFT"] = "LEFT";
            STATUS["PROBATION"] = "PROBATION";
        })(STATUS = TYPE.STATUS || (TYPE.STATUS = {}));
    })(TYPE = EMPLOYEE.TYPE || (EMPLOYEE.TYPE = {}));
    let STATUS;
    (function (STATUS) {
        STATUS["ACTIVE"] = "ACTIVE";
        STATUS["INACTIVE"] = "INACTIVE";
        STATUS["DELETED"] = "DELETED";
    })(STATUS = EMPLOYEE.STATUS || (EMPLOYEE.STATUS = {}));
})(EMPLOYEE || (exports.EMPLOYEE = EMPLOYEE = {}));
