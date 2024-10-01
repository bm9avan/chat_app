import NavBar from "@/components/custom/NavBar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";
import TostProvider from "@/components/providers/TostProvider";
import AuthProvider from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatApp - Connect with the World",
  description:
    "Experience seamless communication with our intuitive chat application.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TostProvider>
              <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <NavBar currentUser={currentUser}>{children}</NavBar>
              </div>
            </TostProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
