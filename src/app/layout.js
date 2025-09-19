import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Team Portal",
  description: "A modern admin dashboard for team management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ChunkErrorHandler>
            <AuthProvider>
              <SettingsProvider>
                <UsersProvider>
                  {children}
                  <Toaster />
                </UsersProvider>
              </SettingsProvider>
            </AuthProvider>
          </ChunkErrorHandler>
        </ErrorBoundary>
      </body>
    </html>
  );
}
