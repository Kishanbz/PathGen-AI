import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PathGen-AI - Personalized Learning",
  description: "AI-Powered Personalized Learning Path System",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#a855f7",
    colorBackground: "#0c0c14",
    colorText: "#ffffff",
    colorTextSecondary: "#9ca3af",
    colorInputBackground: "#1a1a2e",
    colorInputText: "#ffffff",
    colorNeutral: "#ffffff",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
    colorTextOnPrimaryBackground: "#ffffff",
  },
  elements: {
    // Root & Card
    rootBox: "w-full",
    cardBox: "bg-[#0c0c14] border border-white/10 shadow-2xl shadow-purple-500/5 backdrop-blur-xl rounded-2xl",
    card: "bg-transparent shadow-none",

    // Header
    headerTitle: "text-white text-2xl font-bold",
    headerSubtitle: "text-gray-400",

    // Social buttons
    socialButtonsBlockButton:
      "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all rounded-xl",
    socialButtonsBlockButtonText: "text-white font-medium",
    socialButtonsProviderIcon: "brightness-0 invert",

    // Divider
    dividerLine: "bg-white/10",
    dividerText: "text-gray-500",

    // Form fields
    formFieldLabel: "text-gray-300 font-medium text-sm",
    formFieldInput:
      "bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all",
    formFieldHintText: "text-gray-500",
    formFieldErrorText: "text-red-400",
    formFieldSuccessText: "text-emerald-400",

    // Buttons
    formButtonPrimary:
      "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all",
    formButtonReset: "text-purple-400 hover:text-purple-300",

    // Footer
    footerAction: "text-gray-400",
    footerActionLink: "text-purple-400 hover:text-purple-300 font-semibold",
    footerActionText: "text-gray-500",

    // Alert
    alert: "bg-red-500/10 border border-red-500/30 rounded-xl text-red-400",

    // User Button
    userButtonBox: "rounded-full",
    userButtonTrigger: "rounded-full ring-2 ring-purple-500/30 hover:ring-purple-500/60 transition-all",
    userButtonPopoverCard: "bg-[#0c0c14] border border-white/10 shadow-2xl backdrop-blur-xl rounded-xl",
    userButtonPopoverActionButton: "text-gray-300 hover:bg-white/5 rounded-lg",
    userButtonPopoverActionButtonText: "text-gray-300",
    userButtonPopoverActionButtonIcon: "text-gray-400",
    userButtonPopoverFooter: "border-t border-white/10",

    // User Profile
    profileSectionTitle: "text-white font-bold",
    profileSectionTitleText: "text-white font-bold",
    profileSectionContent: "text-gray-300",
    profileSectionPrimaryButton:
      "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl",
    formFieldAction: "text-purple-400 hover:text-purple-300",

    // Page / Navbar
    navbar: "bg-[#0c0c14] border-r border-white/10",
    navbarButton: "text-gray-300 hover:bg-white/5 rounded-lg",
    navbarButtonIcon: "text-gray-400",
    pageScrollBox: "bg-[#0c0c14]",
    page: "bg-[#0c0c14]",

    // Badges
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg",

    // Avatars
    avatarBox: "ring-2 ring-purple-500/30",

    // Modal / Overlay
    modalBackdrop: "bg-black/60 backdrop-blur-sm",
    modalContent: "bg-[#0c0c14] border border-white/10 shadow-2xl rounded-2xl",

    // Internal card headers
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-purple-400 hover:text-purple-300",

    // Other action links
    otherMethodsBlockButton: "text-gray-300 hover:bg-white/5 border border-white/10 rounded-xl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-purple-500/30`}>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
