import { Router } from "express";
import { recordRouter } from "../../modules/records/record.router";

export const router: Router = Router();

router.use("/record", recordRouter);
