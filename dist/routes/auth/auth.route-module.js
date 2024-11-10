"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const common_1 = require("../../common");
const register_route_1 = require("./register.route");
const login_route_1 = require("./login.route");
const test_route_1 = require("./test.route");
const refresh_token_route_1 = require("./refresh-token.route");
const check_nickname_route_1 = require("./check-nickname.route");
const authRoute = (app, postgres) => {
    const domain = `/api/${common_1.API_V1}/auth`;
    (0, register_route_1.registerRoute)(app, postgres, domain);
    (0, login_route_1.loginRoute)(app, postgres, domain);
    (0, test_route_1.testRoute)(app, postgres, domain);
    (0, refresh_token_route_1.refreshTokenRoute)(app, postgres, domain);
    (0, check_nickname_route_1.checkNicknameRoute)(app, postgres, domain);
};
exports.authRoute = authRoute;
