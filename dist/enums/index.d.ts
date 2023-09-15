export declare enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare const COMMON_STATUS: STATUS[];
export declare enum COMMON_COLLECTION {
    attachments = "attachments",
    tenants = "tenants",
    locations = "locations",
    departments = "departments",
    currencies = "currencies",
    employees = "employees"
}
export declare enum TOKEN {
    USER = "USER",
    TENANT = "TENANT"
}
export * from './employee';
