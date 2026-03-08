import { useState } from "react"
import { apiFetch } from "../api/api"

type Props = {
  onLogin: () => void
  goSignup: () => void
}

export default function LoginPage({ onLogin, goSignup }: Props) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {

    const res = await apiFetch<{access_token:string}>(
      "/api/auth/login",
      {
        method:"POST",
        auth:false,
        body:JSON.stringify({email,password})
      }
    )

    localStorage.setItem("loan_access_token", res.access_token)
    localStorage.setItem("user_email", email)

    onLogin()
  }

  return (

    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">

      <h2 className="text-xl font-bold mb-4 text-center">
        Login
      </h2>

      <input
        className="w-full border rounded-lg px-4 py-2 mb-3"
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border rounded-lg px-4 py-2 mb-4"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full bg-emerald-600 text-white py-2 rounded-lg"
      >
        Login
      </button>

      <div className="text-center mt-4">
        <button
          onClick={goSignup}
          className="text-sm text-blue-600 hover:underline"
        >
          Don't have an account? Sign up
        </button>
      </div>

    </div>

  )

}