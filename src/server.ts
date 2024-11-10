import express, {Express} from "express";
import {formRoute} from "./routes";

const app: Express = express();
const port = 5001;

app.use(express.json());

formRoute(app);

app.listen(port, () => {
	console.log(`\nСервер успешно запущен по адресу http://localhost:${port}\n`);
});
