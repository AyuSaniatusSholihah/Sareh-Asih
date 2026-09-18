import { motion } from "motion/react";

export function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.8l7.8 6.1C12.3 14 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.4-4.5 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-17z" />
      <path fill="#FBBC05" d="M10.4 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.5l7.8-6.1z" />
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.3-5.5l-7.1-5.5c-2 1.4-4.6 2.2-8.2 2.2-6.4 0-11.7-4.5-13.6-10.4l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5z" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <motion.svg animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* leaf base */}
      <ellipse cx="36" cy="58" rx="18" ry="6" fill="#8BB098" opacity="0.3" />
      {/* left figure (adult) */}
      <circle cx="28" cy="22" r="9" fill="#5B7A68" />
      <path d="M18 50 Q18 36 28 34 Q32 33 34 36 L34 50Z" fill="#5B7A68" />
      {/* right figure (child) */}
      <circle cx="46" cy="26" r="7" fill="#D4A843" />
      <path d="M38 50 Q38 38 46 36 Q50 35 52 38 L52 50Z" fill="#D4A843" />
      {/* heart formed by both */}
      <path d="M36 46 Q28 38 28 33 Q28 29 32 29 Q34 29 36 31 Q38 29 40 29 Q44 29 44 33 Q44 38 36 46Z" fill="#E8637A" opacity="0.85" />
      {/* small leaf top-right */}
      <path d="M50 14 Q56 8 60 14 Q56 18 50 14Z" fill="#8BB098" />
      <path d="M55 14 L55 20" stroke="#5B7A68" strokeWidth="1.2" strokeLinecap="round" />
      {/* flower top-left */}
      <circle cx="20" cy="12" r="3" fill="#F5C9A0" />
      <circle cx="16" cy="15" r="3" fill="#F5C9A0" />
      <circle cx="24" cy="15" r="3" fill="#F5C9A0" />
      <circle cx="20" cy="19" r="3" fill="#F5C9A0" />
      <circle cx="20" cy="15" r="2" fill="#D4A843" />
      {/* sparkles */}
      <circle cx="58" cy="22" r="1.5" fill="#8BB098" />
      <circle cx="16" cy="32" r="1.2" fill="#D4A843" opacity="0.6" />
    </motion.svg>
  );
}

