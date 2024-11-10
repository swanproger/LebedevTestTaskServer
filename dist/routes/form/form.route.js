"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formRoute = void 0;
const process_form_1 = require("./process-form");
const formRoute = (app) => {
    const domain = `/api/cadex`;
    (0, process_form_1.processFormRoute)(app, domain);
};
exports.formRoute = formRoute;
