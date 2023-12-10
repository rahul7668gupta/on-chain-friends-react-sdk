"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferredProfileImage = exports.readJsonArrayFromFile = exports.writeMapToFile = exports.writeJsonArrayToFile = void 0;
var fs_1 = require("fs");
function getPreferredProfileImage(socials) {
    var _a, _b;
    if (socials === void 0) { socials = []; }
    if (!socials || socials.length === 0) {
        return "";
    }
    var lensImage;
    var lensSocial = socials.find(function (social) { return social.dappName === 'lens'; });
    if (lensSocial) {
        lensImage = ((_b = (_a = lensSocial.profileImageContentValue) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.extraSmall) || lensSocial.profileImage;
    }
    var farcasterImage;
    var farcasterSocial = socials.find(function (social) { return social.dappName === 'farcaster'; });
    if (farcasterSocial) {
        farcasterImage = farcasterSocial.profileImage;
    }
    if (lensImage && farcasterImage && isIpfsUrl(lensImage)) {
        return farcasterImage;
    }
    if (!lensImage && farcasterImage) {
        return farcasterImage;
    }
    if (lensImage && !farcasterImage) {
        return lensImage;
    }
    return "";
}
exports.getPreferredProfileImage = getPreferredProfileImage;
function isIpfsUrl(url) {
    return url.startsWith('ipfs://');
}
function writeJsonArrayToFile(filename, jsonArray) {
    var jsonData = JSON.stringify(jsonArray, null, 2);
    try {
        fs_1.default.writeFileSync(filename, jsonData);
        console.log("JSON array successfully written to ".concat(filename));
    }
    catch (err) {
        console.error('Error writing to file:', err);
    }
}
exports.writeJsonArrayToFile = writeJsonArrayToFile;
var writeMapToFile = function (map, filePath) {
    try {
        // Convert the Map to a plain JavaScript object
        var plainObject_1 = {};
        map.forEach(function (value, key) {
            plainObject_1[key] = value;
        });
        // Convert the object to a JSON string
        var jsonString = JSON.stringify(plainObject_1, null, 2);
        // Write the JSON string to the file
        fs_1.default.writeFileSync(filePath, jsonString, 'utf8');
        console.log('Map has been successfully written to the file.');
    }
    catch (error) {
        console.error("Error writing Map to file: ".concat(error.message));
    }
};
exports.writeMapToFile = writeMapToFile;
var readJsonArrayFromFile = function (filePath) {
    try {
        // Read the file synchronously
        var jsonData = fs_1.default.readFileSync(filePath, 'utf8');
        // Parse the JSON data
        var jsonArray = JSON.parse(jsonData);
        // Check if the parsed data is an array
        if (Array.isArray(jsonArray)) {
            return jsonArray;
        }
        else {
            throw new Error('The content of the file is not a JSON array.');
        }
    }
    catch (error) {
        console.error("Error reading JSON array from file: ".concat(error.message));
        return null;
    }
};
exports.readJsonArrayFromFile = readJsonArrayFromFile;
