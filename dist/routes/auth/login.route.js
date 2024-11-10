"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoute = void 0;
const common_1 = require("../../common");
const loginRoute = (app, postgres, domain) => {
    app.post(`${domain}/login`, (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Не хватает логина или пароля");
        }
        postgres.query(`
			SELECT 
				*
			FROM 
				auth.users 
			WHERE 
				email = $1
			`, [email])
            .then((result) => {
            if (result.rowCount === 0) {
                return res
                    .status(400)
                    .json({
                    error: "Такой пользователь не найден",
                })
                    .send();
            }
            let user;
            {
                // Создание пользователя с открытым паролем (privateUser) только
                // в одном блоке для исключения возможности использовать его дальше этого блока
                let privateUser = result.rows[0];
                const passwordHash = (0, common_1.encryptPasssword)(password);
                if (privateUser.password !== passwordHash) {
                    res.status(400).json({
                        error: "Неверный пароль",
                    });
                }
                user = {
                    id: privateUser.id,
                    name: privateUser.name,
                    surname: privateUser.surname,
                    nickname: privateUser.nickname,
                    email: privateUser.email,
                };
            }
            const accessToken = (0, common_1.generateAccessToken)(user);
            const refreshToken = (0, common_1.generateRefreshToken)(user);
            const loginResponse = {
                ...user,
                accessToken,
            };
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 31536000,
            })
                .status(200)
                .json(loginResponse);
        })
            .catch(err => {
            if (err) {
                console.log(err);
            }
            res.status(500);
        })
            .finally(() => {
            res.send();
        });
    });
};
exports.loginRoute = loginRoute;
