import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, ShoppingBag, ArrowRightLeft, ShieldCheck,
  Laptop, Camera, Cpu, Star, Award, CheckCircle2
} from 'lucide-react';

export default function CampusInteractiveHero() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 8, y: -12 });
  const [activeNode, setActiveNode] = useState('exchange');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle dampening
    setRotate({
      x: -(y / rect.height) * 12 + 6,
      y: (x / rect.width) * 16 - 8,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 8, y: -12 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto h-[380px] sm:h-[440px] flex items-center justify-center cursor-default select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Isometric Miniature Campus Platform */}
      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Base Platform Shadow */}
        <div
          className="absolute inset-0 bg-[#581c2e]/10 rounded-3xl blur-2xl transform translate-y-16 scale-95"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Base Platform (Warm Cream Quad Base) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-white to-[#f4eee5] rounded-3xl border-2 border-[#e7ded3] shadow-2xl overflow-hidden p-6"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Subtle Quad Paths */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#e7ded3]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#e7ded3]" />
            <div className="absolute inset-10 rounded-full border border-[#d6c6b6]/60" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
              <span className="flex items-center gap-1 text-[#881337] bg-[#fff1f2] px-2.5 py-0.5 rounded-full border border-[#fecdd3] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse" /> Campus Quad
              </span>
              <span className="font-semibold text-stone-600">Stanford • CS / Eng</span>
            </div>

            {/* Central Interchange Ring */}
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#581c2e] text-white flex flex-col items-center justify-center shadow-lg border-2 border-[#451523]">
                <ArrowRightLeft size={20} className="text-[#f59e0b]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-200 mt-0.5">
                  0-Cash
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium">
              <span>Peer Mentors: 14+</span>
              <span>Available Gear: 12+</span>
            </div>
          </div>
        </div>

        {/* ─── Layer 1: Skill Learning Pod (Top-Left 3D Layer) ──────── */}
        <motion.div
          whileHover={{ translateZ: 50, scale: 1.05 }}
          onClick={() => setActiveNode('skills')}
          className={`absolute -top-4 -left-4 w-40 p-3.5 bg-white rounded-2xl border transition-all shadow-xl cursor-pointer ${
            activeNode === 'skills'
              ? 'border-[#881337] ring-2 ring-[#881337]/20'
              : 'border-[#e7ded3]'
          }`}
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#fff1f2] text-[#881337] flex items-center justify-center font-bold text-xs">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-900">Elena R.</div>
              <div className="text-[9px] text-[#881337] font-semibold">Web Architecture</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>Match: 95%</span>
            <span className="text-[#166534] font-bold">★ 98 PTS</span>
          </div>
        </motion.div>

        {/* ─── Layer 2: Gear Rental Hub (Bottom-Right 3D Layer) ─────── */}
        <motion.div
          whileHover={{ translateZ: 55, scale: 1.05 }}
          onClick={() => setActiveNode('rentals')}
          className={`absolute -bottom-4 -right-4 w-44 p-3.5 bg-white rounded-2xl border transition-all shadow-xl cursor-pointer ${
            activeNode === 'rentals'
              ? 'border-[#166534] ring-2 ring-[#166534]/20'
              : 'border-[#e7ded3]'
          }`}
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#166534] flex items-center justify-center font-bold text-xs">
              <Cpu size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-900">3D Printer Kit</div>
              <div className="text-[9px] text-[#166534] font-semibold">$12/day • Conflict-Free</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>Marcus V. (Yr 4)</span>
            <span className="text-[#166534] font-bold">✓ Ready</span>
          </div>
        </motion.div>

        {/* ─── Layer 3: Barter Contract Capsule (Top-Right Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 65, scale: 1.08 }}
          onClick={() => setActiveNode('barter')}
          className="absolute -top-3 -right-3 px-3 py-2 bg-gradient-to-r from-[#581c2e] to-[#380e1a] text-white rounded-xl shadow-2xl border border-[#70243b] cursor-pointer flex items-center gap-2"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="w-5 h-5 rounded-full bg-[#f59e0b] text-stone-950 flex items-center justify-center font-black text-[10px]">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-bold leading-tight text-white">Skill ↔ Item Barter</div>
            <div className="text-[8px] text-amber-200 font-medium">3h Tutoring = 5d Gear</div>
          </div>
        </motion.div>

        {/* ─── Layer 4: Verified Student Identity (Bottom-Left Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 40, scale: 1.05 }}
          className="absolute -bottom-2 -left-2 px-3 py-1.5 bg-[#1a402d] text-white rounded-xl shadow-xl border border-[#23533b] flex items-center gap-2"
          style={{ transform: 'translateZ(30px)' }}
        >
          <ShieldCheck size={14} className="text-[#4ade80]" />
          <span className="text-[10px] font-bold tracking-tight">100% .EDU Verified</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
