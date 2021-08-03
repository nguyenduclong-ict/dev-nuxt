import { isMatch } from 'lodash';
export class PermissionHelper {
    constructor(user) {
        var _a;
        this.roles = [];
        this.user = null;
        this.rolePermissions = [];
        this.userPermissions = [];
        this.permissions = [];
        if (user) {
            this.user = user;
            this.roles = user.roles;
            this.rolePermissions =
                ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.flatMap((role) => role.permissions)) || [];
            this.userPermissions = user.permissions;
            this.permissions = [...this.rolePermissions, ...this.userPermissions];
        }
    }
    get isAdmin() {
        var _a;
        return (_a = this.user) === null || _a === void 0 ? void 0 : _a.isAdmin;
    }
    get isAuthenticated() {
        return !!this.user;
    }
    hasPermission(...items) {
        if (this.isAdmin)
            return true;
        if (items.length === 0) {
            return true;
        }
        let result = false;
        for (const item of items) {
            if (!item)
                continue;
            if (Array.isArray(item)) {
                const [condition, options] = item;
                if (typeof condition === 'string') {
                    result =
                        !!this.permissions.find((upers) => {
                            var _a;
                            return ((_a = upers.permission) === null || _a === void 0 ? void 0 : _a.name) === condition &&
                                (options ? isMatch(upers, options) : true);
                        }) || false;
                }
                else if (typeof condition === 'object') {
                    result =
                        !!this.permissions.find((upers) => isMatch(upers.permission, condition) &&
                            (options ? isMatch(upers, options) : true)) || false;
                }
            }
            else if (typeof item === 'string') {
                result = this.permissions.find((upers) => { var _a; return ((_a = upers.permission) === null || _a === void 0 ? void 0 : _a.name) === item; });
            }
            else if (typeof item === 'object') {
                result = this.permissions.find((upers) => isMatch(upers.permission, item));
            }
        }
        return result;
    }
    hasRole(...items) {
        if (this.isAdmin)
            return true;
        if (items.length === 0) {
            return true;
        }
        return items.some((item) => {
            if (!item)
                return false;
            if (typeof item === 'string') {
                return !!this.roles.find((e) => e.name === item);
            }
            if (typeof item === 'object') {
                return !!this.roles.find((e) => isMatch(e, item));
            }
            return false;
        });
    }
}
