import React from "react";

export function PumpkinIcon({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Warm Pumpkin Body Gradient */}
        <radialGradient id="pumpkinBodyGrad" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FFA24C" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#FF5400" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#C2410C" stopOpacity="0.22" />
        </radialGradient>

        {/* Inner Carved Glow Gradient */}
        <radialGradient id="carvedGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFF0B3" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FF8A00" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF5400" stopOpacity="0.75" />
        </radialGradient>

        {/* Stem Gradient */}
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84CC16" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#4D7C0F" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id="pumpkinGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#FF5400" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#pumpkinGlow)">
        {/* Back Upper Ridges */}
        <path
          d="M 85 58 C 96 46 112 40 130 40 C 148 40 164 46 175 58"
          stroke="#EA580C"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 68 70 C 76 56 94 48 114 46"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 192 70 C 184 56 166 48 146 46"
          stroke="#EA580C"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Stem */}
        <path
          d="M 124 50 C 122 34 126 20 138 12 C 144 7 149 10 148 16 C 144 26 138 36 136 50 Z"
          fill="url(#stemGrad)"
          stroke="#365314"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <ellipse
          cx="144"
          cy="12"
          rx="6"
          ry="3"
          transform="rotate(-25 144 12)"
          fill="#A3E635"
          stroke="#365314"
          strokeWidth="2"
        />

        {/* Far-Left Lobe */}
        <path
          d="M 80 58 C 45 68 22 98 22 135 C 22 178 52 208 82 218 C 65 192 56 162 58 132 C 60 102 70 76 80 58 Z"
          fill="url(#pumpkinBodyGrad)"
          stroke="#FF5400"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Far-Right Lobe */}
        <path
          d="M 180 58 C 215 68 238 98 238 135 C 238 178 208 208 178 218 C 195 192 204 162 202 132 C 200 102 190 76 180 58 Z"
          fill="url(#pumpkinBodyGrad)"
          stroke="#FF5400"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner-Left Lobe */}
        <path
          d="M 105 50 C 78 54 56 82 56 128 C 56 174 78 210 105 224 C 92 198 86 164 88 130 C 90 96 98 68 105 50 Z"
          fill="url(#pumpkinBodyGrad)"
          stroke="#FF5400"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner-Right Lobe */}
        <path
          d="M 155 50 C 182 54 204 82 204 128 C 204 174 182 210 155 224 C 168 198 174 164 172 130 C 170 96 162 68 155 50 Z"
          fill="url(#pumpkinBodyGrad)"
          stroke="#FF5400"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Center Main Lobe */}
        <path
          d="M 130 48 C 104 48 86 80 86 130 C 86 182 105 225 130 225 C 155 225 174 182 174 130 C 174 80 156 48 130 48 Z"
          fill="url(#pumpkinBodyGrad)"
          stroke="#FF5400"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* CARVED FACE - JACK O LANTERN */}
        {/* Left Eye */}
        <g>
          {/* Main Cutout */}
          <polygon
            points="62,130 108,130 84,94"
            fill="url(#carvedGlow)"
            stroke="#EA580C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 3D Carved Inner Facet (matching drawing) */}
          <polygon
            points="70,125 102,125 84,101"
            fill="none"
            stroke="#9A3412"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <line x1="62" y1="130" x2="70" y2="125" stroke="#9A3412" strokeWidth="1.8" />
          <line x1="108" y1="130" x2="102" y2="125" stroke="#9A3412" strokeWidth="1.8" />
          <line x1="84" y1="94" x2="84" y2="101" stroke="#9A3412" strokeWidth="1.8" />
        </g>

        {/* Right Eye */}
        <g>
          {/* Main Cutout */}
          <polygon
            points="152,130 198,130 176,94"
            fill="url(#carvedGlow)"
            stroke="#EA580C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 3D Carved Inner Facet */}
          <polygon
            points="158,125 190,125 176,101"
            fill="none"
            stroke="#9A3412"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <line x1="152" y1="130" x2="158" y2="125" stroke="#9A3412" strokeWidth="1.8" />
          <line x1="198" y1="130" x2="190" y2="125" stroke="#9A3412" strokeWidth="1.8" />
          <line x1="176" y1="94" x2="176" y2="101" stroke="#9A3412" strokeWidth="1.8" />
        </g>

        {/* Nose */}
        <g>
          <polygon
            points="120,150 140,150 130,130"
            fill="url(#carvedGlow)"
            stroke="#EA580C"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 3D Bevel Line */}
          <line x1="123" y1="147" x2="137" y2="147" stroke="#9A3412" strokeWidth="1.5" />
        </g>

        {/* Grinning Mouth with Teeth */}
        <g>
          <path
            d="M 60 156 
               C 80 176 100 182 108 170 
               L 116 178 
               L 124 168 
               L 132 178 
               L 142 168 
               L 150 178 
               C 160 182 180 176 200 156 
               C 184 195 158 208 130 208 
               C 102 208 76 195 60 156 Z"
            fill="url(#carvedGlow)"
            stroke="#EA580C"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Lower Rind Carved Rim/Facet */}
          <path
            d="M 68 163 
               C 85 192 108 201 130 201 
               C 152 201 175 192 192 163"
            stroke="#9A3412"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        </g>
      </g>
    </svg>
  );
}

