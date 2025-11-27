"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Float, OrbitControls } from "@react-three/drei"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  CalendarCheck,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
} from "lucide-react"

type Node = {
  position: [number, number, number]
  color: string
  size: number
}

const features = [
  {
    icon: <Layers3 className="h-6 w-6 text-sky-400" />,
    title: "Unified workstreams",
    description: "Connect clearance, FYP reviews, and degree audits inside one adaptive pipeline.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-pink-400" />,
    title: "Compliance-grade",
    description: "Policy-aware routing, tamper-proof logs, and granular approvals keep auditors happy.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
    title: "AI copilots",
    description: "Nudges, queue balancing, and risk scores anticipate bottlenecks before they flare.",
  },
]

const stats = [
  { label: "Clearance acceleration", value: "43%", detail: "Average faster approvals" },
  { label: "Administrative hours saved", value: "1200+", detail: "Per semester" },
  { label: "Stakeholders connected", value: "9", detail: "Departments unified" },
  { label: "SLA compliance", value: "99.2%", detail: "Automated nudges" },
]

const modules = [
  {
    title: "Clearance Cockpit",
    description: "Multi-track pipeline view with drag-and-drop prioritization and risk badges.",
    tags: ["Doc AI", "Escalations", "Filters"],
  },
  {
    title: "Insights Canvas",
    description: "Composable analytics blocks for throughput, cohort health, and policy readiness.",
    tags: ["Realtime", "Exports", "Drill-down"],
  },
  {
    title: "Engagement Automations",
    description: "Behavioral nudges across email, SMS, and in-product notifications.",
    tags: ["Journeys", "Templates", "A/B"],
  },
]

const journeys = [
  {
    icon: <Sparkles className="h-5 w-5 text-amber-400" />,
    title: "Intake intelligence",
    description: "Personalized onboarding selects contextual templates per program instantly.",
  },
  {
    icon: <Workflow className="h-5 w-5 text-sky-400" />,
    title: "Adaptive workflows",
    description: "Branching logic adapts to deferments, co-advisors, and cross-campus requirements.",
  },
  {
    icon: <CalendarCheck className="h-5 w-5 text-emerald-400" />,
    title: "Smart SLAs",
    description: "Time-aware guardrails dispatch nudges, escalations, and reassignments automatically.",
  },
  {
    icon: <Users2 className="h-5 w-5 text-pink-400" />,
    title: "Stakeholder rooms",
    description: "Contextual spaces fuse chat, approvals, and files so updates stay discoverable.",
  },
]

const testimonials = [
  {
    quote:
      "AcadFlow gave us a live pulse on 600+ student journeys. The immersive UI keeps everyone aligned without endless emails.",
    name: "Dr. Ayesha Khan",
    role: "Dean of Student Success",
  },
  {
    quote:
      "Automations shaved full weeks off our FYP review cycles. The insights console is now our north star every Monday.",
    name: "Omar Siddiqui",
    role: "Head of Quality Assurance",
  },
]

const faqs = [
  {
    question: "Does AcadFlow integrate with our SIS and LMS?",
    answer:
      "Yes. Native REST and flat-file connectors sync identities, course metadata, and assessment outcomes every hour.",
  },
  {
    question: "How secure is the workspace?",
    answer: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3) with region-specific hosting options.",
  },
  {
    question: "Can we customize workflows per department?",
    answer: "Absolutely. Drag to create department-specific rules while keeping shared milestones aligned.",
  },
]

const pulse: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

