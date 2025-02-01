import type { User as UserSupabase} from "@supabase/supabase-js";

export enum UserRole {
  MANAGER = "GERENTE",
  NORMAL = "NORMAL"
}

export enum UserStatus{
  ACTIVED = "ATIVO",
  DESACTIVED="DESATIVADO",
  REGISTED="REGISTRADO"
}

export type User = UserSupabase & {
  name: string
  role: UserRole,
  status?: UserStatus,
  image?: string,
  create_at: Date 
}