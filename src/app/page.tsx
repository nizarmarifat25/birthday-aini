"use client";

import { useState, useRef, useEffect } from "react";
// UPDATE: Tambahin useScroll dan useTransform dari framer-motion
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
// PHASE 1: Button & Realistic CSS Cake (Revisi Klik Mobile)
// ==========================================
function Phase1Runaway({ onNext }: { onNext: () => void }) {
  const [hoverCount, setHoverCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showCake, setShowCake] = useState(false);
  const [isBlown, setIsBlown] = useState(false);

  const moveButton = () => {
    if (hoverCount < 5) {
      setPosition({ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 300 });
      setHoverCount((prev) => prev + 1);
    }
  };

  const blowCandle = () => {
    if (isBlown) return; // Mencegah double tap di HP
    setIsBlown(true);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#fbcfe8', '#bfdbfe', '#fde047'] });
    setTimeout(() => onNext(), 3500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} className="absolute inset-0 flex items-center justify-center z-10">
      
      <div className="absolute w-[80vw] h-[80vw] md:w-[30vw] md:h-[30vw] bg-blue-300/20 rounded-full blur-[100px] -z-10 animate-pulse" />

      <motion.div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-14 flex flex-col items-center max-w-lg mx-4 text-center relative overflow-hidden">
        
        {!showCake ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
              <Gift size={40} className="text-blue-500" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-4 leading-tight">
              Hai Aini! <br/> Ada kado nih... ✨
            </h1>
            <p className="text-slate-500 mb-10 text-lg font-medium">Tangkap tombolnya kalau bisa!</p>
            
            <div className="relative w-full h-32 flex items-center justify-center">
              <motion.button
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
                onPointerEnter={moveButton} // Buat laptop
                onTouchStart={moveButton} // FIX BUAT HP: Tombol auto kabur pas kesentuh
                onClick={() => { if (hoverCount >= 5) setShowCake(true); }}
                className={`absolute font-heading text-xl px-8 py-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 border-2 border-white/50 ${hoverCount >= 5 ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:scale-105" : "bg-blue-500 text-white"}`}
              >
                <Gift size={24} /> {hoverCount >= 5 ? "Klik Aku Sekarang!" : "Buka Kado"}
              </motion.button>
            </div>
            
            <div className="h-8 mt-4">
              {hoverCount > 0 && hoverCount < 5 && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-indigo-500 font-bold tracking-wide">
                  Hayo kurang gesit! 😜 ({hoverCount}/5)
                </motion.p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.4 }} className="flex flex-col items-center w-full">
            
            {!isBlown ? (
              <>
                <h1 className="font-heading text-3xl md:text-4xl text-blue-600 mb-2">Make a Wish! 🎂</h1>
                <p className="text-slate-500 mb-10 font-medium bg-white/60 px-6 py-2 rounded-full border border-white">(Tap api lilinnya buat niup)</p>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                <h1 className="font-heading text-4xl text-indigo-500 mb-2">Yeayyy! 🎉</h1>
                <p className="text-slate-600 font-medium">Tunggu bentar, kado lagi disiapin...</p>
              </motion.div>
            )}
            
            <motion.div 
              animate={isBlown ? { y: [0, -20, 0, -10, 0], scale: [1, 1.05, 1] } : { y: 0 }} 
              transition={{ duration: 1, ease: "easeInOut" }}
              className="relative mt-8 mb-8"
            >
              
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                {isBlown && (
                  <motion.div 
                    initial={{ opacity: 1, y: 0, scale: 0.5 }} 
                    animate={{ opacity: 0, y: -60, scale: 2, x: [0, -10, 10, -5] }} 
                    transition={{ duration: 2, ease: "easeOut" }} 
                    className="absolute -top-4 w-4 h-4 rounded-full bg-slate-300 blur-sm pointer-events-none" 
                  />
                )}

                {!isBlown && (
                  // REVISI FIX HP: Pake framer motion onTap + Hitbox transparan gede
                  <motion.div 
                    className="relative cursor-pointer group z-50" 
                    onTap={blowCandle} 
                    onClick={blowCandle}
                  >
                    {/* INI RAHASIANYA: Hitbox kotak transparan 100x100px biar jempol gak bakal meleset */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-transparent z-50" />
                    
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-4 -left-4 w-12 h-12 bg-amber-400 rounded-full blur-xl opacity-50 group-hover:bg-orange-400 pointer-events-none" />
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -2, 2] }} 
                      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                      className="w-5 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_15px_rgba(251,191,36,0.8)] relative z-10 group-hover:scale-125 transition-transform pointer-events-none"
                    />
                  </motion.div>
                )}
                
                <div className="w-1 h-3 bg-slate-700 rounded-t-full mt-[-2px] z-0 pointer-events-none" />
                <div className="w-4 h-14 rounded-sm bg-[repeating-linear-gradient(45deg,#93c5fd,#93c5fd_5px,#ffffff_5px,#ffffff_10px)] border border-blue-200 shadow-sm pointer-events-none" />
              </div>

              {/* === BADAN KUE (Cake Body - No Events) === */}
              <div className="relative z-20 pointer-events-none">
                <div className="w-56 h-12 bg-white rounded-t-2xl absolute top-0 left-0 z-10 shadow-[inset_0_-4px_6px_rgba(0,0,0,0.05)] flex justify-between overflow-hidden">
                  <div className="w-8 h-10 bg-white rounded-b-full translate-y-2 shadow-sm" />
                  <div className="w-10 h-14 bg-white rounded-b-full translate-y-4 shadow-sm" />
                  <div className="w-12 h-8 bg-white rounded-b-full translate-y-1 shadow-sm" />
                  <div className="w-10 h-12 bg-white rounded-b-full translate-y-3 shadow-sm" />
                  <div className="w-8 h-9 bg-white rounded-b-full translate-y-2 shadow-sm" />
                </div>
                
                <div className="w-56 h-28 bg-gradient-to-b from-sky-200 to-blue-200 rounded-2xl shadow-xl border-b-8 border-blue-300 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-12 left-6 w-3 h-1 bg-pink-400 rounded-full rotate-45" />
                  <div className="absolute top-16 left-16 w-3 h-1 bg-yellow-400 rounded-full rotate-12" />
                  <div className="absolute top-20 left-10 w-3 h-1 bg-indigo-400 rounded-full -rotate-45" />
                  <div className="absolute top-14 right-12 w-3 h-1 bg-purple-400 rounded-full rotate-90" />
                  <div className="absolute top-20 right-8 w-3 h-1 bg-pink-500 rounded-full -rotate-12" />
                  <div className="absolute top-22 right-20 w-3 h-1 bg-sky-400 rounded-full rotate-45" />
                </div>
              </div>

              <div className="absolute -bottom-4 -left-8 w-72 h-12 bg-slate-200/80 backdrop-blur-sm rounded-[100%] shadow-[0_15px_25px_rgba(0,0,0,0.1)] border-b-4 border-slate-300 z-0 pointer-events-none" />
              <div className="absolute -bottom-6 -left-4 w-64 h-12 bg-slate-300/30 rounded-[100%] -z-10 blur-md pointer-events-none" />

            </motion.div>
            
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}

