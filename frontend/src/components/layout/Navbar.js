import Link from 'next/link';
import { Sparkles, Map, User, LogIn } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a23]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center flex-row justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 rounded p-1.5 text-white group-hover:bg-indigo-500 transition-colors">
              <Map size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PathGen<span className="text-indigo-400">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-4">
            <Link 
              href="/explore" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/generate" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Sparkles size={16} />
            Generate with AI
          </Link>
          
          <div className="h-5 w-px bg-white/10 hidden sm:block mx-1" />

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                <span className="hidden sm:inline">Log in</span>
                <LogIn size={18} className="sm:hidden" />
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link 
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 border-2 border-indigo-500/50"
                }
              }}
              afterSignOutUrl="/" 
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
