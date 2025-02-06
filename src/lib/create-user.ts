import { supabaseAnonKey } from "./config-supabase";

export async function createUser(data: any){
  let response = null
  let error = null;

  try{
    response = await fetch("https://iborvasrdopkfbmwuywt.supabase.co/auth/v1/signup", {
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
    error: response?.status === 422 ? "Esse e-mail já existe" : error
  }
}