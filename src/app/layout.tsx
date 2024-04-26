import { Header } from "../components/header";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "wagmi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-system">
        <ThemeProvider attribute="class">
          <Providers>
            <Header />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
