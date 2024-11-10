"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnRoute = void 0;
const common_1 = require("../../common");
const postgres_1 = require("../../postgres");
const addColumnRoute = (app, postgres, domain) => {
    app.post(`${domain}/add-column`, common_1.authenticateToken, (req, res) => {
        if (!req.body.title) {
            res.status(400).json({ error: "Не хватает данных" });
        }
        const columnTitle = req.body.title;
        postgres.query(`
		CREATE TABLE IF NOT EXISTS 
				todo.columns (
					id serial,
					title varchar(50) NOT NULL,
					PRIMARY KEY (id),
					CONSTRAINT title_unique UNIQUE (title)
				);
		`);
        postgres.query(`
			INSERT INTO 
				todo.columns(
					title
				) 
			VALUES ($1) 
			RETURNING *
		`, [columnTitle])
            .then(result => {
            res.status(200).json(result);
        })
            .catch((err) => {
            if (err.code === "23505") {
                res.status(500).json({
                    error: "Колонка с таким названием уже существует",
                });
                return;
            }
            res.status(500).json({ error: "Что-то пошло не так" });
            return (0, postgres_1.resetAutoincrement)(postgres, "todo", "columns", "columns_id_seq");
        })
            .finally(() => {
            return res.send();
        });
    });
};
exports.addColumnRoute = addColumnRoute;
