import { useEffect, useRef } from "react";

interface RecordingIndicatorProps {
    isRecording: boolean;
    formattedDuration: string;
}

const RecordingIndicator = ({ isRecording, formattedDuration }: RecordingIndicatorProps) => {
    const barsRef = useRef<HTMLDivElement[]>([]);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!isRecording) return;

        const animate = () => {
            barsRef.current.forEach((bar) => {
                if (!bar) return;
                const height = Math.random() * 28 + 8;
                bar.style.height = `${height}px`;
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        const interval = setInterval(() => {
            barsRef.current.forEach((bar) => {
                if (!bar) return;
                const height = Math.random() * 28 + 8;
                bar.style.height = `${height}px`;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isRecording]);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Waveform */}
            <div className="flex items-center gap-1 h-10">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) barsRef.current[i] = el; }}
                        className={`w-1.5 rounded-full transition-all duration-100 ${
                            isRecording ? "bg-primary" : "bg-gray-200"
                        }`}
                        style={{ height: isRecording ? `${Math.random() * 28 + 8}px` : "8px" }}
                    />
                ))}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
                {isRecording && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className={`font-mono text-b1 font-bold ${isRecording ? "text-primary" : "text-text-muted"}`}>
                    {formattedDuration}
                </span>
            </div>

            {isRecording && (
                <p className="text-[12px] text-text-muted font-medium animate-pulse">
                    Listening... speak clearly
                </p>
            )}
        </div>
    );
};

export default RecordingIndicator;
