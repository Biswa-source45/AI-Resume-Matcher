/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, FileText } from "lucide-react";
import { Link } from "react-router-dom";

// 🧠 Animated Neuron Background
const NeuronBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numParticles = 80;
    const maxDistance = 120;
    const random = (min, max) => Math.random() * (max - min) + min;

    const initParticles = () => {
      particles.current = Array.from({ length: numParticles }, () => ({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.5, 0.5),
        vy: random(-0.5, 0.5),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      particles.current.forEach((p1, i) => {
        particles.current.forEach((p2, j) => {
          if (i !== j) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDistance) {
              const opacity = 1 - dist / maxDistance;
              ctx.strokeStyle = `rgba(0, 100, 255, ${opacity * 0.4})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });

      particles.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();
      });

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    };

    initParticles();
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
    ></canvas>
  );
};

// 🌐 Landing Page
const LandingPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white text-black flex flex-col items-center justify-start mt-17 md:mt-34 px-6">
      <NeuronBackground />

      {/* ICONS ANIMATION */}
      <div className="relative z-10 flex items-center justify-center gap-5 sm:gap-8 mb-4 sm:mb-6">
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <FileText size={70} className="text-black sm:size-20" />
        </motion.div>

        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <Brain size={70} className="text-black sm:size-20" />
        </motion.div>
      </div>

      {/* TEXT SECTION */}
      <motion.div
        className="relative z-10 text-center max-w-3xl px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight font-sans">
          Match Your <span className="text-blue-600">Resume</span> with{" "}
          <span className="text-blue-600">AI Precision</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed font-light">
          Transform your career documents into impactful stories. Our{" "}
          <span className="font-medium text-blue-600">AI-powered matcher</span>{" "}
          analyzes, optimizes, and aligns your resume perfectly with job roles.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(0, 100, 255, 0.4)",
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-8 py-3 rounded-full bg-black text-white text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            <Link to="/dashboard">Get Started</Link>
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(0, 100, 255, 0.4)",
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-8 py-3 rounded-full border border-black text-black text-base sm:text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all"
          >
            <Link to="/docs">View Docs</Link>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
