import React, { useEffect, useState } from 'react';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export default function Particle({ x, y, color, onComplete }: ParticleProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
    scale: number;
  }>>([]);

  // Function to create bright golden-yellow sparkle color
  const getSparkleColor = () => {
    return '#FFFFFF'; // Bright golden yellow for sparkles
  };

  useEffect(() => {
    // Create 12 sparkles flying out from tile border
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      // Calculate starting position on tile border/perimeter
      const angle = (i / 12) * 2 * Math.PI; // Distribute 12 sparkles around the tile
      const borderX = x + 20 + Math.cos(angle) * 20; // 20 = tile border radius
      const borderY = y + 20 + Math.sin(angle) * 20; // 20 = tile border radius
      
      // Velocity pointing outward from tile center with random variation
      const baseVx = Math.cos(angle) * 2; // Base outward velocity
      const baseVy = Math.sin(angle) * 2;
      const vx = baseVx + (Math.random() - 0.5) * 1.5; // Add random variation
      const vy = baseVy + (Math.random() - 0.5) * 1.5;
      
      return {
        id: i,
        x: borderX,
        y: borderY,
        vx,
        vy,
        opacity: 1,
        scale: 1,
      };
    });

    setParticles(newParticles);

    // Animate particles
    const animation = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          opacity: particle.opacity - 0.06,
          scale: particle.scale + 0.03,
        }))
      );
    }, 16); // 60fps

    // Clean up animation
    const cleanup = setTimeout(() => {
      clearInterval(animation);
      onComplete();
    }, 300);

    return () => {
      clearInterval(animation);
      clearTimeout(cleanup);
    };
  }, []); // Remove dependencies so animation runs independently

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: getSparkleColor(),
            opacity: particle.opacity,
            transform: `scale(${particle.scale})`,
            filter: 'blur(0.3px)',
            zIndex: 100,
            boxShadow: `0 0 4px ${getSparkleColor()}`,
          }}
        />
      ))}
    </>
  );
}
