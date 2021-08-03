export const NOT_FOUND = {
    code: 404,
    type: 'NotFound',
};
export const ENTITY_EXIST = {
    code: 409,
    type: 'Entity Exist',
};
export const FORBIDDEN = {
    code: 403,
    type: 'Forbidden',
};
export const UNAUTHORIZED = {
    code: 401,
    type: 'Unauthorized',
};
export const USER_IS_BLOCKED = {
    ...UNAUTHORIZED,
    message: 'User blocked',
};
export const INVALID_TOKEN = {
    ...UNAUTHORIZED,
    message: 'Invalid Token',
};
export const UNPROCESSABLE_ENTITY = {
    code: 422,
    type: 'Params Invalid',
};
export const INTERNAL_SERVER_ERROR = {
    code: 500,
    type: 'Internal Server Error',
};
export function sendError(res, ...errors) {
    let error = errors[0] || INTERNAL_SERVER_ERROR;
    error = { ...error };
    if (errors.length > 1) {
        errors.forEach((e) => Object.assign(error, e));
    }
    if (error instanceof Error) {
        res.status(500).json({
            message: error.message,
            name: error.name,
        });
    }
    else {
        res.status(error.code).json(error);
    }
}
export function sendValidateError(res, errors) {
    const getError = (error, result = []) => {
        if (error.constraints) {
            result.push(...Object.values(error.constraints));
            return result;
        }
        if (error.children) {
            error.children.forEach((element) => {
                getError(element, result);
            });
        }
        return result;
    };
    const message = {};
    errors.forEach((error) => {
        message[error.property] = getError(error);
        if (message[error.property].length === 1) {
            message[error.property] = message[error.property][0];
        }
    });
    sendError(res, UNPROCESSABLE_ENTITY, { errors: message });
}
