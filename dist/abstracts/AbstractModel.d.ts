import { Connection, Model, Schema, Types, VirtualTypeOptions } from 'mongoose';
interface VirtualPopulate {
    name: string;
    option: VirtualTypeOptions;
}
interface AbstractModelConstructor<D> {
    hooks?: (model: AbstractModel<D>) => void;
    staticHook?: (model: AbstractModel<D>) => void;
    virtualPopulate?: VirtualPopulate[];
}
export declare abstract class AbstractModel<D> {
    Doc: D & {
        _id: Types.ObjectId;
    };
    name: string;
    tenant?: string;
    connection: Connection;
    schema: Schema<D>;
    model: Model<D>;
    constructor(connection: Connection, name: string, decoratorSchema: new () => D, tenant?: string | undefined, { hooks, staticHook, virtualPopulate }?: AbstractModelConstructor<D>);
    generateVirtualPopulate(virtualPopulate: VirtualPopulate[]): void;
    getModel(): Model<any, {}, {}, {}, any, any>;
}
export {};
