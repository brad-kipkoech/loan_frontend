import React from "react"

export const Card:React.FC<{
 title?:string
 subtitle?:string
 actions?:React.ReactNode
 children:React.ReactNode
}> = ({title,subtitle,actions,children}) => (

<div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-6 sm:max-w-lg sm:p-8">

{(title || subtitle || actions) && (

<div className="mb-6 flex justify-between">

<div>

{title && <h1 className="text-xl font-bold text-slate-900">{title}</h1>}

{subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}

</div>

{actions}

</div>

)}

{children}

</div>

)