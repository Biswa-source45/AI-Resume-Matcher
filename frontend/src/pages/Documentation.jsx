/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Brain,
  BarChart3,
  Play,
  Code2,
  Database,
  Cloud,
  ShieldCheck,
  GitBranch,
  Cpu,
  FileText,
  Users,
  KeyRound,
  Lock,
  FolderKanban,
} from "lucide-react";
import { Link } from "react-router";

export default function Documentation() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      title: "Upload Resume",
      text:
        "Users upload a PDF resume. It is parsed temporarily in memory (never stored) and processed for embedding generation.",
    },
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "AI Embedding & Analysis",
      text:
        "LangChain + OpenAI (or compatible) embeddings extract key insights — skills, experience context, and job-fit alignment.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "FAISS Vector Search",
      text:
        "Resume vectors are stored in FAISS for similarity queries, enabling personalized history tracking and smart recommendations.",
    },
    {
      icon: <Play className="w-6 h-6 text-blue-600" />,
      title: "Insight Visualization",
      text:
        "Users can view AI insights and recommendations through visual charts, skills distribution, and improvement tracking.",
    },
  ];

  const tech = [
    {
      icon: <Code2 className="w-6 h-6 text-blue-600" />,
      title: "Frontend",
      desc: "React + Vite + Tailwind CSS + Framer Motion for smooth, responsive UI and animations.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      title: "Backend",
      desc: "FastAPI + LangChain backend for resume processing, embedding generation, and analysis APIs.",
    },
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      title: "Database",
      desc: "Supabase PostgreSQL for user data and resume embedding metadata.",
    },
    {
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      title: "Vector Store",
      desc: "FAISS for efficient semantic vector search and similarity queries.",
    },
    {
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "Authentication",
      desc: "Supabase Auth provides secure user login, JWT sessions, and profile management.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Visualization",
      desc: "Recharts + Framer Motion-driven charts for resume insights, gap analysis, and improvement metrics.",
    },
  ];

  const apis = [
    { method: "POST", path: "/auth/signup", desc: "Register a new user via Supabase Auth." },
    { method: "POST", path: "/auth/login", desc: "Authenticate user credentials securely." },
    { method: "POST", path: "/resume/analyze", desc: "Upload and analyze resume (processed in-memory, not stored)." },
    { method: "GET", path: "/analysis/history", desc: "Fetch user-specific embedding history and results." },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-6 text-gray-900"
        >
          Resume Enhancer — Project Documentation
        </motion.h1>

        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">
          Detailed technical overview of the Resume Enhancer app — a privacy-focused, AI-driven resume analysis
          platform built with FastAPI, LangChain, and FAISS.
        </p>

        {/* --- Quick Overview --- */}
        <section className="bg-white/70 border border-blue-100 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" /> Quick Overview
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Resume Enhancer helps users securely analyze their resumes using AI embeddings and provides actionable feedback for skill enhancement and job-fit improvement.  
            No resumes are permanently stored — only anonymized embeddings are saved for historical insights.
          </p>
        </section>

        {/* --- Pages & Security --- */}
        <section className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 border border-blue-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Pages & UX
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Landing</strong> — Hero, features, and signup CTA.</li>
              <li><strong>Login / Signup</strong> — Secure Supabase Auth flows.</li>
              <li><strong>Dashboard</strong> — View embeddings, analysis, and charts.</li>
              <li><strong>Protected Routes</strong> — Role-based route guards with JWT session validation.</li>
            </ul>
          </div>

          <div className="bg-white/70 border border-blue-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Privacy & Security
            </h3>
            <ul className="text-gray-700 list-disc pl-5 space-y-1 text-sm">
              <li>Resumes are processed in-memory; not stored on server or DB.</li>
              <li>Only embeddings are stored — no raw user data or files.</li>
              <li>All API keys are securely managed on the server (never exposed).</li>
              <li>HTTPS enforced; tokens stored via secure Supabase Auth sessions.</li>
            </ul>
          </div>
        </section>

        {/* --- How It Works --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Brain className="w-5 h-5 text-blue-600" /> How It Works
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="p-4 bg-white/70 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3 mb-2">{s.icon}</div>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-gray-700 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Tech Stack --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-blue-600" /> Technology Stack
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tech.map((t, i) => (
              <div key={i} className="p-4 bg-white/70 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3 mb-2">{t.icon}</div>
                <h4 className="font-semibold">{t.title}</h4>
                <p className="text-gray-700 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- API Section --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-blue-600" /> API Routes
          </h2>
          <div className="bg-white/70 border border-blue-100 p-4 rounded-lg">
            <ul className="text-gray-700 text-sm space-y-2">
              {apis.map((a, i) => (
                <li key={i}>
                  <strong>{a.method}</strong>{" "}
                  <code className="bg-neutral-100 px-2 py-0.5 rounded">{a.path}</code> — {a.desc}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Local Setup --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-blue-600" /> Local Setup
          </h2>
          <div className="bg-white/70 border border-blue-100 p-4 rounded-lg text-gray-700 text-sm">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Clone repo → <code>npm install</code> (frontend) and <code>pip install -r requirements.txt</code> (backend).</li>
              <li>Run FastAPI backend → <code>uvicorn main:app --reload</code></li>
              <li>Start React frontend → <code>npm run dev</code></li>
              <li>Configure Supabase keys in <code>.env</code> (never expose API secrets in frontend).</li>
            </ol>
          </div>
        </section>

        {/* --- Deployment --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> Deployment & CI/CD
          </h2>
          <div className="bg-white/70 border border-blue-100 p-4 rounded-lg text-gray-700 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Frontend → Deploy to Vercel/Netlify.</li>
              <li>Backend → Deploy to Render / Fly.io / Cloud Run.</li>
              <li>Use GitHub Actions for automated linting, testing, and deployment pipelines.</li>
              <li>All secrets and API keys managed via environment variables.</li>
            </ul>
          </div>
        </section>

        {/* --- Contribute --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" /> Contributing
          </h2>
          <div className="bg-white/70 border border-blue-100 p-4 rounded-lg text-gray-700 text-sm">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open issues for new features or bugs.</li>
              <li>Fork → Create feature branch → Submit PR.</li>
              <li>Ensure code follows ESLint & Prettier formatting before committing.</li>
            </ol>
          </div>
        </section>

        {/* --- Back to App Button --- */}
        <div className="text-center mb-6">
          <Link to={"/dashboard"}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            <KeyRound className="w-4 h-4" /> Back to App
          </Link>
        </div>
      </div>
    </div>
  );
}
