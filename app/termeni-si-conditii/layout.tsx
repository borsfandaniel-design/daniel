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
    <section className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-200">
      {children}
    </section>
  );
}
