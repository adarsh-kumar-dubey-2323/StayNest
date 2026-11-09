import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const { axios } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState(token ? "verifying" : "waiting");
  const [message, setMessage] = useState(token ? "Verifying your email address..." : "Check your inbox for the verification link.");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    axios.post("/api/user/verify-email", { token })
      .then(({ data }) => {
        if (!active) return;
        setStatus("verified");
        setMessage(data.message || "Your email is verified. You can now log in.");
      })
      .catch((error) => {
        if (!active) return;
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification link is invalid or expired.");
      });
    return () => { active = false; };
  }, [token, axios]);

  const resend = async (e) => {
    e.preventDefault();
    if (resending) return;
    try {
      setResending(true);
      const { data } = await axios.post("/api/user/resend-verification", { email });
      toast.success(data.message || "If needed, a verification email has been sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-14">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">{status === "verified" ? "✓" : status === "error" ? "!" : "✉"}</div>
        <h1 className="text-2xl font-bold text-gray-900">{status === "verified" ? "Email verified" : status === "error" ? "Verification link issue" : "Verify your email"}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>
        {status === "verified" && <Link to="/login" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Continue to login</Link>}
        {(status === "waiting" || status === "error") && <form onSubmit={resend} className="mt-7 text-left"><label htmlFor="verification-email" className="mb-2 block text-sm font-medium text-gray-700">Email address</label><input id="verification-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500" /><button disabled={resending} className="mt-3 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{resending ? "Sending..." : "Resend verification email"}</button></form>}
        <p className="mt-6 text-sm text-gray-500"><Link to="/login" className="text-indigo-600 hover:underline">Back to login</Link></p>
      </section>
    </main>
  );
};

export default VerifyEmail;
