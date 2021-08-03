export var DefaultPermission;
(function (DefaultPermission) {
    DefaultPermission["AdminPannel"] = "AdminPannel";
    DefaultPermission["Authorize"] = "Authorize";
})(DefaultPermission || (DefaultPermission = {}));
export var PermissionType;
(function (PermissionType) {
    PermissionType["ENTITY"] = "entity";
    PermissionType["API"] = "api";
    PermissionType["PAGE"] = "page";
    PermissionType["OTHER"] = "other";
})(PermissionType || (PermissionType = {}));
export var PermissionAction;
(function (PermissionAction) {
    PermissionAction["FIND"] = "find";
    PermissionAction["FIND_ONE"] = "findOne";
    PermissionAction["LIST"] = "list";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["UPDATE_ONE"] = "updateOne";
    PermissionAction["CREATE"] = "create";
    PermissionAction["CREATE_MANY"] = "createMany";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["DELETE_ONE"] = "deleteOne";
    PermissionAction["READ"] = "read";
})(PermissionAction || (PermissionAction = {}));
export var PermissionMethod;
(function (PermissionMethod) {
    PermissionMethod["GET"] = "get";
    PermissionMethod["POST"] = "post";
    PermissionMethod["DELETE"] = "delete";
    PermissionMethod["PUT"] = "put";
})(PermissionMethod || (PermissionMethod = {}));
