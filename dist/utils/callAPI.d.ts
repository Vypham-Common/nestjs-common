import { AxiosRequestConfig } from 'axios';
interface Option extends AxiosRequestConfig {
    throwError?: boolean;
    jwt?: string;
    baseURL?: string;
}
declare const callAPI: (prefix: string, options?: Option) => {
    get: (route: string, params?: any) => Promise<any>;
    post: <P = any, D = any>(route: string, body: P) => Promise<any>;
    put: (route: string, body: {}) => Promise<any>;
    patch: (route: string, body: {}) => Promise<any>;
    delete: (route: string) => Promise<any>;
};
export { callAPI };
