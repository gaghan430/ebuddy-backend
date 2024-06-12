import dotenv from "dotenv";
dotenv.config();

import App from "@core/app";
import router from "./routes";
import config from "@config/config";

const port = process.env.PORT || config.port || 3000;
const app = new App(router).express;

app.listen(port, () => {
    console.log(`API is listening on http://localhost:${port}`);
});