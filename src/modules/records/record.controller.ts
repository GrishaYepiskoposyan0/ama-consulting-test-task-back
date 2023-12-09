import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as recordService from "./record.service";
import * as path from "path";
import fs from "node:fs/promises";

export const upload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(StatusCodes.FORBIDDEN).json({ error: "File is not loaded!" });
      return;
    }
    const result: { success: boolean; message?: string } =
      await recordService.upload(req.file);
    res
      .status(result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST)
      .json(result);
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Something went wrong!" });
  }
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const filename = req.params.filename;
    if (!filename) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, error: "Invalid filename!" });
      return;
    }
    res.sendFile(path.join(process.cwd(), "files", filename), {
      headers: {
        "Content-Disposition": `attachment;filename=${filename}`,
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Something went wrong!" });
  }
};
export const getAllFilenames = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files: Array<string> = await fs.readdir(
      path.join(process.cwd(), "files"),
    );
    res.status(StatusCodes.OK).json({ filenames: files });
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Something went wrong!" });
  }
};
