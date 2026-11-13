import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGADEZ PLCDA BOT | Plateforme Anti-Désinformation & Rumeurs",
  description:
    "Plateforme institutionnelle de lutte contre les rumeurs et la désinformation dans la région d'Agadez (Niger). Signalements WhatsApp, vérification de terrain et alertes officielles.",
  icons: {
    icon: "/logo-plcda.jpg",
    apple: "/logo-plcda.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full bg-slate-50">
      <body className="h-full flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
