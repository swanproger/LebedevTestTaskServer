"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRoute = void 0;
const common_1 = require("../../common");
const getUserRoute = (app, postgres, domain) => {
    app.get(`${domain}/user`, common_1.authenticateToken, (req, res) => {
        res.status(200).send(res.locals.user);
    });
};
exports.getUserRoute = getUserRoute;
