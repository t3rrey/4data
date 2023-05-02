import { ChangeEvent, useCallback, FC } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";

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

const FileUpload: FC = () => {
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

  return (
    <div>
      <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />
    </div>
  );
};

export default FileUpload;
