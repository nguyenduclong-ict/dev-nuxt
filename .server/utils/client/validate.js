import { get } from '../lodash';
export const equalToField = (model, otherKey, message = `Not equal to ${otherKey}`, options) => {
    return {
        validator: (rule, value, callback) => {
            if (value !== get(model, otherKey)) {
                // @ts-ignore
                return callback(message);
            }
            callback();
        },
        ...(options || {}),
    };
};
export const isVNode = (view) => {
    return (view === null || view === void 0 ? void 0 : view.constructor.name) === 'VNode';
};
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}
