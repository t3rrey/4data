import {
  aggregatedSuperFundHoldingsDataTableHeadings,
  dataStructHeadingsCC,
} from "../consts";

export type UploadSuperInvestmentHoldingsData = {
  assetClass: string | null;
  assetIdentifier: string | null;
  assetName: string | null;
  currency: string | null;
  dollarValue: number | null;
  gicsIndustryCodeAndName: string | null;
  gicsIndustryGroupCodeAndName: string | null;
  gicsSectorCodeAndName: string | null;
  gicsSubIndustryCodeAndName: string | null;
  investmentOptionName: string | null;
  super_fund: number;
  recent_uploads: number;
};
/**
 *
 * @param data  the data to be validated
 * @param headings  the headings to be validated against
 * @returns true if the data headings match the headings provided
 */

export const validateParsedDataHeadings = (
  data: any[],
  headings: string[]
): boolean => {
  if (
    !data[0] ||
    data[0].length !== headings.length ||
    !data[0].every((value: string, index: number) => value === headings[index])
  ) {
    return false;
  }

  return true;
};

export const formatCurrency = (
  input: number | null,
  currency: string | null
): string => {
  if (!input) return "";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(input);

  return formatted.substring(1);
};

export function mapToCamelCase(value: string): string | null {
  const index = aggregatedSuperFundHoldingsDataTableHeadings.indexOf(value);
  if (index !== -1) {
    return dataStructHeadingsCC[index];
  }
  return null; // return null if value is not found
}

export const mapParsedDataToJSON = (
  parsedData: any[],
  superFundId: number,
  recentUploadsId: number
): UploadSuperInvestmentHoldingsData[] => {
  const headers = parsedData[0];
  const dataRows = parsedData.slice(1);

  return dataRows.map((row) => {
    const rowObject: UploadSuperInvestmentHoldingsData = {
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
      super_fund: superFundId,
      recent_uploads: recentUploadsId,
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

export const formatTimestamp = (timestamp: string): string => {
  let date: Date = new Date(timestamp);
  let formattedTime: string = date.toLocaleDateString();
  return formattedTime;
};

export function toSnakeCaseArray(inputArray: string[]): string[] {
  return inputArray.map((str) => toSnakeCase(str));
}

export function toSnakeCase(str: string): string {
  return (
    "unique_" +
    str
      .replace(/&/g, "and") // replace '&' with 'and'
      .replace(/-/g, "_") // replace '-' with '_'
      .replace(/\s+/g, " ") // replace multiple spaces with a single space
      .split(" ") // split by space
      .join("_") // join by underscore
      .toLowerCase() // convert to lower case
  ); // convert to lower case
}

export function toCamelCaseArray(arr: string[]): string[] {
  return arr.map((str) => toCamelCase(str));
}

export function toCamelCase(str: string): string {
  // Replace special characters with a space
  str = str.replace(/[^a-zA-Z0-9 ]/g, " ");
  // Split the string into words
  const words = str.split(" ");

  // Convert the first word to lower case
  const firstWord = words[0].toLowerCase();

  // Convert the first character of each of the remaining words to upper case
  const camelCaseWords = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Join the first word with the rest of the words
  return firstWord + camelCaseWords.join("");
}
