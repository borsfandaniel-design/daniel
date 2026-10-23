"use client";

import React from "react";
import { motion } from "framer-motion";
import { PumpkinIcon } from "./PumpkinIcon";

export function FloatingPumpkins() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pumpkin 1: Top-Right (Hero / Header Area - clearly visible on phones) */}
      <motion.div
        className="absolute top-20 sm:top-28 right-2 sm:right-8 md:right-16 select-none opacity-70 sm:opacity-40 pointer-events-none"
        animate={{
          y: [0, -14, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <PumpkinIcon className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36" />
      </motion.div>

      {/* Pumpkin 2: Mid-Left (Services / Skills Area - clearly visible on phones) */}
      <motion.div
        className="absolute top-[44%] left-1 sm:left-6 md:left-12 select-none opacity-65 sm:opacity-35 pointer-events-none"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <PumpkinIcon className="w-14 h-14 sm:w-24 sm:h-24 md:w-32 md:h-32" />
      </motion.div>

      {/* Pumpkin 3: Bottom-Right (Contact Area - clearly visible on phones) */}
      <motion.div
        className="absolute top-[82%] right-2 sm:right-8 md:right-16 select-none opacity-70 sm:opacity-40 pointer-events-none"
        animate={{
          y: [0, -14, 0],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.4,
        }}
      >
        <PumpkinIcon className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36" />
      </motion.div>
    </div>
  );
}
