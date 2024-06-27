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
      airlines: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notes: string | null
          short_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          short_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          short_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          airline_id: string
          created_at: string | null
          id: string
          pax_name: string
          record_locator: string
          sectors: string
          tickets_info: Json
          total_ticket: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          airline_id: string
          created_at?: string | null
          id?: string
          pax_name: string
          record_locator: string
          sectors: string
          tickets_info: Json
          total_ticket?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          airline_id?: string
          created_at?: string | null
          id?: string
          pax_name?: string
          record_locator?: string
          sectors?: string
          tickets_info?: Json
          total_ticket?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_airline_id_fkey"
            columns: ["airline_id"]
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      commissions: {
        Row: {
          airline_id: string
          class: string
          commission: number
          created_at: string | null
          description: string
          id: string
          service_fee: number
          updated_at: string | null
        }
        Insert: {
          airline_id: string
          class: string
          commission: number
          created_at?: string | null
          description: string
          id?: string
          service_fee: number
          updated_at?: string | null
        }
        Update: {
          airline_id?: string
          class?: string
          commission?: number
          created_at?: string | null
          description?: string
          id?: string
          service_fee?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_airline_id_fkey"
            columns: ["airline_id"]
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          }
        ]
      }
      fees: {
        Row: {
          airline_id: string
          category: string
          created_at: string | null
          description: string
          id: string
          service_fee: number
          updated_at: string | null
        }
        Insert: {
          airline_id: string
          category: string
          created_at?: string | null
          description: string
          id?: string
          service_fee: number
          updated_at?: string | null
        }
        Update: {
          airline_id?: string
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          service_fee?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fees_airline_id_fkey"
            columns: ["airline_id"]
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      statements: {
        Row: {
          created_at: string | null
          end_date: string
          ending_balance: number
          id: string
          initial_balance: number
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          ending_balance?: number
          id?: string
          initial_balance?: number
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          ending_balance?: number
          id?: string
          initial_balance?: number
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          cost: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          id: string
          receiver_user: string | null
          type: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receiver_user?: string | null
          type: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          receiver_user?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_receiver_user_fkey"
            columns: ["receiver_user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          admin_role: string | null
          balance: number
          company_name: string
          id: string
          is_operating: boolean
          max_credit: number
          updated_at: string
        }
        Insert: {
          admin_role?: string | null
          balance?: number
          company_name: string
          id: string
          is_operating?: boolean
          max_credit?: number
          updated_at?: string
        }
        Update: {
          admin_role?: string | null
          balance?: number
          company_name?: string
          id?: string
          is_operating?: boolean
          max_credit?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distinct_transactions: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          receiver_user: string
        }[]
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
