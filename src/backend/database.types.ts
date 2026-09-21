export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      child_device_bindings: {
        Row: {
          auth_user_id: string;
          child_id: string;
          created_at: string;
          household_id: string;
        };
        Insert: {
          auth_user_id: string;
          child_id: string;
          created_at?: string;
          household_id: string;
        };
        Update: {
          auth_user_id?: string;
          child_id?: string;
          created_at?: string;
          household_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "child_device_bindings_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_device_bindings_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      child_game_state: {
        Row: {
          child_id: string;
          diamonds: number;
          progression: Json;
          syssel_bux: number;
          updated_at: string;
          world_flags: Json;
        };
        Insert: {
          child_id: string;
          diamonds?: number;
          progression?: Json;
          syssel_bux?: number;
          updated_at?: string;
          world_flags?: Json;
        };
        Update: {
          child_id?: string;
          diamonds?: number;
          progression?: Json;
          syssel_bux?: number;
          updated_at?: string;
          world_flags?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "child_game_state_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: true;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
        ];
      };
      child_pairing_codes: {
        Row: {
          child_id: string;
          code_hash: string;
          created_at: string;
          created_by: string;
          expires_at: string;
          household_id: string;
          id: string;
          redeemed_at: string | null;
        };
        Insert: {
          child_id: string;
          code_hash: string;
          created_at?: string;
          created_by: string;
          expires_at: string;
          household_id: string;
          id?: string;
          redeemed_at?: string | null;
        };
        Update: {
          child_id?: string;
          code_hash?: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          household_id?: string;
          id?: string;
          redeemed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "child_pairing_codes_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_pairing_codes_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      children: {
        Row: {
          created_at: string;
          display_name: string;
          dog_name: string;
          household_id: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          dog_name?: string;
          household_id: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          dog_name?: string;
          household_id?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "children_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      household_members: {
        Row: {
          created_at: string;
          household_id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          household_id: string;
          role: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          household_id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      households: {
        Row: {
          archived_at: string | null;
          created_at: string;
          created_by: string;
          id: string;
          name: string;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          name: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      parent_quests: {
        Row: {
          created_at: string;
          created_by: string;
          description: string;
          household_id: string;
          id: string;
          progression_class: string;
          recurrence_kind: string;
          recurrence_timezone: string | null;
          recurrence_weekdays: number[];
          reward_diamonds: number;
          reward_syssel_bux: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          description: string;
          household_id: string;
          id?: string;
          progression_class: string;
          recurrence_kind?: string;
          recurrence_timezone?: string | null;
          recurrence_weekdays?: number[];
          reward_diamonds?: number;
          reward_syssel_bux?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          description?: string;
          household_id?: string;
          id?: string;
          progression_class?: string;
          recurrence_kind?: string;
          recurrence_timezone?: string | null;
          recurrence_weekdays?: number[];
          reward_diamonds?: number;
          reward_syssel_bux?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parent_quests_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      quest_instances: {
        Row: {
          approved_at: string | null;
          approved_by: string | null;
          child_id: string;
          created_at: string;
          household_id: string;
          id: string;
          occurrence_key: string;
          progression_class_snapshot: string;
          quest_id: string;
          reward_diamonds_snapshot: number;
          reward_syssel_bux_snapshot: number;
          state: string;
          title_snapshot: string;
          description_snapshot: string;
          submitted_at: string | null;
        };
        Insert: {
          approved_at?: string | null;
          approved_by?: string | null;
          child_id: string;
          created_at?: string;
          household_id: string;
          id?: string;
          occurrence_key: string;
          progression_class_snapshot: string;
          quest_id: string;
          reward_diamonds_snapshot: number;
          reward_syssel_bux_snapshot: number;
          state?: string;
          title_snapshot: string;
          description_snapshot: string;
          submitted_at?: string | null;
        };
        Update: {
          approved_at?: string | null;
          approved_by?: string | null;
          child_id?: string;
          created_at?: string;
          household_id?: string;
          id?: string;
          occurrence_key?: string;
          progression_class_snapshot?: string;
          quest_id?: string;
          reward_diamonds_snapshot?: number;
          reward_syssel_bux_snapshot?: number;
          state?: string;
          title_snapshot?: string;
          description_snapshot?: string;
          submitted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quest_instances_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_instances_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_instances_quest_id_fkey";
            columns: ["quest_id"];
            isOneToOne: false;
            referencedRelation: "parent_quests";
            referencedColumns: ["id"];
          },
        ];
      };
      reward_events: {
        Row: {
          child_id: string;
          created_at: string;
          diamonds: number;
          id: string;
          progression_class: string;
          quest_instance_id: string;
          syssel_bux: number;
        };
        Insert: {
          child_id: string;
          created_at?: string;
          diamonds: number;
          id?: string;
          progression_class: string;
          quest_instance_id: string;
          syssel_bux: number;
        };
        Update: {
          child_id?: string;
          created_at?: string;
          diamonds?: number;
          id?: string;
          progression_class?: string;
          quest_instance_id?: string;
          syssel_bux?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reward_events_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reward_events_quest_instance_id_fkey";
            columns: ["quest_instance_id"];
            isOneToOne: true;
            referencedRelation: "quest_instances";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      archive_parent_quest: {
        Args: { p_quest_id: string };
        Returns: undefined;
      };
      create_child: {
        Args: { p_display_name: string; p_household_id: string };
        Returns: string;
      };
      create_child_pairing_code: {
        Args: { p_child_id: string };
        Returns: string;
      };
      create_household: { Args: { p_name: string }; Returns: string };
      create_parent_quest: {
        Args: {
          p_child_id: string;
          p_description: string;
          p_household_id: string;
          p_progression_class: string;
          p_reward_diamonds?: number;
          p_reward_syssel_bux?: number;
          p_title: string;
        };
        Returns: string;
      };
      is_bound_child: { Args: { p_child_id: string }; Returns: boolean };
      is_household_parent: {
        Args: { p_household_id: string };
        Returns: boolean;
      };
      list_parent_quest_definitions: {
        Args: { p_child_id: string };
        Returns: {
          child_id: string;
          created_at: string;
          description: string;
          household_id: string;
          progression_class: string;
          quest_id: string;
          recurrence_kind: string;
          recurrence_timezone: string | null;
          recurrence_weekdays: number[];
          reward_diamonds: number;
          reward_syssel_bux: number;
          title: string;
        }[];
      };
      list_child_quests: {
        Args: { p_child_id: string };
        Returns: {
          approved_at: string;
          child_id: string;
          created_at: string;
          description: string;
          household_id: string;
          instance_id: string;
          progression_class: string;
          quest_id: string;
          reward_diamonds: number;
          reward_syssel_bux: number;
          state: string;
          submitted_at: string;
          title: string;
        }[];
      };
      redeem_child_pairing_code: { Args: { p_code: string }; Returns: string };
      review_quest: {
        Args: { p_approve: boolean; p_instance_id: string };
        Returns: undefined;
      };
      submit_quest: { Args: { p_instance_id: string }; Returns: undefined };
      update_parent_quest: {
        Args: {
          p_description: string;
          p_progression_class: string;
          p_quest_id: string;
          p_reward_diamonds?: number;
          p_reward_syssel_bux?: number;
          p_title: string;
        };
        Returns: undefined;
      };

    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][PublicTableName]["Row"];

export type TablesInsert<
  PublicTableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][PublicTableName]["Insert"];

export type TablesUpdate<
  PublicTableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][PublicTableName]["Update"];
