"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPasssword = void 0;
const sha_js_1 = __importDefault(require("sha.js"));
const encryptPasssword = (str) => {
    return (0, sha_js_1.default)("sha256").update(str).digest("hex");
};
exports.encryptPasssword = encryptPasssword;
