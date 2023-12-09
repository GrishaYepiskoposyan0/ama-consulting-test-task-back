import { Request, Router } from "express";
import * as routerController from "./record.controller";
import multer from "multer";
export const recordRouter: Router = Router();

const upload: multer.Multer = multer({
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ): void {
    if (["application/xml", "text/csv"].includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error("Invalid file!"));
  },
});

recordRouter.post("/upload", upload.single("file"), routerController.upload);
recordRouter.get("/:filename", routerController.getFile);
recordRouter.get("/", routerController.getAllFilenames);
