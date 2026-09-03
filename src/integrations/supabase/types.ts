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
      about_us_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          language: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          language: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          language?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_date: string
          seo_meta_description: string | null
          seo_meta_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_date?: string
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_date?: string
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_editable_profile: {
        Row: {
          about_me: string | null
          additional_info: string | null
          created_at: string
          hobbies: string | null
          partner_preferences: string | null
          personal_introduction: string | null
          preferred_age_range: string | null
          preferred_location: string | null
          profile_id: number
          updated_at: string
        }
        Insert: {
          about_me?: string | null
          additional_info?: string | null
          created_at?: string
          hobbies?: string | null
          partner_preferences?: string | null
          personal_introduction?: string | null
          preferred_age_range?: string | null
          preferred_location?: string | null
          profile_id: number
          updated_at?: string
        }
        Update: {
          about_me?: string | null
          additional_info?: string | null
          created_at?: string
          hobbies?: string | null
          partner_preferences?: string | null
          personal_introduction?: string | null
          preferred_age_range?: string | null
          preferred_location?: string | null
          profile_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_editable_profile_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
        ]
      }
      member_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          profile_data_id: number | null
          registration_id: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          profile_data_id?: number | null
          registration_id?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          profile_data_id?: number | null
          registration_id?: string | null
        }
        Relationships: []
      }
      member_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          last_active_at: string
          profile_data_id: number | null
          registration_id: string | null
          revoked_at: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at: string
          id?: string
          last_active_at?: string
          profile_data_id?: number | null
          registration_id?: string | null
          revoked_at?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          last_active_at?: string
          profile_data_id?: number | null
          registration_id?: string | null
          revoked_at?: string | null
        }
        Relationships: []
      }
      privacy_policy_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_interests: {
        Row: {
          created_at: string
          id: string
          receiver_profile_id: number
          sender_profile_id: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_profile_id: number
          sender_profile_id: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_profile_id?: number
          sender_profile_id?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_receiver_profile_id_fkey"
            columns: ["receiver_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_update_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          current_value: string | null
          field_name: string
          id: string
          profile_id: number
          reason: string | null
          requested_value: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          current_value?: string | null
          field_name: string
          id?: string
          profile_id: number
          reason?: string | null
          requested_value: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          current_value?: string | null
          field_name?: string
          id?: string
          profile_id?: number
          reason?: string | null
          requested_value?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_update_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          viewed_at: string
          viewed_profile_id: number
          viewer_profile_id: number
        }
        Insert: {
          id?: string
          viewed_at?: string
          viewed_profile_id: number
          viewer_profile_id: number
        }
        Update: {
          id?: string
          viewed_at?: string
          viewed_profile_id?: number
          viewer_profile_id?: number
        }
        Relationships: []
      }
      profiles_data: {
        Row: {
          active_device_info: Json | null
          active_session_id: string | null
          admin_notes: string | null
          age: string
          biodata_url: string | null
          caste: string | null
          complexion: string
          created_at: string | null
          date_of_birth: string | null
          display_order: number
          dob: string
          education: string
          email: string | null
          family: string
          gender: string
          height: string
          id: number
          is_live: boolean
          islamic_knowledge: string | null
          last_login_at: string | null
          location: string
          login_count: number
          marital_status: string
          maslak: string | null
          name: string
          other_info: string | null
          photo_urls: string[] | null
          plan_type: string
          preferred_age: string
          preferred_location: string
          preferred_partner: string
          premium_expiry: string | null
          profession: string
          registration_id: string | null
          updated_at: string | null
          verification_status: string
          whatsapp_number: string | null
        }
        Insert: {
          active_device_info?: Json | null
          active_session_id?: string | null
          admin_notes?: string | null
          age: string
          biodata_url?: string | null
          caste?: string | null
          complexion: string
          created_at?: string | null
          date_of_birth?: string | null
          display_order?: number
          dob: string
          education: string
          email?: string | null
          family: string
          gender: string
          height: string
          id?: number
          is_live?: boolean
          islamic_knowledge?: string | null
          last_login_at?: string | null
          location: string
          login_count?: number
          marital_status: string
          maslak?: string | null
          name: string
          other_info?: string | null
          photo_urls?: string[] | null
          plan_type?: string
          preferred_age: string
          preferred_location: string
          preferred_partner: string
          premium_expiry?: string | null
          profession: string
          registration_id?: string | null
          updated_at?: string | null
          verification_status?: string
          whatsapp_number?: string | null
        }
        Update: {
          active_device_info?: Json | null
          active_session_id?: string | null
          admin_notes?: string | null
          age?: string
          biodata_url?: string | null
          caste?: string | null
          complexion?: string
          created_at?: string | null
          date_of_birth?: string | null
          display_order?: number
          dob?: string
          education?: string
          email?: string | null
          family?: string
          gender?: string
          height?: string
          id?: number
          is_live?: boolean
          islamic_knowledge?: string | null
          last_login_at?: string | null
          location?: string
          login_count?: number
          marital_status?: string
          maslak?: string | null
          name?: string
          other_info?: string | null
          photo_urls?: string[] | null
          plan_type?: string
          preferred_age?: string
          preferred_location?: string
          preferred_partner?: string
          premium_expiry?: string | null
          profession?: string
          registration_id?: string | null
          updated_at?: string | null
          verification_status?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_data_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_order: {
        Row: {
          id: number
          order_position: number
          profile_id: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          order_position: number
          profile_id: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          order_position?: number
          profile_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      registration_submissions: {
        Row: {
          biodata_url: string | null
          caste: string
          complexion: string
          created_at: string
          date_of_birth: string
          education_details: string
          email: string
          family_details: string
          full_name: string
          gender: string
          height: string
          id: string
          islamic_education: string | null
          marital_status: string
          maslak: string
          occupation_details: string
          other_info: string | null
          partner_preferences: string
          photo_urls: string[]
          preferred_age_range: string
          preferred_location: string
          referral: string | null
          residence_location: string
          status: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          biodata_url?: string | null
          caste: string
          complexion: string
          created_at?: string
          date_of_birth: string
          education_details: string
          email: string
          family_details: string
          full_name: string
          gender: string
          height: string
          id?: string
          islamic_education?: string | null
          marital_status: string
          maslak: string
          occupation_details: string
          other_info?: string | null
          partner_preferences: string
          photo_urls: string[]
          preferred_age_range: string
          preferred_location: string
          referral?: string | null
          residence_location: string
          status?: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          biodata_url?: string | null
          caste?: string
          complexion?: string
          created_at?: string
          date_of_birth?: string
          education_details?: string
          email?: string
          family_details?: string
          full_name?: string
          gender?: string
          height?: string
          id?: string
          islamic_education?: string | null
          marital_status?: string
          maslak?: string
          occupation_details?: string
          other_info?: string | null
          partner_preferences?: string
          photo_urls?: string[]
          preferred_age_range?: string
          preferred_location?: string
          referral?: string | null
          residence_location?: string
          status?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          active_device_info: Json | null
          active_session_id: string | null
          admin_notes: string | null
          biodata_url: string | null
          caste: string
          complexion: string
          created_at: string
          date_of_birth: string
          education_details: string
          email: string
          family_details: string
          full_name: string
          gender: string
          height: string
          id: string
          is_live: boolean
          islamic_education: string | null
          last_login_at: string | null
          login_count: number
          marital_status: string
          maslak: string
          occupation_details: string
          other_info: string | null
          partner_preferences: string
          photo_urls: string[]
          plan_type: string
          preferred_age_range: string
          preferred_location: string
          premium_expiry: string | null
          referral: string | null
          residence_location: string
          updated_at: string
          verification_status: string
          whatsapp_number: string
        }
        Insert: {
          active_device_info?: Json | null
          active_session_id?: string | null
          admin_notes?: string | null
          biodata_url?: string | null
          caste: string
          complexion: string
          created_at?: string
          date_of_birth: string
          education_details: string
          email: string
          family_details: string
          full_name: string
          gender: string
          height: string
          id?: string
          is_live?: boolean
          islamic_education?: string | null
          last_login_at?: string | null
          login_count?: number
          marital_status: string
          maslak: string
          occupation_details: string
          other_info?: string | null
          partner_preferences: string
          photo_urls?: string[]
          plan_type?: string
          preferred_age_range: string
          preferred_location: string
          premium_expiry?: string | null
          referral?: string | null
          residence_location: string
          updated_at?: string
          verification_status?: string
          whatsapp_number: string
        }
        Update: {
          active_device_info?: Json | null
          active_session_id?: string | null
          admin_notes?: string | null
          biodata_url?: string | null
          caste?: string
          complexion?: string
          created_at?: string
          date_of_birth?: string
          education_details?: string
          email?: string
          family_details?: string
          full_name?: string
          gender?: string
          height?: string
          id?: string
          is_live?: boolean
          islamic_education?: string | null
          last_login_at?: string | null
          login_count?: number
          marital_status?: string
          maslak?: string
          occupation_details?: string
          other_info?: string | null
          partner_preferences?: string
          photo_urls?: string[]
          plan_type?: string
          preferred_age_range?: string
          preferred_location?: string
          premium_expiry?: string | null
          referral?: string | null
          residence_location?: string
          updated_at?: string
          verification_status?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      saved_profiles: {
        Row: {
          created_at: string
          id: string
          owner_profile_id: number
          saved_profile_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          owner_profile_id: number
          saved_profile_id: number
        }
        Update: {
          created_at?: string
          id?: string
          owner_profile_id?: number
          saved_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "saved_profiles_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_profiles_saved_profile_id_fkey"
            columns: ["saved_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_data"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
