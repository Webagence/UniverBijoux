export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_blocks: {
        Row: {
          data: Json
          key: string
          updated_at: string
        }
        Insert: {
          data?: Json
          key: string
          updated_at?: string
        }
        Update: {
          data?: Json
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          active: boolean
          answer: string
          category: string | null
          created_at: string
          display_order: number
          id: string
          question: string
        }
        Insert: {
          active?: boolean
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          question: string
        }
        Update: {
          active?: boolean
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          question?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          issued_at: string
          order_id: string
          pdf_path: string | null
          total_ht: number
          total_ttc: number
          user_id: string
          vat_amount: number
        }
        Insert: {
          id?: string
          invoice_number: string
          issued_at?: string
          order_id: string
          pdf_path?: string | null
          total_ht: number
          total_ttc: number
          user_id: string
          vat_amount: number
        }
        Update: {
          id?: string
          invoice_number?: string
          issued_at?: string
          order_id?: string
          pdf_path?: string | null
          total_ht?: number
          total_ttc?: number
          user_id?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_ht: number
          order_id: string
          product_id: string | null
          product_name: string
          product_reference: string | null
          quantity: number
          unit_price_ht: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_ht: number
          order_id: string
          product_id?: string | null
          product_name: string
          product_reference?: string | null
          quantity: number
          unit_price_ht: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total_ht?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_reference?: string | null
          quantity?: number
          unit_price_ht?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          carrier: string | null
          created_at: string
          id: string
          notes: string | null
          reference: string
          shipping_address: Json
          shipping_ht: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_ht: number
          total_ttc: number
          tracking_number: string | null
          updated_at: string
          user_id: string
          vat_amount: number
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reference?: string
          shipping_address?: Json
          shipping_ht?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_ht?: number
          total_ttc?: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
          vat_amount?: number
        }
        Update: {
          carrier?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reference?: string
          shipping_address?: Json
          shipping_ht?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_ht?: number
          total_ttc?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          images: Json
          is_new: boolean
          material: string | null
          moq: number
          name: string
          pack_size: number
          price_ht: number
          reference: string | null
          slug: string
          stock: number
          universe_id: string | null
          updated_at: string
          vat_rate: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_new?: boolean
          material?: string | null
          moq?: number
          name: string
          pack_size?: number
          price_ht?: number
          reference?: string | null
          slug: string
          stock?: number
          universe_id?: string | null
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_new?: boolean
          material?: string | null
          moq?: number
          name?: string
          pack_size?: number
          price_ht?: number
          reference?: string | null
          slug?: string
          stock?: number
          universe_id?: string | null
          updated_at?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_universe_id_fkey"
            columns: ["universe_id"]
            isOneToOne: false
            referencedRelation: "universes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          approved: boolean
          city: string | null
          company_name: string
          contact_name: string
          country: string | null
          created_at: string
          email: string
          id: string
          phone: string | null
          postal_code: string | null
          siret: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          approved?: boolean
          city?: string | null
          company_name?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email: string
          id: string
          phone?: string | null
          postal_code?: string | null
          siret?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          approved?: boolean
          city?: string | null
          company_name?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          postal_code?: string | null
          siret?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          author: string
          created_at: string
          display_order: number
          id: string
          quote: string
          rating: number
          role: string | null
        }
        Insert: {
          active?: boolean
          author: string
          created_at?: string
          display_order?: number
          id?: string
          quote: string
          rating?: number
          role?: string | null
        }
        Update: {
          active?: boolean
          author?: string
          created_at?: string
          display_order?: number
          id?: string
          quote?: string
          rating?: number
          role?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_admin: boolean
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_admin?: boolean
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          priority: string
          reference: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          priority?: string
          reference?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          priority?: string
          reference?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universes: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "pro"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "shipped"
        | "delivered"
        | "cancelled"
      ticket_status: "open" | "pending" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "pro"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      ticket_status: ["open", "pending", "resolved", "closed"],
    },
  },
} as const
