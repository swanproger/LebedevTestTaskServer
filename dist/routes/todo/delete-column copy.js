"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColumnRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const deleteColumnRoute = (app, postgres, domain) => {
    app.delete(`${domain}/delete-column`, common_1.authenticateToken, (req, res) => {
        if (!req.body.columnId) {
            res.status(400).json({ error: "Не хватает данных" });
        }
        const columnId = req.body.columnId;
        return postgres
            .query(`
			DELETE FROM todo.columns WHERE id = $1
		`, [columnId])
            .then(result => (0, postgres_1.resetAutoincrement)(postgres, "todo", "columns", "columns_id_seq", result))
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
exports.deleteColumnRoute = deleteColumnRoute;
