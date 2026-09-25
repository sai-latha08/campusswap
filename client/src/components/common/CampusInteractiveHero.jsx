import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ArrowRightLeft, ShieldCheck,
  Cpu, Sparkles, GraduationCap, Zap, RefreshCw, Layers
} from 'lucide-react';

export default function CampusInteractiveHero() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 6, y: -8 });
  const [activeMode, setActiveMode] = useState(0); // 0: Skills, 1: Hardware, 2: Barter
  const [particleOffset, setParticleOffset] = useState(0);

  const exchangeModes = [
    {
      title: 'Skill Exchange',
      badge: '40/20 Match',
      giver: { name: 'Elena R.', item: 'Advanced Web Dev', tier: 'Top 2% Mentor' },
      receiver: { name: 'Liam S.', item: 'Calculus III Tutoring', tier: 'Peer Verified' },
      contract: '2 hrs Python ↔ 2 hrs Calculus',
      metric: 'Conflict-Free Match',
    },
    {
      title: 'Item Lending Hub',
      badge: 'Anti-Overlap',
      giver: { name: 'Marcus V.', item: 'Lab 3D Printer Kit', tier: 'Hardware Guild' },
      receiver: { name: 'Sophia K.', item: 'Sony Alpha 4K DSLR', tier: 'Verified Renter' },
      contract: '3-Day Lab Access with $0 Clashing',
      metric: 'Safe Deposit Handshake',
    },
    {
      title: 'Signature 0-Cash Barter',
      badge: '0-Cash Swap',
      giver: { name: 'Aiden T.', item: 'Fullstack Mentorship', tier: 'Senior TA' },
      receiver: { name: 'Maya D.', item: 'Oscilloscope & Kit', tier: 'Robotics Team' },
      contract: '3 hrs Mentorship = 5 Days Gear',
      metric: '+3 Peer Trust Bonus',
    },
  ];

  // Auto-cycle through the unique exchange modes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMode((prev) => (prev + 1) % exchangeModes.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [exchangeModes.length]);

  // Subtle continuous motion tick for flow particle
  useEffect(() => {
    let animFrame;
    const animate = () => {
      setParticleOffset((prev) => (prev + 0.008) % 1);
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / rect.height) * 12 + 4,
      y: (x / rect.width) * 14 - 6,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 6, y: -8 });
  };

  const current = exchangeModes[activeMode];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] mx-auto h-[420px] sm:h-[460px] flex items-center justify-center cursor-default select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Soft Breathing Halo */}
      <div className="absolute w-80 h-80 rounded-full bg-[#581c2e]/12 blur-3xl pointer-events-none animate-swap-glow" />

      {/* 3D Gyroscopic Floating Constellation Core */}
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        className="relative w-[340px] sm:w-[390px] h-[340px] sm:h-[390px] transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Deep Platform Glow */}
        <div
          className="absolute inset-0 bg-[#581c2e]/20 rounded-3xl blur-2xl transform translate-y-12 scale-95"
          style={{ transform: 'translateZ(-35px)' }}
        />

        {/* Main Cream Glass Foundation */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-white to-[#f4eee5] rounded-3xl border-2 border-[#e7ded3] shadow-2xl p-5 overflow-hidden flex flex-col justify-between"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Animated SVG Orbital Tracks & Flow Ribbons */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#581c2e" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#881337" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#581c2e" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="flowBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#581c2e" stopOpacity="0" />
                <stop offset="50%" stopColor="#581c2e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fdfbf7" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Concentric Orbital Rings */}
            <circle cx="200" cy="200" r="140" fill="none" stroke="#e7ded3" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#581c2e" strokeOpacity="0.12" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="#581c2e" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 4" />

            {/* Dynamic S-Curve Interlocking Exchange Ribbon */}
            <path
              d="M 60 140 C 130 90, 160 310, 340 260"
              fill="none"
              stroke="url(#orbitGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            <path
              d="M 60 260 C 140 310, 260 90, 340 140"
              fill="none"
              stroke="#581c2e"
              strokeOpacity="0.15"
              strokeWidth="2"
            />

            {/* Floating Energy Particle that animates back and forth along the path */}
            <circle
              cx={60 + (340 - 60) * particleOffset}
              cy={140 + Math.sin(particleOffset * Math.PI * 2) * 60 + (260 - 140) * particleOffset}
              r="4"
              fill="#581c2e"
              className="filter drop-shadow"
            />
          </svg>

          {/* Header Row: Interactive Live Switcher */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#fff1f2] border border-[#fecdd3] px-3 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#581c2e] animate-ping" />
              <span className="text-[11px] font-bold text-[#581c2e] font-serif">Campus Orbit Engine</span>
            </div>

            {/* Mode Dots */}
            <div className="flex items-center gap-1.5 bg-[#faf6f0] p-1 rounded-full border border-[#e7ded3]">
              {exchangeModes.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMode(idx)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all duration-300 cursor-pointer ${
                    activeMode === idx
                      ? 'bg-[#581c2e] text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {m.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Center Nexus: Animated Interlocking Core */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="relative">
              {/* Rotating Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 rounded-full border-2 border-dashed border-[#581c2e]/30 flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full bg-[#581c2e] absolute -top-1.5 shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-[#faf6f0] border border-[#581c2e] absolute -bottom-1 shadow-sm" />
              </motion.div>

              {/* Central Core Emblem */}
              <div className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#581c2e] to-[#380e1a] text-white flex flex-col items-center justify-center shadow-xl border border-[#70243b]">
                <ArrowRightLeft size={18} className="text-[#faf6f0] animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#faf6f0] mt-0.5 font-serif">
                  Match
                </span>
              </div>
            </div>

            {/* Active Live Contract Readout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e7ded3] shadow-xs text-center"
              >
                <div className="text-[10px] font-bold font-serif text-[#581c2e]">
                  {current.contract}
                </div>
                <div className="text-[8px] text-stone-500 font-medium">
                  {current.metric}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-100 font-serif">
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#581c2e]" /> Verified Peer Network</span>
            <span className="text-[#581c2e] font-bold">100% Student-to-Student</span>
          </div>
        </div>

        {/* ─── Floating Satellite Node Left (Giver/Mentor) ─────────── */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -left-4 w-44 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#581c2e]/20 shadow-xl"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f2] text-[#581c2e] flex items-center justify-center font-bold text-xs border border-[#fecdd3] shadow-xs">
              <BookOpen size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-stone-900 font-serif truncate">
                {current.giver.name}
              </div>
              <div className="text-[9px] text-[#581c2e] font-semibold truncate">
                {current.giver.item}
              </div>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-500">
            <span className="font-serif italic">{current.giver.tier}</span>
            <span className="text-[#581c2e] font-bold">★ 5.0</span>
          </div>
        </motion.div>

        {/* ─── Floating Satellite Node Right (Receiver/Gear) ───────── */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute -bottom-4 -right-4 w-44 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#581c2e]/20 shadow-xl"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f2] text-[#581c2e] flex items-center justify-center font-bold text-xs border border-[#fecdd3] shadow-xs">
              <Cpu size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-stone-900 font-serif truncate">
                {current.receiver.name}
              </div>
              <div className="text-[9px] text-[#581c2e] font-semibold truncate">
                {current.receiver.item}
              </div>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-500">
            <span className="font-serif italic">{current.receiver.tier}</span>
            <span className="text-[#581c2e] font-bold">✓ Ready</span>
          </div>
        </motion.div>

        {/* ─── Floating Real-Time Pulse Pill ───────────────────────── */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -right-2 px-3 py-1.5 bg-[#581c2e] text-white rounded-xl shadow-lg border border-[#70243b] flex items-center gap-1.5"
          style={{ transform: 'translateZ(50px)' }}
        >
          <Zap size={13} className="text-[#faf6f0] animate-bounce" />
          <span className="text-[9px] font-bold font-serif tracking-tight text-[#faf6f0]">
            Live Exchange
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
