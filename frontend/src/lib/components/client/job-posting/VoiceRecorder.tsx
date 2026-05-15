import { Mic, RotateCcw, Check, AlertCircle } from "lucide-react";
import useVoiceRecording from "@/lib/hooks/useVoiceRecording";
import RecordingIndicator from "./RecordingIndicator";
import UploadState from "./UploadState";

const VoiceRecorder = () => {
    const {
        isRecording,
        audioUrl,
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
        <div className="flex flex-col items-center gap-6 py-6">
            {/* Waveform / Idle Indicator */}
            <RecordingIndicator
                isRecording={isRecording}
                formattedDuration={formattedDuration}
            />

            {/* Error */}
            {transcriptionError && (
                <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                    <AlertCircle size={18} className="text-error shrink-0 mt-0.5" />
                    <p className="text-[13px] text-red-700 font-medium">{transcriptionError}</p>
                </div>
            )}

            {/* Controls */}
            {!audioUrl ? (
                // Recording Controls
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
            ) : (
                // Review Controls
                <div className="flex flex-col items-center gap-4 w-full">
                    {/* Playback */}
                    <audio
                        src={audioUrl}
                        controls
                        className="w-full h-10 rounded-xl"
                    />

                    <p className="text-[12px] text-text-muted font-medium text-center">
                        Review your recording before submitting
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={discardRecording}
                            className="flex-1 flex items-center justify-center gap-2 border border-accent rounded-2xl py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <RotateCcw size={16} />
                            Re-record
                        </button>
                        <button
                            onClick={transcribeVoice}
                            className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 text-sm font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Check size={16} />
                            Use Recording
                        </button>
                    </div>
                </div>
            )}

            {!isRecording && !audioUrl && (
                <p className="text-[12px] text-text-muted font-medium text-center max-w-[240px]">
                    Hold the button and describe your job clearly. Release when done.
                </p>
            )}
        </div>
    );
};

export default VoiceRecorder;
