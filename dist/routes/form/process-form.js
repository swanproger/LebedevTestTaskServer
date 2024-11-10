"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFormRoute = void 0;
const processFormRoute = (app, domain) => {
    app.post(`${domain}/form`, (req, res) => {
        const data = req.body;
        const name = data.name;
        if (!name) {
            res.status(400).send({ error: "Missing name property" });
            return;
        }
        const responseMessage = `Thank you for your interest, ${name}`;
        console.log(responseMessage);
        res.status(200).send({ message: responseMessage });
    });
};
exports.processFormRoute = processFormRoute;
