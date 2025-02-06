import { supabaseAnonKey } from "./config-supabase";

export async function createUser(data: any){
  let user = null;
  let error = null;

  try{
    user = await fetch("https://iborvasrdopkfbmwuywt.supabase.co/auth/v1/signup", {
      method: "POST",
      headers: {
        "apikey": supabaseAnonKey ?? "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  }catch(err){
    error = err
  }
  
  return {
    data: user,
    error
  }
}