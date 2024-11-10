"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const port = 5001;
app.use(express_1.default.json());
(0, routes_1.formRoute)(app);
app.listen(port, () => {
    console.log(`\nСервер успешно запущен по адресу http://localhost:${port}\n`);
});
