import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

interface LoadingAnimationProps {
    message?: string;
}

export const LoadingAnimation = ({ message = "Please wait..." }: LoadingAnimationProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position values for 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the tilt
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useMotionTemplate`${mouseYSpring}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring}deg`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * 20); // Rotate Y axis based on X position
        y.set(yPct * -20); // Rotate X axis based on Y position
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 backdrop-blur-md"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={ref}
                style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white px-16 py-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-slate-100 flex flex-col items-center gap-8"
            >
                {/* Background Decor (Floating) */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#48AEDD]/5 via-transparent to-[#E53935]/5 rounded-[2.5rem] pointer-events-none"
                    style={{ transform: "translateZ(-20px)" }}
                />

                {/* 3 Bouncing Brand Dots with 3D Depth */}
                <div 
                    className="flex gap-4" 
                    style={{ transform: "translateZ(40px)" }}
                >
                    <motion.div
                        className="w-6 h-6 rounded-full bg-[#48AEDD] shadow-lg shadow-[#48AEDD]/30" // Sky Blue
                        initial={{ y: 0 }}
                        animate={{ y: -20 }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0,
                        }}
                    />
                    <motion.div
                        className="w-6 h-6 rounded-full bg-[#E53935] shadow-lg shadow-[#E53935]/30" // Red
                        initial={{ y: 0 }}
                        animate={{ y: -20 }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.15,
                        }}
                    />
                    <motion.div
                        className="w-6 h-6 rounded-full bg-[#F5EB18] shadow-lg shadow-[#F5EB18]/40" // Yellow
                        initial={{ y: 0 }}
                        animate={{ y: -20 }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: 0.3,
                        }}
                    />
                </div>

                {/* Message with 3D Depth */}
                <motion.p 
                    className="text-lg font-bold text-[#134467] tracking-wide"
                    style={{ transform: "translateZ(30px)" }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
};