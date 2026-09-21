import { useState } from "react";
import type { Page } from "../types";
import { cn } from "../utils";
import Btn from "./Btn";
import Card from "./Card";
import { login, requestPasswordReset, resetPassword } from "../../lib/authApi";
import { useAuth } from "../AuthContext";
import { dashboardPageForRole } from "../../lib/roleRedirect";

export default function LoginPage({ navigate }: { navigate: (p: Page) => void }) {
  const { refreshUser, signOut } = useAuth();
  const [role, setRole] = useState<string>("student");
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function recover() {
    setLoggingIn(true); setError(""); setMessage("");
    try {
      if (resetSent) {
        await resetPassword(email, code, newPassword); setForgot(false); setResetSent(false); setCode(""); setNewPassword("");
        setMessage("Password updated. Sign in with your new password.");
      } else {
        await requestPasswordReset(email); setResetSent(true);
        setMessage("If your account exists, a reset code will be sent to your email.");
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to reset password."); }
    finally { setLoggingIn(false); }
  }

  async function handleLogin() {
    setLoggingIn(true);
    setError(""); setMessage("");

    try {
      await login(email, password, role);
      const me = await refreshUser();
      navigate(dashboardPageForRole(me.role));
    } catch (err: any) {
      signOut();
      setError(err.message);
    } finally {
      setLoggingIn(false);
    }
  }
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-12">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Welcome back to GradAlumni
          </h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Your alumni network is ready. Log in to continue mentoring, exploring jobs, and growing your career.
          </p>
        </div>
        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=400&fit=crop&auto=format"
          alt="Students connecting" className="rounded-2xl w-full object-cover opacity-90 bg-blue-500" style={{ maxHeight: 320 }} />
        <div className="grid grid-cols-2 gap-4">
          {[{ v: "12,500+", l: "Alumni" }, { v: "850+", l: "Mentors" }, { v: "4,200+", l: "Placements" }, { v: "320+", l: "Companies" }].map(s => (
            <div key={s.l} className="bg-white/10 rounded-xl p-3">
              <p className="text-white font-bold text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>{s.v}</p>
              <p className="text-blue-200 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="p-8">
            {error && <p role="alert" className="rounded-lg p-3 mb-4 bg-red-50 text-red-700">{error}</p>}
            {message && <p role="status" className="rounded-lg p-3 mb-4 bg-blue-50 text-blue-700">{message}</p>}
            {forgot ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Reset Password</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your email to receive a reset code.</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" aria-label="Account email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-slate-50" />
                {resetSent && <div className="space-y-3 mb-4"><label className="block text-sm">Email code<input className="w-full border rounded-lg p-3" autoComplete="one-time-code" value={code} onChange={e => setCode(e.target.value)} /></label><label className="block text-sm">New password (at least 10 characters)<input className="w-full border rounded-lg p-3" type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></label></div>}
                <Btn fullWidth onClick={recover} disabled={loggingIn || !email || (resetSent && (newPassword.length < 10 || code.length < 6))}>{loggingIn ? "Please wait…" : resetSent ? "Save new password" : "Send reset code"}</Btn>
                <button onClick={() => setForgot(false)} className="w-full text-center text-sm text-blue-600 hover:underline mt-4 cursor-pointer">Back to Login</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Sign in to your account</h2>
                <p className="text-gray-500 text-sm mb-6">Welcome back! Please enter your details.</p>

                {/* Role tabs */}
                <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 mb-6">
                  {(["student", "alumni", "admin", "industry", "academician", "institution_admin"] as const).map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      className={cn("flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize",
                        role === r ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                      {r === "academician" ? "Faculty" : r === "institution_admin" ? "Institution" : r[0].toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {role === "industry" ? "Work Email" : role === "admin" ? "Admin Email" : "Institutional Email"}
                    </label>
                    <input type="email" placeholder={role === "admin" ? "admin@university.edu" : "rollno@university.edu"}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 mb-6">
                  <button onClick={() => setForgot(true)} className="text-sm text-blue-600 hover:underline cursor-pointer">Forgot password?</button>
                </div>

                <Btn fullWidth size="lg" onClick={handleLogin} disabled={loggingIn}>
                  {loggingIn ? "Signing In..." : "Sign in"}
                </Btn>
                <button className="w-full mt-3 text-sm text-blue-700" onClick={() => navigate("register")}>Verify an existing account</button>

                <p className="text-center text-sm text-gray-600 mt-5">
                  Don't have an account?{" "}
                  <button onClick={() => navigate(role === "industry" ? "industry-register" : "register")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Sign up free</button>
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
