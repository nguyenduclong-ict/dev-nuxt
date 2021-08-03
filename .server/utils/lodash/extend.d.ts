export function isEqualWithKeys(a: any, b: any, keys: any): boolean;
export function customDefaultsMerge(objValue: any, srcValue: any): any[];
export function defaultsDeepWith(source: any, customizer?: typeof customDefaultsMerge, ...args: any[]): any;
export function customGet(source: any, path: any, defaultData: any): any;
export function customPick(source: any, path: any): any;
export function removeEmptyProperties(obj: any): void;
export function customUnset(value: any, path?: string): any;
export function customMapValues(obj: any, mapValueFunction: any): {};
export function omitByKeys(obj: any, keys: any): Partial<any>;
export const assign: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
export function isObjectId(text: any): boolean;
