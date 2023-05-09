import { ChangeEvent, useCallback, FC } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateParsedDataHeadings } from "@/lib/utils";
import { supabase } from "@/lib/database/supabase";

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

const dataStructHeadingsCC = [
  "investmentOptionName",
  "assetClass",
  "assetName",
  "assetIdentifier",
  "dollarValue",
  "currency",
  "gicsSectorCodeAndName",
  "gicsIndustryGroupCodeAndName",
  "gicsIndustryCodeAndName",
  "gicsSubIndustryCodeAndName",
];

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
          break;
        // console.error(`Invalid column header: ${header}`);
      }
    });

    return rowObject;
  });
};

const CSVFileUpload: FC = () => {
  const uploadToSupabase = async (parsedData: any[]) => {
    try {
      const { error } = await supabase.from("data").insert(parsedData);
      if (error) {
        throw error;
      }
      console.log("success");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

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
          if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
            const slicedParsedData = parsedData.slice(0, 5);
            console.log("CSV Sliced extract:", slicedParsedData);
            const mappedData = mapParsedDataToJSON(slicedParsedData);
            await uploadToSupabase(mappedData);
            console.log("success upload");
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
          if (validateParsedDataHeadings(parsedData, dataStructHeadings)) {
            console.log("CSV extract:", parsedData.slice(0, 4));
            console.log(
              "CSV Parsed extract:",
              mapParsedDataToJSON(parsedData.slice(0, 4))
            );
            const slicedParsedData = parsedData.slice(0, 5);
            console.log("CSV Sliced extract:", slicedParsedData);
            const mappedData = mapParsedDataToJSON(slicedParsedData);
            await uploadToSupabase(mappedData);
            console.log("success upload");
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
    <input
      type="file"
      name="file-upload"
      className="bg-red-500"
      onChange={handleFileUpload}
    />
  );
};

export default CSVFileUpload;
