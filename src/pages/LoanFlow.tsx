import { useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "../api/api";
import { fmtKES, normalizeKEPhone } from "../utils/helpers";

import { Card } from "../components/card";
import { Button } from "../components/button";

type LoanAmount = 10000 | 20000 | 50000 | 100000 | 150000;

type Step =
  | "select"
  | "payment"
  | "disbursement"
  | "success";

type SessionUser = {
  id: number;
  email?: string;
  name?: string;
};

type StkPushResponse = {
  checkout_request_id?: string;
};

const LOAN_OPTIONS: LoanAmount[] = [
  10000,
  20000,
  50000,
  100000,
  150000,
];

const TOKEN_KEY = "loan_access_token";

export default function LoanFlow() {

  const [user, setUser] = useState<SessionUser | null>(null);

  const [step, setStep] = useState<Step>("select");

  const [selectedLoan, setSelectedLoan] =
    useState<LoanAmount | null>(null);

  const [phone, setPhone] = useState("");

  const [checkoutId, setCheckoutId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const deposit = useMemo(() => {
    return selectedLoan ? Math.round(selectedLoan * 0.05) : 0;
  }, [selectedLoan]);

  /* Restore session */

  useEffect(() => {

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    apiFetch<{ user: SessionUser }>("/api/me")
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      });

  }, []);

  /* Payment polling */

  useEffect(() => {

    if (!checkoutId) return;

    pollRef.current = setInterval(async () => {

      try {

        const res = await apiFetch<{ status: string }>(
          `/api/mpesa/payment/${checkoutId}`
        );

        if (res.status === "PAID") {

          if (pollRef.current)
            clearInterval(pollRef.current);

          setStep("disbursement");

        }

      } catch (err) {
        console.error(err);
      }

    }, 2500);

    return () => {
      if (pollRef.current)
        clearInterval(pollRef.current);
    };

  }, [checkoutId]);

  /* Simulate disbursement */

  useEffect(() => {

    if (step !== "disbursement") return;

    const timer = setTimeout(() => {
      setStep("success");
    }, 8000);

    return () => clearTimeout(timer);

  }, [step]);

  /* Start STK push */

  const startPayment = async () => {

    if (!selectedLoan) return;

    setLoading(true);

    try {

      const res = await apiFetch<StkPushResponse>(
        "/api/mpesa/stkpush",
        {
          method: "POST",
          body: JSON.stringify({
            phone: normalizeKEPhone(phone),
            loan_amount: selectedLoan,
          }),
        }
      );

      setCheckoutId(res.checkout_request_id ?? null);

    } finally {
      setLoading(false);
    }

  };

  const signOut = () => {

    localStorage.removeItem(TOKEN_KEY);

    window.location.reload();

  };

  return (
    <>
      {/* SELECT LOAN */}

      {step === "select" && (

        <Card
          title="Choose Loan Amount"
          actions={
            <Button variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          }
        >

          <div className="grid gap-3">

            {LOAN_OPTIONS.map((amt) => (

              <button
                key={amt}
                onClick={() => setSelectedLoan(amt)}
                className={`rounded-xl border p-4 transition ${
                  selectedLoan === amt
                    ? "bg-emerald-600 text-white"
                    : "bg-white hover:bg-slate-50"
                }`}
              >

                {fmtKES(amt)}

                <div className="text-sm opacity-70">
                  Deposit {fmtKES(Math.round(amt * 0.05))}
                </div>

              </button>

            ))}

          </div>

          <input
            className="mt-4 w-full border rounded-xl px-4 py-3"
            placeholder="M-Pesa phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button
            className="w-full mt-4"
            onClick={() => setStep("payment")}
            disabled={!selectedLoan || phone.length < 9}
          >
            Continue
          </Button>

        </Card>

      )}

      {/* PAYMENT */}

      {step === "payment" && selectedLoan && (

        <Card title="Confirm Deposit">

          <div className="space-y-4">

            <p className="text-slate-600">
              A 5% deposit is required to activate your loan.
            </p>

            <div className="bg-slate-100 p-4 rounded-xl text-center">

              <p className="text-sm text-slate-500">
                Deposit Amount
              </p>

              <p className="text-2xl font-semibold text-emerald-600">
                {fmtKES(deposit)}
              </p>

            </div>

            <Button
              className="w-full"
              onClick={startPayment}
              disabled={loading}
            >
              {loading
                ? "Requesting STK..."
                : "Request STK Push"}
            </Button>

          </div>

        </Card>

      )}

      {/* DISBURSEMENT */}

      {step === "disbursement" && (

        <Card title="Processing Your Loan">

          <div className="space-y-6 text-center">

            <div className="text-emerald-600 font-semibold text-lg">
              Deposit confirmed ✔
            </div>

            <div className="space-y-1 text-slate-600 text-sm">

              <p>Running credit verification</p>
              <p>Checking account eligibility</p>
              <p>Preparing loan disbursement</p>

            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">

              <div className="bg-emerald-600 h-3 animate-pulse w-2/3"></div>

            </div>

            <p className="text-sm text-slate-500">
              Disbursement in progress...
            </p>

          </div>

        </Card>

      )}

      {/* SUCCESS */}

      {step === "success" && (

        <Card title="Loan Approved">

          <div className="space-y-4 text-center">

            <p className="text-slate-600">
              Your loan has been approved and will be
              disbursed to your M-Pesa shortly.
            </p>

            <Button onClick={() => setStep("select")}>
              Apply Again
            </Button>

          </div>

        </Card>

      )}

    </>
  );
}