export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string
          user_id: string
          table_name: string
          record_id: string
          operation_type: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data: Json | null
          new_data: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          table_name: string
          record_id: string
          operation_type: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          table_name?: string
          record_id?: string
          operation_type?: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string | null
        }
      }
      categorization_rules: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          criteria: Json
          actions: Json
          relation_operator: string
          status: string
          priority: number | null
          last_modified: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          criteria: Json
          actions: Json
          relation_operator?: string
          status?: string
          priority?: number | null
          last_modified?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          criteria?: Json
          actions?: Json
          relation_operator?: string
          status?: string
          priority?: number | null
          last_modified?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rule_executions: {
        Row: {
          id: string
          rule_id: string
          transaction_id: string
          user_id: string
          execution_time: string | null
          success: boolean
          error_message: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          rule_id: string
          transaction_id: string
          user_id: string
          execution_time?: string | null
          success: boolean
          error_message?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          rule_id?: string
          transaction_id?: string
          user_id?: string
          execution_time?: string | null
          success?: boolean
          error_message?: string | null
          created_at?: string | null
        }
      }
      transaction_previews: {
        Row: {
          id: string
          user_id: string
          payee: string
          memo: string | null
          amount: number
          date: string
          account: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          payee: string
          memo?: string | null
          amount: number
          date: string
          account: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          payee?: string
          memo?: string | null
          amount?: number
          date?: string
          account?: string
          created_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          default_budget_id: string | null
          theme: string | null
          auto_sync: boolean | null
          sync_frequency: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          default_budget_id?: string | null
          theme?: string | null
          auto_sync?: boolean | null
          sync_frequency?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          default_budget_id?: string | null
          theme?: string | null
          auto_sync?: boolean | null
          sync_frequency?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ynab_categories: {
        Row: {
          id: string
          user_id: string
          budget_id: string
          ynab_category_id: string
          name: string
          parent_category_id: string | null
          is_hidden: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          budget_id: string
          ynab_category_id: string
          name: string
          parent_category_id?: string | null
          is_hidden?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          budget_id?: string
          ynab_category_id?: string
          name?: string
          parent_category_id?: string | null
          is_hidden?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ynab_connections: {
        Row: {
          id: string
          user_id: string
          budget_id: string
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          last_sync: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          budget_id: string
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          budget_id?: string
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync?: string | null
          created_at?: string | null
          updated_at?: string | null
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
  }
}
