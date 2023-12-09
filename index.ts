import express from "express";
import { envConfig } from "./src/common/config/envConfig";
import { router } from "./src/common/router";
import cors from "cors";

const app: express.Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Router
app.use(router);

app.listen(envConfig.PORT || 3000, (): void => {
  console.log(`Server started on http://localhost:${envConfig.PORT || 3000}`);
});

export default app;
