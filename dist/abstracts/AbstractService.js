"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let AbstractService = class AbstractService {
    tenant;
    name;
    model;
    user;
    populate = [];
    lookup = [];
    shortLookup = [];
    constructor(M, user = undefined, { shortLookup, populate } = {}) {
        this.name = M.name;
        this.tenant = M.tenant;
        if (user) {
            this.user = user;
        }
        if (shortLookup) {
            this.shortLookup = shortLookup;
            this.lookup = this.generateLookup(this.shortLookup);
        }
        if (populate) {
            this.populate = populate;
        }
        this.model = M.model;
    }
    generateLookup(pipelines) {
        const mappedPipeline = [];
        pipelines.forEach((pipeline) => {
            const { unwind = true, keepNull = false, project } = pipeline;
            const localField = `${String(pipeline.localField)}`;
            const as = `${String(pipeline.as || pipeline.localField)}`;
            const from = pipeline.from;
            const lookupStage = {
                $lookup: {
                    from: from,
                    localField: localField,
                    foreignField: pipeline.foreignField || '_id',
                    as: as,
                },
            };
            if (pipeline.pipeline) {
                lookupStage.$lookup.pipeline = pipeline.pipeline;
            }
            mappedPipeline.push(lookupStage);
            if (unwind) {
                mappedPipeline.push({
                    $unwind: {
                        path: `$${as}`,
                        preserveNullAndEmptyArrays: keepNull,
                    },
                });
            }
            if (pipeline.match) {
                if (lookupStage.$lookup.pipeline) {
                    lookupStage.$lookup.pipeline.push({
                        $match: pipeline.match
                    });
                }
                else {
                    lookupStage.$lookup.pipeline = [{
                            $match: pipeline.match
                        }];
                }
            }
            if (pipeline.lookup) {
                const nestedLookup = this.generateLookup(pipeline.lookup);
                if (lookupStage.$lookup.pipeline) {
                    lookupStage.$lookup.pipeline.push(...nestedLookup);
                }
                else {
                    lookupStage.$lookup.pipeline = nestedLookup;
                }
            }
            if (pipeline.postPipeline) {
                if (lookupStage.$lookup.pipeline) {
                    lookupStage.$lookup.pipeline.push(...pipeline.postPipeline);
                }
                else {
                    lookupStage.$lookup.pipeline = pipeline.postPipeline;
                }
            }
            if (project) {
                if (lookupStage.$lookup.pipeline) {
                    lookupStage.$lookup.pipeline.push({
                        $project: project
                    });
                }
                else {
                    lookupStage.$lookup.pipeline = [{
                            $project: project
                        }];
                }
            }
        });
        return mappedPipeline;
    }
    async find({ query = {}, skip, limit, sort, lean, count, populate, idsOnly, projection, }) {
        const options = {};
        if (skip) {
            options.skip = skip;
        }
        if (limit) {
            options.limit = limit;
        }
        if (sort) {
            options.sort = sort;
        }
        else {
            options.sort = { _id: -1 };
        }
        if (typeof lean === 'boolean') {
            options.lean = lean;
        }
        if (idsOnly) {
            return (await this.model.find(query).select('_id')).map((o) => o._id);
        }
        let promiseFind = this.model
            .find(query, projection, options)
            .populate(populate || this.populate)
            .exec();
        if (populate === false) {
            promiseFind = this.model.find(query, projection, options).exec();
        }
        if (count === false) {
            return await promiseFind;
        }
        const promises = [promiseFind, this.model.countDocuments(query).exec()];
        const [data, total] = await Promise.all(promises);
        const next = {
            page: null,
            limit: null,
        };
        const pre = {
            page: null,
            limit: null,
        };
        if (skip !== undefined &&
            limit !== undefined &&
            Number.isInteger(skip) &&
            Number.isInteger(limit)) {
            next.page = skip + limit >= total ? null : (skip + limit) / limit + 1;
            next.limit = limit;
            pre.page = skip - limit >= 0 ? (skip - limit) / limit + 1 : null;
            pre.limit = limit;
        }
        return {
            data,
            total,
            next,
            pre,
        };
    }
    async findById(id, { isThrow, message, populate, } = {}) {
        const data = await this.model
            .findById(id)
            .populate(populate === false
            ? []
            : populate === undefined
                ? this.populate
                : populate);
        if (isThrow === true) {
            if (!data) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async findOne(query, { isThrow, message, populate, } = {}) {
        const data = await this.model
            .findOne(query)
            .populate(populate === false
            ? []
            : populate === undefined
                ? this.populate
                : populate)
            .exec();
        if (isThrow === true) {
            if (!data) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async exists(query, options) {
        const { throwCase, message } = options || {};
        const isExists = await this.model.exists(query);
        switch (throwCase) {
            case 'IF_EXISTS':
                if (isExists) {
                    throw new common_1.BadRequestException(message || `${this.name} already exist`);
                }
                break;
            case 'IF_NOT_EXISTS':
                if (!isExists) {
                    throw new common_1.BadRequestException(message || `${this.name} not found`);
                }
                break;
        }
        return !!isExists;
    }
    async existsAll(ids, options = {}, customQuery) {
        const hashTypes = {};
        ids.forEach((o) => {
            hashTypes[o.toString()] = 1;
        });
        ids = Object.keys(hashTypes);
        const query = customQuery
            ? customQuery(ids)
            : { _id: { $in: ids } };
        const { throwCase, message } = options || {};
        const totalDocs = await this.model.countDocuments(query);
        const isExistsOne = totalDocs > 0;
        const isExistsAll = totalDocs === ids.length;
        switch (throwCase) {
            case 'IF_ONE_EXISTS':
                if (isExistsOne) {
                    throw new common_1.BadRequestException(message || `One of ${this.name} already exist`);
                }
                break;
            case 'IF_ONE_NOT_EXISTS':
                if (!isExistsAll) {
                    throw new common_1.BadRequestException(message || `One of ${this.name} not found`);
                }
                break;
            case 'IF_ALL_EXISTS':
                if (isExistsAll) {
                    throw new common_1.BadRequestException(message || `All ${this.name} already exist`);
                }
                break;
            case 'IF_ALL_NOT_EXISTS':
                if (!isExistsOne) {
                    throw new common_1.BadRequestException(message || `All ${this.name} not found`);
                }
                break;
        }
        return {
            isExistsOne,
            isExistsAll,
        };
    }
    async groupBy(field, keys, pipeline = []) {
        const rawData = await this.model.aggregate([
            ...pipeline,
            {
                $group: {
                    _id: `$${field}`,
                    total: { $count: {} },
                },
            },
        ]);
        const data = {
            asObject: {},
            asArray: [],
        };
        rawData.forEach(({ _id, total }) => {
            data.asObject[_id] = total;
            data.asArray.push({
                status: _id,
                total,
            });
        });
        keys.forEach((status) => {
            if (!data.asObject[status]) {
                data.asObject[status] = 0;
                data.asArray.push({
                    status,
                    total: 0,
                });
            }
        });
        return data;
    }
    isValidObjectId(id) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ObjectId');
        }
        return new mongoose_1.Types.ObjectId(id);
    }
    async findByIdAndUpdate(id, input, { isThrow, message, populate, } = {}) {
        const data = await this.model
            .findByIdAndUpdate(id, input, { new: true })
            .populate(populate === false
            ? []
            : populate === undefined
                ? this.populate
                : populate)
            .exec();
        if (!data) {
            if (isThrow) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async findOneAndUpdate(query, input, { isThrow, message, populate, } = {}) {
        const data = await this.model
            .findOneAndUpdate(query, input, { new: true })
            .populate(populate === false
            ? []
            : populate === undefined
                ? this.populate
                : populate)
            .exec();
        if (!data) {
            if (isThrow) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async findByIdAndDelete(id, { isThrow, message } = {}) {
        const data = await this.model.findByIdAndDelete(id);
        if (!data) {
            if (isThrow) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async findOneAndDelete(query, { isThrow, message } = {}) {
        const data = await this.model.findOneAndDelete(query);
        if (!data) {
            if (isThrow) {
                throw new common_1.BadRequestException(message || `${this.name} not found`);
            }
        }
        return data;
    }
    async findByPipeline({ skip, limit, sort }, pipelines) {
        if (!Number.isInteger(skip)) {
            skip = 0;
        }
        if (sort) {
            pipelines.push({ $sort: sort });
        }
        else {
            pipelines.push({ $sort: { createdAt: -1 } });
        }
        pipelines.push({
            $group: {
                _id: null,
                total: {
                    $count: {},
                },
                data: {
                    $push: '$$ROOT',
                },
            },
        }, {
            $addFields: {
                data: {
                    $slice: [
                        '$data',
                        skip,
                        !limit || limit === Number.MAX_SAFE_INTEGER
                            ? { $size: '$data' }
                            : limit,
                    ],
                },
            },
        });
        const [result] = await this.model.aggregate(pipelines);
        const { data, total } = result || { data: [], total: 0 };
        return {
            data,
            total,
        };
    }
};
exports.AbstractService = AbstractService;
exports.AbstractService = AbstractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object])
], AbstractService);
