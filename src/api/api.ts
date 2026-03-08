const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:8000"

const TOKEN_KEY="loan_access_token"

export async function apiFetch<T>(
  path:string,
  options:RequestInit & {auth?:boolean} = {auth:true}
):Promise<T>{

  const headers:Record<string,string>={
    "Content-Type":"application/json"
  }

  if(options.auth!==false){
    const token = localStorage.getItem(TOKEN_KEY)
    if(token) headers.Authorization=`Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`,{
    ...options,
    headers
  })

  const data = await res.json()

  if(!res.ok){
    throw new Error(data?.detail ?? "Request failed")
  }

  return data as T
}