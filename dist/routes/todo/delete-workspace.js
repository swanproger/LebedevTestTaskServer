"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkspaceRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const deleteWorkspaceRoute = (app, postgres, domain) => {
    app.delete(`${domain}/delete-workspace`, common_1.authenticateToken, (req, res) => {
        if (!req.body.workspaceId) {
            res.status(400).json({ error: "Не хватает данных" });
        }
        console.log(req.body);
        const workspaceId = req.body.workspaceId;
        return postgres
            .query(`
			DELETE FROM todo.workspaces WHERE id = $1
		`, [workspaceId])
            .then(result => (0, postgres_1.resetAutoincrement)(postgres, "todo", "workspaces", "workspaces_id_seq", result))
            .then(result => {
            res.status(200).json(result.rows);
        })
            .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Что-то пошло не так" });
        })
            .finally(() => {
            res.send();
        });
    });
};
exports.deleteWorkspaceRoute = deleteWorkspaceRoute;
