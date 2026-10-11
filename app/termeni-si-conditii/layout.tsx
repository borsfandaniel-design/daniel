import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții | SWING",
  description: "Termenii, condițiile și cadrul legal de colaborare cu SWING (Daniel Moisă).",
};

export default function TermeniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-white text-zinc-900 font-sans">
      {children}
    </section>
  );
}