import express from "express";
import { envConfig } from "./src/common/config/envConfig";
import { router } from "./src/common/router";

const app: express.Express = express();

// Router
app.use(router);

app.listen(envConfig.PORT, (): void => {
  console.log(`Server started on http://localhost:${envConfig.PORT}`);
});
