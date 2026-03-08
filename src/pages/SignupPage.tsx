import { useState } from "react"
import { apiFetch } from "../api/api"

type Props = {
  goLogin: () => void
}

export default function SignupPage({ goLogin }: Props) {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const signup = async () => {

    setError("")
    setLoading(true)

    try {

      await apiFetch(
        "/api/auth/signup",
        {
          method:"POST",
          auth:false,
          body:JSON.stringify({
            name,
            email,
            password
          })
        }
      )

      alert("Account created. Please login.")

      goLogin()

    } catch(err:any) {

      setError(err.message || "Signup failed")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">

      <h2 className="text-xl font-bold mb-4 text-center">
        Create Account
      </h2>

      {error && (
        <div className="text-red-500 text-sm mb-3 text-center">
          {error}
        </div>
      )}

      <input
        className="w-full border rounded-lg px-4 py-2 mb-3"
        placeholder="Full name"
        value={name}
        onChange={e=>setName(e.target.value)}
      />

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
        onClick={signup}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-500"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <div className="text-center mt-4">

        <button
          onClick={goLogin}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>

      </div>

    </div>

  )

}