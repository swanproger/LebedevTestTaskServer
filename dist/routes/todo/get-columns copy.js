"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsRoute = void 0;
const common_1 = require("../../common");
const getColumnsRoute = (app, postgres, domain) => {
    app.get(`${domain}/get-columns`, common_1.authenticateToken, (req, res) => {
        postgres.query(`
			SELECT * FROM todo.columns
		`)
            .then(result => {
            res.status(200).send(result.rows);
        })
            .catch(err => {
            res.status(500).send({ error: "Что-то пошло не так" });
        });
    });
};
exports.getColumnsRoute = getColumnsRoute;
