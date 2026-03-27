import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "../components/ClientProvider";
import StoreProvider from "../redux/StoreProvider";
import InitUser from "../components/InitUser";

export const metadata: Metadata = {
  title: "Snapcart",
  description: "10 minutes Grocery delivery App",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-linear-to-b from-green-100 to-white font-sans">
        <ClientProvider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
