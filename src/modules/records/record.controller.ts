import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as recordService from "./record.service";
export const upload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(StatusCodes.FORBIDDEN).json({ error: "File is not loaded!" });
      return;
    }
    const result: { success: boolean } = await recordService.upload(req.file);
    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    console.log(e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Something went wrong!" });
  }
};
