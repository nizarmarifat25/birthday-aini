"use client";

import { useState, useRef, useEffect, useCallback } from "react";
// UPDATE: Tambahin useScroll dan useTransform dari framer-motion
import { motion, AnimatePresence, useScroll, useTransform, PanInfo } from "framer-motion";
import { Gift, Heart, Sparkles, Flame, X, ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import confetti from "canvas-confetti";

// ==========================================
// BACKGROUND ANIMATION
// ==========================================
function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <motion.div animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/30 blur-[80px]" />
      <motion.div animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.5, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-200/40 blur-[100px]" />
      <motion.div animate={{ y: [0, 30, 0], x: [0, 50, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-indigo-200/30 blur-[70px]" />
    </div>
  );
}

// ==========================================
// KOMPONEN BARU: SAFE PARALLAX WRAPPER
// (Bikin efek scroll parallax yang aman buat HP)
// ==========================================
function SafeParallax({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Elemen akan bergerak berlawanan arah scroll bikin efek melayang
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className="w-full h-full relative z-10">
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

export default function BirthdayPage() {
  const [phase, setPhase] = useState(1);

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-800">
      <FloatingBackground />
      <AnimatePresence mode="wait">
        {phase === 1 && <Phase1Runaway key="phase1" onNext={() => setPhase(2)} />}
        {phase === 2 && <Phase2Balloons key="phase2" onNext={() => setPhase(3)} />}
        {phase === 3 && <Phase3MainContent key="phase3" />}
      </AnimatePresence>
    </main>
  );
}


// ==========================================
// PHASE 1: Button & Realistic SVG Cake (Upgrade — Fix Hitbox Lilin Mobile)
// ==========================================
 
const FLOAT_EMOJIS = ["✨", "🎈", "💫", "🎉"];
 
type FloatBit = { id: number; emoji: string; x: number; rotate: number };
 
function Phase1Runaway({ onNext }: { onNext: () => void }) {
  const [hoverCount, setHoverCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
  const [showCake, setShowCake] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [floatBits, setFloatBits] = useState<FloatBit[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const floatIdRef = useRef(0);
 
  const popFloatBit = useCallback(() => {
    const id = floatIdRef.current++;
    const bit: FloatBit = {
      id,
      emoji: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
      x: 30 + Math.random() * 240,
      rotate: Math.random() * 60 - 30,
    };
    setFloatBits((prev) => [...prev, bit]);
    setTimeout(() => {
      setFloatBits((prev) => prev.filter((b) => b.id !== id));
    }, 1100);
  }, []);
 
  const moveButton = () => {
    if (hoverCount < 5) {
      // Range gerak disesuaikan biar tombol tidak keluar dari card di HP kecil
      setPosition({
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.5) * 80,
        rotate: Math.random() * 10 - 5,
      });
      setHoverCount((prev) => prev + 1);
      popFloatBit();
    }
  };
 
  const blowCandle = () => {
    if (isBlown) return; // Mencegah double tap / double-fire touchend+click di HP
    setIsBlown(true);
    confetti({
      particleCount: 160,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#fbcfe8", "#bfdbfe", "#fde047", "#a5b4fc"],
    });
    setTimeout(() => onNext(), 3500);
  };
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      className="absolute inset-0 flex items-center justify-center z-10"
    >
      {/* Ambient glow background */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[80vw] h-[80vw] md:w-[30vw] md:h-[30vw] bg-blue-300/20 rounded-full blur-[100px] -z-10"
      />
 
      <motion.div
        ref={stageRef}
        className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-14 flex flex-col items-center max-w-lg mx-4 text-center relative overflow-hidden"
      >
        {/* Dekorasi bulatan asimetris di pojok card — biar gak kaku/simetris */}
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-200/30 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-indigo-300/25 pointer-events-none" />
 
        {/* Layer emoji yang melayang setiap tombol kabur */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <AnimatePresence>
            {floatBits.map((bit) => (
              <motion.span
                key={bit.id}
                initial={{ opacity: 0.9, y: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 0, y: -70, scale: 1.4, rotate: bit.rotate }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute text-lg"
                style={{ left: bit.x, top: "55%" }}
              >
                {bit.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
 
        <AnimatePresence mode="wait">
          {!showCake ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center relative z-10"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-blue-100 p-4 rounded-full mb-5 relative"
              >
                <Gift size={40} className="text-blue-500" />
                <Sparkles
                  size={16}
                  className="absolute -top-1 -right-1 text-amber-400 fill-amber-300"
                />
                <span className="absolute -bottom-1 -left-2 text-base">🎈</span>
              </motion.div>
 
              <p className="text-indigo-500 text-xs font-semibold tracking-widest uppercase mb-1">
                Untuk seseorang yang spesial
              </p>
              <h1 className="font-heading text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-2 leading-tight">
                Happy Birthday, Sayang 💙
              </h1>
              <p className="text-slate-500 mb-8 text-base font-medium">
                Tangkap tombolnya kalau bisa~
              </p>
 
              <div className="relative w-full h-28 flex items-center justify-center">
                <motion.button
                  animate={{ x: position.x, y: position.y, rotate: position.rotate }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
                  onPointerEnter={moveButton} // Buat laptop / mouse
                  onTouchStart={(e) => {
                    e.preventDefault();
                    moveButton();
                  }} // FIX HP: tombol auto kabur pas disentuh, sebelum onClick sempat fire
                  onClick={() => {
                    if (hoverCount >= 5) setShowCake(true);
                  }}
                  className={`absolute font-heading text-lg px-7 py-3.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-colors duration-300 border-2 border-white/50 touch-none select-none ${
                    hoverCount >= 5
                      ? "bg-gradient-to-r from-indigo-400 to-blue-500 text-white animate-pulse"
                      : "bg-gradient-to-br from-blue-400 to-indigo-500 text-white"
                  }`}
                  style={{ touchAction: "manipulation" }}
                >
                  <Gift size={22} />{" "}
                  {hoverCount >= 5 ? "Klik Aku Sekarang!" : "Buka Kado"}
                </motion.button>
              </div>
 
              <div className="h-6 mt-2">
                {hoverCount > 0 && hoverCount < 5 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-indigo-500 font-bold tracking-wide text-sm"
                  >
                    Hayo kurang gesit! 😜
                  </motion.p>
                )}
                {hoverCount >= 5 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-indigo-500 font-bold tracking-wide text-sm"
                  >
                    Sekarang tangkap aku!
                  </motion.p>
                )}
              </div>
 
              {/* Progress dots — pengganti angka counter biar lebih playful */}
              <div className="flex gap-1.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      scale: i < hoverCount ? 1.3 : 1,
                      backgroundColor: i < hoverCount ? "#6366f1" : "#cbd5e1",
                    }}
                    transition={{ duration: 0.25 }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              {!isBlown ? (
                <>
                  <h1 className="font-heading text-3xl md:text-4xl text-blue-600 mb-2">
                    Make a Wish! 🎂
                  </h1>
                  <p className="text-slate-500 mb-8 font-medium bg-white/60 px-6 py-2 rounded-full border border-white">
                    (Tap api lilinnya buat niup)
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 text-center"
                >
                  <h1 className="font-heading text-4xl text-indigo-500 mb-2">
                    Yeayyy! 🎉
                  </h1>
                  <p className="text-slate-600 font-medium">
                    Tunggu bentar, kado lagi disiapin...
                  </p>
                </motion.div>
              )}
 
              <RealisticCake isBlown={isBlown} onBlow={blowCandle} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
 
// ==========================================
// Sub-komponen: Kue SVG realistis + lilin dengan hitbox tap yang besar & menyatu
// ==========================================
function RealisticCake({
  isBlown,
  onBlow,
}: {
  isBlown: boolean;
  onBlow: () => void;
}) {
  // Pakai satu handler gabungan: pointerUp menutupi mouse + touch + pen sekaligus.
  // Ini menghindari masalah lama: div hitbox absolute terpisah yang bisa ke-clip
  // oleh overflow-hidden parent atau ketutup elemen lain. Di sini hitbox adalah
  // elemen SVG yang menyatu langsung di urutan render & stacking context yang sama
  // dengan api, jadi tidak mungkin "kepotong".
  const handleActivate = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBlow();
  };
 
  return (
    <motion.div
      animate={isBlown ? { y: [0, -16, 0, -8, 0], scale: [1, 1.04, 1] } : { y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative mt-4 mb-4"
    >
      <svg
        viewBox="0 0 260 240"
        width="260"
        height="240"
        className="overflow-visible"
        style={{ touchAction: "manipulation" }}
      >
        <defs>
          <radialGradient id="plateShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cakeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="frostingDrip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <pattern id="candleStripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="#93c5fd" />
            <rect x="5" width="5" height="10" fill="#ffffff" />
          </pattern>
          <radialGradient id="flameGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
 
        {/* Bayangan & alas piring */}
        <ellipse cx="130" cy="218" rx="115" ry="16" fill="url(#plateShadow)" />
        <ellipse cx="130" cy="212" rx="100" ry="12" fill="#e2e8f0" />
        <ellipse cx="130" cy="208" rx="92" ry="9" fill="#f1f5f9" />
 
        {/* Badan kue bawah */}
        <rect x="40" y="130" width="180" height="70" rx="14" fill="url(#cakeBody)" />
        <rect x="40" y="160" width="180" height="40" rx="10" fill="#60a5fa" opacity="0.35" />
        {/* Sprinkles di badan bawah */}
        <g>
          <rect x="65" y="148" width="10" height="3" rx="1.5" fill="#f472b6" transform="rotate(30 70 150)" />
          <rect x="160" y="155" width="10" height="3" rx="1.5" fill="#fde047" transform="rotate(-20 165 156)" />
          <rect x="100" y="170" width="10" height="3" rx="1.5" fill="#a5b4fc" transform="rotate(15 105 171)" />
          <rect x="185" y="175" width="10" height="3" rx="1.5" fill="#f472b6" transform="rotate(-35 190 176)" />
          <rect x="55" y="180" width="10" height="3" rx="1.5" fill="#5eead4" transform="rotate(45 60 181)" />
        </g>
 
        {/* Lapisan frosting drip atas, dibentuk pakai curve biar natural */}
        <path
          d="M45 130
             C45 110 55 95 70 95
             C75 110 85 115 90 100
             C95 112 105 116 112 100
             C117 113 127 117 134 100
             C139 113 149 116 156 100
             C161 112 171 115 176 100
             C190 96 215 108 215 130
             Z"
          fill="url(#frostingDrip)"
        />
        <path
          d="M45 130
             C45 110 55 95 70 95
             C75 110 85 115 90 100
             C95 112 105 116 112 100
             C117 113 127 117 134 100
             C139 113 149 116 156 100
             C161 112 171 115 176 100
             C190 96 215 108 215 130
             Z"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
          opacity="0.6"
        />
 
        {/* Sprinkles di frosting atas */}
        <g>
          <circle cx="80" cy="112" r="3" fill="#f472b6" />
          <circle cx="105" cy="106" r="3" fill="#a5b4fc" />
          <circle cx="130" cy="108" r="3" fill="#fde047" />
          <circle cx="150" cy="104" r="3" fill="#5eead4" />
          <circle cx="170" cy="110" r="3" fill="#f472b6" />
          <circle cx="95" cy="118" r="2.5" fill="#fde047" />
          <circle cx="160" cy="118" r="2.5" fill="#a5b4fc" />
        </g>
 
        {/* === LILIN + API: hitbox tap = lingkaran besar transparan dalam grup SVG yang sama === */}
        <g
          onPointerUp={handleActivate}
          onTouchEnd={handleActivate}
          style={{ cursor: isBlown ? "default" : "pointer" }}
        >
          {/* Hitbox: lingkaran tak terlihat tapi besar (~96px diameter), menyatu di grup ini
              sehingga TIDAK BISA ke-clip oleh overflow parent atau ketutup elemen lain —
              berbeda dari versi lama yang pakai div absolute terpisah di luar alur SVG. */}
          {!isBlown && (
            <circle cx="135" cy="62" r="48" fill="transparent" />
          )}
 
          {/* Batang lilin */}
          <rect x="127" y="78" width="16" height="36" rx="3" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
          <rect x="127" y="78" width="16" height="36" rx="3" fill="url(#candleStripes)" opacity="0.55" />
 
          {/* Sumbu */}
          <rect x="133" y="70" width="4" height="9" fill="#44403c" />
 
          {/* Api (hilang halus saat ditiup) */}
          <motion.g
            animate={isBlown ? { opacity: 0, scale: 0.4, y: 6 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "135px 60px" }}
          >
            <motion.g
              animate={
                !isBlown
                  ? { scale: [1, 1.12, 0.96, 1.06, 1], rotate: [-3, 2, -2, 3, 0] }
                  : {}
              }
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "135px 60px" }}
            >
              <circle cx="135" cy="58" r="18" fill="url(#flameGlowGrad)" />
              <path
                d="M135 40 C143 50 146 58 138 66 C133 70 124 65 126 57 C127.5 51.5 131.5 46 135 40 Z"
                fill="#fb923c"
              />
              <path
                d="M135 48 C139.5 54.5 141 58.5 137 62.5 C134.5 64.5 130 62.5 131 58 C131.8 54.5 133 51 135 48 Z"
                fill="#fde047"
              />
            </motion.g>
          </motion.g>
 
          {/* Cincin petunjuk tap (hanya tampil sebelum ditiup) — affordance visual,
              bukan satu-satunya area tap (hitbox lebih besar dari ring ini). */}
          {!isBlown && (
            <motion.circle
              cx="135"
              cy="60"
              r="34"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              animate={{ opacity: [0.55, 0.1, 0.55], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </g>
 
        {/* Asap saat lilin ditiup */}
        <AnimatePresence>
          {isBlown && (
            <motion.g
              initial={{ opacity: 0.9, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -55, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            >
              <circle cx="135" cy="55" r="6" fill="#cbd5e1" opacity="0.7" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
 


// ==========================================
// PHASE 2: Balloons (Upgrade — SVG balon 3D, sway, awan, hint feedback)
// ==========================================

type BalloonColor = { top: string; bot: string };

const BALLOON_COLORS: BalloonColor[] = [
  { top: "#7dd3fc", bot: "#38bdf8" },
  { top: "#67e8f9", bot: "#22d3ee" },
  { top: "#93c5fd", bot: "#60a5fa" },
  { top: "#a5b4fc", bot: "#818cf8" },
];

const SPECIAL_GOLD: BalloonColor = { top: "#fff7d6", bot: "#fbbf24" };

type Balloon = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  swayDuration: number;
  size: number;
  isSpecial: boolean;
  color: BalloonColor;
};

const TOTAL_BALLOONS = 9;

function makeBalloons(): Balloon[] {
  const specialIndex = Math.floor(Math.random() * TOTAL_BALLOONS);
  return Array.from({ length: TOTAL_BALLOONS }).map((_, i) => {
    const isSpecial = i === specialIndex;
    return {
      id: i,
      x: Math.random() * 80 + 8,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 7,
      swayDuration: Math.random() * 1.5 + 3,
      size: isSpecial ? 1.1 : 0.85 + Math.random() * 0.25,
      isSpecial,
      color: isSpecial
        ? SPECIAL_GOLD
        : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    };
  });
}

const CLOUDS = [
  { left: "10%", top: "15%", w: 90, h: 34, dur: 22 },
  { left: "45%", top: "32%", w: 110, h: 38, dur: 28 },
  { left: "75%", top: "10%", w: 80, h: 30, dur: 34 },
];

function Phase2Balloons({ onNext }: { onNext: () => void }) {
  const [balloons, setBalloons] = useState<Balloon[]>(() => makeBalloons());
  const [hint, setHint] = useState<{ text: string; tone: "miss" | "hit" } | null>(
    null
  );
  const endedRef = useRef(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const popBalloon = (id: number, isSpecial: boolean) => {
    if (endedRef.current) return;
    setBalloons((prev) => prev.filter((b) => b.id !== id));

    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);

    if (isSpecial) {
      endedRef.current = true;
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#f87171", "#facc15", "#60a5fa", "#a5b4fc"],
      });
      setHint({ text: "Yeay ketemu! Lanjut yaa...", tone: "hit" });
      setTimeout(() => onNext(), 1000);
    } else {
      confetti({
        particleCount: 18,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#93c5fd"],
      });
      setHint({ text: "Belum ini, coba balon lain~", tone: "miss" });
      hintTimeoutRef.current = setTimeout(() => setHint(null), 1400);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-sky-100 via-indigo-50 to-slate-50"
    >
      {/* Awan latar belakang, melayang pelan untuk kedalaman */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {CLOUDS.map((c, i) => (
          <motion.div
            key={i}
            initial={{ x: -40 }}
            animate={{ x: 420 }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "linear" }}
            className="absolute bg-white rounded-full blur-md"
            style={{ left: c.left, top: c.top, width: c.w, height: c.h }}
          />
        ))}
      </div>

      <div className="absolute top-16 w-full text-center z-20 pointer-events-none">
        <h2 className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-md rounded-full font-heading text-2xl text-blue-700 shadow-sm border border-white">
          Klik 1 balon yang bersinar buat dapet kuncinya
          <Sparkles size={20} className="text-amber-400 fill-amber-300" />
        </h2>
      </div>

      <AnimatePresence>
        {balloons.map((b) => (
          <BalloonItem key={b.id} balloon={b} onPop={popBalloon} />
        ))}
      </AnimatePresence>

      {/* Hint feedback halus saat klik balon salah / benar, tanpa spoiler posisi balon emas */}
      <div className="absolute bottom-5 w-full text-center z-20 pointer-events-none">
        <AnimatePresence>
          {hint && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                hint.tone === "hit"
                  ? "bg-amber-100/90 text-amber-700"
                  : "bg-white/70 text-slate-500"
              }`}
            >
              {hint.text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ==========================================
// Sub-komponen: satu balon SVG dengan gradient, highlight, sway, dan glow khusus
// ==========================================
function BalloonItem({
  balloon,
  onPop,
}: {
  balloon: Balloon;
  onPop: (id: number, isSpecial: boolean) => void;
}) {
  const { id, x, delay, duration, swayDuration, size, isSpecial, color } = balloon;
  const [popping, setPopping] = useState(false);

  const handlePop = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (popping) return;
    setPopping(true);
    onPop(id, isSpecial);
  };

  return (
    <motion.div
      initial={{ bottom: "-20vh" }}
      animate={{ bottom: "115vh" }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      className="absolute"
      style={{ left: `${x}%`, width: 64, height: 150 }}
    >
      <motion.div
        animate={{ x: [0, 18, 0, -18, 0] }}
        transition={{ duration: swayDuration, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        <motion.div
          onClick={handlePop}
          onTouchEnd={handlePop}
          whileHover={{ scale: size * 1.06 }}
          animate={
            popping
              ? { scale: size * 1.35, opacity: 0 }
              : { scale: size, opacity: 1 }
          }
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ touchAction: "manipulation", transformOrigin: "top center" }}
          className="cursor-pointer"
        >
          <svg
            viewBox="0 0 64 90"
            width="64"
            height="90"
            style={
              isSpecial
                ? {
                    filter:
                      "drop-shadow(0 0 14px rgba(253,224,71,0.95)) drop-shadow(0 0 4px rgba(255,255,255,0.9))",
                  }
                : undefined
            }
          >
            <defs>
              <radialGradient id={`balloonGrad-${id}`} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor={color.top} />
                <stop offset="100%" stopColor={color.bot} />
              </radialGradient>
            </defs>
            <ellipse cx="32" cy="38" rx="26" ry="32" fill={`url(#balloonGrad-${id})`} />
            <ellipse cx="24" cy="26" rx="7" ry="10" fill="white" opacity="0.35" />
            <path
              d="M28 68 L36 68 L33 76 L31 76 Z"
              fill={isSpecial ? "#d97706" : color.bot}
            />
            <line x1="32" y1="76" x2="32" y2="88" stroke="#94a3b8" strokeWidth="1.4" />
          </svg>

          {isSpecial && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 left-1/2 -translate-x-1/2"
            >
              <Sparkles size={18} className="text-amber-200 fill-amber-200" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// PHASE 3 & 4: Main Content 
// ==========================================
export function Phase3MainContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
 
  const photos = [
    { id: 1, src: "https://images.unsplash.com/photo-1518199268815-95a206069e47?auto=format&fit=crop&w=600&q=80", cap: "Awal Ketemu 💙", detail: "Inget gak pas pertama kali kita ketemu? Keliatan malu-malu tapi aslinya... hahahaha.", rot: -8, top: "5%", left: "5%" },
    { id: 2, src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80", cap: "Ngedate Perdana", detail: "Jalan bareng pertama kali. Rasanya deg-degan tapi seneng banget bisa abisin waktu sama kamu.", rot: 6, top: "10%", left: "50%" },
    { id: 3, src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80", cap: "Muka Ngambek 😤", detail: "Ini muka kamu pas lagi bete. Sumpah lucu banget, makanya sering aku isengin wkwk.", rot: -4, top: "35%", left: "15%" },
    { id: 4, src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80", cap: "Random Selfie", detail: "Lagi di jalan tiba-tiba minta foto. Hasilnya tetep cantik kok, santai aja.", rot: 10, top: "40%", left: "55%" },
    { id: 5, src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", cap: "Makan Terus 🍜", detail: "Nih bukti nyata hobi kita: Cari makan! Gak apa-apa, yang penting bahagia kan?", rot: -12, top: "65%", left: "5%" },
    { id: 6, src: "https://images.unsplash.com/photo-1541250848049-b4f71461741b?auto=format&fit=crop&w=600&q=80", cap: "Tidur Siang 😴", detail: "Diam-diam difoto pas lagi pules. Muka capek abis jalan-jalan seharian.", rot: 5, top: "60%", left: "60%" },
    { id: 7, src: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80", cap: "Happy Birthday! 🎂", detail: "Hari ini spesial buat kamu. Semoga doa-doa baik terkabul yaa. Amin!", rot: -5, top: "25%", left: "35%" },
  ];
 
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
 
  useEffect(() => {
    if (selectedPhoto) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedPhoto]);
 
  const goPrev = () => {
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };
 
  const goNext = () => {
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };
 
  const handlePrev = (e: any) => {
    e.stopPropagation();
    goPrev();
  };
 
  const handleNext = (e: any) => {
    e.stopPropagation();
    goNext();
  };
 
  // Swipe gesture di foto modal sebagai alternatif tombol prev/next
  const handleDragEnd = (_e: any, info: PanInfo) => {
    const SWIPE_THRESHOLD = 60;
    if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) goNext();
  };
 
  const currentIndex = selectedPhoto
    ? photos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;
 
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, type: "spring", bounce: 0.3 }} className="w-full min-h-screen py-20 px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-32">
 
          <section>
            <div className="text-center mb-16 relative z-20">
              <h2 className="font-heading text-4xl md:text-5xl text-blue-700 drop-shadow-sm">Memory Lane 📸</h2>
              <p className="text-slate-600 mt-4 text-lg bg-white/40 inline-block px-6 py-2 rounded-full backdrop-blur-sm">Geser fotonya, atau KLIK buat liat detailnya!</p>
            </div>
 
            <div ref={containerRef} className="relative h-[80vh] bg-white/20 backdrop-blur-xl rounded-[3rem] border-4 border-dashed border-white/60 shadow-lg p-4 overflow-hidden">
              {photos.map((p) => (
                <PolaroidCard key={p.id} containerRef={containerRef} photo={p} onClick={() => setSelectedPhoto(p)} />
              ))}
              <div className="absolute bottom-5 right-6 text-xs text-slate-500 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50 pointer-events-none z-30">
                {photos.length} foto
              </div>
            </div>
          </section>
 
          <section>
            <GachaBox />
          </section>
 
          <FooterLoveLetter />
        </div>
      </motion.div>
 
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="bg-white p-5 pb-7 md:p-8 md:pb-10 rounded-3xl shadow-2xl max-w-sm md:max-w-md w-full relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Tutup"
                className="absolute -top-3 -right-3 bg-white p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 hover:scale-110 transition-all duration-300 text-slate-400 cursor-pointer border border-slate-100 z-50"
              >
                <X size={18} strokeWidth={3} />
              </button>
 
              <AnimatePresence mode="wait">
                <motion.div key={selectedPhoto.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }} className="w-full flex flex-col items-center">
 
                  {/* Foto + tombol prev/next & dot indicator DI DALAM frame foto — fix supaya tidak kepotong di mobile */}
                  <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-inner bg-slate-100 mb-6 relative">
                    <motion.img
                      src={selectedPhoto.src}
                      alt="Detail"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                    />
 
                    <button
                      onClick={handlePrev}
                      aria-label="Sebelumnya"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/55 p-2 rounded-full text-white backdrop-blur-sm transition-all z-10"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Selanjutnya"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/55 p-2 rounded-full text-white backdrop-blur-sm transition-all z-10"
                    >
                      <ChevronRight size={20} />
                    </button>
 
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                      {photos.map((p, i) => (
                        <span
                          key={p.id}
                          className={`h-1.5 rounded-full transition-all ${
                            i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
 
                  <h3 className="font-heading text-2xl md:text-3xl text-slate-800 mb-3 w-full text-center">{selectedPhoto.cap}</h3>
                  <div className="h-1 w-12 bg-blue-300 mb-5 rounded-full opacity-60" />
                  <p className="text-slate-600 leading-relaxed text-base text-center px-2" style={{ fontFamily: "var(--font-sans)" }}>
                    {selectedPhoto.detail}
                  </p>
                  <p className="text-xs text-slate-400 mt-4">
                    Geser foto untuk pindah &middot; {currentIndex + 1} / {photos.length}
                  </p>
                </motion.div>
              </AnimatePresence>
 
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
 
function PolaroidCard({ containerRef, photo, onClick }: any) {
  return (
    <motion.div
      drag dragConstraints={containerRef} dragElastic={0.2} dragMomentum={true}
      initial={{ rotate: photo.rot }}
      whileHover={{ scale: 1.05, zIndex: 40 }}
      whileDrag={{ scale: 1.12, zIndex: 50, rotate: 0, cursor: "grabbing" }}
      onClick={onClick}
      style={{ left: photo.left, top: photo.top }}
      className="absolute bg-white p-3 pb-5 md:p-4 md:pb-6 rounded-sm shadow-xl cursor-grab w-40 md:w-52 flex flex-col items-center"
    >
      <div className="absolute -top-3 bg-white/60 backdrop-blur-sm w-20 h-5 rotate-[-3deg] shadow-sm border border-slate-200/50" />
      <div className="bg-slate-100 w-full aspect-square mb-3 overflow-hidden shadow-inner border border-slate-100 pointer-events-none">
        <img src={photo.src} alt="memory" className="object-cover w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 pointer-events-none" />
      </div>
      <p className="font-heading text-center text-slate-700 text-sm md:text-base pointer-events-none">{photo.cap}</p>
    </motion.div>
  );
}
 
// ==========================================
// GACHA BOX — kotak kado SVG dengan tutup terbuka, sparkle ambient, breathing
// ==========================================
 
const PRIZES = [
  "Voucher Nonton Bebas 🍿",
  "Es Krim Sepuasnya 🍦",
  "Voucher Bebas Ngambek 😤",
  "Voucher Pijat Punggung 💆‍♀️",
  "Traktir GoFood 🍔",
  "Jalan-Jalan Random 🚗",
];
 
type AmbientSparkle = { id: number; x: number; y: number; size: number };
 
function GachaBox() {
  const [phase, setPhase] = useState<"idle" | "shaking" | "opening" | "result">("idle");
  const [shuffleText, setShuffleText] = useState("Ketuk kotaknya");
  const [prize, setPrize] = useState("");
  const [sparkles, setSparkles] = useState<AmbientSparkle[]>([]);
  const sparkleIdRef = useRef(0);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
 
  // Sparkle ambient muncul pelan di sekitar kotak walau belum diklik
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (phase !== "idle") return;
      const id = sparkleIdRef.current++;
      const s: AmbientSparkle = {
        id,
        x: 20 + Math.random() * 100,
        y: 10 + Math.random() * 40,
        size: 10 + Math.random() * 6,
      };
      setSparkles((prev) => [...prev, s]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((sp) => sp.id !== id));
      }, 1450);
    }, 900);
    return () => clearInterval(spawnInterval);
  }, [phase]);
 
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);
 
  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
 
    const shuffleInterval = setInterval(() => {
      setShuffleText(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
    }, 90);
    intervalsRef.current.push(shuffleInterval);
 
    // Setelah goyang sebentar, tutup mulai terbuka
    const openTimeout = setTimeout(() => {
      setPhase("opening");
    }, 1400);
    timeoutsRef.current.push(openTimeout);
 
    // Hasil final muncul + confetti
    const resultTimeout = setTimeout(() => {
      clearInterval(shuffleInterval);
      const finalPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
      setPrize(finalPrize);
      setPhase("result");
      confetti({
        particleCount: 200,
        spread: 110,
        origin: { y: 0.5 },
        colors: ["#a5b4fc", "#fde68a", "#818cf8", "#ffffff", "#60a5fa"],
      });
    }, 1900);
    timeoutsRef.current.push(resultTimeout);
  };
 
  const resetGacha = () => {
    setPhase("idle");
    setShuffleText("Ketuk kotaknya");
  };
 
  const isShaking = phase === "shaking";
  const lidOpen = phase === "opening" || phase === "result";
 
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl max-w-lg mx-auto text-center border-2 border-white/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-amber-200/30 pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-indigo-300/30 pointer-events-none" />
 
      <h3 className="font-heading text-3xl md:text-4xl text-indigo-600 mb-2 drop-shadow-sm relative z-10">Waktunya Gacha! 🎁</h3>
      <p className="text-indigo-400 text-sm mb-8 relative z-10">Satu kotak, satu hadiah random buat kamu</p>
 
      <div className="min-h-[280px] flex flex-col items-center justify-center relative z-10">
        {phase !== "result" ? (
          <div className="flex flex-col items-center">
 
            {/* Sparkle ambient layer */}
            <div className="relative w-full" style={{ height: 0 }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-44 h-40 pointer-events-none">
                <AnimatePresence>
                  {sparkles.map((s) => (
                    <motion.span
                      key={s.id}
                      initial={{ opacity: 0.8, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -26, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      className="absolute text-amber-400"
                      style={{ left: s.x, top: s.y, fontSize: s.size }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
 
            <motion.div
              animate={
                isShaking
                  ? { rotate: [-7, 7, -7, 7, -4, 4, 0], scale: 1.05 }
                  : !lidOpen
                  ? { scale: [1, 1.04, 1] }
                  : { scale: 1, rotate: 0 }
              }
              transition={
                isShaking
                  ? { duration: 0.4, repeat: Infinity }
                  : !lidOpen
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
              onClick={handleOpen}
              className="cursor-pointer flex flex-col items-center group relative"
            >
              <motion.div
                animate={{ opacity: isShaking || lidOpen ? 1 : 0.5 }}
                className="absolute inset-[-14px] rounded-full bg-indigo-400 blur-2xl"
              />
 
              <div className="relative z-10" style={{ width: 140, height: 140 }}>
                <svg viewBox="0 0 140 140" width="140" height="140" className="overflow-visible">
                  <defs>
                    <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a5b4fc" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
 
                  <ellipse cx="70" cy="120" rx="56" ry="9" fill="#a5b4fc" opacity="0.3" />
 
                  {/* Badan kotak (statis) */}
                  <rect x="24" y="64" width="92" height="50" rx="10" fill="url(#bodyGrad)" stroke="white" strokeWidth="3" />
                  <rect x="58" y="64" width="24" height="50" fill="#fde68a" opacity="0.9" />
                  <circle cx="70" cy="88" r="11" fill="white" opacity="0.9" />
 
                  {/* Tutup + pita: terangkat & berputar saat fase opening/result */}
                  <motion.g
                    animate={{
                      y: lidOpen ? -46 : 0,
                      rotate: lidOpen ? -14 : 0,
                      // opacity: phase === "result" ? 0 : 1,
                    }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ transformOrigin: "70px 60px" }}
                  >
                    <rect x="18" y="38" width="104" height="34" rx="10" fill="url(#lidGrad)" stroke="white" strokeWidth="3" />
                    <rect x="58" y="30" width="24" height="46" rx="6" fill="#fde68a" stroke="white" strokeWidth="2" />
                    <path
                      d="M58 30 C46 30 40 18 50 12 C58 8 64 18 70 28 C76 18 82 8 90 12 C100 18 94 30 82 30 Z"
                      fill="#fde68a"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </motion.g>
                </svg>
 
                <motion.div
                  animate={{ opacity: lidOpen ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
                >
                  <Gift size={28} className="text-violet-700 drop-shadow-md" />
                </motion.div>
              </div>
            </motion.div>
 
            <motion.div className="mt-6 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full shadow-inner border border-white/50 h-10 flex items-center justify-center min-w-[200px]">
              <p className={`font-heading ${isShaking ? "text-indigo-400 text-lg animate-pulse" : "text-slate-600 text-xl"}`}>
                {isShaking ? shuffleText : phase === "opening" ? "Kebuka nih..." : "Ketuk Buat Buka!"}
              </p>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.2, y: 50, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 150 }}
            className="w-full relative"
          >
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-1.5 rounded-2xl shadow-2xl relative">
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-sky-50 rounded-full shadow-inner" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-sky-50 rounded-full shadow-inner" />
              <div className="bg-white rounded-xl border-2 border-dashed border-indigo-200 p-6 md:p-8 relative overflow-hidden flex flex-col items-center">
                <Ticket className="absolute -right-8 -bottom-8 text-indigo-50 opacity-50 rotate-[-15deg]" size={150} />
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-amber-400" size={24} />
                  <p className="font-heading text-indigo-400 tracking-widest text-sm uppercase">Official Voucher</p>
                  <Sparkles className="text-amber-400" size={24} />
                </div>
                <h4 className="text-slate-500 mb-2 font-medium">Selamat! Kamu dapet:</h4>
                <p className="font-heading text-2xl md:text-3xl text-blue-600 mb-8 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 z-10 w-full text-center shadow-sm">
                  {prize}
                </p>
                <button
                  onClick={resetGacha}
                  className="relative z-10 text-sm md:text-base px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full font-heading transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1"
                >
                  Gacha Lagi Dong!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// OUTRO: Envelope & Realistic Lined Paper Letter
// ==========================================
export function FooterLoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  
  // PARALLAX 3: Buat khusus Amplop biar pop-up modalnya gak error
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]); // Bergerak paling cepat

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => { setIsReading(true); }, 800); 
  };

  const handleClose = () => {
    setIsReading(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <footer ref={ref} className="relative pt-24 pb-32 flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        .font-typewriter { font-family: 'Special Elite', monospace; }
        .letter-scroll::-webkit-scrollbar { width: 8px; }
        .letter-scroll::-webkit-scrollbar-track { background: transparent; }
        .letter-scroll::-webkit-scrollbar-thumb { background-color: #fcd34d; border-radius: 10px; }
        .realistic-paper::before {
          content: ""; absolute: inset-0; background-color: #fdfbf7;
          mask-image: radial-gradient(#000 10%, transparent 80%);
          mask-size: 8px 8px; mask-repeat: round; z-index: -1;
        }
      `}} />

      <motion.div style={{ y }} className="flex flex-col items-center w-full relative z-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-indigo-600 drop-shadow-sm">Ada Pesan Terakhir Nih 💌</h2>
          <p className="text-slate-500 mt-2 font-medium bg-white/50 px-4 py-1 rounded-full inline-block">Klik amplopnya ya!</p>
        </div>

        <div className="relative w-80 md:w-[26rem] h-56 md:h-64 cursor-pointer group" onClick={handleOpen}>
          <div className="absolute inset-0 bg-[#fde68a] rounded-lg shadow-md" />
          <motion.div initial={{ y: 20 }} animate={{ y: isOpen ? -40 : 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute left-4 right-4 h-[90%] bg-[#fdfbf7] rounded-sm border border-amber-100 flex flex-col items-center pt-6 px-4 shadow-sm z-10">
            <Heart className="text-red-400 mb-2" size={24} fill="currentColor" />
            <p className="font-typewriter text-sm text-slate-400">To: Aini...</p>
          </motion.div>
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <polygon points="0,0 50,50 0,100" fill="#fcd34d" />
              <polygon points="100,0 50,50 100,100" fill="#fcd34d" />
              <polygon points="0,100 50,50 100,100" fill="#fbbf24" />
              <polyline points="0,0 50,50 100,0" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
            </svg>
          </div>
          <motion.div animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 30 }} transition={{ duration: 0.6, ease: "easeInOut" }} style={{ transformOrigin: "top" }} className="absolute top-0 left-0 w-full h-[60%] group-hover:scale-[1.02] transition-transform origin-top">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
              <polygon points="0,0 100,0 50,100" fill="#f59e0b" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isReading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={handleClose}>
            <motion.div initial={{ scale: 0.8, y: 150, rotate: -5 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.8, y: 150, rotate: 5 }} transition={{ type: "spring", damping: 20, stiffness: 200 }} className="realistic-paper rounded-lg shadow-2xl max-w-2xl w-full relative max-h-[80vh] overflow-y-auto letter-scroll flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 bottom-0 left-[-4px] w-1.5 bg-amber-200 z-10" />
              <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors hover:scale-110 z-20">
                <X size={24} />
              </button>
              <div className="bg-white rounded-lg p-10 flex flex-col items-center relative overflow-hidden flex-grow">
                 <div className="absolute inset-0 bg-[#fdfbf7] bg-[linear-gradient(transparent_27px,#cbd5e1_28px)] bg-[length:100%_28px] opacity-70 pointer-events-none" />
                  <Heart className="text-red-400 mb-10 mx-auto mt-4 relative z-10" size={40} fill="currentColor" />
                  <div className="space-y-[1.75rem] text-slate-700 font-typewriter text-base md:text-xl relative z-10 w-full" style={{ lineHeight: '28px' }}>
                    <p>Halo Aini yang (katanya) hari ini lagi nambah umur.</p>
                    <p>Semoga di tanggal 8 Juli ini dan seterusnya, kamu selalu dikasih senyum dan bahagia yang banyak. Makasih udah selalu jadi orang sabar, partner yang asik diajak gila, dan tempat cerita yang paling nyaman.</p>
                    <p>Maaf kalau kadonya nerd banget bentuk web begini wkwk. Tapi sengaja dibikin pake coding biar beda dari yang lain, spesial buat kamu doang.</p>
                    
                    <p>Gua nulis ini panjang-panjang cuma buat ngetes scrollbar doang sebenernya. Bla bla bla. Inget kan waktu itu kita blablabla... pokoknya panjang dah ceritanya gak muat kalau 1 paragraf doang.</p>
                    <p>Terus ada lagi pas momen blablabla... panjang banget pokoknya isi hati yang mau disampein.</p>
                    <p>Makin panjang ke bawah makin asik dibaca.</p>

                    <div className="pt-8">
                      <p className="text-blue-600 font-bold">Love u tons! 💙</p>
                      <p className="mt-2">- Nizar</p>
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}