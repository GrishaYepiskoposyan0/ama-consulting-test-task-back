import { IRecord } from "../../modules/records/record.interface";

export const recordStructureValidation = (records: Array<IRecord>): boolean => {
  for (const record of records) {
    if (
      record.hasOwnProperty("reference") &&
      record.hasOwnProperty("accountNumber") &&
      record.hasOwnProperty("description") &&
      record.hasOwnProperty("startBalance") &&
      record.hasOwnProperty("mutation") &&
      record.hasOwnProperty("endBalance")
    ) {
      continue;
    }
    return false;
  }
  return true;
};
