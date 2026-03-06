"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            {/* Back button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 left-6 z-20"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg px-3 py-2 hover:bg-white/5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="mb-6 flex flex-col items-center">
                    <Link
                        href="/"
                        className="mb-4 flex items-center justify-center rounded-full bg-white/5 p-3 ring-1 ring-white/10 hover:ring-purple-500/30 transition-all"
                    >
                        <BrainCircuit className="h-8 w-8 text-purple-400" />
                    </Link>
                    <motion.h2
                        key={isLogin ? "login" : "signup"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-white"
                    >
                        {isLogin ? "Welcome back" : "Create an account"}
                    </motion.h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isLogin
                            ? "Sign in to access your personalized learning path"
                            : "Start your personalized AI learning journey"}
                    </p>
                </div>

                {/* Clerk SignIn / SignUp */}
                <div className="w-full">
                    {isLogin ? (
                        <SignIn
                            routing="hash"
                            forceRedirectUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    cardBox: "bg-transparent shadow-none border-none w-full !p-0",
                                    card: "bg-transparent shadow-none border-none w-full !p-0",
                                    footer: "hidden",
                                },
                            }}
                        />
                    ) : (
                        <SignUp
                            routing="hash"
                            forceRedirectUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    cardBox: "bg-transparent shadow-none border-none w-full !p-0",
                                    card: "bg-transparent shadow-none border-none w-full !p-0",
                                    footer: "hidden",
                                },
                            }}
                        />
                    )}
                </div>

                {/* Custom toggle */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-semibold text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
