"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig = {
    JWT_SECRET: process.env.JWT_SECRET || '',
    HOST_URL: process.env.HOST_URL || '',
    PUBLIC_KEY: process.env.PUBLIC_KEY || '',
    MONGODB_NAME: process.env.MONGODB_NAME || '',
};
global.GlobalConfig = envConfig;
