"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOptions = void 0;
const common_1 = require("@nestjs/common");
const ORDER_BY = {
    ASC: 1,
    DESC: -1,
};
exports.QueryOptions = (0, common_1.createParamDecorator)((_, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const query = req.query;
    const page = !Number.isNaN(Number(query.page))
        ? Number(query.page)
        : undefined;
    let skip = !Number.isNaN(Number(query.skip))
        ? Number(query.skip)
        : undefined;
    const limit = !Number.isNaN(Number(query.limit))
        ? Number(query.limit)
        : undefined;
    if (!Number.isNaN(page) && !Number.isNaN(limit)) {
        skip = (page - 1) * limit;
    }
    const { sort } = query;
    let mapSort = undefined;
    if (Array.isArray(sort) && sort.length > 0) {
        mapSort = {};
        for (const item of sort) {
            const [sortName, value] = item.toString().split(':');
            if (!sortName || !value)
                continue;
            if (ORDER_BY[value.toUpperCase()]) {
                mapSort[sortName] = ORDER_BY[value.toUpperCase()];
            }
        }
    }
    return {
        skip: skip || 0,
        limit: limit || Number.MAX_SAFE_INTEGER,
        sort: mapSort,
    };
});
