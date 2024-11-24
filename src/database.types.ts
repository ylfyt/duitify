export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  user_schema: {
    Tables: {
      account: {
        Row: {
          balance: number
          created_at: string
          id: string
          initial_balance: number
          logo: string
          name: string
          updated_at: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          initial_balance: number
          logo: string
          name: string
          updated_at?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          initial_balance?: number
          logo?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expense: {
        Row: {
          account_id: string
          amount: number
          category_id: string
          created_at: string
          description: string
          id: string
          occurred_at: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          amount: number
          category_id: string
          created_at?: string
          description: string
          id?: string
          occurred_at: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          occurred_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_category"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_category: {
        Row: {
          created_at: string
          id: string
          logo: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      income: {
        Row: {
          account_id: string
          amount: number
          category_id: string
          created_at: string
          description: string
          id: string
          occurred_at: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          amount: number
          category_id: string
          created_at?: string
          description: string
          id?: string
          occurred_at: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          occurred_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "income_category"
            referencedColumns: ["id"]
          },
        ]
      }
      income_category: {
        Row: {
          created_at: string
          id: string
          logo: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transfer: {
        Row: {
          amount: number
          created_at: string
          description: string
          from_account_id: string
          id: string
          occurred_at: string
          to_account_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          from_account_id: string
          id?: string
          occurred_at: string
          to_account_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          from_account_id?: string
          id?: string
          occurred_at?: string
          to_account_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfer_from_account_id_fkey"
            columns: ["from_account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
