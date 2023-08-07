export enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const COMMON_STATUS = Object.values(STATUS)

export enum COMMON_COLLECTION {
  attachments = 'attachments',
  tenants = 'tenants',
  locations = 'locations',
  departments = 'departments',
  currencies = 'currencies',
  employees = 'employees',
}

export enum TOKEN {
  USER = 'USER',
  TENANT = 'TENANT',
}

export * from './employee'