// ==========================================
// PHASE 2: Balloons
// ==========================================
function Phase2Balloons({ onNext }: { onNext: () => void }) {
  const [balloons, setBalloons] = useState(() => {
    const specialIndex = Math.floor(Math.random() * 10);
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i, x: Math.random() * 80 + 10, delay: Math.random() * 2, duration: Math.random() * 3 + 5,
      isSpecial: i === specialIndex, color: ["bg-sky-400", "bg-cyan-400", "bg-blue-400", "bg-indigo-400"][Math.floor(Math.random() * 4)],
    }));
  });

  const popBalloon = (id: number, isSpecial: boolean) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    if (isSpecial) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#f87171', '#facc15', '#60a5fa'] });
      setTimeout(() => onNext(), 800); 
    } else {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#60a5fa'] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
      <div className="absolute top-16 w-full text-center z-20 pointer-events-none">
         <h2 className="inline-block px-6 py-3 bg-white/50 backdrop-blur-md rounded-full font-heading text-2xl text-blue-700 shadow-sm border border-white">
           Klik 1 balon yang bersinar buat dapet kuncinya! ✨
         </h2>
      </div>
      
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: "110vh" }} animate={{ y: "-20vh", x: [0, 20, -20, 0] }} transition={{ y: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }, x: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          className={`absolute rounded-[40%] w-16 h-20 flex items-center justify-center ${b.color} cursor-pointer ${b.isSpecial ? "ring-4 ring-white/80 shadow-[0_0_25px_rgba(255,255,255,0.9)] z-10" : "shadow-lg z-0"}`}
          style={{ left: `${b.x}%` }}
          onClick={() => popBalloon(b.id, b.isSpecial)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0 }}
        >
          {b.isSpecial && <Sparkles size={20} className="text-white absolute animate-pulse" />}
          <div className="absolute -bottom-8 w-0.5 h-8 bg-slate-300/80 origin-top" />
        </motion.div>
      ))}
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

  const handlePrev = (e: any) => {
    e.stopPropagation();
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, type: "spring", bounce: 0.3 }} className="w-full min-h-screen py-20 px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-32">
          
          <section>
            {/* PARALLAX 1: Memory Lane (Agak lambat) */}
            <SafeParallax offset={40}>
              <div className="text-center mb-16 relative z-20">
                <h2 className="font-heading text-4xl md:text-5xl text-blue-700 drop-shadow-sm">Memory Lane 📸</h2>
                <p className="text-slate-600 mt-4 text-lg bg-white/40 inline-block px-6 py-2 rounded-full backdrop-blur-sm">Geser fotonya, atau KLIK buat liat detailnya!</p>
              </div>
              
              <div ref={containerRef} className="relative h-[80vh] bg-white/20 backdrop-blur-xl rounded-[3rem] border-4 border-dashed border-white/60 shadow-lg p-4 overflow-hidden">
                 {photos.map((p) => (
                   <PolaroidCard key={p.id} containerRef={containerRef} photo={p} onClick={() => setSelectedPhoto(p)} />
                 ))}
              </div>
            </SafeParallax>
          </section>

          <section>
            {/* PARALLAX 2: Gacha Box (Agak Cepat) */}
            <SafeParallax offset={80}>
               <GachaBox />
            </SafeParallax>
          </section>

          {/* PARALLAX 3: Footer Love Letter udah di-handle di dalem komponennya */}
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
              className="bg-white p-6 pb-8 md:p-8 md:pb-10 rounded-3xl shadow-2xl max-w-sm md:max-w-md w-full relative flex flex-col items-center" onClick={e => e.stopPropagation()} 
            >
              <button onClick={() => setSelectedPhoto(null)} className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 hover:scale-110 transition-all duration-300 text-slate-400 cursor-pointer border border-slate-100 z-50">
                <X size={20} strokeWidth={3} />
              </button>

              <button onClick={handlePrev} className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all z-50">
                <ChevronLeft size={32} />
              </button>
              <button onClick={handleNext} className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-sm transition-all z-50">
                <ChevronRight size={32} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div key={selectedPhoto.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }} className="w-full flex flex-col items-center">
                  <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-inner bg-slate-100 mb-6 relative">
                    <img src={selectedPhoto.src} alt="Detail" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl text-slate-800 mb-3 w-full text-center">{selectedPhoto.cap}</h3>
                  <div className="h-1 w-12 bg-blue-300 mb-5 rounded-full opacity-60" />
                  <p className="text-slate-600 leading-relaxed text-base text-center px-2" style={{ fontFamily: "var(--font-sans)" }}>
                    {selectedPhoto.detail}
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

