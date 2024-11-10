"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouteV2 = void 0;
const common_1 = require("../common");
const sha_js_1 = __importDefault(require("sha.js"));
var RegisterCredentialFields;
(function (RegisterCredentialFields) {
    RegisterCredentialFields["LOGIN"] = "login";
    RegisterCredentialFields["PASSWORD"] = "password";
    RegisterCredentialFields["NAME"] = "name";
    RegisterCredentialFields["SURNAME"] = "surname";
})(RegisterCredentialFields || (RegisterCredentialFields = {}));
class RegisterCredentials {
}
class PostgresError extends Error {
}
const encryptPasssword = (str) => {
    return (0, sha_js_1.default)("sha256").update(str).digest("hex");
};
const authRouteV2 = (app, postgres) => {
    app.post(`/api/${common_1.API_V2}/register`, (req, res) => {
        const registerCredentials = req.body;
        const dataLoss = Object.values(RegisterCredentialFields).find((key) => {
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
        /* postgres.query(`ALTER TABLE auth.users ADD CONSTRAINT login_unique UNIQUE (login)`)
            .then(() => {
                res.status(200);
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            })
            .finally(() => {
                res.send();
            }); */
        postgres.query(query.text, query.values)
            .then((result) => {
            console.log("Запрос в БД выполнен успешно", result);
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
        /* postgres.query(
            `
            CREATE TABLE IF NOT EXISTS
                auth.users (
                    id serial,
                    name varchar(50) NOT NULL,
                    surname varchar(100) NOT NULL,
                    login varchar(50) NOT NULL,
                    password varchar(64) NOT NULL,
                    PRIMARY KEY (id)
                )
            CONSTRAINT login_unique UNIQUE (login)
            `
        )
            .then((result) => {
                console.log(result);
                res.status(200);
            })
            .catch((err) => {
                console.log(err);
                res.status(500);
            })
            .finally(() => {
                return res.send();
            }); */
    });
};
exports.authRouteV2 = authRouteV2;
