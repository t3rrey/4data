import { supabase } from "../database/supabase";
import {
  aggregatedSuperFundHoldingsDataTableHeadings,
  dataStructHeadingsCC,
} from "../consts";
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

export const uploadToSupabase = async (parsedData: any[], table: string) => {
  try {
    const { error } = await supabase.from(table).insert(parsedData);
    if (error) {
      throw error;
    }
    console.log("success");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

export function mapToCamelCase(value: string): string | null {
  const index = aggregatedSuperFundHoldingsDataTableHeadings.indexOf(value);
  if (index !== -1) {
    return dataStructHeadingsCC[index];
  }
  return null; // return null if value is not found
}
