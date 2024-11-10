import {Express} from "express";

export const processFormRoute = (app: Express, domain: string) => {
	app.post(`${domain}/form`, (req, res) => {
		const data = req.body;

		const name = data.name;

		if (!name) {
			res.status(400).send({error: "Missing name property"});

			return;
		}

		const responseMessage = `Thank you for your interest, ${name}`;

		console.log(responseMessage);

		res.status(200).send({message: responseMessage});
	});
};
