"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface CelebrationEffectProps {
  show: boolean;
  onComplete?: () => void;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  show,
  onComplete,
}) => {
  useEffect(() => {
    if (show) {
      // Fire confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ["#00FF00", "#7CFC00", "#32CD32", "#98FB98", "#28A745"];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 200);
        }
      })();
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-100 text-green-800 font-bold text-xl p-4 rounded-lg shadow-lg"
      >
        <span role="img" aria-label="Celebration">
          🎉
        </span>{" "}
        Task Completed!{" "}
        <span role="img" aria-label="Celebration">
          🎊
        </span>
      </motion.div>
    </div>
  );
};

export default CelebrationEffect;
