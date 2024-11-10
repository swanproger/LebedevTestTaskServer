"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacesRoute = void 0;
const common_1 = require("../../common");
const getWorkspacesRoute = (app, postgres, domain) => {
    app.get(`${domain}/get-workspaces`, common_1.authenticateToken, (_, res) => {
        postgres.query(`
			SELECT * FROM todo.workspaces WHERE user_id = $1
		`, [res.locals.user.id])
            .then(result => {
            res.status(200).send(result.rows);
        })
            .catch(err => {
            res.status(500).send({ error: "Что-то пошло не так" });
        });
    });
};
exports.getWorkspacesRoute = getWorkspacesRoute;
