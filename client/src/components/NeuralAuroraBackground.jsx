import React, { useEffect, useRef } from 'react';

/**
 * NeuralAuroraBackground
 * 
 * High-performance, GPU-accelerated HTML5 Canvas animation.
 * Features:
 * 1. Multi-layered waving Aurora ribbons in brand palette (#38BDF8, #2563EB, #8B5CF6, #A855F7).
 * 2. Neural synaptic graph with drifting evidence nodes and pulsing data-flow packets.
 * 3. Soft gradient fade-out at the bottom to melt into pure #050816.
 * 4. IntersectionObserver pauses RAF when off-screen for maximum efficiency.
 */
export function NeuralAuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Mouse coordinates for gentle parallax interaction
    let mouse = { x: width / 2, y: height / 3, targetX: width / 2, targetY: height / 3 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle responsive resizing with device pixel ratio
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // Pause rendering when hero is scrolled out of viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Neural Synapse Nodes
    const NODE_COUNT = Math.min(42, Math.max(24, Math.floor(window.innerWidth / 36)));
    const nodes = [];
    const colors = [
      '#38BDF8', // Primary Blue
      '#2563EB', // AI Blue
      '#8B5CF6', // Violet
      '#A855F7'  // Purple
    ];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * (canvas.offsetWidth || width),
        y: Math.random() * (canvas.offsetHeight || height) * 0.85,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Flowing Data Packets along synaptic links
    const packets = [];
    for (let i = 0; i < 18; i++) {
      packets.push({
        sourceIdx: Math.floor(Math.random() * NODE_COUNT),
        targetIdx: Math.floor(Math.random() * NODE_COUNT),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.008;

      // Soft mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const displayW = canvas.offsetWidth || width;
      const displayH = canvas.offsetHeight || height;

      // Clear with base background
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, displayW, displayH);

      // ==========================================
      // 1. NEURAL AURORA WAVES (Fluid Flow)
      // ==========================================
      const drawAuroraWave = (baseY, amplitude, freq, speed, colorStart, colorEnd, alpha) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, displayH);

        for (let x = 0; x <= displayW; x += 8) {
          // Compound sinusoidal waves simulating magnetic plasma ribbons
          const wave1 = Math.sin(x * freq + time * speed) * amplitude;
          const wave2 = Math.cos(x * freq * 1.6 - time * speed * 0.7) * (amplitude * 0.45);
          const mouseFactor = (mouse.x - x) * 0.0004;
          const y = baseY + wave1 + wave2 + mouseFactor * 30;

          if (x === 0) {
            ctx.lineTo(0, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(displayW, displayH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - amplitude, displayW, baseY + amplitude);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.5, colorEnd);
        grad.addColorStop(1, colorStart);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = grad;
        ctx.filter = 'blur(35px)';
        ctx.fill();
        ctx.restore();
      };

      // Aurora Layer 1: Electric AI Blue (#2563EB) & Violet (#8B5CF6)
      drawAuroraWave(
        displayH * 0.32,
        90,
        0.0022,
        1.1,
        'rgba(37, 99, 235, 0.28)',
        'rgba(139, 92, 246, 0.32)',
        0.75
      );

      // Aurora Layer 2: Luminous Primary Sky Blue (#38BDF8) & Purple (#A855F7)
      drawAuroraWave(
        displayH * 0.46,
        110,
        0.0018,
        -0.85,
        'rgba(56, 189, 248, 0.24)',
        'rgba(168, 85, 247, 0.28)',
        0.65
      );

      // Aurora Layer 3: Upper Ambient Synapse Mist
      drawAuroraWave(
        displayH * 0.22,
        70,
        0.0031,
        0.65,
        'rgba(139, 92, 246, 0.20)',
        'rgba(56, 189, 248, 0.22)',
        0.5
      );

      // ==========================================
      // 2. NEURAL NODES & SYNAPTIC CONNECTIONS
      // ==========================================
      // Update nodes position
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        // Soft bounce boundaries
        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > displayW - 10) { node.x = displayW - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > displayH * 0.82) { node.y = displayH * 0.82; node.vy *= -1; }
      }

      // Draw connection lines between proximate nodes
      const maxDist = 135;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulsedRadius = node.radius + Math.sin(node.pulse) * 0.8;

        // Glowing node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.5, pulsedRadius), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw flowing data packets (cross-modal information pulses)
      for (let k = 0; k < packets.length; k++) {
        const p = packets[k];
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.sourceIdx = Math.floor(Math.random() * nodes.length);
          p.targetIdx = Math.floor(Math.random() * nodes.length);
        }

        const src = nodes[p.sourceIdx];
        const tgt = nodes[p.targetIdx];
        if (!src || !tgt) continue;

        const curX = src.x + (tgt.x - src.x) * p.progress;
        const curY = src.y + (tgt.y - src.y) * p.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ==========================================
      // 3. GRADUAL FADE-OUT AT BOTTOM (Into #050816)
      // ==========================================
      const fadeH = displayH * 0.38;
      const fadeGrad = ctx.createLinearGradient(0, displayH - fadeH, 0, displayH);
      fadeGrad.addColorStop(0, 'rgba(5, 8, 22, 0)');
      fadeGrad.addColorStop(0.45, 'rgba(5, 8, 22, 0.45)');
      fadeGrad.addColorStop(0.8, 'rgba(5, 8, 22, 0.85)');
      fadeGrad.addColorStop(1, 'rgba(5, 8, 22, 1)');

      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, displayH - fadeH, displayW, fadeH);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Subtle overlay gradient to ensure flawless blend at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-[#050816]/70 to-[#050816] pointer-events-none" />
    </div>
  );
}

export default NeuralAuroraBackground;
