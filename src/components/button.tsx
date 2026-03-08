import React from "react"

export const Button:React.FC<
React.ButtonHTMLAttributes<HTMLButtonElement> & {
variant?:"primary" | "ghost"
}
> = ({variant="primary",className,...props}) => (

<button
 {...props}
 className={[
  "rounded-xl px-4 py-3 font-semibold transition",
  variant==="primary"
   ? "bg-emerald-600 text-white hover:bg-emerald-500"
   : "border border-slate-200 bg-white hover:bg-slate-50",
  className ?? ""
 ].join(" ")}
/>

)