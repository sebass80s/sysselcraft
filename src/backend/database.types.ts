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
      child_device_bindings: {
        Row: {
          auth_user_id: string
          child_id: string
          created_at: string
          household_id: string
        }
        Insert: {
          auth_user_id: string
          child_id: string
          created_at?: string
          household_id: string
        }
        Update: {
          auth_user_id?: string
          child_id?: string
          created_at?: string
          household_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_device_bindings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_device_bindings_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      child_game_state: {
        Row: {
          child_id: string
          diamonds: number
          progression: Json
          syssel_bux: number
          updated_at: string
          world_flags: Json
        }
        Insert: {
          child_id: string
          diamonds?: number
          progression?: Json
          syssel_bux?: number
          updated_at?: string
          world_flags?: Json
        }
        Update: {
          child_id?: string
          diamonds?: number
          progression?: Json
          syssel_bux?: number
          updated_at?: string
          world_flags?: Json
        }
        Relationships: [
          {
            foreignKeyName: "child_game_state_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      child_pairing_codes: {
        Row: {
          child_id: string
          code_hash: string
          created_at: string
          created_by: string
          expires_at: string
          household_id: string
          id: string
          redeemed_at: string | null
        }
        Insert: {
          child_id: string
          code_hash: string
          created_at?: string
          created_by: string
          expires_at: string
          household_id: string
          id?: string
          redeemed_at?: string | null
        }
        Update: {
          child_id?: string
          code_hash?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          household_id?: string
          id?: string
          redeemed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_pairing_codes_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_pairing_codes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          display_name: string
          dog_name: string
          household_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          dog_name?: string
          household_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          dog_name?: string
          household_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      diamond_reward_definitions: {
        Row: {
          active: boolean
          archived_at: string | null
          created_at: string
          created_by: string
          description: string
          diamond_price: number
          household_id: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          archived_at?: string | null
          created_at?: string
          created_by: string
          description?: string
          diamond_price: number
          household_id: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          archived_at?: string | null
          created_at?: string
          created_by?: string
          description?: string
          diamond_price?: number
          household_id?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diamond_reward_definitions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      diamond_reward_redemptions: {
        Row: {
          child_id: string
          delivered_at: string | null
          delivered_by: string | null
          diamond_price_snapshot: number
          household_id: string
          id: string
          purchased_at: string
          refunded_at: string | null
          refunded_by: string | null
          reward_definition_id: string | null
          reward_description_snapshot: string
          reward_title_snapshot: string
          status: string
        }
        Insert: {
          child_id: string
          delivered_at?: string | null
          delivered_by?: string | null
          diamond_price_snapshot: number
          household_id: string
          id?: string
          purchased_at?: string
          refunded_at?: string | null
          refunded_by?: string | null
          reward_definition_id?: string | null
          reward_description_snapshot?: string
          reward_title_snapshot: string
          status?: string
        }
        Update: {
          child_id?: string
          delivered_at?: string | null
          delivered_by?: string | null
          diamond_price_snapshot?: number
          household_id?: string
          id?: string
          purchased_at?: string
          refunded_at?: string | null
          refunded_by?: string | null
          reward_definition_id?: string | null
          reward_description_snapshot?: string
          reward_title_snapshot?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "diamond_reward_redemptions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diamond_reward_redemptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diamond_reward_redemptions_reward_definition_id_fkey"
            columns: ["reward_definition_id"]
            isOneToOne: false
            referencedRelation: "diamond_reward_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      household_members: {
        Row: {
          created_at: string
          household_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          household_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          household_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      parent_quests: {
        Row: {
          archived_at: string | null
          created_at: string
          created_by: string
          description: string
          household_id: string
          id: string
          progression_class: string
          recurrence_kind: string
          recurrence_timezone: string | null
          recurrence_weekdays: number[]
          reward_diamonds: number
          reward_syssel_bux: number
          title: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          created_by: string
          description: string
          household_id: string
          id?: string
          progression_class: string
          recurrence_kind?: string
          recurrence_timezone?: string | null
          recurrence_weekdays?: number[]
          reward_diamonds?: number
          reward_syssel_bux?: number
          title: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          created_by?: string
          description?: string
          household_id?: string
          id?: string
          progression_class?: string
          recurrence_kind?: string
          recurrence_timezone?: string | null
          recurrence_weekdays?: number[]
          reward_diamonds?: number
          reward_syssel_bux?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_quests_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_instances: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          child_id: string
          claimed_at: string | null
          created_at: string
          description_snapshot: string
          household_id: string
          id: string
          occurrence_key: string
          progression_class_snapshot: string
          quest_id: string
          reward_diamonds_snapshot: number
          reward_syssel_bux_snapshot: number
          state: string
          submitted_at: string | null
          title_snapshot: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          child_id: string
          claimed_at?: string | null
          created_at?: string
          description_snapshot: string
          household_id: string
          id?: string
          occurrence_key: string
          progression_class_snapshot: string
          quest_id: string
          reward_diamonds_snapshot: number
          reward_syssel_bux_snapshot: number
          state?: string
          submitted_at?: string | null
          title_snapshot: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          child_id?: string
          claimed_at?: string | null
          created_at?: string
          description_snapshot?: string
          household_id?: string
          id?: string
          occurrence_key?: string
          progression_class_snapshot?: string
          quest_id?: string
          reward_diamonds_snapshot?: number
          reward_syssel_bux_snapshot?: number
          state?: string
          submitted_at?: string | null
          title_snapshot?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_instances_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_instances_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_instances_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "parent_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_events: {
        Row: {
          child_id: string
          created_at: string
          diamonds: number
          id: string
          progression_class: string
          quest_instance_id: string
          syssel_bux: number
        }
        Insert: {
          child_id: string
          created_at?: string
          diamonds: number
          id?: string
          progression_class: string
          quest_instance_id: string
          syssel_bux: number
        }
        Update: {
          child_id?: string
          created_at?: string
          diamonds?: number
          id?: string
          progression_class?: string
          quest_instance_id?: string
          syssel_bux?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_events_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_events_quest_instance_id_fkey"
            columns: ["quest_instance_id"]
            isOneToOne: true
            referencedRelation: "quest_instances"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_diamond_reward: {
        Args: { p_reward_id: string }
        Returns: undefined
      }
      archive_parent_quest: { Args: { p_quest_id: string }; Returns: undefined }
      claim_quest_reward: {
        Args: { p_instance_id: string }
        Returns: undefined
      }
      create_child: {
        Args: { p_display_name: string; p_household_id: string }
        Returns: string
      }
      create_child_pairing_code: {
        Args: { p_child_id: string }
        Returns: string
      }
      create_diamond_reward: {
        Args: {
          p_description: string
          p_diamond_price: number
          p_household_id: string
          p_title: string
        }
        Returns: string
      }
      create_household: { Args: { p_name: string }; Returns: string }
      create_parent_quest: {
        Args: {
          p_child_id: string
          p_description: string
          p_household_id: string
          p_progression_class: string
          p_reward_diamonds?: number
          p_reward_syssel_bux?: number
          p_title: string
        }
        Returns: string
      }
      create_parent_quest_v2: {
        Args: {
          p_child_id: string
          p_description: string
          p_household_id: string
          p_progression_class: string
          p_recurrence_kind?: string
          p_recurrence_timezone?: string
          p_recurrence_weekdays?: number[]
          p_reward_diamonds?: number
          p_reward_syssel_bux?: number
          p_title: string
        }
        Returns: string
      }
      get_bound_child_id: { Args: never; Returns: string }
      is_bound_child: { Args: { p_child_id: string }; Returns: boolean }
      is_household_parent: {
        Args: { p_household_id: string }
        Returns: boolean
      }
      list_child_quests: {
        Args: { p_child_id: string }
        Returns: {
          approved_at: string
          child_id: string
          claimed_at: string
          created_at: string
          description: string
          household_id: string
          instance_id: string
          progression_class: string
          quest_id: string
          reward_diamonds: number
          reward_syssel_bux: number
          state: string
          submitted_at: string
          title: string
        }[]
      }
      list_parent_quest_definitions: {
        Args: { p_child_id: string }
        Returns: {
          child_id: string
          created_at: string
          description: string
          household_id: string
          progression_class: string
          quest_id: string
          recurrence_kind: string
          recurrence_timezone: string
          recurrence_weekdays: number[]
          reward_diamonds: number
          reward_syssel_bux: number
          title: string
        }[]
      }
      mark_diamond_reward_delivered: {
        Args: { p_redemption_id: string }
        Returns: undefined
      }
      materialize_due_quest_instances: {
        Args: { p_child_id: string }
        Returns: number
      }
      purchase_diamond_reward: {
        Args: { p_reward_definition_id: string }
        Returns: string
      }
      commit_story_beat: {
        Args: { p_beat_key: string }
        Returns: Json
      }
      purchase_story_item: {
        Args: { p_item_key: string }
        Returns: Json
      }
      redeem_child_pairing_code: { Args: { p_code: string }; Returns: string }
      refund_diamond_reward: {
        Args: { p_redemption_id: string }
        Returns: undefined
      }
      review_quest: {
        Args: { p_approve: boolean; p_instance_id: string }
        Returns: undefined
      }
      set_parent_quest_recurrence: {
        Args: {
          p_quest_id: string
          p_recurrence_kind: string
          p_recurrence_timezone?: string
          p_recurrence_weekdays?: number[]
        }
        Returns: undefined
      }
      submit_quest: { Args: { p_instance_id: string }; Returns: undefined }
      update_diamond_reward: {
        Args: {
          p_active: boolean
          p_description: string
          p_diamond_price: number
          p_reward_id: string
          p_title: string
        }
        Returns: undefined
      }
      update_parent_quest: {
        Args: {
          p_description: string
          p_progression_class: string
          p_quest_id: string
          p_reward_diamonds?: number
          p_reward_syssel_bux?: number
          p_title: string
        }
        Returns: undefined
      }
      update_parent_quest_v2: {
        Args: {
          p_description: string
          p_progression_class: string
          p_quest_id: string
          p_recurrence_kind?: string
          p_recurrence_timezone?: string
          p_recurrence_weekdays?: number[]
          p_reward_diamonds?: number
          p_reward_syssel_bux?: number
          p_title: string
        }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
