"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsObjectId = void 0;
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
function IsObjectId(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isObjectId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    let isValid = true;
                    if (Array.isArray(value)) {
                        value.forEach(o => {
                            isValid = (0, mongoose_1.isValidObjectId)(o);
                            if (!isValid)
                                return;
                        });
                    }
                    else {
                        isValid = (0, mongoose_1.isValidObjectId)(value);
                    }
                    return isValid;
                },
                defaultMessage(args) {
                    return `${args.property} is not valid mongo id`;
                }
            },
        });
    };
}
exports.IsObjectId = IsObjectId;
