import { RequestHandler } from 'express';
export declare const ParseQuery: RequestHandler;
declare type MergeParamsOptions = {
    paramsIdToQuery?: boolean;
};
export declare const MergeParams: ({ paramsIdToQuery }?: MergeParamsOptions) => RequestHandler;
export declare const ValidateRequestParams: (cls: any) => RequestHandler;
export {};
