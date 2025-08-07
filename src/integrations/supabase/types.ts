export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string | null
          agency_number: string | null
          bank_code: string | null
          bank_name: string | null
          color: string | null
          created_at: string | null
          current_balance: number | null
          deleted_at: string | null
          icon: string | null
          id: string
          include_in_total: boolean | null
          initial_balance: number | null
          is_active: boolean | null
          is_default: boolean | null
          last_sync_at: string | null
          name: string
          open_finance_id: string | null
          open_finance_token: string | null
          sync_enabled: boolean | null
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          agency_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          color?: string | null
          created_at?: string | null
          current_balance?: number | null
          deleted_at?: string | null
          icon?: string | null
          id?: string
          include_in_total?: boolean | null
          initial_balance?: number | null
          is_active?: boolean | null
          is_default?: boolean | null
          last_sync_at?: string | null
          name: string
          open_finance_id?: string | null
          open_finance_token?: string | null
          sync_enabled?: boolean | null
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          agency_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          color?: string | null
          created_at?: string | null
          current_balance?: number | null
          deleted_at?: string | null
          icon?: string | null
          id?: string
          include_in_total?: boolean | null
          initial_balance?: number | null
          is_active?: boolean | null
          is_default?: boolean | null
          last_sync_at?: string | null
          name?: string
          open_finance_id?: string | null
          open_finance_token?: string | null
          sync_enabled?: boolean | null
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          alert_at_100: boolean | null
          alert_at_50: boolean | null
          alert_at_75: boolean | null
          alert_at_90: boolean | null
          amount: number
          category_id: string | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          period: Database["public"]["Enums"]["budget_period"]
          rollover: boolean | null
          spent_amount: number | null
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_at_100?: boolean | null
          alert_at_50?: boolean | null
          alert_at_75?: boolean | null
          alert_at_90?: boolean | null
          amount: number
          category_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          period?: Database["public"]["Enums"]["budget_period"]
          rollover?: boolean | null
          spent_amount?: number | null
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_at_100?: boolean | null
          alert_at_50?: boolean | null
          alert_at_75?: boolean | null
          alert_at_90?: boolean | null
          amount?: number
          category_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          period?: Database["public"]["Enums"]["budget_period"]
          rollover?: boolean | null
          spent_amount?: number | null
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          name: string
          parent_id: string | null
          slug: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_card_bills: {
        Row: {
          card_id: string
          closing_date: string
          created_at: string
          due_date: string
          id: string
          is_paid: boolean
          paid_at: string | null
          payment_transaction_id: string | null
          reference_month: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          card_id: string
          closing_date: string
          created_at?: string
          due_date: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_transaction_id?: string | null
          reference_month: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          card_id?: string
          closing_date?: string
          created_at?: string
          due_date?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_transaction_id?: string | null
          reference_month?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_bills_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          available_limit: number | null
          brand: Database["public"]["Enums"]["card_brand"]
          closing_day: number | null
          color: string | null
          created_at: string | null
          credit_limit: number | null
          deleted_at: string | null
          due_day: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_virtual: boolean | null
          last_digits: string | null
          last_sync_at: string | null
          name: string
          open_finance_id: string | null
          parent_card_id: string | null
          type: Database["public"]["Enums"]["card_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_limit?: number | null
          brand?: Database["public"]["Enums"]["card_brand"]
          closing_day?: number | null
          color?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          due_day?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_virtual?: boolean | null
          last_digits?: string | null
          last_sync_at?: string | null
          name: string
          open_finance_id?: string | null
          parent_card_id?: string | null
          type?: Database["public"]["Enums"]["card_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_limit?: number | null
          brand?: Database["public"]["Enums"]["card_brand"]
          closing_day?: number | null
          color?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          due_day?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_virtual?: boolean | null
          last_digits?: string | null
          last_sync_at?: string | null
          name?: string
          open_finance_id?: string | null
          parent_card_id?: string | null
          type?: Database["public"]["Enums"]["card_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_parent_card_id_fkey"
            columns: ["parent_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      documentacao_funcoes: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string
          examples: string | null
          function_name: string
          id: string
          parameters: string | null
          performance_notes: string | null
          permission_levels: string | null
          related_functions: Json | null
          return_type: string | null
          security_notes: string | null
          status: string | null
          updated_at: string | null
          usage_notes: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          examples?: string | null
          function_name: string
          id?: string
          parameters?: string | null
          performance_notes?: string | null
          permission_levels?: string | null
          related_functions?: Json | null
          return_type?: string | null
          security_notes?: string | null
          status?: string | null
          updated_at?: string | null
          usage_notes?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          examples?: string | null
          function_name?: string
          id?: string
          parameters?: string | null
          performance_notes?: string | null
          permission_levels?: string | null
          related_functions?: Json | null
          return_type?: string | null
          security_notes?: string | null
          status?: string | null
          updated_at?: string | null
          usage_notes?: string | null
          version?: string | null
        }
        Relationships: []
      }
      documentacao_rls: {
        Row: {
          anti_redundancy_applied: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          implementation_notes: string | null
          performance_impact: string | null
          permission_matrix: string | null
          policies_created: Json | null
          rls_type: string
          security_functions_used: Json | null
          status: string | null
          table_name: string
          updated_at: string | null
        }
        Insert: {
          anti_redundancy_applied?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          implementation_notes?: string | null
          performance_impact?: string | null
          permission_matrix?: string | null
          policies_created?: Json | null
          rls_type: string
          security_functions_used?: Json | null
          status?: string | null
          table_name: string
          updated_at?: string | null
        }
        Update: {
          anti_redundancy_applied?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          implementation_notes?: string | null
          performance_impact?: string | null
          permission_matrix?: string | null
          policies_created?: Json | null
          rls_type?: string
          security_functions_used?: Json | null
          status?: string | null
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documentacao_tabelas: {
        Row: {
          business_rules: string | null
          constraints_applied: Json | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          indexes_created: Json | null
          main_purpose: string | null
          module: string | null
          related_tables: Json | null
          rls_applied: boolean | null
          rls_type: string | null
          status: string | null
          table_name: string
          table_type: string | null
          updated_at: string | null
        }
        Insert: {
          business_rules?: string | null
          constraints_applied?: Json | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          indexes_created?: Json | null
          main_purpose?: string | null
          module?: string | null
          related_tables?: Json | null
          rls_applied?: boolean | null
          rls_type?: string | null
          status?: string | null
          table_name: string
          table_type?: string | null
          updated_at?: string | null
        }
        Update: {
          business_rules?: string | null
          constraints_applied?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          indexes_created?: Json | null
          main_purpose?: string | null
          module?: string | null
          related_tables?: Json | null
          rls_applied?: boolean | null
          rls_type?: string | null
          status?: string | null
          table_name?: string
          table_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documentacao_views: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          indexes_created: Json | null
          module: string | null
          performance_notes: string | null
          refresh_strategy: string | null
          size_info: string | null
          source_tables: Json | null
          status: string | null
          updated_at: string | null
          usage_purpose: string | null
          view_name: string
          view_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          indexes_created?: Json | null
          module?: string | null
          performance_notes?: string | null
          refresh_strategy?: string | null
          size_info?: string | null
          source_tables?: Json | null
          status?: string | null
          updated_at?: string | null
          usage_purpose?: string | null
          view_name: string
          view_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          indexes_created?: Json | null
          module?: string | null
          performance_notes?: string | null
          refresh_strategy?: string | null
          size_info?: string | null
          source_tables?: Json | null
          status?: string | null
          updated_at?: string | null
          usage_purpose?: string | null
          view_name?: string
          view_type?: string | null
        }
        Relationships: []
      }
      family_group_members: {
        Row: {
          auto_import: boolean | null
          group_id: string
          id: string
          joined_at: string | null
          left_at: string | null
          notifications_enabled: boolean | null
          status: Database["public"]["Enums"]["family_member_status"] | null
          user_id: string
        }
        Insert: {
          auto_import?: boolean | null
          group_id: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          notifications_enabled?: boolean | null
          status?: Database["public"]["Enums"]["family_member_status"] | null
          user_id: string
        }
        Update: {
          auto_import?: boolean | null
          group_id?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          notifications_enabled?: boolean | null
          status?: Database["public"]["Enums"]["family_member_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      family_groups: {
        Row: {
          created_at: string | null
          created_by_id: string
          description: string | null
          id: string
          invite_code: string | null
          max_members: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_id: string
          description?: string | null
          id?: string
          invite_code?: string | null
          max_members?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          max_members?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          ai_categorized: boolean | null
          ai_confidence: number | null
          amount: number
          bill_id: string | null
          card_id: string | null
          category_id: string
          created_at: string | null
          date: string
          deleted_at: string | null
          description: string
          id: string
          installment_group_id: string | null
          installment_number: number | null
          installment_total: number | null
          is_installment: boolean | null
          is_recurring: boolean | null
          is_transfer: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          notes: string | null
          paid_at: string | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          transfer_from_id: string | null
          transfer_to_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          ai_categorized?: boolean | null
          ai_confidence?: number | null
          amount: number
          bill_id?: string | null
          card_id?: string | null
          category_id: string
          created_at?: string | null
          date: string
          deleted_at?: string | null
          description: string
          id?: string
          installment_group_id?: string | null
          installment_number?: number | null
          installment_total?: number | null
          is_installment?: boolean | null
          is_recurring?: boolean | null
          is_transfer?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          paid_at?: string | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          transfer_from_id?: string | null
          transfer_to_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          ai_categorized?: boolean | null
          ai_confidence?: number | null
          amount?: number
          bill_id?: string | null
          card_id?: string | null
          category_id?: string
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          description?: string
          id?: string
          installment_group_id?: string | null
          installment_number?: number | null
          installment_total?: number | null
          is_installment?: boolean | null
          is_recurring?: boolean | null
          is_transfer?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          paid_at?: string | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          transfer_from_id?: string | null
          transfer_to_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "credit_card_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_transfer_from_id_fkey"
            columns: ["transfer_from_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_transfer_to_id_fkey"
            columns: ["transfer_to_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_resumo_documentacao: {
        Row: {
          data_consulta: string | null
          funcoes_documentadas: number | null
          rls_documentadas: number | null
          tabelas_documentadas: number | null
          titulo: string | null
          total_documentos: number | null
          views_documentadas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      buscar_documentacao: {
        Args: { p_termo?: string; p_tipo?: string }
        Returns: {
          tipo: string
          nome: string
          descricao: string
          modulo: string
          status_obj: string
          criado_em: string
        }[]
      }
      estatisticas_documentacao: {
        Args: Record<PropertyKey, never>
        Returns: {
          tipo: string
          total_objetos: number
          total_documentado: number
          percentual_cobertura: number
          status_emoji: string
        }[]
      }
      verificar_documentacao_pendente: {
        Args: Record<PropertyKey, never>
        Returns: {
          tipo: string
          objeto: string
          schema_name: string
          acao_necessaria: string
        }[]
      }
    }
    Enums: {
      account_type:
        | "CHECKING"
        | "SAVINGS"
        | "CASH"
        | "PREPAID"
        | "INVESTMENT"
        | "OTHER"
      budget_period: "MONTHLY" | "QUARTERLY" | "YEARLY"
      card_brand: "VISA" | "MASTERCARD" | "ELO" | "AMEX" | "HIPERCARD" | "OTHER"
      card_type: "CREDIT" | "DEBIT" | "CREDIT_DEBIT" | "PREPAID" | "VIRTUAL"
      family_member_status: "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED"
      recurrence_type:
        | "NONE"
        | "DAILY"
        | "WEEKLY"
        | "MONTHLY"
        | "YEARLY"
        | "CUSTOM"
      transaction_type: "INCOME" | "EXPENSE" | "TRANSFER"
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
      account_type: [
        "CHECKING",
        "SAVINGS",
        "CASH",
        "PREPAID",
        "INVESTMENT",
        "OTHER",
      ],
      budget_period: ["MONTHLY", "QUARTERLY", "YEARLY"],
      card_brand: ["VISA", "MASTERCARD", "ELO", "AMEX", "HIPERCARD", "OTHER"],
      card_type: ["CREDIT", "DEBIT", "CREDIT_DEBIT", "PREPAID", "VIRTUAL"],
      family_member_status: ["ACTIVE", "INACTIVE", "PENDING", "BLOCKED"],
      recurrence_type: [
        "NONE",
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "YEARLY",
        "CUSTOM",
      ],
      transaction_type: ["INCOME", "EXPENSE", "TRANSFER"],
    },
  },
} as const
