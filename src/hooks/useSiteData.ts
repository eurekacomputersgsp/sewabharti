import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      const map: Record<string, any> = {};
      (data ?? []).forEach((row: any) => { map[row.key] = row.value; });
      return map;
    },
  });
}

export function useTranslationsAll() {
  return useQuery({
    queryKey: ["translations"],
    queryFn: async () => {
      const { data } = await supabase.from("translations").select("*");
      const map: Record<string, Record<string, string>> = { en: {}, hi: {}, pa: {} };
      (data ?? []).forEach((row: any) => {
        if (!map[row.lang]) map[row.lang] = {};
        map[row.lang][row.key] = row.value;
      });
      return map;
    },
  });
}
