import { useState } from "react";
import { CheckCircle, ChevronLeft } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni } from "../data";
import Btn from "./Btn";
import Card from "./Card";

export default function RegisterPage({ navigate }: { navigate: (p: Page) => void }) {
  const [role, setRole] = useState<"student" | "alumni">("student");
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const studentFields = [
    [
      { label: "Full Name", type: "text", placeholder: "Aryan Kapoor" },
      { label: "Roll Number", type: "text", placeholder: "21CSE1047" },
      { label: "Institutional Email", type: "email", placeholder: "aryan@university.edu" },
      { label: "Password", type: "password", placeholder: "Create a strong password" },
    ],
    [
      { label: "Department", type: "select", options: ["CSE", "IT", "ECE", "ME", "CE", "EEE"] },
      { label: "Year of Study", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
      { label: "CGPA", type: "text", placeholder: "e.g. 8.5" },
      { label: "Skills (comma separated)", type: "text", placeholder: "React, Python, DSA..." },
    ],
    [
      { label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourname" },
      { label: "GitHub URL", type: "url", placeholder: "https://github.com/username" },
      { label: "Career Goals", type: "textarea", placeholder: "Briefly describe your career objectives..." },
    ],
  ];
  const alumniFields = [
    [
      { label: "Full Name", type: "text", placeholder: "Priya Sharma" },
      { label: "Graduation Year", type: "text", placeholder: "2018" },
      { label: "Alumni Email", type: "email", placeholder: "priya@gmail.com" },
      { label: "Password", type: "password", placeholder: "Create a strong password" },
    ],
    [
      { label: "Department", type: "select", options: ["CSE", "IT", "ECE", "ME", "CE", "EEE"] },
      { label: "Current Company", type: "text", placeholder: "Google" },
      { label: "Current Role", type: "text", placeholder: "Senior Software Engineer" },
      { label: "Years of Experience", type: "select", options: ["1-2", "3-5", "6-10", "10+"] },
    ],
    [
      { label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourname" },
      { label: "Areas of Mentorship (comma separated)", type: "text", placeholder: "DSA, System Design, Resume Review..." },
      { label: "Availability", type: "select", options: ["Weekends only", "Weekday evenings", "Flexible"] },
    ],
  ];

  const fields = role === "student" ? studentFields[step - 1] : alumniFields[step - 1];
  const stepLabels = role === "student"
    ? ["Personal Info", "Academic Details", "Profile & Goals"]
    : ["Personal Info", "Professional Details", "Mentorship Preferences"];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">Join thousands of students and alumni on GradAlumni</p>
        </div>

        <Card className="p-8">
          {/* Role toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-7">
            {(["student", "alumni"] as const).map(r => (
              <button key={r} onClick={() => { setRole(r); setStep(1); }}
                className={cn("flex-1 py-2.5 text-sm font-semibold rounded-md transition-all cursor-pointer",
                  role === r ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                {r === "student" ? "I'm a Student" : "I'm an Alumni"}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-7">
            <div className="flex justify-between mb-2">
              {stepLabels.map((l, i) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500")}>
                    {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={cn("text-xs hidden sm:block", step === i + 1 ? "text-blue-700 font-medium" : "text-gray-400")}>{l}</span>
                  {i < totalSteps - 1 && <div className={cn("h-0.5 w-8 sm:w-16 transition-colors", step > i + 1 ? "bg-emerald-400" : "bg-gray-200")} />}
                </div>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-7">
            {fields.map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                {f.type === "select" ? (
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option value="">Select {f.label}</option>
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea rows={3} placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                ) : (
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && <Btn variant="outline" onClick={() => setStep(s => s - 1)} icon={<ChevronLeft size={16} />}>Back</Btn>}
            <Btn fullWidth onClick={() => step < totalSteps ? setStep(s => s + 1) : navigate("student-dashboard")}>
              {step < totalSteps ? "Continue" : "Complete Registration"}
            </Btn>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <button onClick={() => navigate("login")} className="text-blue-600 font-semibold hover:underline cursor-pointer">Sign in</button>
          </p>
        </Card>
      </div>
    </div>
  );
}

