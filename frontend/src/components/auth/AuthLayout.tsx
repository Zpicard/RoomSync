import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  // Create a balanced particle system with direct DOM manipulation
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);
  
  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2, // 2-4px (balanced size)
      opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6 (more visible but still subtle)
    }));
    
    setParticles(initialParticles);
    
    // Animate particles with moderate movement
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y > 100 ? -10 : particle.y + 0.15, // Moderate vertical movement
          x: particle.x + (Math.random() - 0.5) * 0.15, // Moderate horizontal movement
        }))
      );
    }, 80); // Moderate update interval
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden !important" 
      style={{ 
        background: 'linear-gradient(135deg, #0a1854 0%, #0c1f6c 50%, #0a1854 100%)',
        backgroundColor: '#0a1854'
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Animated gradient circles */}
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#0c1f6c]/10 rounded-full filter blur-[120px]"
          animate={{
            x: [-100, 100, -100],
            y: [-100, 100, -100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full filter blur-[120px]"
          animate={{
            x: [100, -100, 100],
            y: [100, -100, 100],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Light beam effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#0c1f6c]/5 rounded-full filter blur-[80px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#0c1f6c]/5 rounded-full filter blur-[80px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Static grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Balanced particle rendering */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.5)',
                opacity: particle.opacity,
                transition: 'all 0.08s linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row w-full min-h-screen">
        {/* Left side - Branding */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-8 flex justify-center md:justify-start"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Logo className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.p 
            className="text-xl text-white/90 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-white/90 font-medium mb-1">Smart Chore Rotation</h3>
              <p className="text-white/60 text-sm">Automated task scheduling and fair distribution of household responsibilities</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-white/90 font-medium mb-1">Dashboard Overview</h3>
              <p className="text-white/60 text-sm">Get a quick view of your household tasks, upcoming events, and roommate activities</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-white/90 font-medium mb-1">Guest Tracking</h3>
              <p className="text-white/60 text-sm">Coordinate visitors and manage shared spaces with your roommates</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-white/90 font-medium mb-1">Quiet Hours</h3>
              <p className="text-white/60 text-sm">Set and respect study and rest periods for a harmonious living environment</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div 
          className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="w-full max-w-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout; 