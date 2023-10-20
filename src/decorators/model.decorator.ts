import { Inject } from '@nestjs/common';

export const getModelToken = (name: string) => `MODEL_${name}`
export const getMethodToken = (name: string) => `METHOD_${name}`
export const getModelFactoryToken = (name: string) => `MODEL_FACTORY_${name}`
export const getMethodFactoryToken = (name: string) => `METHOD_FACTORY_${name}`

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
