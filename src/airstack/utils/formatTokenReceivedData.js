"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var formatTokenReceivedData = function (data, _recommendedUsers) {
    var _a, _b, _c, _d;
    if (_recommendedUsers === void 0) { _recommendedUsers = []; }
    var recommendedUsers = __spreadArray([], _recommendedUsers, true);
    var _loop_1 = function (transfer) {
        var _e = (transfer || {}).addresses, addresses = _e === void 0 ? [] : _e;
        var existingUserIndex = recommendedUsers.findIndex(function (_a) {
            var _b;
            var recommendedUsersAddresses = _a.addresses;
            return (_b = recommendedUsersAddresses === null || recommendedUsersAddresses === void 0 ? void 0 : recommendedUsersAddresses.some) === null || _b === void 0 ? void 0 : _b.call(recommendedUsersAddresses, function (address) { var _a; return (_a = addresses === null || addresses === void 0 ? void 0 : addresses.includes) === null || _a === void 0 ? void 0 : _a.call(addresses, address); });
        });
        var _tokenTransfers = {
            received: true,
        };
        if (existingUserIndex !== -1) {
            var _addresses = ((_a = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _a === void 0 ? void 0 : _a.addresses) || [];
            recommendedUsers[existingUserIndex].addresses = (_b = __spreadArray(__spreadArray([], _addresses, true), addresses, true)) === null || _b === void 0 ? void 0 : _b.filter(function (address, index, array) { return array.indexOf(address) === index; });
            recommendedUsers[existingUserIndex].tokenTransfers = __assign(__assign({}, ((_d = (_c = recommendedUsers === null || recommendedUsers === void 0 ? void 0 : recommendedUsers[existingUserIndex]) === null || _c === void 0 ? void 0 : _c.tokenTransfers) !== null && _d !== void 0 ? _d : {})), _tokenTransfers);
        }
        else {
            recommendedUsers.push(__assign(__assign({}, transfer), { tokenTransfers: __assign({}, _tokenTransfers) }));
        }
    };
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var transfer = data_1[_i];
        _loop_1(transfer);
    }
    return recommendedUsers;
};
exports.default = formatTokenReceivedData;
