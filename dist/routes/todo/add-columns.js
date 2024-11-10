"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnsRoute = void 0;
const common_1 = require("../../common");
const getColumnsRoute = (app, postgres, domain) => {
    app.post(`${domain}/add-column`, common_1.authenticateToken, (req, res) => {
        if (!req.body.title) {
            res.status(400).json({ error: "Не хватает данных" });
        }
        const columnTitle = req.body.title;
        postgres.query(`
			
		`);
    });
};
exports.getColumnsRoute = getColumnsRoute;
