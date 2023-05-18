import { ChangeEvent, useCallback, FC, Dispatch, SetStateAction } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import { aggregatedSuperFundHoldingsDataTableHeadings } from "@/lib/consts";
import { mapParsedDataToJSON } from "@/lib/utils";
import { SuperFund } from "@/lib/types";

/**
 *
 * This function, mapParsedDataToJSON, takes an array of parsed data and maps it to an array of JSON objects with a defined structure (mappedDataStruct).
 * It iterates through each data row and assigns values based on the column header, creating a new rowObject for each row.
 */

export interface ICSVFileUploadProps {
  setCSVData: any;
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
  selectedSuperFund: SuperFund | null;
}

const CSVFileUpload: FC<ICSVFileUploadProps> = ({
  setCSVData,
  fileName,
  setFileName,
  selectedSuperFund,
}) => {
  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      setFileName(file.name);

      const fileType = file.name.split(".").pop();
      const reader = new FileReader();

      if (fileType === "csv") {
        reader.onload = async () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData as string, {
            header: false,
          }).data;
          if (
            validateParsedDataHeadings(
              parsedData,
              aggregatedSuperFundHoldingsDataTableHeadings
            )
          ) {
            const mappedData = mapParsedDataToJSON(
              parsedData,
              selectedSuperFund?.id || 1
            );
            setCSVData(mappedData);
          } else {
            console.error("Invalid data format");
          }
        };
        reader.readAsText(file);
      } else if (fileType === "xlsx") {
        reader.onload = async () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (
            validateParsedDataHeadings(
              parsedData,
              aggregatedSuperFundHoldingsDataTableHeadings
            )
          ) {
            const mappedData = mapParsedDataToJSON(
              parsedData,
              selectedSuperFund?.id || 1
            );
            setCSVData(mappedData);
          } else {
            console.error("Invalid data format");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file type");
      }
    },
    []
  );

  return (
    <>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <TableCellsIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span className="mx-auto">Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
            <p className="pl-4 text-black font-bold">{fileName}</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </>
  );
};

export default CSVFileUpload;
