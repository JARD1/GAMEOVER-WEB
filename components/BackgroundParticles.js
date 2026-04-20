"use client";

const mushrooms = [
  // Grandes (Fondo muy profundo)
  { size: 120, left: "10%", delay: "0s", duration: "25s" },
  { size: 90, left: "40%", delay: "5s", duration: "30s" },
  { size: 110, left: "80%", delay: "2s", duration: "28s" },
  
  // Medianos (Efecto gota)
  { size: 65, left: "25%", delay: "8s", duration: "18s" },
  { size: 75, left: "55%", delay: "3s", duration: "22s" },
  { size: 60, left: "90%", delay: "12s", duration: "20s" },
  
  // Variedad para llenar huecos
  { size: 50, left: "5%", delay: "15s", duration: "15s" },
  { size: 85, left: "65%", delay: "1s", duration: "24s" },
  { size: 45, left: "33%", delay: "6s", duration: "19s" },
  { size: 100, left: "15%", delay: "10s", duration: "35s" },
];

export default function BackgroundParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {mushrooms.map((mushroom, index) => (
        <span
          key={index}
          className="neon-mushroom-drop"
          style={{
            width: `${mushroom.size}px`,
            height: `${mushroom.size}px`,
            left: mushroom.left,
            animationDelay: mushroom.delay,
            animationDuration: mushroom.duration,
            // Añadimos un blur opcional para los más grandes para dar profundidad
            filter: mushroom.size > 80 ? `blur(2px) drop-shadow(0 0 15px rgba(157, 78, 221, 0.8))` : `drop-shadow(0 0 10px rgba(157, 78, 221, 0.8))`
          }}
        />
      ))}
    </div>
  );
}