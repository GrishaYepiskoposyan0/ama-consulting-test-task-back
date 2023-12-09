import { IRecord } from "./record.interface";
import { XMLParser } from "fast-xml-parser";
import { Converter } from "csvtojson/v2/Converter";
import csv from "csvtojson/index";
import fs from "node:fs/promises";
import { recordStructureValidation } from "../../common/utils/record-structure.validation";

export const upload = async (
  file: Express.Multer.File,
): Promise<{ success: boolean; message?: string }> => {
  let records: Array<IRecord>;
  try {
    if (file.mimetype === "application/xml") {
      const xmlContent: string = file.buffer.toString("utf-8");
      const parser: XMLParser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });
      const {
        records: { record },
      } = parser.parse(xmlContent);
      records = record;
    } else {
      const converter: Converter = csv({
        trim: true,
        headers: [
          "reference",
          "accountNumber",
          "description",
          "startBalance",
          "mutation",
          "endBalance",
        ],
      });
      records = await converter.fromString(file.buffer.toString());
    }
  } catch {
    return { success: false, message: "Invalid File!" };
  }
  if (!recordStructureValidation(records)) {
    return { success: false, message: "Invalid File!" };
  }
  const content: Array<string> = [];

  const duplicateMap: Record<number, number> = {};
  const map: Record<string, Array<IRecord>> = {};
  for (const record of records) {
    if (duplicateMap[`${record.reference}`]) {
      duplicateMap[`${record.reference}`]++;
    } else {
      duplicateMap[`${record.reference}`] = 1;
    }
    if (map[record.accountNumber]) {
      map[record.accountNumber].push(record);
    } else {
      map[record.accountNumber] = [record];
    }
  }
  for (const reference in duplicateMap) {
    if (duplicateMap[reference] > 1) {
      content.push(
        `Transaction with reference ${reference} has anomaly: It is duplicated! There is ${duplicateMap[reference]} duplicates\n`,
      );
    }
  }

  for (const key in map) {
    const current: IRecord = map[key][0];
    let balance: number =
      Math.round((+current.startBalance + +current.mutation) * 1e12) / 1e12;

    if (balance !== +current.endBalance) {
      content.push(
        `Transaction with reference ${
          current.reference
        } has anomaly: Invalid End Balance! ${current.startBalance}${
          current.mutation > 0 && "+"
        }${current.mutation} != ${current.endBalance}\n`,
      );
    }
    if (map[key].length !== 0) {
      for (let i = 1; i < map[key].length; i++) {
        const currentRecord: IRecord = map[key][i];
        if (balance !== +currentRecord.startBalance) {
          content.push(
            `Transaction with reference ${currentRecord.reference} has anomaly: Invalid Start Balance!\nPrevious end balance is not equal to current start balance: ${balance} != ${currentRecord.startBalance}\n`,
          );
        }
        balance =
          Math.round(
            (+currentRecord.startBalance + +currentRecord.mutation) * 1e12,
          ) / 1e12;

        if (balance !== +currentRecord.endBalance) {
          content.push(
            `Transaction with reference ${
              currentRecord.reference
            } has anomaly: Invalid End Balance! ${currentRecord.startBalance}${
              currentRecord.mutation > 0 && "+"
            }${currentRecord.mutation} != ${currentRecord.endBalance}\n`,
          );
        }
      }
    }
  }
  if (content.length) {
    await fs.writeFile(
      `files/${file.originalname.split(".")[0]}-${Date.now()}.txt`,
      content.join("\n"),
    );
  }

  return {
    success: !content.length,
  };
};
