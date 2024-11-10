"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoute = void 0;
const common_1 = require("../../common");
const testRoute = (app, postgres, domain) => {
    app.get(`/api/v1/test`, common_1.authenticateToken, (req, res) => {
        const query = {
            text: `
                ALTER TABLE 
                    todo.columns RENAME COLUMN position2 TO position`,
        };
        postgres.query(query.text)
            .catch(e => console.log(e))
            .then(() => {
            res.status(200).send();
        });
    });
};
exports.testRoute = testRoute;
