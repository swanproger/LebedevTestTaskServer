import {Express} from "express";
import {processFormRoute} from "./process-form";

export const formRoute = (app: Express) => {
	const domain = `/api/cadex`;

	processFormRoute(app, domain);
};
