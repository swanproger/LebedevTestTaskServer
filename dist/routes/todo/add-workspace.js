"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkspace = exports.addWorkspaceRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const addWorkspaceRoute = (app, postgres, domain) => {
    app.post(`${domain}/add-workspace`, common_1.authenticateToken, (req, res) => {
        if (!req.body.title) {
            res.status(400).json({ error: "Не хватает данных" }).send();
            return;
        }
        if (req.body.title.length > 255) {
            res.status(400).json({ error: "Длина заголовка слишком большая" }).send();
            return;
        }
        const workspaceData = {
            title: req.body.title,
            description: req.body.description,
            user_id: res.locals.user.id,
        };
        createWorkspace(postgres, workspaceData)
            .then(result => {
            res.status(200).json(true);
        })
            .catch((err) => {
            console.log("catched");
            res.status(500).json({ error: "Что-то пошло не так" });
            return (0, postgres_1.resetAutoincrement)(postgres, "todo", "workspaces", "workspaces_id_seq");
        })
            .finally(() => {
            return res.send();
        });
    });
};
exports.addWorkspaceRoute = addWorkspaceRoute;
function createWorkspace(postgres, data) {
    return postgres.query(`
		INSERT INTO 
			todo.workspaces (
				title,
				description,
				user_id
			) 
			VALUES ($1, $2, $3) 
			RETURNING *
		`, [data.title, data.description, data.user_id]);
}
exports.createWorkspace = createWorkspace;
