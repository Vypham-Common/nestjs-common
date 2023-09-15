"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAPI = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const https_1 = require("https");
const { HOST_URL } = GlobalConfig;
const createInstance = (prefix, options) => {
    const baseURL = `${options.baseURL || HOST_URL}/${prefix}`;
    const instanceOption = {
        baseURL,
        httpsAgent: new https_1.Agent({
            rejectUnauthorized: false,
        }),
    };
    if (options.headers) {
        instanceOption.headers = options.headers;
    }
    if (options.jwt) {
        if (instanceOption.headers) {
            instanceOption.headers.Authorization = `Bearer ${options.jwt}`;
        }
        else {
            instanceOption.headers = { Authorization: `Bearer ${options.jwt}` };
        }
        return axios_1.default.create(instanceOption);
    }
    return axios_1.default.create(instanceOption);
};
const checkError = (error, prefix) => {
    if (error?.response?.data?.code) {
        if (error.response.data.code === 401) {
            throw new common_1.UnauthorizedException('Session timeout, please login again');
        }
        else {
            throw new common_1.BadRequestException(error.response.data);
        }
    }
    throw new common_1.InternalServerErrorException(`There are unknown error from ${prefix}`);
};
const callAPI = function (prefix, options) {
    const { throwError = true, ...restOptions } = options || {};
    const instance = createInstance(prefix, restOptions);
    return {
        get: async (route, params) => {
            try {
                const { data } = await instance.get(route, params);
                return data;
            }
            catch (error) {
                if (throwError) {
                    return checkError(error, prefix);
                }
                return error?.response?.data;
            }
        },
        post: async (route, body) => {
            try {
                const { data } = await instance.post(route, body);
                return data;
            }
            catch (error) {
                if (throwError) {
                    return checkError(error, prefix);
                }
                return error?.response?.data;
            }
        },
        put: async (route, body) => {
            try {
                const { data } = await instance.put(route, body);
                return data;
            }
            catch (error) {
                if (throwError) {
                    return checkError(error, prefix);
                }
                return error?.response?.data;
            }
        },
        patch: async (route, body) => {
            try {
                const { data } = await instance.patch(route, body);
                return data;
            }
            catch (error) {
                if (throwError) {
                    return checkError(error, prefix);
                }
                return error?.response?.data;
            }
        },
        delete: async (route) => {
            try {
                const { data } = await instance.delete(route);
                return data;
            }
            catch (error) {
                if (throwError) {
                    return checkError(error, prefix);
                }
                return error?.response?.data;
            }
        },
    };
};
exports.callAPI = callAPI;
