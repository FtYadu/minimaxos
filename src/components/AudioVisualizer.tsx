'use client';

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioUrl: string;
    isPlaying: boolean;
}

export default function AudioVisualizer({ audioUrl, isPlaying }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!audioUrl) return;

        const audio = document.getElementById('audio-player') as HTMLAudioElement;
        if (!audio) return;

        // Initialize Audio Context
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            // Connect audio element to analyser
            if (!sourceRef.current) {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
            }
        }

        const renderFrame = () => {
            if (!canvasRef.current || !analyserRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserRef.current.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            ctx.clearRect(0, 0, width, height);

            // Create gradient
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, '#f97316'); // Orange-500
            gradient.addColorStop(1, '#ef4444'); // Red-500
            ctx.fillStyle = gradient;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height;

                // Draw rounded bars
                ctx.beginPath();
                ctx.roundRect(x, height - barHeight, barWidth, barHeight, 4);
                ctx.fill();

                x += barWidth + 1;
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(renderFrame);
            }
        };

        if (isPlaying) {
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            renderFrame();
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [audioUrl, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-full rounded-lg"
        />
    );
}
