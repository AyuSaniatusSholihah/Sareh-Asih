const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `function LogoMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">`,
  `function LogoMark() {
  return (
    <motion.svg animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} width="72" height="72" viewBox="0 0 72 72" fill="none">`
);

code = code.replace(
  `      {/* small leaf top-right */}
      <path d="M50 14 Q56 8 60 14 Q56 18 50 14Z" fill="#8BB098"/>
      <path d="M55 14 L55 20" stroke="#5B7A68" strokeWidth="1.2" strokeLinecap="round"/>
      {/* sparkles */}
      <circle cx="20" cy="14" r="2" fill="#D4A843"/>
      <circle cx="58" cy="22" r="1.5" fill="#8BB098"/>
      <circle cx="16" cy="32" r="1.2" fill="#D4A843" opacity="0.6"/>
    </svg>`,
  `      {/* small leaf top-right */}
      <path d="M50 14 Q56 8 60 14 Q56 18 50 14Z" fill="#8BB098"/>
      <path d="M55 14 L55 20" stroke="#5B7A68" strokeWidth="1.2" strokeLinecap="round"/>
      {/* flower top-left */}
      <circle cx="20" cy="12" r="3" fill="#F5C9A0"/>
      <circle cx="16" cy="15" r="3" fill="#F5C9A0"/>
      <circle cx="24" cy="15" r="3" fill="#F5C9A0"/>
      <circle cx="20" cy="19" r="3" fill="#F5C9A0"/>
      <circle cx="20" cy="15" r="2" fill="#D4A843"/>
      {/* sparkles */}
      <circle cx="58" cy="22" r="1.5" fill="#8BB098"/>
      <circle cx="16" cy="32" r="1.2" fill="#D4A843" opacity="0.6"/>
    </motion.svg>`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
