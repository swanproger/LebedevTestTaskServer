"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).send({ error: "Отсутствует Bearer токен" });
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
        if (err) {
            return res.status(401).send({ error: "Токен пользователя недействителен" });
        }
        const data = tokenData;
        const user = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            nickname: data.nickname,
            email: data.email,
        };
        res.locals.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
/* export const authenticateToken: RequestHandler = (req: Request & {authenticatedUserData?: any}, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).send();

    jwt.verify(token, process.env.TOKEN_SECRET, (jsonParseError, tokenData) => {
        if (jsonParseError) {
            return res.status(403).send("Токен пользователя недействителен");
        }
    });
};

export const authenticateAdminToken: RequestHandler = (req: Request & {authenticatedUserData?: any}, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).send();

    jwt.verify(token, process.env.TOKEN_SECRET, (jsonParseError, tokenData) => {
        if (jsonParseError) {
            return res.status(403).send("Токен пользователя недействителен");
        }
    });
}; */
