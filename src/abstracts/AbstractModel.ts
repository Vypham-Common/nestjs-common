import { Injectable } from '@nestjs/common'
import { SchemaFactory } from '@nestjs/mongoose'
import { Connection, Model, Schema, Types, VirtualTypeOptions } from 'mongoose'

interface VirtualPopulate {
  name: string
  option: VirtualTypeOptions
}
interface AbstractModelConstructor<D> {
  hooks?: (model: AbstractModel<D>) => void
  staticHook?: (model: AbstractModel<D>) => void
  virtualsPopulate?: VirtualPopulate[]
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
    { hooks, staticHook, virtualsPopulate }: AbstractModelConstructor<D> = {}
  ) {
    this.connection = connection
    this.name = name
    this.tenant = tenant

    this.schema = SchemaFactory.createForClass(decoratorSchema)
    if (staticHook) {
      staticHook(this)
    }

    if (hooks) {
      hooks(this)
    }
    if (virtualsPopulate) {
      this.generateVirtualPopulate(virtualsPopulate)
    }

    this.model = this.getModel()
  }

  generateVirtualPopulate(virtualsPopulate: VirtualPopulate[]) {
    virtualsPopulate.forEach(({ name, option }) => {
      if (option.ref && typeof option.ref === 'string') {
        option.ref = this.getCollectionName(option.ref)
      }
      this.schema.virtual(name, option)
    })
  }
  getCollectionName(name?: string) {
    if (name) {
      return `${this.tenant ? this.tenant + '_' : ''}${name}`
    }
    return `${this.tenant ? this.tenant + '_' : ''}${this.name}`
  }

  getModel() {
    const collectionName = this.getCollectionName()
    let modelObject = this.connection.models[collectionName]
    if (!modelObject) {
      modelObject = this.connection.model<D>(collectionName, this.schema)
    }
    return modelObject
  }
}
