import type { User as UserSupabase} from "@supabase/supabase-js";

export enum UserRole {
  MANAGER = "GERENTE",
  NORMAL = "NORMAL"
}

export type User = UserSupabase & {
  name: string
  role: UserRole,
  image?: string,
  create_at: Date 
}