import { ChangeEvent, useCallback, FC, useMemo } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";

const dataStructHeadings = [
  "Investment Option Name",
  "Asset Class",
  "Asset Name",
  "Asset Identifier",
  "Dollar Value",
  "Currency",
  "GICS Sector Code and Name",
  "GICS Industry Group Code & Name",
  "GICS Industry Code & name",
  "GICS Sub-Industry Code and Name",
];

const CSVFileUpload: FC = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!file) return;

      const fileType = file.name.split(".").pop();
      const reader = new FileReader();

      if (fileType === "csv") {
        reader.onload = () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData as string, {
            header: false,
          }).data;
          if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
            console.log(parsedData);
          } else {
            console.error("Invalid data format");
          }
        };
        reader.readAsText(file);
      } else if (fileType === "xlsx") {
        reader.onload = () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
            console.log(parsedData);
          } else {
            console.error("Invalid data format");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file type");
      }
    });
  }, []);

  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop();
    const reader = new FileReader();

    if (fileType === "csv") {
      reader.onload = () => {
        const csvData = reader.result;
        const parsedData = Papa.parse(csvData as string, {
          header: false,
        }).data;
        if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
          console.log(parsedData);
        } else {
          console.error("Invalid data format");
        }
      };
      reader.readAsText(file);
    } else if (fileType === "xlsx") {
      reader.onload = () => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
          console.log(parsedData);
        } else {
          console.error("Invalid data format");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error("Unsupported file type");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const baseClasses =
    "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-white transition-colors duration-200 ease-in-out";
  const activeClasses = "border-indigo-600";

  return (
    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
        >
          Data
        </label>
        <div className="mt-2 sm:col-span-2 sm:mt-0">
          <div
            className={`${baseClasses} ${
              isDragActive ? activeClasses : "border-gray-200"
            }`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
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
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileUpload}
                      id="file-upload"
                      name="file-upload"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">CSV or XLSX</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVFileUpload;
