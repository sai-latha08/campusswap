import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, ArrowRightLeft, ShieldCheck,
  Cpu, Award, Sparkles, GraduationCap
} from 'lucide-react';

export default function CampusInteractiveHero() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 8, y: -10 });
  const [activeNode, setActiveNode] = useState('exchange');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle dampening for premium tactile feel
    setRotate({
      x: -(y / rect.height) * 10 + 5,
      y: (x / rect.width) * 14 - 7,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 8, y: -10 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto h-[380px] sm:h-[440px] flex items-center justify-center cursor-default select-none"
      style={{ perspective: 1200 }}
    >
      {/* Ambient Burgundy Glow behind platform */}
      <div className="absolute w-72 h-72 rounded-full bg-[#581c2e]/10 blur-3xl pointer-events-none animate-swap-glow" />

      {/* 3D Isometric Miniature Campus Platform */}
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        className="relative w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Base Platform Shadow */}
        <div
          className="absolute inset-0 bg-[#581c2e]/15 rounded-3xl blur-2xl transform translate-y-14 scale-95"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Base Platform (Warm Cream Quad Base) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-white to-[#f4eee5] rounded-3xl border-2 border-[#e7ded3] shadow-2xl overflow-hidden p-6"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Subtle Quad Geometry Grid */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#d8c7b6]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#d8c7b6]" />
            <div className="absolute inset-10 rounded-full border border-[#d6c6b6]/70" />
            <div className="absolute inset-20 rounded-full border border-dashed border-[#d6c6b6]/50" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
              <span className="flex items-center gap-1.5 text-[#581c2e] bg-[#fff1f2] px-3 py-1 rounded-full border border-[#fecdd3] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#581c2e] animate-pulse" /> Verified Campus Quad
              </span>
              <span className="font-serif italic text-stone-500 font-semibold">Peer-to-Peer Hub</span>
            </div>

            {/* Central Burgundy Interchange Ring */}
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#581c2e] to-[#380e1a] text-white flex flex-col items-center justify-center shadow-xl border border-[#70243b] hover:scale-105 transition-transform duration-300">
                <ArrowRightLeft size={22} className="text-[#fdfbf7] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#faf6f0] mt-1 font-serif">
                  Direct Swap
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium px-1">
              <span className="flex items-center gap-1"><GraduationCap size={12} className="text-[#581c2e]" /> 100% Peer Verified</span>
              <span className="flex items-center gap-1"><Sparkles size={12} className="text-[#581c2e]" /> Zero-Fee Exchange</span>
            </div>
          </div>
        </div>

        {/* ─── Layer 1: Skill Learning Pod (Top-Left 3D Layer) ──────── */}
        <motion.div
          whileHover={{ translateZ: 50, scale: 1.05 }}
          onClick={() => setActiveNode('skills')}
          className={`absolute -top-4 -left-4 w-44 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border transition-all shadow-xl cursor-pointer ${
            activeNode === 'skills'
              ? 'border-[#581c2e] ring-2 ring-[#581c2e]/20'
              : 'border-[#e7ded3]'
          }`}
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f2] text-[#581c2e] flex items-center justify-center font-bold text-xs shadow-xs border border-[#fecdd3]">
              <BookOpen size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-900 font-serif">Elena R.</div>
              <div className="text-[9px] text-[#581c2e] font-semibold">Web Architecture</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>Match: 98%</span>
            <span className="text-[#581c2e] font-bold">★ 5.0 Trust</span>
          </div>
        </motion.div>

        {/* ─── Layer 2: Gear Rental Hub (Bottom-Right 3D Layer) ─────── */}
        <motion.div
          whileHover={{ translateZ: 55, scale: 1.05 }}
          onClick={() => setActiveNode('rentals')}
          className={`absolute -bottom-4 -right-4 w-44 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border transition-all shadow-xl cursor-pointer ${
            activeNode === 'rentals'
              ? 'border-[#581c2e] ring-2 ring-[#581c2e]/20'
              : 'border-[#e7ded3]'
          }`}
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f2] text-[#581c2e] flex items-center justify-center font-bold text-xs shadow-xs border border-[#fecdd3]">
              <Cpu size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-900 font-serif">Lab 3D Printer</div>
              <div className="text-[9px] text-[#581c2e] font-semibold">Conflict-Free Lending</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>Marcus V. (Yr 4)</span>
            <span className="text-[#581c2e] font-bold font-serif">✓ Available</span>
          </div>
        </motion.div>

        {/* ─── Layer 3: Barter Contract Capsule (Top-Right Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 65, scale: 1.08 }}
          onClick={() => setActiveNode('barter')}
          className="absolute -top-3 -right-3 px-3.5 py-2 bg-gradient-to-r from-[#581c2e] to-[#380e1a] text-white rounded-xl shadow-2xl border border-[#70243b] cursor-pointer flex items-center gap-2"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="w-6 h-6 rounded-lg bg-[#faf6f0] text-[#581c2e] flex items-center justify-center font-black text-[11px]">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-bold leading-tight text-white font-serif">Skill ↔ Item Barter</div>
            <div className="text-[8px] text-[#faf6f0]/90 font-medium">3h Tutoring = 5d Gear</div>
          </div>
        </motion.div>

        {/* ─── Layer 4: Verified Student Identity (Bottom-Left Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 40, scale: 1.05 }}
          className="absolute -bottom-2 -left-2 px-3.5 py-1.5 bg-[#581c2e] text-white rounded-xl shadow-xl border border-[#70243b] flex items-center gap-2"
          style={{ transform: 'translateZ(30px)' }}
        >
          <ShieldCheck size={15} className="text-[#faf6f0]" />
          <span className="text-[10px] font-bold tracking-tight font-serif text-[#faf6f0]">100% .EDU Verified</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
