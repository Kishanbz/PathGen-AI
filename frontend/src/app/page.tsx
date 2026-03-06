"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
  BookOpen,
  Target,
  BarChart3,
  Bot,
  FileText,
  ShieldCheck,
  Zap,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const features = [
  {
    icon: Target,
    title: "Initial Assessment",
    desc: "Diagnostic quiz to evaluate your knowledge level and preferred learning style.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: BrainCircuit,
    title: "AI Learning Path",
    desc: "ML model creates a personalized curriculum that adapts as you progress.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Track completed topics, scores, and time spent with live dashboards.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    desc: "AI suggests the next best content based on your performance patterns.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Bot,
    title: "AI Chatbot (RAG)",
    desc: "LangChain-powered chatbot answers your questions from course content.",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: FileText,
    title: "Auto PDF Reports",
    desc: "Weekly AI-generated performance reports delivered automatically.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

const techStack = [
  { name: "Next.js", desc: "Frontend Framework" },
  { name: "FastAPI", desc: "Backend API" },
  { name: "PostgreSQL", desc: "Database" },
  { name: "Scikit-learn", desc: "ML Engine" },
  { name: "LangChain", desc: "AI Chatbot" },
  { name: "Docker", desc: "Deployment" },
  { name: "Redis", desc: "Caching" },
  { name: "MinIO", desc: "File Storage" },
];

const stats = [
  { value: "6+", label: "AI Models", icon: BrainCircuit },
  { value: "3", label: "User Roles", icon: Users },
  { value: "12+", label: "API Endpoints", icon: Zap },
  { value: "100%", label: "Personalized", icon: GraduationCap },
];

export default function LandingPage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 flex w-full items-center justify-between p-6 md:px-12 backdrop-blur-xl bg-background/60 border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-bold tracking-tight text-foreground">PathGen-AI</span>
        </div>
        <nav className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span>Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:scale-105"
              >
                <span>Get Started</span>
              </Link>
            </>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="z-10 flex flex-col items-center">
        <section className="flex flex-col items-center justify-center px-4 text-center py-24 md:py-36 min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-purple-300 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>AI-Powered Personalized Education Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-tight"
            >
              Education{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
              PathGen-AI understands your learning style, pace, and goals — then dynamically creates a{" "}
              <span className="text-white font-semibold">personalized learning path</span> that continuously adapts.
              Unlike one-size-fits-all platforms, we make education truly{" "}
              <span className="text-purple-400 font-semibold">personal, predictive, and performance-driven.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href={isSignedIn ? "/dashboard" : "/login"}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-10 py-4 text-sm font-bold text-white transition-all"
                >
                  <span>{isSignedIn ? "Go to Dashboard" : "Start Learning Now"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Explore Features</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-6xl mx-auto px-4 py-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center hover:border-purple-500/30 transition-colors"
              >
                <stat.icon className="h-8 w-8 text-purple-400" />
                <span className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mx-auto px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-purple-300 mb-4">
              <Zap className="h-4 w-4" /> Core Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Learn Smarter
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by cutting-edge AI and Machine Learning to transform the way you learn.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative rounded-2xl border p-8 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-purple-500/5 ${feature.bg}`}
              >
                <div className={`mb-4 inline-flex rounded-xl bg-white/5 p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Tech Stack Section */}
        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-300 mb-4">
              <ShieldCheck className="h-4 w-4" /> Built With
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Modern{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tech Stack
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built on production-grade technologies for performance, scalability, and reliability.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-blue-500/30 hover:bg-white/10 transition-all cursor-default"
              >
                <span className="text-lg font-bold text-white">{tech.name}</span>
                <span className="text-xs font-medium text-gray-500">{tech.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="w-full max-w-6xl mx-auto px-4 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Works
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              { step: "01", title: "Sign Up", desc: "Create your account and set your learning goals." },
              { step: "02", title: "Take Assessment", desc: "AI evaluates your knowledge level and learning style." },
              { step: "03", title: "Get Your Path", desc: "Receive a personalized, AI-generated learning curriculum." },
              { step: "04", title: "Learn & Grow", desc: "Progress through modules as the path adapts to you." },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center hover:border-emerald-500/30 transition-all"
              >
                <span className="text-5xl font-extrabold bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent p-12 md:p-16 text-center backdrop-blur-sm"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join PathGen-AI and experience the future of personalized education.
            </p>
            <Link href={isSignedIn ? "/dashboard" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-10 py-4 text-sm font-bold text-white transition-all"
              >
                <span>{isSignedIn ? "Go to Dashboard" : "Get Started for Free"}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 py-8 px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BrainCircuit className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-bold text-white">PathGen-AI</span>
          </div>
          <p className="text-xs text-gray-500">
            Built with ❤️ using AI + Data Science •{" "}
            <span className="text-gray-400">Python • Next.js • PostgreSQL • LangChain • Docker</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
