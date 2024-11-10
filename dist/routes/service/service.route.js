"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoute = void 0;
const common_1 = require("../../common");
const user_1 = require("./user");
const serviceRoute = (app, postgres) => {
    const domain = `/api/${common_1.API_V1}/service`;
    (0, user_1.getUserRoute)(app, postgres, domain);
};
exports.serviceRoute = serviceRoute;
