import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții | SWING OS",
  description: "Citește termenii și condițiile de utilizare a platformei SWING OS.",
};

export default function TermeniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-[#FFF3E0] text-[#2B2D42]">
      {children}
    </section>
  );
}