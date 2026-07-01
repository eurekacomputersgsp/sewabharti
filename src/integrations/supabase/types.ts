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
      certificates: {
        Row: {
          course_name: string
          created_at: string
          ending_date: string | null
          grade: string | null
          id: string
          name: string
          registration_number: string
          serial_number: string
          son_of: string
          starting_date: string | null
          updated_at: string
        }
        Insert: {
          course_name: string
          created_at?: string
          ending_date?: string | null
          grade?: string | null
          id?: string
          name: string
          registration_number: string
          serial_number: string
          son_of: string
          starting_date?: string | null
          updated_at?: string
        }
        Update: {
          course_name?: string
          created_at?: string
          ending_date?: string | null
          grade?: string | null
          id?: string
          name?: string
          registration_number?: string
          serial_number?: string
          son_of?: string
          starting_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donor_name: string
          email: string | null
          id: string
          message: string | null
          pan_number: string | null
          phone: string
          purpose: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          donor_name: string
          email?: string | null
          id?: string
          message?: string | null
          pan_number?: string | null
          phone: string
          purpose?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          donor_name?: string
          email?: string | null
          id?: string
          message?: string | null
          pan_number?: string | null
          phone?: string
          purpose?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          album: string | null
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
        }
        Insert: {
          album?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
        }
        Update: {
          album?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      gallery_videos: {
        Row: {
          album: string | null
          created_at: string
          display_order: number
          id: string
          title: string
          youtube_id: string
        }
        Insert: {
          album?: string | null
          created_at?: string
          display_order?: number
          id?: string
          title: string
          youtube_id: string
        }
        Update: {
          album?: string | null
          created_at?: string
          display_order?: number
          id?: string
          title?: string
          youtube_id?: string
        }
        Relationships: []
      }
      news_events: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          event_date: string | null
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          title: string
          type: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          event_date?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          type?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          event_date?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          type?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          display_order: number
          featured: boolean
          gallery_images: Json | null
          id: string
          short_description: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery_images?: Json | null
          id?: string
          short_description?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          gallery_images?: Json | null
          id?: string
          short_description?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          created_at: string
          description: string | null
          file_type: string
          file_url: string
          id: string
          is_published: boolean
          published_date: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_type: string
          file_url: string
          id?: string
          is_published?: boolean
          published_date?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string
          id?: string
          is_published?: boolean
          published_date?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
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
      site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          bank_details: string | null
          emails: Json | null
          footer_quick_links: Json | null
          id: number
          logo_url: string | null
          map_embed_url: string | null
          nav_links: Json | null
          ngo_name: string
          phones: Json | null
          primary_color: string | null
          section_visibility: Json | null
          social_links: Json | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          bank_details?: string | null
          emails?: Json | null
          footer_quick_links?: Json | null
          id?: number
          logo_url?: string | null
          map_embed_url?: string | null
          nav_links?: Json | null
          ngo_name?: string
          phones?: Json | null
          primary_color?: string | null
          section_visibility?: Json | null
          social_links?: Json | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          bank_details?: string | null
          emails?: Json | null
          footer_quick_links?: Json | null
          id?: number
          logo_url?: string | null
          map_embed_url?: string | null
          nav_links?: Json | null
          ngo_name?: string
          phones?: Json | null
          primary_color?: string | null
          section_visibility?: Json | null
          social_links?: Json | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          designation: string | null
          display_order: number
          id: string
          name: string
          photo_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          display_order?: number
          id?: string
          name: string
          photo_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          designation?: string | null
          display_order?: number
          id?: string
          name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          display_order: number
          id: string
          message: string
          name: string
          photo_url: string | null
          published: boolean
          role: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          message: string
          name: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          message?: string
          name?: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          key: string
          lang: string
          value: string
        }
        Insert: {
          key: string
          lang: string
          value: string
        }
        Update: {
          key?: string
          lang?: string
          value?: string
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
      volunteers: {
        Row: {
          admin_notes: string | null
          availability: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          skills: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      site_settings_public: {
        Row: {
          accent_color: string | null
          address: string | null
          bank_details: string | null
          emails: Json | null
          footer_quick_links: Json | null
          id: number | null
          logo_url: string | null
          map_embed_url: string | null
          nav_links: Json | null
          ngo_name: string | null
          phones: Json | null
          primary_color: string | null
          section_visibility: Json | null
          social_links: Json | null
          updated_at: string | null
          upi_id: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          bank_details?: string | null
          emails?: Json | null
          footer_quick_links?: Json | null
          id?: number | null
          logo_url?: string | null
          map_embed_url?: string | null
          nav_links?: Json | null
          ngo_name?: string | null
          phones?: Json | null
          primary_color?: string | null
          section_visibility?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          bank_details?: string | null
          emails?: Json | null
          footer_quick_links?: Json | null
          id?: number | null
          logo_url?: string | null
          map_embed_url?: string | null
          nav_links?: Json | null
          ngo_name?: string | null
          phones?: Json | null
          primary_color?: string | null
          section_visibility?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          upi_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      verify_certificate: {
        Args: {
          p_name: string
          p_registration_number: string
          p_serial_number: string
          p_son_of: string
        }
        Returns: {
          course_name: string
          ending_date: string
          grade: string
          name: string
          registration_number: string
          serial_number: string
          son_of: string
          starting_date: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
