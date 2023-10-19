import { Inject } from '@nestjs/common';

export function InjectModel(name: string) {
  return Inject(`MODEL_${name}`)
}

export function InjectMethod(name: string) {
  return Inject(`METHOD_${name}`)
}

export function InjectModelFactory(name: string) {
  return Inject(`MODEL_FACTORY_${name}`)
}

export function InjectMethodFactory(name: string) {
  return Inject(`METHOD_FACTORY_${name}`)
}
