import { PopulateOptions } from 'mongoose'

export interface FindOneOption {
  isThrow?: boolean
  populate?: PopulateOptions[]
  message?: string
  softDelete?: boolean
  select?: NestedObjectSelect
  sort?: { [k: string]: any }
}

export interface UpdateOneOption extends Omit<FindOneOption, 'select'> {
  newRecord?: boolean
}

export type DeleteOneOption = Omit<FindOneOption, 'populate' | 'select'>
