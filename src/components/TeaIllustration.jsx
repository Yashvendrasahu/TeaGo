import React, { useState, useEffect } from 'react';

/**
 * TeaIllustration: Renders rich product photos or artisanal tea cup graphics
 */
export default function TeaIllustration({
  image,
  id,
  alt = 'Menu Item',
  className = "w-full h-full",
  size = "md"
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  // If image URL / base64 is provided and hasn't errored out, show real dish image
  if (image && !imgError) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-stone-100 flex items-center justify-center ${className}`}>
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback to specific cup styling by drink ID or category
  switch (id) {
    case 'tg-01': // Tiger Brown Sugar Boba
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#2E180B] via-[#4A2610] to-[#1F0E04] p-4 ${className}`}>
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(210,105,30,0.25),transparent_70%)]" />
          
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cupBody1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFF9F2" stopOpacity="0.88" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F5EBE1" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="brownSugarSyrup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A2610" />
                <stop offset="100%" stopColor="#1A0C04" />
              </linearGradient>
              <linearGradient id="teaLiquid1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7EADB" />
                <stop offset="40%" stopColor="#E2C4A2" />
                <stop offset="85%" stopColor="#8C4E23" />
                <stop offset="100%" stopColor="#3B1C0A" />
              </linearGradient>
            </defs>

            {/* Straw */}
            <path d="M74 15 L78 60" stroke="#C47D38" strokeWidth="8" strokeLinecap="round" />
            <path d="M74 15 L78 60" stroke="#E5A869" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

            {/* Cup Outline (Transparent glass look) */}
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#teaLiquid1)" />
            
            {/* Tiger stripes effect */}
            <path d="M42 90 Q58 110 46 140 Q40 160 48 180" stroke="#3A1A07" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
            <path d="M118 85 Q102 115 112 145 Q118 165 110 185" stroke="#3A1A07" strokeWidth="11" strokeLinecap="round" opacity="0.85" />
            <path d="M80 80 Q92 105 82 135 Q74 155 86 175" stroke="#4A2610" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

            {/* Tapioca Pearls at bottom */}
            <circle cx="56" cy="190" r="8" fill="#150903" />
            <circle cx="72" cy="194" r="8.5" fill="#200E05" />
            <circle cx="90" cy="192" r="8" fill="#150903" />
            <circle cx="104" cy="188" r="7.5" fill="#1E0D05" />
            <circle cx="63" cy="178" r="7.5" fill="#231006" />
            <circle cx="81" cy="180" r="8.5" fill="#140803" />
            <circle cx="98" cy="177" r="7.8" fill="#281308" />
            <circle cx="72" cy="166" r="7.2" fill="#1B0C04" />
            <circle cx="88" cy="166" r="7" fill="#220F05" />
            
            {/* Pearl highlights */}
            <circle cx="54" cy="188" r="2.2" fill="#E8A87C" opacity="0.6" />
            <circle cx="70" cy="192" r="2.4" fill="#E8A87C" opacity="0.7" />
            <circle cx="88" cy="190" r="2.3" fill="#E8A87C" opacity="0.6" />
            <circle cx="79" cy="178" r="2.4" fill="#E8A87C" opacity="0.8" />

            {/* Cream top / Cap */}
            <path d="M34 56 C34 52 40 48 80 48 C120 48 126 52 126 56 C126 60 120 64 80 64 C40 64 34 60 34 56 Z" fill="#FFFDF8" />
            {/* Cup Rim Seal */}
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="none" stroke="#D1B89D" strokeWidth="2.5" />
            
            {/* Glass reflections */}
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
          </svg>
        </div>
      );

    case 'tg-02': // Ceremonial Uji Matcha Cloud
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#132A13] via-[#1B3B1A] to-[#0A1A0B] p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(78,138,62,0.3),transparent_70%)]" />
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="matchaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="28%" stopColor="#F4FBF1" />
                <stop offset="42%" stopColor="#6DAF50" />
                <stop offset="100%" stopColor="#2D5A27" />
              </linearGradient>
            </defs>
            {/* Glass Straw */}
            <path d="M75 14 L80 60" stroke="#8DC975" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
            <path d="M75 14 L80 60" stroke="#E6F5E1" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

            {/* Cup Body */}
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#matchaGrad)" />

            {/* Cloud Foam Dripping */}
            <path d="M36 62 Q50 78 64 68 Q80 84 96 70 Q110 82 124 62 L124 56 L36 56 Z" fill="#FFFDF5" />
            
            {/* Matcha Powder Dusting on top */}
            <circle cx="70" cy="54" r="1.5" fill="#3D7430" />
            <circle cx="85" cy="53" r="2" fill="#3D7430" />
            <circle cx="95" cy="55" r="1.5" fill="#3D7430" />
            <circle cx="78" cy="56" r="1.8" fill="#3D7430" />

            {/* Cup Rim */}
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="#FFFFFF" fillOpacity="0.4" stroke="#A8D499" strokeWidth="2" />
            {/* Light reflection */}
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.35" />
          </svg>
        </div>
      );

    case 'tg-03': // Ruby White Peach Oolong
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#3D1E16] via-[#5C2B1D] to-[#240F0A] p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(224,122,95,0.35),transparent_70%)]" />
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="peachGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE5D9" />
                <stop offset="35%" stopColor="#F4A261" />
                <stop offset="80%" stopColor="#E07A5F" />
                <stop offset="100%" stopColor="#9C4129" />
              </linearGradient>
            </defs>
            {/* Peach Straw */}
            <path d="M74 15 L78 60" stroke="#F4A261" strokeWidth="8" strokeLinecap="round" />
            {/* Cup Body */}
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#peachGrad)" />
            {/* Peach slice inside */}
            <ellipse cx="78" cy="115" rx="18" ry="10" transform="rotate(-25 78 115)" fill="#FFD1BA" opacity="0.6" stroke="#E07A5F" strokeWidth="2" />
            {/* Crystal pearls */}
            <circle cx="58" cy="188" r="7" fill="#FFFFFF" fillOpacity="0.65" stroke="#FFE3D6" strokeWidth="1.5" />
            <circle cx="75" cy="192" r="7.5" fill="#FFFFFF" fillOpacity="0.7" stroke="#FFE3D6" strokeWidth="1.5" />
            <circle cx="92" cy="190" r="7" fill="#FFFFFF" fillOpacity="0.65" stroke="#FFE3D6" strokeWidth="1.5" />
            <circle cx="68" cy="178" r="6.8" fill="#FFFFFF" fillOpacity="0.6" stroke="#FFE3D6" strokeWidth="1.5" />
            <circle cx="85" cy="179" r="7.2" fill="#FFFFFF" fillOpacity="0.65" stroke="#FFE3D6" strokeWidth="1.5" />
            {/* Ice cubes floating */}
            <rect x="52" y="75" width="18" height="18" rx="4" transform="rotate(15 52 75)" fill="#FFFFFF" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="88" y="85" width="16" height="16" rx="4" transform="rotate(-20 88 85)" fill="#FFFFFF" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Cup Rim */}
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="#FFF2EB" fillOpacity="0.4" stroke="#F4A261" strokeWidth="2" />
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );

    case 'tg-05': // Dragonfruit Passion Jasmine
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#38091B] via-[#5C0D30] to-[#20030E] p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(199,31,94,0.4),transparent_70%)]" />
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dragonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFB5D0" />
                <stop offset="35%" stopColor="#F06292" />
                <stop offset="80%" stopColor="#C71F5E" />
                <stop offset="100%" stopColor="#690B30" />
              </linearGradient>
            </defs>
            <path d="M74 15 L78 60" stroke="#FF85AF" strokeWidth="8" strokeLinecap="round" />
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#dragonGrad)" />
            {/* Dragonfruit seeds */}
            <circle cx="60" cy="95" r="1.5" fill="#20030E" />
            <circle cx="75" cy="110" r="1.8" fill="#20030E" />
            <circle cx="95" cy="100" r="1.5" fill="#20030E" />
            <circle cx="85" cy="130" r="1.6" fill="#20030E" />
            <circle cx="55" cy="140" r="1.5" fill="#20030E" />
            <circle cx="102" cy="145" r="1.7" fill="#20030E" />
            <circle cx="70" cy="160" r="1.5" fill="#20030E" />
            {/* Aloe vera cubes */}
            <rect x="55" y="180" width="14" height="14" rx="3" fill="#FFFFFF" fillOpacity="0.75" />
            <rect x="74" y="185" width="13" height="13" rx="3" fill="#FFFFFF" fillOpacity="0.8" />
            <rect x="91" y="180" width="14" height="14" rx="3" fill="#FFFFFF" fillOpacity="0.75" />
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="#FFF0F5" fillOpacity="0.4" stroke="#FF85AF" strokeWidth="2" />
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );

    case 'tg-07': // Taro Brulee Velvet Dream
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#22172B] via-[#3B294A] to-[#140C1A] p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(163,144,181,0.3),transparent_70%)]" />
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="taroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF4E6" />
                <stop offset="25%" stopColor="#E4D5EE" />
                <stop offset="65%" stopColor="#A390B5" />
                <stop offset="100%" stopColor="#5D4B6E" />
              </linearGradient>
            </defs>
            <path d="M74 15 L78 60" stroke="#B8A4C9" strokeWidth="8" strokeLinecap="round" />
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#taroGrad)" />
            {/* Taro Mash texture bottom */}
            <path d="M44 175 Q60 165 75 178 Q95 162 116 172 L116 195 C116 202 110 208 100 208 L60 208 C50 208 44 202 44 195 Z" fill="#4B3A5C" />
            {/* Brulee caramelized top */}
            <path d="M34 56 C34 52 40 48 80 48 C120 48 126 52 126 56 C126 60 120 64 80 64 C40 64 34 60 34 56 Z" fill="#E69C24" />
            <path d="M48 56 Q80 50 112 56" stroke="#8C4E0A" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="none" stroke="#D1B89D" strokeWidth="2" />
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
          </svg>
        </div>
      );

    default: // Default Artisanal Botanical Tea
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#241E19] via-[#3D332A] to-[#17130F] p-4 ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(196,125,56,0.25),transparent_70%)]" />
          <svg viewBox="0 0 160 220" className="w-full h-full max-h-[190px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="defaultTeaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFBF5" />
                <stop offset="35%" stopColor="#E6C8A8" />
                <stop offset="85%" stopColor="#9C6B3E" />
                <stop offset="100%" stopColor="#543317" />
              </linearGradient>
            </defs>
            <path d="M74 15 L78 60" stroke="#C47D38" strokeWidth="8" strokeLinecap="round" />
            <path d="M36 60 L44 195 C44 202 50 208 60 208 L100 208 C110 208 116 202 116 195 L124 60 Z" fill="url(#defaultTeaGrad)" />
            {/* Boba pearls */}
            <circle cx="56" cy="190" r="7.5" fill="#20130A" />
            <circle cx="74" cy="193" r="8" fill="#20130A" />
            <circle cx="92" cy="191" r="7.5" fill="#20130A" />
            <circle cx="65" cy="180" r="7" fill="#20130A" />
            <circle cx="83" cy="181" r="7.5" fill="#20130A" />
            <circle cx="100" cy="180" r="6.8" fill="#20130A" />
            <ellipse cx="80" cy="56" rx="46" ry="6" fill="#FFF8F0" fillOpacity="0.4" stroke="#C47D38" strokeWidth="2" />
            <path d="M42 70 L48 185" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      );
  }
}
