import { Mic, Check, AlertCircle, Trash2, Send, Loader2 } from "lucide-react";
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
        isSubmitting,
        transcriptionError,
        submissionError,
        startRecording,
        stopRecording,
        discardRecording,
        transcribeVoice,
        submitVoiceJob,
    } = useVoiceRecording();

    // Full-screen overlay during transcription
    if (isTranscribing) {
        return <UploadState message="Transcribing your voice..." />;
    }

    // Full-screen overlay during direct voice job posting
    if (isSubmitting) {
        return <UploadState message="Posting your voice job..." />;
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

                {/* Timer Overlay */}
                <div className="absolute top-4 right-6 flex items-center gap-2">
                    {isRecording && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                    <span
                        className={`font-mono text-sm font-bold ${
                            isRecording ? "text-primary" : "text-text-muted"
                        }`}
                    >
                        {formattedDuration}
                    </span>
                </div>
            </div>

            {/* Error States */}
            {(transcriptionError || submissionError) && (
                <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                    <AlertCircle size={18} className="text-error shrink-0 mt-0.5" />
                    <p className="text-[13px] text-red-700 font-medium">
                        {transcriptionError || submissionError}
                    </p>
                </div>
            )}

            {/* Controls */}
            {!recordedBlob ? (
                // ── Recording Controls ──────────────────
                <div className="flex flex-col items-center gap-4">
                    <button
                        onMouseDown={startRecording}
                        onTouchStart={startRecording}
                        onMouseUp={stopRecording}
                        onTouchEnd={stopRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 ${
                            isRecording
                                ? "bg-red-500 shadow-red-500/30 animate-pulse scale-110"
                                : "bg-primary shadow-primary/30 hover:bg-primary2"
                        }`}
                        aria-label={isRecording ? "Stop recording" : "Hold to record"}
                    >
                        <Mic size={32} className="text-white" />
                    </button>
                    <p className="text-[12px] text-text-muted font-medium text-center max-w-[240px]">
                        {isRecording
                            ? "Release to stop recording"
                            : "Hold the button and describe your job clearly."}
                    </p>
                </div>
            ) : (
                // ── Review Controls ─────────────────────
                <div className="flex flex-col items-center gap-4 w-full">
                    <p className="text-[12px] text-text-muted font-medium text-center">
                        Recording ready. Choose how to proceed:
                    </p>

                    {/* Discard */}
                    <button
                        onClick={discardRecording}
                        className="w-full flex items-center justify-center gap-2 border border-accent rounded-2xl py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Trash2 size={16} />
                        Discard & Re-record
                    </button>

                    {/* Transcribe → edit in text tab */}
                    <button
                        onClick={transcribeVoice}
                        className="w-full flex items-center justify-center gap-2 border border-primary text-primary rounded-2xl py-3.5 text-sm font-bold hover:bg-primary/5 transition-all active:scale-95"
                    >
                        <Check size={16} />
                        Transcribe to Text
                    </button>

                    {/* Post directly as voice job */}
                    <button
                        onClick={submitVoiceJob}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 text-sm font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                        Post Voice Job Directly
                    </button>

                    <p className="text-[11px] text-text-muted text-center max-w-[260px] leading-relaxed">
                        <strong>Transcribe to Text</strong> lets you review &amp; edit before posting.
                        <br />
                        <strong>Post Directly</strong> lets our AI structure and post it instantly.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
