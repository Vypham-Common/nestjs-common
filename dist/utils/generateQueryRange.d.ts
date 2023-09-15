import { QuerySelector } from 'mongoose';
type GenerateQueryRange<I> = {
    from: I;
    to: I;
};
export declare function generateQueryRange<I = any>({ from, to, }: GenerateQueryRange<I>): QuerySelector<I> | null;
export {};
