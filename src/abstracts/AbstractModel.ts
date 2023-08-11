import { Injectable } from '@nestjs/common'
import { SchemaFactory } from '@nestjs/mongoose'
import { Connection, Model, Schema, Types, VirtualTypeOptions } from 'mongoose'
import { getDbName } from '../utils'

interface VirtualPopulate {
  name: string
  option: VirtualTypeOptions
}
interface AbstractModelConstructor<D> {
  hooks?: (model: AbstractModel<D>) => void
  staticHook?: (model: AbstractModel<D>) => void
  virtualPopulate?: VirtualPopulate[]
}
@Injectable()
export abstract class AbstractModel<D> {
  Doc: D & { _id: Types.ObjectId }
  name: string
  tenant?: string
  connection: Connection
  schema: Schema<D>
  model: Model<D>
  constructor(
    connection: Connection,
    name: string,
    decoratorSchema: new () => D,
    tenant: string | undefined = undefined,
    { hooks, staticHook, virtualPopulate }: AbstractModelConstructor<D> = {}
  ) {
    this.name = name
    this.tenant = tenant
    this.connection = connection.useDb(getDbName(this.tenant))

    this.schema = SchemaFactory.createForClass(decoratorSchema)
    if (staticHook) {
      staticHook(this)
    }

    if (hooks) {
      hooks(this)
    }
    if (virtualPopulate) {
      this.generateVirtualPopulate(virtualPopulate)
    }
    this.model = this.getModel()
  }

  generateVirtualPopulate(virtualPopulate: VirtualPopulate[]) {
    virtualPopulate.forEach(({ name, option }) => {
      this.schema.virtual(name, option)
    })
  }

  getModel() {
    let modelObject = this.connection.models[this.name]
    if (!modelObject) {
      modelObject = this.connection.model<D>(this.name, this.schema)
    }
    return modelObject
  }
}
