"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export function AppleNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Despre", href: "#about", id: "about" },
    { name: "Servicii", href: "#services", id: "services" },
    { name: "Abilități", href: "#skills", id: "skills" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0d0f12]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <a
            href="#"
            onClick={() => setActiveLink("about")}
            className="flex items-center gap-3 group relative"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] opacity-40 blur-sm group-hover:opacity-100 transition duration-300"></div>
              <img
                src="/logo.png"
                alt="Swing Logo"
                className="relative w-10 h-10 object-contain rounded-xl bg-[#0d0f12] p-1 border border-white/10"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-widest text-xl bg-gradient-to-r from-[#FF5722] via-[#FF7822] to-[#FF9800] bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                SWING
              </span>
              <span className="text-[10px] tracking-wider text-white/40 font-medium -mt-1">
                PORTFOLIO
              </span>
            </div>
          </a>

          {/* DESKTOP NAV LINKS (Centrat & Stilizat) */}
          <div className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeLink === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveLink(link.id)}
                  className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out select-none ${
                    isActive
                      ? "scale-110 font-bold text-white bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-[0_0_20px_rgba(255,87,34,0.4)]"
                      : "text-white/70 hover:text-white hover:scale-105"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* ACTION BUTTON (CTA Right side) */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              onClick={() => setActiveLink("contact")}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-white/5 border border-white/15 hover:border-[#FF5722]/50 hover:bg-[#FF5722]/10 transition-all duration-300"
            >
              <Sparkles size={14} className="text-[#FF5722] group-hover:rotate-12 transition-transform" />
              <span>Colaborează</span>
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 mx-4 p-6 rounded-2xl bg-[#0d0f12]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                  isActive
                    ? "font-extrabold text-white bg-gradient-to-r from-[#FF5722] to-[#FF9800] scale-105 pl-6"
                    : "font-semibold text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default AppleNavbar;