function GachaBox() {
  const prizes = ["Voucher Nonton Bebas 🍿", "Es Krim Sepuasnya 🍦", "Voucher Bebas Ngambek 😤", "Voucher Pijat Punggung 💆‍♀️", "Traktir GoFood 🍔", "Jalan-Jalan Random 🚗"];
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [prize, setPrize] = useState("");
  const [shuffleText, setShuffleText] = useState("Klik Kotaknya!");

  const handleOpen = () => {
    if (isOpen || isShaking) return;
    setIsShaking(true);
    let shuffleCount = 0;
    const interval = setInterval(() => {
      setShuffleText(prizes[Math.floor(Math.random() * prizes.length)]);
      shuffleCount++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsShaking(false);
      setIsOpen(true);
      const finalPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(finalPrize);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#3b82f6', '#8b5cf6', '#60a5fa', '#fcd34d', '#ffffff'] });
    }, 2000); 
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl max-w-lg mx-auto text-center border-2 border-white/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <h3 className="font-heading text-3xl md:text-4xl text-indigo-600 mb-10 drop-shadow-sm relative z-10">Waktunya Gacha! 🎁</h3>
      
      <div className="min-h-[250px] flex flex-col items-center justify-center relative z-10">
        {!isOpen ? (
          <motion.div animate={isShaking ? { rotate: [-10, 10, -10, 10, -5, 5, 0], scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.4, repeat: isShaking ? Infinity : 0 }} onClick={handleOpen} className="cursor-pointer flex flex-col items-center group">
            <div className="relative">
              <div className={`absolute inset-0 bg-blue-400 rounded-full blur-2xl transition-all duration-300 ${isShaking ? 'opacity-80 scale-150 animate-pulse' : 'opacity-40 group-hover:opacity-60 scale-110'}`} />
              <div className="bg-gradient-to-br from-blue-400 via-indigo-400 to-indigo-600 w-36 h-36 rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.4)] flex items-center justify-center border-4 border-white/90 group-hover:scale-105 transition-transform relative z-10">
                <Gift size={72} className="text-white drop-shadow-md" />
              </div>
            </div>
            <motion.div className="mt-8 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full shadow-inner border border-white/50 h-10 flex items-center justify-center min-w-[200px]">
              <p className={`font-heading ${isShaking ? 'text-indigo-400 text-lg animate-pulse' : 'text-slate-600 text-xl'}`}>{isShaking ? shuffleText : "Klik Buat Buka!"}</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.2, y: 50, rotate: -15 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }} transition={{ type: "spring", damping: 12, stiffness: 150 }} className="w-full relative">
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
                <p className="font-heading text-2xl md:text-3xl text-blue-600 mb-8 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 z-10 w-full text-center shadow-sm">{prize}</p>
                <button onClick={() => setIsOpen(false)} className="relative z-10 text-sm md:text-base px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full font-heading transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">Gacha Lagi Dong!</button>
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