import { ChangeEvent, useCallback, FC, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import SuccessfulUploadModal from "../SuccessfulUploadModal";
import { aggregatedSuperFundHoldingsDataTableHeadings } from "@/lib/consts";
import { uploadToSupabase } from "@/lib/utils";

export type mappedDataStruct = {
  investmentOptionName: string | null;
  assetClass: string | null;
  assetName: string | null;
  assetIdentifier: string | null;
  dollarValue: number | null;
  currency: string | null;
  gicsSectorCodeAndName: string | null;
  gicsIndustryGroupCodeAndName: string | null;
  gicsIndustryCodeAndName: string | null;
  gicsSubIndustryCodeAndName: string | null;
};

const mapParsedDataToJSON = (parsedData: any[]): mappedDataStruct[] => {
  const headers = parsedData[0];
  const dataRows = parsedData.slice(1);

  return dataRows.map((row) => {
    const rowObject: mappedDataStruct = {
      investmentOptionName: null,
      assetClass: null,
      assetName: null,
      dollarValue: null,
      assetIdentifier: null,
      currency: null,
      gicsSectorCodeAndName: null,
      gicsIndustryGroupCodeAndName: null,
      gicsIndustryCodeAndName: null,
      gicsSubIndustryCodeAndName: null,
    };

    row.forEach((value: string, index: number) => {
      const header = headers[index];
      switch (header) {
        case "Investment Option Name":
          rowObject.investmentOptionName = value;
          break;
        case "Asset Class":
          rowObject.assetClass = value;
          break;
        case "Asset Name":
          rowObject.assetName = value;
          break;
        case "Asset Identifier":
          rowObject.assetIdentifier = value;
          break;
        case "Dollar Value":
          rowObject.dollarValue = parseFloat(value);
          break;
        case "Currency":
          rowObject.currency = value;
          break;
        case "GICS Sector Code and Name":
          rowObject.gicsSectorCodeAndName = value;
          break;
        case "GICS Industry Group Code & Name":
          rowObject.gicsIndustryGroupCodeAndName = value;
          break;
        case "GICS Industry Code & name":
          rowObject.gicsIndustryCodeAndName = value;
          break;
        case "GICS Sub-Industry Code and Name":
          rowObject.gicsSubIndustryCodeAndName = value;
          break;
        default:
          console.error(`Invalid column header: ${header}`);
      }
    });

    return rowObject;
  });
};

const CSVFileUpload: FC = () => {
  const [successfulUploadModalOpen, setSuccessfulUploadModalOpen] =
    useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

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
            const mappedData = mapParsedDataToJSON(parsedData);
            await uploadToSupabase(mappedData, "data");
            setSuccessfulUploadModalOpen(true);
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
            const mappedData = mapParsedDataToJSON(parsedData);
            await uploadToSupabase(mappedData, "data");
            setSuccessfulUploadModalOpen(true);
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
      {successfulUploadModalOpen ? <SuccessfulUploadModal /> : null}

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
            <p className="pl-1">{uploadedFileName}</p>
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
