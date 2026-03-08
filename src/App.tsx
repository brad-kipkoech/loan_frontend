import { useState, useEffect } from "react";

import AdminDashboard from "./pages/AdminDashboard";
import LoanFlow from "./pages/LoanFlow";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { isAdmin } from "./utils/admin";

type Page =
  | "login"
  | "signup"
  | "loan"
  | "admin";

export default function App() {

const token = localStorage.getItem("loan_access_token")

const [page, setPage] = useState<Page>(
  token ? "loan" : "login"
);

const userEmail = localStorage.getItem("user_email") || undefined;

  const openAdmin = () => {

    if (!userEmail) {
      alert("Please login first");
      return;
    }

    if (!isAdmin(userEmail)) {
      alert("You are not authorized to access admin.");
      return;
    }

    setPage("admin");
  };

  const logout = () => {

    localStorage.removeItem("loan_access_token");
    localStorage.removeItem("user_email");

    setPage("login");

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* HEADER */}

      {token && (

        <header className="absolute top-0 left-0 w-full p-6 text-white">

          <div className="max-w-6xl mx-auto flex justify-between items-center">

            <h1 className="font-bold text-xl">
              SwiftLoan
            </h1>

            <div className="flex gap-3">

              <button
                onClick={() => setPage("loan")}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Home
              </button>

              {isAdmin(userEmail || "") && (

                <button
                  onClick={openAdmin}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  Admin
                </button>

              )}

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500"
              >
                Logout
              </button>

            </div>

          </div>

        </header>

      )}

      {/* MAIN */}

      <main className="flex min-h-screen items-center justify-center px-4 py-20">

        {page === "login" && (
          <LoginPage
            onLogin={() => setPage("loan")}
            goSignup={() => setPage("signup")}
          />
        )}

        {page === "signup" && (
          <SignupPage
            goLogin={() => setPage("login")}
          />
        )}

        {page === "loan" && <LoanFlow />}

        {page === "admin" && <AdminDashboard />}

      </main>

    </div>

  );

}