function FloatingConstellation() {
  const nodes = useMemo<Node[]>(
    () =>
      Array.from({ length: 18 }).map((_, idx) => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 8,
        ],
        color: idx % 2 === 0 ? "#38bdf8" : "#f472b6",
        size: idx % 3 === 0 ? 0.22 : 0.14,
      })),
    []
  )

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      {nodes.map((node, index) => (
        <Float key={index} speed={1 + node.size * 10} rotationIntensity={0.6}>
          <mesh position={node.position}>
            <sphereGeometry args={[node.size, 32, 32]} />
            <meshStandardMaterial emissive={node.color} emissiveIntensity={0.7} color="white" />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("acadflow-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = stored ?? (prefersDark ? "dark" : "light")
    setTheme(initial === "dark" ? "dark" : "light")
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const handleThemeToggle = () => {
    if (typeof window === "undefined") return
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    window.localStorage.setItem("acadflow-theme", nextTheme)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0">
        <Canvas className="h-full w-full">
          <FloatingConstellation />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white dark:from-slate-950/10 dark:via-slate-950/60 dark:to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-10 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <motion.p
              className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-white/50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AcadFlow Platform · Live Preview
            </motion.p>
            <p className="mt-2 text-base text-slate-500 dark:text-white/70">
              A cinematic control room for every clearance, FYP milestone, and compliance checkpoint.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={handleThemeToggle}
            className="self-start rounded-full border border-slate-300/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white/70 dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/5"
            whileTap={{ scale: 0.96 }}
          >
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </motion.button>
        </div>

        <header className="flex flex-1 flex-col justify-center gap-10 text-center md:text-left">
          <motion.div initial="hidden" animate="visible" custom={0.1} variants={pulse}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Welcome to AcadFlow
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Engineer modern academic journeys with an immersive workspace.
            </h1>
            <p className="text-lg text-slate-600 dark:text-white/70 md:text-xl">
              Orchestrate every stakeholder—students, supervisors, committees—through a single real-time command center
              that blends data, automation, and clarity.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={pulse}
            className="flex flex-col items-center gap-4 md:flex-row md:justify-start"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-2xl shadow-slate-900/30 transition hover:gap-3 dark:bg-white dark:text-slate-900"
            >
              Launch workspace
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <span className="text-sm text-slate-500 dark:text-white/60">
              Already onboarded? Use your institutional credentials.
            </span>
          </motion.div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={pulse}
              initial="hidden"
              animate="visible"
              custom={0.4 + index * 0.1}
              className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 dark:bg-white/10 dark:text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-white/5 dark:text-white">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">Impact metrics</p>
              <h2 className="mt-3 text-3xl font-semibold">Proof that automation elevates every cohort.</h2>
            </div>
            <p className="text-base text-slate-600 dark:text-white/70">
              Every data point pulls from active deployments spanning engineering, business, and design schools.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200/50 bg-white/70 p-5 text-center dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-4xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-white/60">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-white/50">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 text-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 md:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Journey blueprint</p>
            <h2 className="text-3xl font-semibold">Every stakeholder sees the same truth, on any device.</h2>
            <p className="text-white/70">
              AcadFlow orchestrates dozens of micro-interactions so approvals, committee votes, and compliance gates
              appear effortless to the humans behind them.
            </p>
            <div className="space-y-4">
              {journeys.map((journey, idx) => (
                <motion.div
                  key={journey.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"
                >
                  <div className="rounded-xl bg-white/10 p-3">{journey.icon}</div>
                  <div>
                    <p className="text-lg font-semibold">{journey.title}</p>
                    <p className="text-sm text-white/70">{journey.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Live console</p>
            <h3 className="mt-3 text-2xl font-semibold">Command center tiles</h3>
            <p className="mt-2 text-white/70">
              Drag cards to prioritize at-risk journeys, assign new reviewers, or trigger audits without switching tabs.
            </p>
            <div className="mt-6 space-y-4">
              {["Journey risk heatmap", "Committee RSVP tracker", "Document signature radar"].map((tile) => (
                <div key={tile} className="rounded-2xl bg-white/10 p-4 text-sm font-medium text-white/80">
                  {tile}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-slate-200/60 bg-white/90 p-8 dark:border-white/10 dark:bg-white/5 md:grid-cols-3">
          {modules.map((module) => (
            <div key={module.title} className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 p-6 dark:border-white/5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-white/60">Module</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{module.title}</h3>
              <p className="text-sm text-slate-600 dark:text-white/70">{module.description}</p>
              <div className="flex flex-wrap gap-2">
                {module.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200/70 px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/20 dark:text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-10 rounded-3xl border border-slate-200/60 bg-white/80 p-8 dark:border-white/10 dark:bg-white/5 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">Stories</p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Trusted across modern campuses.</h2>
            <p className="text-base text-slate-600 dark:text-white/70">
              From monthly board reviews to weekly stand-ups, teams rely on AcadFlow to communicate the now, the next,
              and what needs attention.
            </p>
            <div className="space-y-6">
              {testimonials.map((testimonial, idx) => (
                <motion.blockquote
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-lg italic text-slate-900 dark:text-white">“{testimonial.quote}”</p>
                  <footer className="mt-4 text-sm font-medium text-slate-600 dark:text-white/70">
                    {testimonial.name} · {testimonial.role}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white dark:border-white/10">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Operational radar</p>
            <h3 className="mt-3 text-2xl font-semibold">Live health indicators</h3>
            <ul className="mt-4 space-y-4 text-sm text-white/80">
              <li className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span>Committee alignment</span>
                <span className="text-emerald-300">Green</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span>Document compliance</span>
                <span className="text-amber-300">Attention</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span>Supervisor load</span>
                <span className="text-sky-300">Balanced</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-white/70">
              The radar blends live telemetry with AI predictions, enabling leadership to act while issues are still
              whispering.
            </p>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-200/60 bg-white/90 p-8 dark:border-white/10 dark:bg-white/5 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">We thought ahead.</h2>
            <p className="mt-2 text-slate-600 dark:text-white/70">Everything is configurable, permissioned, and auditable.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <summary className="cursor-pointer text-base font-semibold">{faq.question}</summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/60 bg-gradient-to-r from-sky-500 to-indigo-500 p-8 text-white dark:border-white/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Ready to orchestrate?</p>
              <h2 className="mt-3 text-3xl font-semibold">Launch your unified workspace in under 10 minutes.</h2>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-slate-900/30 transition hover:translate-y-0.5"
              >
                Sign in to continue
              </Link>
              <button
                type="button"
                className="rounded-full border border-white/50 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Book a guided tour
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

