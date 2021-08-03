export declare const useless: (v: any) => any;
export declare const parseToken: (bearerToken: string) => string;
export declare const buildToken: (token: string) => string;
export declare function parseBool(b: any): boolean;
/** Xóa phần tử trong mảng và trả về mảng các phần tử đã xóa **/
export declare function removeItems<T extends object>(arr: T[], func: Partial<T> | ((item: T, index?: number) => boolean), keys?: string | string[] | undefined): any[];
/**
 * Thay đổi một phần tử trong mảng
 * @param {*} arr Mảng cần thay đổi phẩn tử
 * @param {*} replaceBy phần tử mới
 * @param {((element, index:number)=> boolean) | string | string[]} func Hàm tìm phần tử cần thay đổi,
 * hoặc mảng các thuộc tính để so sánh các phần tử
 */
export declare function replace(arr: any[], replaceBy: any, func: any): void;
export declare function createUniqueId(): string;
export declare function pushIfNotExists(arr: any[], map: any, item: any, valueKey: string): any[];
export declare function pushWithOrder(arr: any[], item: any, orderField?: string): number;
export declare function parseJSON(s: any): any;
/**
 * @param {} response
 * @returns {{data: [], page : number, total: number, pageSize : number}}
 */
export declare function santizeResponse(response: any): any;
export declare function findRecusive(arr: any[], compare: any, chilrenKey?: string): any;
export declare function findParent(arr: any[], compare: any, chilrenKey?: string): any;
/**
 *
 * @param {*} source Nếu source là function thì chạy source lấy kết quả
 * @param  {...any} args
 */
export declare function getSourceValue(source: any, ...args: any[]): any;
export declare function getObjectId(value: any): any;
export declare const getErrorMessage: (error: any) => any;
export declare function joinUrl(...paths: string[]): string;
export declare function getAlias(tsConfig: any, baseUrl: any): any;
export declare const cachedColor: any;
export declare function getRandomColor(source: any, a?: number): any;
export declare function nonAccentVietnamese(str: string): string;
