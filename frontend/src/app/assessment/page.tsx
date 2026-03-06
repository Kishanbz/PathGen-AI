"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, ChevronRight, Target } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_QUESTIONS = [
    {
        id: 1,
        question: "How would you rate your current knowledge of Machine Learning?",
        options: ["Complete Beginner", "Know the Basics", "Intermediate", "Advanced"],
    },
    {
        id: 2,
        question: "Which learning format do you prefer?",
        options: ["Video Lectures", "Interactive Coding", "Reading Articles", "Project-Based"],
    },
    {
        id: 3,
        question: "What is your primary goal with PathGen-AI?",
        options: ["Career Transition", "Academic Requirement", "Skill Enhancement", "Curiosity"],
    }
];

export default function AssessmentPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();

    const handleSelectOption = (option: string) => {
        setAnswers({ ...answers, [currentQuestionIndex]: option });
    };

    const handleNext = () => {
        if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
            // Simulate AI processing
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        }
    };

    const progress = ((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden relative">
            <div className="absolute inset-0 z-0">
                {/* Subtle ambient blur */}
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <header className="mb-12 flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <BrainCircuit className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Initial Assessment</h1>
                        <p className="text-sm text-gray-400">Personalizing your optimal path</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {!isCompleted ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
                        >
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}
                                    </span>
                                    <span className="text-xs font-bold text-purple-400">{Math.round(progress)}% Complete</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                        initial={{ width: `${((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100}%` }}
                                        animate={{ width: `${((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                                {MOCK_QUESTIONS[currentQuestionIndex].question}
                            </h2>

                            <div className="space-y-3 mb-8">
                                {MOCK_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        key={idx}
                                        onClick={() => handleSelectOption(option)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQuestionIndex] === option
                                            ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                            : 'border-white/10 bg-black/20 text-gray-300 hover:bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{option}</span>
                                            {answers[currentQuestionIndex] === option && (
                                                <CheckCircle2 className="h-5 w-5 text-purple-400" />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!answers[currentQuestionIndex]}
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                >
                                    {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next Question'}
                                    <ChevronRight className="h-4 w-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 border border-purple-500/30 rounded-3xl p-12 text-center backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse-glow" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
                                    <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-full">
                                        <Target className="h-10 w-10 text-white animate-pulse" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-4">Generating Your Custom Path...</h2>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    PathGen-AI model is analyzing your responses to build a predictive learning trajectory optimized for your goals.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
