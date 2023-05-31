import Papa from "papaparse";
import { supabase } from "../database/supabase";

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

export const deleteAllDataFromSingleTable = async (table: string) => {
  const { error } = await supabase.from(table).delete().neq("id", 0);
  if (error) {
    console.log("error", error);
  }
};