export function TeacherChildIllustration() {
  return (
    <svg width="300" height="190" viewBox="0 0 300 190" fill="none">
      {/* background blob */}
      <ellipse cx="150" cy="130" rx="130" ry="55" fill="#E8F0E9" opacity="0.7" />

      {/* desk */}
      <rect x="40" y="140" width="220" height="10" rx="5" fill="#C8A87A" opacity="0.5" />

      {/* books stack left */}
      <rect x="48" y="120" width="34" height="8" rx="3" fill="#5B7A68" />
      <rect x="50" y="113" width="30" height="8" rx="3" fill="#D4A843" />
      <rect x="52" y="106" width="26" height="8" rx="3" fill="#8BB098" />

      {/* laptop */}
      <rect x="110" y="108" width="80" height="52" rx="5" fill="#5A5A6A" />
      <rect x="113" y="111" width="74" height="46" rx="3" fill="#E8F5ED" />
      {/* logo on laptop */}
      <path d="M148 130 Q143 124 143 121 Q143 118 146 118 Q148 118 150 120 Q152 118 154 118 Q157 118 157 121 Q157 124 150 130Z" fill="#8BB098" opacity="0.8" />
      <rect x="100" y="158" width="100" height="5" rx="2.5" fill="#3A3A4A" />

      {/* mug right */}
      <rect x="202" y="124" width="24" height="20" rx="4" fill="#fff" stroke="#8BB098" strokeWidth="1.5" />
      <path d="M226 130 Q234 130 234 136 Q234 142 226 142" stroke="#8BB098" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M208 122 Q210 116 214 116 Q218 116 216 122" stroke="#8BB098" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* plant right */}
      <rect x="238" y="130" width="8" height="16" rx="2" fill="#C8A87A" opacity="0.7" />
      <ellipse cx="242" cy="128" rx="10" ry="6" fill="#8BB098" opacity="0.6" />
      <ellipse cx="236" cy="122" rx="7" ry="5" fill="#5B7A68" opacity="0.5" />
      <ellipse cx="248" cy="120" rx="7" ry="5" fill="#5B7A68" opacity="0.5" />

      {/* plant left */}
      <rect x="28" y="140" width="6" height="10" rx="2" fill="#C8A87A" opacity="0.6" />
      <ellipse cx="31" cy="138" rx="8" ry="5" fill="#8BB098" opacity="0.5" />
      <ellipse cx="26" cy="133" rx="6" ry="4" fill="#5B7A68" opacity="0.4" />
      <ellipse cx="37" cy="132" rx="6" ry="4" fill="#5B7A68" opacity="0.4" />

      {/* ADULT (teacher) — body */}
      <rect x="82" y="80" width="42" height="65" rx="14" fill="#5B7A68" />
      {/* collar white */}
      <path d="M100 80 L103 92 L106 80" fill="#F0EDE8" opacity="0.9" />
      {/* adult head */}
      <circle cx="103" cy="64" r="18" fill="#F5C9A0" />
      {/* hair */}
      <path d="M84 58 Q85 44 103 44 Q121 44 122 58 Q118 50 103 49 Q88 50 84 58Z" fill="#2E1A0E" />
      <path d="M84 58 Q81 68 85 74 Q83 65 86 60Z" fill="#2E1A0E" />
      <path d="M122 58 Q125 68 121 74 Q123 65 120 60Z" fill="#2E1A0E" />
      {/* eyes */}
      <ellipse cx="97" cy="64" rx="2" ry="2.2" fill="#2E1A0E" />
      <ellipse cx="109" cy="64" rx="2" ry="2.2" fill="#2E1A0E" />
      {/* smile */}
      <path d="M97 71 Q103 75 109 71" stroke="#C47A5A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* arm pointing to laptop */}
      <path d="M124 100 Q140 105 148 115" stroke="#5B7A68" strokeWidth="8" strokeLinecap="round" />

      {/* CHILD — body */}
      <rect x="162" y="92" width="34" height="52" rx="11" fill="#D4A843" opacity="0.9" />
      {/* child head */}
      <circle cx="179" cy="76" r="15" fill="#F5C9A0" />
      {/* child hair */}
      <path d="M163 70 Q165 60 179 60 Q193 60 195 70 Q192 63 179 62 Q166 63 163 70Z" fill="#3D2010" />
      {/* child eyes */}
      <ellipse cx="174" cy="76" rx="1.8" ry="2" fill="#2E1A0E" />
      <ellipse cx="184" cy="76" rx="1.8" ry="2" fill="#2E1A0E" />
      {/* child smile */}
      <path d="M174 82 Q179 86 184 82" stroke="#C47A5A" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* chat bubble (heart) top-left */}
      <rect x="56" y="52" width="32" height="28" rx="10" fill="#fff" stroke="#8BB098" strokeWidth="1.5" />
      <path d="M65 76 L60 84" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 76 L60 84" stroke="#8BB098" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 64 Q67 58 67 55 Q67 52 70 52 Q72 52 72 54 Q72 52 74 52 Q77 52 77 55 Q77 58 72 64Z" fill="#E8637A" opacity="0.85" />

      {/* star top-right */}
      <path d="M228 48 L230 54 L236 54 L231 58 L233 64 L228 60 L223 64 L225 58 L220 54 L226 54Z" fill="#D4A843" />
    </svg>
  );
}

export function SplashLogo() {
  return (
    <svg width="120" height="101" viewBox="0 0 125 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M72.1475 37.0083C72.1475 55.1312 64.7526 104 52.6236 104C40.4945 104 9.92851 85.9004 1.56112 49.7014C-5.18691 31.5364 10.5761 -4.50951 36.5986 1.51474C48.7277 1.51474 72.1475 18.8854 72.1475 37.0083Z" fill="#8BB098" />
      <ellipse cx="88.0087" cy="15.2788" rx="13.9456" ry="15.2788" fill="#D27D6B" />
      <path d="M63.653 103.76C63.6346 103.794 63.6162 103.828 63.5978 103.862C63.6144 103.828 63.6328 103.794 63.653 103.76C69.4179 93.091 73.6973 62.8798 80.4557 53.8555C87.2358 44.8023 121.616 22.8219 122.996 33.3994C124.927 48.2081 124.653 51.2698 116.929 68.8991C108.706 87.6672 87.2839 94.313 80.0972 97.2651C72.7874 100.268 64.8815 101.715 63.653 103.76Z" fill="#8BB098" />
      <path d="M63.5978 103.862C69.3906 93.2841 73.6757 62.9086 80.4557 53.8555C87.2358 44.8023 121.616 22.8219 122.996 33.3994C124.927 48.2081 124.653 51.2698 116.929 68.8991C108.706 87.6672 87.2839 94.313 80.0972 97.2651C72.6669 100.317 64.6208 101.763 63.5978 103.862Z" stroke="#8BB098" />
    </svg>
  );
}
