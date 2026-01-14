
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const ConservatoryBackground: React.FC = () => {
    const [isDaytime, setIsDaytime] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkTime = () => {
            const hour = new Date().getHours();
            // Assume day is 6 AM to 6 PM (18:00)
            setIsDaytime(hour >= 6 && hour < 18);
        };

        checkTime();
        // Check every minute just in case they leave it open through sunset
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-zinc-900 pointer-events-none">
            {/* Day Image */}
            <div className={`absolute inset-0 transition-opacity duration-[2000ms] ${isDaytime ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src="/images/conservatory-day.jpg"
                    alt="Conservatory Day"
                    fill
                    className="object-cover opacity-80" // Slightly dimmed to let content pop
                    priority
                />
            </div>

            {/* Night Image */}
            <div className={`absolute inset-0 transition-opacity duration-[2000ms] ${!isDaytime ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src="/images/conservatory-night.jpg"
                    alt="Conservatory Night"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </div>

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-[1px]" />
        </div>
    );
};
