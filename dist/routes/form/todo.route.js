"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRoute = void 0;
const process_form_1 = require("./process-form");
const todoRoute = (app) => {
    const domain = `/api/cadex`;
    (0, process_form_1.processFormRoute)(app, domain);
};
exports.todoRoute = todoRoute;
