"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    try {
        return jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET, { expiresIn: 3600 });
    }
    catch (e) {
        console.log("Generate Access Token Error:", e);
        return "Invalid Access Token";
    }
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    try {
        return jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET, {
            expiresIn: 604800,
        });
    }
    catch (e) {
        console.log("Generate Refresh Token Error:", e);
        return "Invalid Refresh Token";
    }
};
exports.generateRefreshToken = generateRefreshToken;
