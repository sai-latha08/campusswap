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
          className="absolute inset-0 bg-slate-900/10 rounded-3xl blur-2xl transform translate-y-16 scale-95"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Base Platform (Campus Quad Base) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl border-2 border-slate-200/80 shadow-2xl overflow-hidden p-6"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Subtle Quad Paths */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200" />
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-200" />
            <div className="absolute inset-10 rounded-full border border-slate-300/60" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Campus Quad
              </span>
              <span>Stanford • CS / Eng</span>
            </div>

            {/* Central Interchange Ring */}
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-indigo-950 text-white flex flex-col items-center justify-center shadow-lg border-2 border-indigo-900">
                <ArrowRightLeft size={20} className="text-amber-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-200 mt-0.5">
                  0-Cash
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
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
              ? 'border-indigo-600 ring-2 ring-indigo-500/20'
              : 'border-slate-200'
          }`}
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900">Elena R.</div>
              <div className="text-[9px] text-indigo-600 font-semibold">Web Architecture</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Match: 95%</span>
            <span className="text-emerald-600 font-bold">★ 98 PTS</span>
          </div>
        </motion.div>

        {/* ─── Layer 2: Gear Rental Hub (Bottom-Right 3D Layer) ─────── */}
        <motion.div
          whileHover={{ translateZ: 55, scale: 1.05 }}
          onClick={() => setActiveNode('rentals')}
          className={`absolute -bottom-4 -right-4 w-44 p-3.5 bg-white rounded-2xl border transition-all shadow-xl cursor-pointer ${
            activeNode === 'rentals'
              ? 'border-emerald-600 ring-2 ring-emerald-500/20'
              : 'border-slate-200'
          }`}
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <Cpu size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900">3D Printer Kit</div>
              <div className="text-[9px] text-emerald-700 font-semibold">$12/day • Anti-Overlap</div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Marcus V. (Yr 4)</span>
            <span className="text-emerald-700 font-bold">✓ Ready</span>
          </div>
        </motion.div>

        {/* ─── Layer 3: Barter Contract Capsule (Top-Right Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 65, scale: 1.08 }}
          onClick={() => setActiveNode('barter')}
          className="absolute -top-3 -right-3 px-3 py-2 bg-gradient-to-r from-indigo-950 to-slate-900 text-white rounded-xl shadow-2xl border border-indigo-800/60 cursor-pointer flex items-center gap-2"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-bold leading-tight">Skill ↔ Item Barter</div>
            <div className="text-[8px] text-amber-300 font-medium">3h Tutoring = 5d Gear</div>
          </div>
        </motion.div>

        {/* ─── Layer 4: Verified Student Identity (Bottom-Left Floating 3D Badge) */}
        <motion.div
          whileHover={{ translateZ: 40, scale: 1.05 }}
          className="absolute -bottom-2 -left-2 px-3 py-1.5 bg-emerald-950 text-white rounded-xl shadow-xl border border-emerald-800/80 flex items-center gap-2"
          style={{ transform: 'translateZ(30px)' }}
        >
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold tracking-tight">100% .EDU Verified</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
