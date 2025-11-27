"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, GraduationCap, Loader2, LockKeyhole, Mail, Shield } from "lucide-react"
import { loginAction, initialLoginState } from "./actions"

const roleRoutes: Record<string, string> = {
  STUDENT: "/student",
  SUPERVISOR: "/supervisor",
  EXAMINER: "/examiner",
  HOD: "/hod",
  DEAN: "/dean",
  "STUDENT-AFFAIRS": "/student-affairs",
  ACCOUNTS: "/accounts",
  ADMIN: "/admin",
}

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState)

  useEffect(() => {
    if (state.status === "success" && state.user) {
      const destination = roleRoutes[state.user.role] ?? "/"
      router.push(destination)
    }
  }, [state, router])

  const success =
    state.status === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-transparent"
  const error =
    state.status === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-transparent text-slate-500"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm">
            <Shield className="h-4 w-4 text-sky-300" />
            Secure AcadFlow access
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold">Sign in to your workflow console</h1>
            <p className="text-white/70">
              One login unlocks FYP tracking, multi-department clearances, and compliance-ready automations.
            </p>
          </div>
        </header>

        <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <GraduationCap className="h-6 w-6 text-sky-300" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">AcadFlow Portal</p>
                <h2 className="text-2xl font-semibold">Trusted login for modern campuses</h2>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li>• Realtime visibility into every approval chain</li>
              <li>• Single identity across students, supervisors, and admin desks</li>
              <li>• Automated compliance logs and alerting</li>
            </ul>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              Demo ready: use the credentials prefilled in the form or swap in your own sandbox user.
            </div>
          </div>

          <form action={formAction} className="space-y-6 rounded-2xl bg-white/90 p-6 text-slate-900 shadow-xl">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-semibold text-slate-900">Welcome back</h3>
              <p className="text-sm text-slate-500">
                Authenticate securely to continue orchestrating journeys.
              </p>
            </div>

            {state.status !== "idle" && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm transition ${state.status === "success" ? success : error}`}
              >
                {state.status === "success" ? state.message ?? "Login successful" : state.message ?? "Login failed"}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  name="username"
                  type="email"
                  defaultValue="student1@acadflow.edu"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="name@acadflow.edu"
                  disabled={pending}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <LockKeyhole className="h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  defaultValue="student123"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Enter password"
                  disabled={pending}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
