"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const add_workspace_1 = require("../todo/add-workspace");
const registerRoute = (app, postgres, domain) => {
    app.post(`${domain}/register`, (req, res) => {
        const registerCredentials = req.body;
        const dataLoss = Object.values(common_1.RegisterCredentialFields).find(key => {
            if (!registerCredentials[key]) {
                return true;
            }
            return false;
        });
        if (dataLoss) {
            return res.status(400).send({ error: "Не хватает данных" });
        }
        const passwordHash = (0, common_1.encryptPasssword)(registerCredentials.password);
        postgres.query("BEGIN")
            .then(() => postgres.query(`
			INSERT INTO 
				auth.users(
					name, 
					surname,
					email,
					nickname, 
					password
				) 
			VALUES ($1, $2, $3, $4, $5) 
			RETURNING *`, [
            registerCredentials.name,
            registerCredentials.surname,
            registerCredentials.email,
            registerCredentials.nickname,
            passwordHash,
        ]))
            .then(result => {
            const user = result.rows[0];
            const workspaceData = {
                title: "Рабочее пространство",
                description: "Пример воркспейса",
                user_id: user.id,
            };
            return (0, add_workspace_1.createWorkspace)(postgres, workspaceData);
        })
            .then(() => postgres.query("COMMIT"))
            .then(() => {
            res.status(200).json(true);
        })
            .catch((err) => {
            postgres.query("ROLLBACK").then(() => (0, postgres_1.resetAutoincrement)(postgres, "auth", "users", "users_id_seq"));
            switch (err.code) {
                case "23505": {
                    res.status(400);
                    res.json({
                        error: "Пользователь с таким ником или почтой уже существует",
                    });
                    break;
                }
                default: {
                    console.log("Запрос в БД выполнен с ошибкой", err);
                    res.status(500).json({ error: "Что-то пошло не так" });
                    break;
                }
            }
        })
            .finally(() => {
            res.send();
        });
    });
};
exports.registerRoute = registerRoute;
