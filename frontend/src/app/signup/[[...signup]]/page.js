'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-500 text-sm normal-case",
              card: "bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl",
              headerTitle: "text-white text-xl",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-900/50 hover:bg-slate-700 border border-slate-700 text-white",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
              footerActionText: "text-slate-400",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
            }
          }}
          routing="path" 
          path="/signup" 
          signInUrl="/login"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
}
