export const fmtKES = (n:number) =>
  new Intl.NumberFormat("en-KE",{
    style:"currency",
    currency:"KES"
  }).format(n)

export function normalizeKEPhone(phone:string){

  let p = phone.trim()

  if(p.startsWith("0")) return "254"+p.slice(1)

  if(p.startsWith("+")) return p.slice(1)

  return p
}