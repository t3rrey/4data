import { ChangeEvent, useCallback, FC, Dispatch, SetStateAction } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import { aggregatedSuperFundHoldingsDataTableHeadings } from "@/lib/consts";
import { SuperFund } from "@/lib/types";

/**
 * This component, CSVFileUpload, handles the uploading and parsing of CSV files.
 * It takes the uploaded file, reads it, and parses the data based on the file type (csv or xlsx).
 * If the parsed data has valid headings, it sets the CSV data using the setCSVData function.
 */

// Define the props interface for CSVFileUpload component
export interface ICSVFileUploadProps {
  setCSVData: any;
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
  selectedSuperFund: SuperFund | null;
}

// Define the CSVFileUpload component
const CSVFileUpload: FC<ICSVFileUploadProps> = ({
  setCSVData,
  fileName,
  setFileName,
  selectedSuperFund,
}) => {
  // Handle file upload event
  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // Set the file name in state
      setFileName(file.name);

      const fileType = file.name.split(".").pop();
      const reader = new FileReader();

      if (fileType === "csv") {
        // Read and parse CSV file
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
            // Set the parsed data in state
            setCSVData(parsedData);
          } else {
          }
        };
        reader.readAsText(file);
      } else if (fileType === "xlsx") {
        // Read and parse XLSX file
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
            // Set the parsed data in state
            setCSVData(parsedData);
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
  
  // Render the file upload component
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
            CSV and XLXS up to 10mb
          </p>
        </div>
      </div>
    </>
  );
};

export default CSVFileUpload;
