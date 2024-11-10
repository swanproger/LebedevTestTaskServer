"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFormRoute = void 0;
const processFormRoute = (app, domain) => {
    app.post(`${domain}/form`, (req, res) => {
        res.status(200).send({ status: "ok" });
    });
};
exports.processFormRoute = processFormRoute;
