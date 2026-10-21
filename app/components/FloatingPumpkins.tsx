"use client";

import React from "react";
import { motion } from "framer-motion";
import { PumpkinIcon } from "./PumpkinIcon";

export function FloatingPumpkins() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pumpkin 1: Top-Right (Hero / About Section) */}
      <motion.div
        className="absolute top-24 sm:top-36 right-3 sm:right-10 md:right-16 lg:right-24 select-none opacity-30 hover:opacity-80 transition-opacity duration-500 pointer-events-auto"
        animate={{
          y: [0, -24, 0],
          rotate: [-3, 3, -3],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.1,
          rotate: 0,
          opacity: 0.95,
          transition: { duration: 0.3 },
        }}
      >
        <div className="relative group">
          {/* Subtle Ambient Halo */}
          <div className="absolute inset-0 bg-[#FF5400]/20 rounded-full blur-2xl group-hover:bg-[#FF5400]/40 transition-all duration-500" />
          <PumpkinIcon className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 relative drop-shadow-[0_8px_20px_rgba(255,84,0,0.25)] group-hover:drop-shadow-[0_12px_28px_rgba(255,84,0,0.45)] transition-all duration-300" />
        </div>
      </motion.div>

      {/* Pumpkin 2: Mid-Left (Services / Skills Section) */}
      <motion.div
        className="absolute top-[42%] left-2 sm:left-8 md:left-14 lg:left-20 select-none opacity-25 hover:opacity-75 transition-opacity duration-500 pointer-events-auto"
        animate={{
          y: [0, -20, 0],
          rotate: [4, -4, 4],
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 7.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
        whileHover={{
          scale: 1.08,
          rotate: 0,
          opacity: 0.95,
          transition: { duration: 0.3 },
        }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-[#FF5400]/15 rounded-full blur-2xl group-hover:bg-[#FF5400]/35 transition-all duration-500" />
          <PumpkinIcon className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 relative drop-shadow-[0_8px_18px_rgba(255,84,0,0.2)] group-hover:drop-shadow-[0_12px_26px_rgba(255,84,0,0.4)] transition-all duration-300" />
        </div>
      </motion.div>

      {/* Pumpkin 3: Bottom-Right (Contact Section) */}
      <motion.div
        className="absolute top-[80%] right-3 sm:right-12 md:right-20 lg:right-28 select-none opacity-28 hover:opacity-80 transition-opacity duration-500 pointer-events-auto"
        animate={{
          y: [0, -22, 0],
          rotate: [-4, 3, -4],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 8.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.8,
        }}
        whileHover={{
          scale: 1.1,
          rotate: 0,
          opacity: 0.95,
          transition: { duration: 0.3 },
        }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-[#FF5400]/20 rounded-full blur-2xl group-hover:bg-[#FF5400]/40 transition-all duration-500" />
          <PumpkinIcon className="w-28 h-28 sm:w-38 sm:h-38 md:w-48 md:h-48 relative drop-shadow-[0_8px_22px_rgba(255,84,0,0.25)] group-hover:drop-shadow-[0_12px_30px_rgba(255,84,0,0.45)] transition-all duration-300" />
        </div>
      </motion.div>
    </div>
  );
}

