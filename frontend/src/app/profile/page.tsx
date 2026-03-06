"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background effects */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute top-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[120px]" />
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 flex w-full items-center justify-between p-6 md:px-12 backdrop-blur-xl bg-background/60 border-b border-white/5"
            >
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-8 w-8 text-purple-500" />
                    <span className="text-xl font-bold tracking-tight text-foreground">PathGen-AI</span>
                </div>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg px-4 py-2 hover:bg-white/5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>
            </motion.header>

            {/* Profile content */}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 flex justify-center px-4 py-10"
            >
                <UserProfile
                    routing="hash"
                    appearance={{
                        elements: {
                            rootBox: "w-full max-w-4xl",
                            cardBox: "bg-[#0c0c14]/80 border border-white/10 shadow-2xl shadow-purple-500/5 backdrop-blur-xl rounded-2xl",
                            card: "bg-transparent",
                            navbar: "bg-[#0c0c14]/50 border-r border-white/10 rounded-l-2xl",
                            navbarButton: "text-gray-300 hover:bg-white/5 rounded-lg data-[active=true]:bg-white/10 data-[active=true]:text-white",
                            navbarButtonIcon: "text-gray-400",
                            pageScrollBox: "bg-transparent",
                            page: "bg-transparent",
                            profileSectionTitleText: "text-white font-bold text-lg",
                            profileSectionContent: "text-gray-300",
                            profileSectionPrimaryButton:
                                "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20",
                            formFieldLabel: "text-gray-300 font-medium",
                            formFieldInput:
                                "bg-white/5 border border-white/10 text-white rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50",
                            formButtonPrimary:
                                "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl",
                            formButtonReset: "text-purple-400 hover:text-purple-300",
                            avatarBox: "ring-2 ring-purple-500/30",
                            badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                            accordionTriggerButton: "text-gray-300 hover:bg-white/5",
                            accordionContent: "text-gray-400",
                        },
                    }}
                />
            </motion.main>
        </div>
    );
}
