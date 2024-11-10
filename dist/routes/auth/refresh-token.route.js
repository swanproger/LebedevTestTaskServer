"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenRoute = exports.authenticateRefreshToken = void 0;
const common_1 = require("../../common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateRefreshToken = (req, res, next) => {
    if (!req.cookies) {
        return res.status(401).send({ error: "Отсутсвуют Cookies пользователя" });
    }
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken)
        return res.status(401).send({ error: "Отсутствует токен" });
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, tokenData) => {
        if (err) {
            return res.status(401).send({ error: "Токен пользователя недействителен" });
        }
        res.locals.tokenData = tokenData;
        next();
    });
};
exports.authenticateRefreshToken = authenticateRefreshToken;
const refreshTokenRoute = (app, postgres, domain) => {
    app.get(`${domain}/refresh-token`, exports.authenticateRefreshToken, (req, res) => {
        const accessToken = (0, common_1.generateAccessToken)(res.locals.tokenData.nickname);
        const refreshToken = (0, common_1.generateRefreshToken)(res.locals.tokenData.nickname);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 31536000,
        })
            .status(200)
            .send({ accessToken });
    });
};
exports.refreshTokenRoute = refreshTokenRoute;
