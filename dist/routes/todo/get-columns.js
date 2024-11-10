"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsRoute = void 0;
const common_1 = require("../../common");
const getColumnsRoute = (app, postgres, domain) => {
    app.get(`${domain}/get-columns`, common_1.authenticateToken, (req, res) => {
        if (!req.query.workspaceId) {
            return res.status(400).json({ error: "Не хватает данных" }).send();
        }
        const workspaceId = req.query.workspaceId;
        postgres.query(`
			SELECT * FROM todo.columns WHERE workspace_id = $1
		`, [workspaceId])
            .then(result => {
            res.status(200).send(result.rows);
        })
            .catch(err => {
            res.status(500).send({ error: "Что-то пошло не так" });
        });
    });
};
exports.getColumnsRoute = getColumnsRoute;
