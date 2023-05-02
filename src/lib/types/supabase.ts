export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      data: {
        Row: {
          assetClass: string | null
          assetIdentifier: string | null
          assetName: string | null
          created_at: string | null
          currency: string | null
          dollarValue: number | null
          gicsCodeAndName: string | null
          gicsIndustryGroupCodeAndName: string | null
          gicsSubIndustryCodeAndName: string | null
          id: number
          investmentOptionName: string | null
        }
        Insert: {
          assetClass?: string | null
          assetIdentifier?: string | null
          assetName?: string | null
          created_at?: string | null
          currency?: string | null
          dollarValue?: number | null
          gicsCodeAndName?: string | null
          gicsIndustryGroupCodeAndName?: string | null
          gicsSubIndustryCodeAndName?: string | null
          id?: number
          investmentOptionName?: string | null
        }
        Update: {
          assetClass?: string | null
          assetIdentifier?: string | null
          assetName?: string | null
          created_at?: string | null
          currency?: string | null
          dollarValue?: number | null
          gicsCodeAndName?: string | null
          gicsIndustryGroupCodeAndName?: string | null
          gicsSubIndustryCodeAndName?: string | null
          id?: number
          investmentOptionName?: string | null
        }
      }
      superfundPhd: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
