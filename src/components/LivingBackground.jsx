import React, { useEffect, useRef } from 'react';

export default function LivingBackground({ theme }) {
  const canvasRef = useRef(null);
  const bgLayerRef = useRef(null);
  const auraLayerRef = useRef(null);

  // Smooth mouse parallax physics
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const updateParallax = () => {
      // Smooth lerp interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `scale(1.05) translate3d(${-currentX * 12}px, ${-currentY * 8}px, 0)`;
      }
      if (auraLayerRef.current) {
        auraLayerRef.current.style.transform = `translate3d(${-currentX * 22}px, ${-currentY * 16}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Ambient floating golden embers & starlight particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle count
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        goldColor: Math.random() > 0.3 ? 'rgba(245, 215, 127,' : 'rgba(255, 255, 255,'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.pulseSpeed;
        const currentAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.phase));

        p.y -= p.speedY;
        p.x += p.speedX;

        // Wrap around
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.goldColor} ${currentAlpha})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="living-bg-root">
      {/* 1. Interactive Parallax Temple Artwork Layer (Clean, No Watermark) */}
      <div ref={bgLayerRef} className="living-bg-image" />

      {/* 2. Central Archway Cosmic Breathing Aura */}
      <div ref={auraLayerRef} className="living-bg-aura" />

      {/* 3. Floating Sacred Light Embers / Stardust */}
      <canvas ref={canvasRef} className="living-bg-canvas" />

      {/* 4. Sacred Vignette Overlay */}
      <div className="living-bg-vignette" />

      {/* 5. Sacred Ornate Framing System (Matching Original Reference) */}
      <div className="sacred-frame-border">
        {/* Top Center Emblem */}
        <div className="frame-emblem top-center">
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
            <path d="M18 0L24 10L18 20L12 10L18 0Z" fill="url(#goldGrad)" />
            <circle cx="18" cy="10" r="2.5" fill="#fff" />
            <path d="M0 10H12M24 10H36" stroke="url(#goldGrad)" strokeWidth="1" />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#b38e2d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom Center Emblem */}
        <div className="frame-emblem bottom-center">
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
            <path d="M18 20L24 10L18 0L12 10L18 20Z" fill="url(#goldGradB)" />
            <circle cx="18" cy="10" r="2.5" fill="#fff" />
            <path d="M0 10H12M24 10H36" stroke="url(#goldGradB)" strokeWidth="1" />
            <defs>
              <linearGradient id="goldGradB" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#b38e2d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 4 Corner Ornate Brackets */}
        <div className="corner-bracket top-left">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M2 38V12C2 6.47715 6.47715 2 12 2H38" stroke="url(#goldGradCorner)" strokeWidth="1.5" />
            <path d="M6 38V14C6 9.58172 9.58172 6 14 6H38" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#f5d77f" />
            <defs>
              <linearGradient id="goldGradCorner" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="corner-bracket top-right">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M38 38V12C38 6.47715 33.5228 2 28 2H2" stroke="url(#goldGradCornerTR)" strokeWidth="1.5" />
            <path d="M34 38V14C34 9.58172 30.4183 6 26 6H2" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <circle cx="28" cy="12" r="3" fill="#f5d77f" />
            <defs>
              <linearGradient id="goldGradCornerTR" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="corner-bracket bottom-left">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M2 2V28C2 33.5228 6.47715 38 12 38H38" stroke="url(#goldGradCornerBL)" strokeWidth="1.5" />
            <path d="M6 2V26C6 30.4183 9.58172 34 14 34H38" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <circle cx="12" cy="28" r="3" fill="#f5d77f" />
            <defs>
              <linearGradient id="goldGradCornerBL" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="corner-bracket bottom-right">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M38 2V28C38 33.5228 33.5228 38 28 38H2" stroke="url(#goldGradCornerBR)" strokeWidth="1.5" />
            <path d="M34 2V26C34 30.4183 30.4183 34 26 34H2" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <circle cx="28" cy="28" r="3" fill="#f5d77f" />
            <defs>
              <linearGradient id="goldGradCornerBR" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#f5d77f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
