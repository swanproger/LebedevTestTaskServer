"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const addColumnRoute = (app, postgres, domain) => {
    app.post(`${domain}/add-column`, common_1.authenticateToken, (req, res) => {
        if (!req.body.title || !req.body.workspace_id) {
            return res.status(400).json({ error: "Не хватает данных" }).send();
        }
        const columnTitle = req.body.title;
        const columnWorkspaceId = req.body.workspace_id;
        getColumnPosition(postgres, columnWorkspaceId)
            .then(position => postgres.query(`
				INSERT INTO 
					todo.columns(
						title,
						position,
						workspace_id
					) 
				VALUES ($1, $2, $3) 
				RETURNING *
				`, [columnTitle, position, columnWorkspaceId]))
            .then(result => {
            res.status(200).json(result.rows);
        })
            .catch((err) => {
            if (err.code === "23505") {
                res.status(500).json({
                    error: "Колонка с таким названием уже существует",
                });
                return;
            }
            console.log("Ошибка добавления колонки:", err);
            res.status(500).json({ error: "Что-то пошло не так" });
            return (0, postgres_1.resetAutoincrement)(postgres, "todo", "columns", "columns_id_seq");
        })
            .finally(() => {
            return res.send();
        });
    });
};
exports.addColumnRoute = addColumnRoute;
function getColumnPosition(postgres, workspace_id) {
    return postgres.query(`SELECT position FROM todo.columns WHERE workspace_id = $1`, [workspace_id]).then(result => {
        if (Array.isArray(result.rows) && result.rows.length > 0) {
            return result.rows[0].position + 1;
        }
        return 0;
    });
}
