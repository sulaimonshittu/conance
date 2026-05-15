import { Mic, Check, AlertCircle, Trash2 } from "lucide-react";
import { VoiceVisualizer } from "react-voice-visualizer";
import useVoiceRecording from "@/lib/hooks/useVoiceRecording";
import UploadState from "./UploadState";

const VoiceRecorder = () => {
    const {
        recorderControls,
        isRecording,
        recordedBlob,
        formattedDuration,
        isTranscribing,
        transcriptionError,
        startRecording,
        stopRecording,
        discardRecording,
        transcribeVoice,
    } = useVoiceRecording();

    if (isTranscribing) {
        return <UploadState message="Transcribing your voice..." />;
    }

    return (
        <div className="flex flex-col items-center gap-6 py-6 w-full">
            {/* Visualizer */}
            <div className="w-full bg-gray-50/50 rounded-3xl p-4 border border-accent/20 relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center">
                <VoiceVisualizer
                    controls={recorderControls}
                    width="100%"
                    height={120}
                    mainBarColor="#3b82f6"
                    secondaryBarColor="#93c5fd"
                    barWidth={3}
                    gap={2}
                />

                {/* Custom Timer Overlay */}
                <div className="absolute top-4 right-6 flex items-center gap-2">
                    {isRecording && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                    <span className={`font-mono text-sm font-bold ${isRecording ? "text-primary" : "text-text-muted"}`}>
                        {formattedDuration}
                    </span>
                </div>
            </div>

            {/* Error */}
            {transcriptionError && (
                <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                    <AlertCircle size={18} className="text-error shrink-0 mt-0.5" />
                    <p className="text-[13px] text-red-700 font-medium">{transcriptionError}</p>
                </div>
            )}

            {/* Controls */}
            {!recordedBlob ? (
                // Recording Controls
                <div className="flex flex-col items-center gap-4">
                    <button
                        onMouseDown={startRecording}
                        onTouchStart={startRecording}
                        onMouseUp={stopRecording}
                        onTouchEnd={stopRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 ${isRecording
                                ? "bg-red-500 shadow-red-500/30 animate-pulse scale-110"
                                : "bg-primary shadow-primary/30 hover:bg-primary2"
                            }`}
                        aria-label={isRecording ? "Stop recording" : "Hold to record"}
                    >
                        <Mic size={32} className="text-white" />
                    </button>
                    <p className="text-[12px] text-text-muted font-medium text-center max-w-[240px]">
                        {isRecording ? "Release to stop recording" : "Hold the button and describe your job clearly."}
                    </p>
                </div>
            ) : (
                // Review Controls
                <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-[12px] text-text-muted font-medium text-center">
                        Review your recording before submitting. Use the visualizer above to play back.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={discardRecording}
                            className="flex-1 flex items-center justify-center gap-2 border border-accent rounded-2xl py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <Trash2 size={16} />
                            Discard
                        </button>
                        <button
                            onClick={transcribeVoice}
                            className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 text-sm font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Check size={16} />
                            Transcribe Voice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
