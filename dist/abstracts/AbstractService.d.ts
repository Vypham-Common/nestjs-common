/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { FilterQuery, HydratedDocument, Model, PipelineStage, PopulateOptions, ProjectionType, Types, UpdateQuery } from 'mongoose';
import { AbstractModel } from './AbstractModel';
type Group = {
    asObject: {
        [k: string]: number;
    };
    asArray: {
        status: string;
        total: number;
    }[];
};
type OptionalQueryOption = {
    skip?: number;
    limit?: number;
    sort?: any;
    lean?: boolean;
    idsOnly?: boolean;
    count?: boolean;
    exportColumns?: {
        label: string;
        value: string;
    }[];
    populate?: PopulateOptions[] | false;
    projection?: ProjectionType<any>;
};
interface AbstractServiceOptions<D> {
    shortLookup?: GeneratePipeline<D>[];
    populate?: (PopulateOptions & {
        global?: boolean;
    })[];
}
export declare abstract class AbstractService<M extends AbstractModel<any>, PullPopulate extends {} = object> {
    tenant?: string;
    name: string;
    model: Model<M['Doc']>;
    user: JWTPayload;
    populate: PopulateOptions[];
    lookup: PipelineStage[];
    shortLookup: GeneratePipeline<M['Doc']>[];
    constructor(M: M, user?: JWTPayload | undefined, { shortLookup, populate }?: AbstractServiceOptions<M['Doc']>);
    generateLookup(pipelines: GeneratePipeline[]): (PipelineStage.AddFields | PipelineStage.Bucket | PipelineStage.BucketAuto | PipelineStage.CollStats | PipelineStage.Count | PipelineStage.Densify | PipelineStage.Facet | PipelineStage.Fill | PipelineStage.GeoNear | PipelineStage.GraphLookup | PipelineStage.Group | PipelineStage.IndexStats | PipelineStage.Limit | PipelineStage.ListSessions | PipelineStage.Lookup | PipelineStage.Match | PipelineStage.PlanCacheStats | PipelineStage.Project | PipelineStage.Redact | PipelineStage.ReplaceRoot | PipelineStage.ReplaceWith | PipelineStage.Sample | PipelineStage.Search | PipelineStage.SearchMeta | PipelineStage.Set | PipelineStage.SetWindowFields | PipelineStage.Skip | PipelineStage.Sort | PipelineStage.SortByCount | PipelineStage.UnionWith | PipelineStage.Unset | PipelineStage.Unwind)[];
    find(input: {
        query?: FilterQuery<M['Doc']>;
        idsOnly: true;
    } & OptionalQueryOption): Promise<Types.ObjectId[]>;
    find(input: {
        query?: FilterQuery<M['Doc']>;
        count: false;
        populate: false;
    } & OptionalQueryOption): Promise<HydratedDocument<M['Doc']>[]>;
    find(input: {
        query?: FilterQuery<M['Doc']>;
        populate: false;
    } & OptionalQueryOption): Promise<{
        data: HydratedDocument<M['Doc']>[];
        total: number;
        next: Pagination;
        pre: Pagination;
    }>;
    find<P extends {} = PullPopulate>(input: {
        query?: FilterQuery<M['Doc']>;
        count: false;
    } & OptionalQueryOption): Promise<MergePopulate<M['Doc'], P>[]>;
    find<P extends {} = PullPopulate>(input: {
        query?: FilterQuery<M['Doc']>;
    } & OptionalQueryOption): Promise<{
        data: MergePopulate<M['Doc'], P>[];
        total: number;
        next: Pagination;
        pre: Pagination;
    }>;
    findById<P extends {} = {}>(id: StringOrObjectId, options: {
        isThrow: true;
        populate: false;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findById<P extends {}>(id: StringOrObjectId, options: {
        isThrow: true;
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findById<P extends {}>(id: StringOrObjectId, options: {
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findById<P extends {} = PullPopulate>(id: StringOrObjectId, option?: {
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findById<P extends {} = PullPopulate>(id: StringOrObjectId, options: {
        message?: string;
        isThrow: true;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOne<P extends {} = {}>(query: FilterQuery<M['Doc']>, options: {
        isThrow: true;
        populate: false;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOne<P extends {}>(query: FilterQuery<M['Doc']>, options: {
        isThrow: true;
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOne<P extends {}>(query: FilterQuery<M['Doc']>, options: {
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findOne<P extends {} = PullPopulate>(query: FilterQuery<M['Doc']>, options?: {
        message: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findOne<P extends {} = PullPopulate>(query: FilterQuery<M['Doc']>, options: {
        isThrow: true;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    exists(query: FilterQuery<M['Doc']>, options?: {
        throwCase?: 'IF_EXISTS' | 'IF_NOT_EXISTS';
        message?: string;
    }): Promise<boolean>;
    existsAll(ids: StringOrObjectId[], options?: {
        throwCase?: 'IF_ONE_EXISTS' | 'IF_ONE_NOT_EXISTS' | 'IF_ALL_EXISTS' | 'IF_ALL_NOT_EXISTS';
        message?: string;
    }, customQuery?: (ids: StringOrObjectId[]) => FilterQuery<M['Doc']>): Promise<{
        isExistsOne: boolean;
        isExistsAll: boolean;
    }>;
    groupBy(field: string, keys: string[], pipeline?: PipelineStage[]): Promise<Group>;
    isValidObjectId(id: string): Types.ObjectId;
    findByIdAndUpdate<P extends {} = {}>(id: string | Types.ObjectId, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        populate: false;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findByIdAndUpdate<P extends {}>(id: string | Types.ObjectId, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findByIdAndUpdate<P extends {}>(id: string | Types.ObjectId, input: UpdateQuery<M['Doc']>, options: {
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findByIdAndUpdate<P extends {} = PullPopulate>(id: string | Types.ObjectId, input: UpdateQuery<M['Doc']>, options?: {
        message: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findByIdAndUpdate<P extends {} = PullPopulate>(id: string | Types.ObjectId, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOneAndUpdate<P = {}>(query: FilterQuery<M['Doc']>, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        populate: false;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOneAndUpdate<P>(query: FilterQuery<M['Doc']>, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findOneAndUpdate<P>(query: FilterQuery<M['Doc']>, input: UpdateQuery<M['Doc']>, options: {
        populate: PopulateOptions[];
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findOneAndUpdate<P = PullPopulate>(query: FilterQuery<M['Doc']>, input: UpdateQuery<M['Doc']>, options?: {
        message: string;
    }): Promise<MergePopulate<M['Doc'], P> | null>;
    findOneAndUpdate<P = PullPopulate>(query: FilterQuery<M['Doc']>, input: UpdateQuery<M['Doc']>, options: {
        isThrow: true;
        message?: string;
    }): Promise<MergePopulate<M['Doc'], P>>;
    findByIdAndDelete(id: string | Types.ObjectId, { isThrow, message }?: {
        isThrow?: boolean;
        message?: string;
    }): Promise<import("mongoose").IfAny<M["Doc"], any, import("mongoose").Document<unknown, {}, M["Doc"]> & import("mongoose").Require_id<M["Doc"]>> | null>;
    findOneAndDelete(query: FilterQuery<M['Doc']>, { isThrow, message }?: {
        isThrow?: boolean;
        message?: string;
    }): Promise<import("mongoose").IfAny<M["Doc"], any, import("mongoose").Document<unknown, {}, M["Doc"]> & import("mongoose").Require_id<M["Doc"]>> | null>;
    findByPipeline<T = any[]>({ skip, limit, sort }: QueryParams, pipelines: PipelineStage[]): Promise<{
        data: T;
        total: number;
    }>;
}
export {};
