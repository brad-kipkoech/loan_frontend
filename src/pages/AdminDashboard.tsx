import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { fmtKES } from "../utils/helpers";
import Skeleton from "../components/skeleton";

type Payment = {
  id: number;
  user_id: number;
  loan_amount: number;
  deposit: number;
  phone: string;
  status: string;
};

export default function AdminDashboard() {

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    apiFetch<Payment[]>("/api/admin/payments")
      .then((data) => {
        setPayments(data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });

  }, []);

  const statusBadge = (status: string) => {

    if (status === "PAID")
      return "bg-green-100 text-green-700";

    if (status === "FAILED")
      return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";
  };

  return (

    <div className="w-full max-w-6xl bg-white rounded-3xl p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {/* TABLE WRAPPER FOR MOBILE */}

      <div className="overflow-x-auto">

        <table className="min-w-full text-left text-sm">

          <thead>

            <tr className="border-b text-slate-600">
              <th className="py-3 pr-6">User</th>
              <th className="py-3 pr-6">Loan</th>
              <th className="py-3 pr-6">Deposit</th>
              <th className="py-3 pr-6">Status</th>
              <th className="py-3">Phone</th>
            </tr>

          </thead>

          <tbody>

            {/* SKELETON LOADING */}

            {loading && (
              <>
                {[...Array(5)].map((_, i) => (

                  <tr key={i} className="border-b">

                    <td className="py-3 pr-6">
                      <Skeleton className="h-4 w-12" />
                    </td>

                    <td className="py-3 pr-6">
                      <Skeleton className="h-4 w-20" />
                    </td>

                    <td className="py-3 pr-6">
                      <Skeleton className="h-4 w-20" />
                    </td>

                    <td className="py-3 pr-6">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>

                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>

                  </tr>

                ))}
              </>
            )}

            {/* DATA */}

            {!loading &&
              payments.map((p) => (

                <tr key={p.id} className="border-b">

                  <td className="py-3 pr-6">
                    {p.user_id}
                  </td>

                  <td className="py-3 pr-6">
                    {fmtKES(p.loan_amount)}
                  </td>

                  <td className="py-3 pr-6">
                    {fmtKES(p.deposit)}
                  </td>

                  <td className="py-3 pr-6">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>

                  </td>

                  <td className="py-3">
                    {p.phone}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}