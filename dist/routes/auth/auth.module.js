"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const sha_js_1 = __importDefault(require("sha.js"));
const common_1 = require("../../common");
const encryptPasssword = (str) => {
    return (0, sha_js_1.default)("sha256").update(str).digest("hex");
};
const authRoute = (app, postgres) => {
    app.post(`/api/${common_1.API_V2}/register`, (req, res) => {
        const registerCredentials = req.body;
        const dataLoss = Object.values(common_1.RegisterCredentialFields).find((key) => {
            if (!registerCredentials[key]) {
                return true;
            }
            return false;
        });
        if (dataLoss) {
            return res.status(400).send("Не хватает данных");
        }
        const passwordHash = encryptPasssword(registerCredentials.password);
        const query = {
            text: `
                INSERT INTO 
                    auth.users(
                        name, 
                        surname, 
                        login, 
                        password
                    ) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *`,
            values: [
                registerCredentials.name,
                registerCredentials.surname,
                registerCredentials.login,
                passwordHash,
            ],
        };
        postgres.query(query.text, query.values)
            .then(() => {
            res.status(200);
        })
            .catch((err) => {
            switch (err.code) {
                case "23505": {
                    res.status(400);
                    res.json({
                        error: "Пользователь с таким ником уже существует",
                    });
                    break;
                }
                default: {
                    console.log("Запрос в БД выполнен с ошибкой", err);
                    res.status(500);
                    break;
                }
            }
        })
            .finally(() => {
            res.send();
        });
    });
};
exports.authRoute = authRoute;
