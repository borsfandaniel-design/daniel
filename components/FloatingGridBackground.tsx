"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Square {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  distance: number;
  opacity: number;
  isFilled: boolean;
}

export default function FloatingGridBackground() {
  // Generăm un set fix de pătrățele cu proprietăți aleatorii
  const squares = useMemo(() => {
    const items: Square[] = [];
    const count = 28; // Numărul de pătrățele din background

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        size: Math.floor(Math.random() * 40) + 16, // dimensiune între 16px și 56px
        left: Math.floor(Math.random() * 95), // poziție orizontală în %
        top: Math.floor(Math.random() * 95), // poziție verticală în %
        duration: Math.random() * 6 + 5, // durată animație între 5s și 11s
        delay: Math.random() * 4, // decalaj start între 0s și 4s
        distance: Math.random() * 30 + 15, // mișcare pe verticală (15px - 45px)
        opacity: Math.random() * 0.25 + 0.05, // opacitate subtilă
        isFilled: Math.random() > 0.6, // unele pline, altele doar contur (border)
      });
    }
    return items;
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid subtil pe fundal (linii fine) */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #E8FFF2 1px, transparent 1px),
                            linear-gradient(to bottom, #E8FFF2 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Pătrățelele flotante */}
      {squares.map((sq) => (
        <motion.div
          key={sq.id}
          className={`absolute rounded-lg border border-[#075E46]/60 backdrop-blur-[1px] ${
            sq.isFilled ? "bg-[#075E46]/10 shadow-[0_0_15px_rgba(7,94,70,0.2)]" : "bg-transparent"
          }`}
          style={{
            width: sq.size,
            height: sq.size,
            left: `${sq.left}%`,
            top: `${sq.top}%`,
          }}
          initial={{ y: 0, opacity: sq.opacity }}
          animate={{
            y: [-sq.distance, sq.distance, -sq.distance],
            rotate: [0, sq.id % 2 === 0 ? 90 : -90, 0], // rotație lentă opțională
            opacity: [sq.opacity, sq.opacity * 1.8, sq.opacity],
          }}
          transition={{
            duration: sq.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: sq.delay,
          }}
        />
      ))}
    </div>
  );
}