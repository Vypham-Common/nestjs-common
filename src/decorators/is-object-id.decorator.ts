import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'
import { isValidObjectId } from 'mongoose'

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: {}, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string | string[]) {
          let isValid = true
          if (Array.isArray(value)) {
            value.forEach(o => {
              isValid = isValidObjectId(o)
              if (!isValid) return
            })
          } else {
            isValid = isValidObjectId(value)
          }
          return isValid
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not valid mongo id`
        }
      },
    })
  }
}
