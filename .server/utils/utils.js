import path from 'path';
import { get, isEqual, isMatch, pick } from './lodash';
/* Function khong lam gi ca */
export const useless = (v) => v;
// Bearer Token
export const parseToken = (bearerToken) => bearerToken.replace(/^bearer /i, '');
export const buildToken = (token) => `Bearer ${token}`;
// parse string 'false' => false, 'true' => true
export function parseBool(b) {
    return !/^(false|0)$/i.test(b) && !!b;
}
/** Xóa phần tử trong mảng và trả về mảng các phần tử đã xóa **/
export function removeItems(arr = [], func, keys = undefined) {
    if (typeof func !== 'function') {
        func = (item) => {
            return isMatch(item, keys ? pick(func, keys) : func);
        };
    }
    const removed = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (func(element, index)) {
            removed.push(element);
            arr.splice(index, 1);
            index--;
        }
    }
    return removed;
}
/**
 * Thay đổi một phần tử trong mảng
 * @param {*} arr Mảng cần thay đổi phẩn tử
 * @param {*} replaceBy phần tử mới
 * @param {((element, index:number)=> boolean) | string | string[]} func Hàm tìm phần tử cần thay đổi,
 * hoặc mảng các thuộc tính để so sánh các phần tử
 */
export function replace(arr = [], replaceBy, func) {
    if (typeof func !== 'function') {
        const compareKeys = func;
        func = (item) => {
            const a = compareKeys ? pick(replaceBy, compareKeys) : replaceBy;
            const b = compareKeys ? pick(item, compareKeys) : item;
            return isEqual(a, b);
        };
    }
    arr.splice(arr.findIndex(func), 1, replaceBy);
}
export function createUniqueId() {
    const timestamp = Date.now();
    const seed = Math.floor(Math.random() * timestamp);
    return timestamp + '-' + seed;
}
export function pushIfNotExists(arr = [], map, item, valueKey) {
    const id = valueKey ? get(item, valueKey) : item;
    if (!map[id]) {
        map[id] = item;
        arr.push(item);
    }
    return arr;
}
export function pushWithOrder(arr = [], item, orderField = 'order') {
    let addedIndex = -1;
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element[orderField] > item[orderField]) {
            addedIndex = index;
            arr.splice(index, 0, item);
            break;
        }
    }
    if (addedIndex === -1)
        addedIndex = arr.push(item);
    return addedIndex;
}
export function parseJSON(s) {
    try {
        return JSON.parse(s);
    }
    catch (error) {
        return null;
    }
}
/**
 * @param {} response
 * @returns {{data: [], page : number, total: number, pageSize : number}}
 */
export function santizeResponse(response) {
    if (Array.isArray(response)) {
        return {
            data: response,
            page: 1,
            total: response.length,
        };
    }
    return response;
}
export function findRecusive(arr = [], compare, chilrenKey = 'children') {
    let find;
    for (const item of arr) {
        if (compare(item)) {
            find = item;
            break;
        }
        if (item[chilrenKey] && item[chilrenKey].length > 0) {
            find = findRecusive(item[chilrenKey], compare, chilrenKey);
            if (find)
                break;
        }
    }
    return find;
}
// Find recusive nhưng return mảng chứa phần tử đó
export function findParent(arr = [], compare, chilrenKey = 'children') {
    let find;
    for (const item of arr) {
        if (compare(item)) {
            find = arr;
            break;
        }
        if (item[chilrenKey] && item[chilrenKey].length > 0) {
            find = findParent(item[chilrenKey], compare, chilrenKey);
            if (find)
                break;
        }
    }
    return find;
}
/**
 *
 * @param {*} source Nếu source là function thì chạy source lấy kết quả
 * @param  {...any} args
 */
export function getSourceValue(source, ...args) {
    if (typeof source === 'function')
        return source(...args);
    return source;
}
export function getObjectId(value) {
    if (!value)
        return null;
    if (typeof value === 'string')
        return value;
    return (value === null || value === void 0 ? void 0 : value.id) || (value === null || value === void 0 ? void 0 : value._id);
}
export const getErrorMessage = (error) => {
    var _a, _b;
    const data = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data;
    return (((_b = data === null || data === void 0 ? void 0 : data.errors) === null || _b === void 0 ? void 0 : _b[0]) ||
        (data === null || data === void 0 ? void 0 : data.message) ||
        (data === null || data === void 0 ? void 0 : data.type) ||
        (data === null || data === void 0 ? void 0 : data.code) ||
        (error === null || error === void 0 ? void 0 : error.message));
};
export function joinUrl(...paths) {
    let url = paths
        .map((item) => {
        if (item === 'http://' || item === 'https://')
            return item;
        return item.replace(/^\/+|\/+$/g, '');
    })
        .join('/');
    if (!url.startsWith('/'))
        url = '/' + url;
    return url;
}
export function getAlias(tsConfig, baseUrl) {
    const alias = {};
    Object.keys(tsConfig.compilerOptions.paths).forEach((key) => {
        const target = path.resolve(baseUrl, 
        // eslint-disable-next-line no-useless-escape
        tsConfig.compilerOptions.paths[key][0].replace(/\/[^\/]*$/g, ''));
        const prefix = key.replace(/\/[^\\/]*$/g, '');
        alias[prefix] = target;
    });
    return alias;
}
export const cachedColor = {};
export function getRandomColor(source, a = 10) {
    if (source && cachedColor[source]) {
        return cachedColor[source];
    }
    else {
        const x = Math.floor(Math.random() * 256);
        const y = Math.floor(Math.random() * 256);
        const z = Math.floor(Math.random() * 256);
        const color = `rgba(${x}, ${y}, ${z}, ${a})`;
        if (source) {
            cachedColor[source] = color;
        }
        return color;
    }
}
export function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
}
