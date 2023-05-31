// Define types for various database tables and rows

// Type for a row in the "data" table
export type SuperInvestmentHoldingsData =
  Database["public"]["Tables"]["data"]["Row"];

// Type for a row in the "super_funds" table
export type SuperFund = Database["public"]["Tables"]["super_funds"]["Row"];

// Type for a row in the "recent_uploads" table
export type RecentUpload =
  Database["public"]["Tables"]["recent_uploads"]["Row"];

// Type for representing JSON data  
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Interface representing the structure of the entire database  
export interface Database {
  public: {
    Tables: {
      data: {
        // Structure of a row in the "data" table
        Row: {
          assetClass: string | null;
          assetIdentifier: string | null;
          assetName: string | null;
          created_at: string | null;
          currency: string | null;
          dollarValue: number | null;
          gicsIndustryCodeAndName: string | null;
          gicsIndustryGroupCodeAndName: string | null;
          gicsSectorCodeAndName: string | null;
          gicsSubIndustryCodeAndName: string | null;
          id: number;
          investmentOptionName: string | null;
          super_fund: number;
        };
        Insert: {
          // Structure of an insert operation for the "data" table
          assetClass?: string | null;
          assetIdentifier?: string | null;
          assetName?: string | null;
          created_at?: string | null;
          currency?: string | null;
          dollarValue?: number | null;
          gicsIndustryCodeAndName?: string | null;
          gicsIndustryGroupCodeAndName?: string | null;
          gicsSectorCodeAndName?: string | null;
          gicsSubIndustryCodeAndName?: string | null;
          id?: number;
          investmentOptionName?: string | null;
          super_fund: number;
        };
        Update: {
          // Structure of an update operation for the "data" table
          assetClass?: string | null;
          assetIdentifier?: string | null;
          assetName?: string | null;
          created_at?: string | null;
          currency?: string | null;
          dollarValue?: number | null;
          gicsIndustryCodeAndName?: string | null;
          gicsIndustryGroupCodeAndName?: string | null;
          gicsSectorCodeAndName?: string | null;
          gicsSubIndustryCodeAndName?: string | null;
          id?: number;
          investmentOptionName?: string | null;
          super_fund?: number;
        };
      };
      recent_uploads: {
        Row: {
          // Structure of a row in the "recent_uploads" table
          created_at: string | null;
          current_as_of: string;
          file_name: string;
          id: number;
          rows_added: number;
          super_fund: number;
        };
        Insert: {
          // Structure of a insert operation in the "recent_uploads" table
          created_at?: string | null;
          current_as_of: string;
          file_name: string;
          id?: number;
          rows_added: number;
          super_fund: number;
        };
        Update: {
          // Structure of a update operation in the "recent_uploads" table
          created_at?: string | null;
          current_as_of?: string;
          file_name?: string;
          id?: number;
          rows_added?: number;
          super_fund?: number;
        };
      };
      super_funds: {
        // Structure of a row in the "super_funds" table
        Row: {
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          // Structure of an insert operation for the "super_funds" table
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          // Structure of an update operation for the "super_funds" table
          created_at?: string | null;
          id?: number;
          name?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
