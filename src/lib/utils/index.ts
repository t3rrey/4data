import {
  aggregatedSuperFundHoldingsDataTableHeadings,
  dataStructHeadingsCC,
} from "../consts";

// Type definition for the data structure to be uploaded
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

/**
 * Formats a number as currency.
 * @param input The number to format.
 * @param currency The currency symbol to use.
 * @returns The formatted currency string.
 */

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

/**
 * Maps a given value to its corresponding camelCase value.
 * @param value The value to map to camelCase.
 * @returns The camelCase value or null if not found.
 */
export function mapToCamelCase(value: string): string | null {
  const index = aggregatedSuperFundHoldingsDataTableHeadings.indexOf(value);
  if (index !== -1) {
    return dataStructHeadingsCC[index];
  }
  return null; // return null if value is not found
}


/**
 * Maps parsed data to an array of UploadSuperInvestmentHoldingsData objects.
 * @param parsedData The parsed data to map.
 * @param superFundId The ID of the super fund associated with the data.
 * @param recentUploadsId The ID of the recent upload associated with the data.
 * @returns An array of mapped UploadSuperInvestmentHoldingsData objects.
 */

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

/**
 * Formats a timestamp string to a localized date string.
 * @param timestamp The timestamp string to format.
 * @returns The formatted date string.
 */

export const formatTimestamp = (timestamp: string): string => {
  let date: Date = new Date(timestamp);
  let formattedTime: string = date.toLocaleDateString();
  return formattedTime;
};
