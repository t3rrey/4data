export type SuperInvestmentHoldingsData =
  Database["public"]["Tables"]["data"]["Row"];

export type SuperFund = Database["public"]["Tables"]["super_funds"]["Row"];

export type RecentUpload =
  Database["public"]["Tables"]["recent_uploads"]["Row"];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      data: {
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
          created_at: string | null;
          current_as_of: string;
          file_name: string;
          id: number;
          rows_added: number;
          super_fund: number;
        };
        Insert: {
          created_at?: string | null;
          current_as_of: string;
          file_name: string;
          id?: number;
          rows_added: number;
          super_fund: number;
        };
        Update: {
          created_at?: string | null;
          current_as_of?: string;
          file_name?: string;
          id?: number;
          rows_added?: number;
          super_fund?: number;
        };
      };
      super_funds: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
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
