export async function createUser(data: any){
  let user = null;
  let error = null;

  try{
    user = await fetch("https://iborvasrdopkfbmwuywt.supabase.co/auth/v1/signup", {
      method: "POST",
      headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlib3J2YXNyZG9wa2ZibXd1eXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjAwNDgsImV4cCI6MjA1MTEzNjA0OH0.ZvcpaPbqhn4B6jkGEleMbxZu9dWrnIxZmooDs_9QLLU",
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