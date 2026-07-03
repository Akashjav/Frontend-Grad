import { useState } from "react";
import type { Page } from "../types";
import { cn } from "../utils";
import Btn from "./Btn";
import Card from "./Card";
import { login, getMe } from "../../lib/authApi";

function dashboardPageForRole(role: string): Page {
  if (role === "admin") return "admin-dashboard";
  if (role === "alumni") return "alumni-dashboard";
  return "student-dashboard";
}

export default function LoginPage({ navigate }: { navigate: (p: Page) => void }) {
  const [role, setRole] = useState<"student" | "alumni" | "admin">("student");
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleLogin() {
    setLoggingIn(true);

    try {
      await login(email, password);
      const me = await getMe();
      navigate(dashboardPageForRole(me.role));
    } catch (err: any) {
      alert(err.message);
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
            {forgot ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Reset Password</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your email to receive a reset link.</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-slate-50" />
                <Btn fullWidth>Send Reset Link</Btn>
                <button onClick={() => setForgot(false)} className="w-full text-center text-sm text-blue-600 hover:underline mt-4 cursor-pointer">Back to Login</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Sign in to your account</h2>
                <p className="text-gray-500 text-sm mb-6">Welcome back! Please enter your details.</p>

                {/* Role tabs */}
                <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                  {(["student", "alumni", "admin"] as const).map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      className={cn("flex-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize",
                        role === r ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                      {r === "student" ? "Student" : r === "alumni" ? "Alumni" : "Admin"}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {role === "admin" ? "Admin Email" : "Institutional Email / Roll No."}
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
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded" /> Remember me
                  </label>
                  <button onClick={() => setForgot(true)} className="text-sm text-blue-600 hover:underline cursor-pointer">Forgot password?</button>
                </div>

                <Btn fullWidth size="lg" onClick={handleLogin} disabled={loggingIn}>
                  {loggingIn ? "Signing In..." : `Sign In as ${role === "student" ? "Student" : role === "alumni" ? "Alumni" : "Admin"}`}
                </Btn>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">OR</span></div>
                </div>

                <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-5">
                  Don't have an account?{" "}
                  <button onClick={() => navigate("register")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Sign up free</button>
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
