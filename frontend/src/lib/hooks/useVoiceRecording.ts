import { useRef, useEffect, useCallback } from "react";
import useJobPostingStore from "./useJobPostingStore";
import { toast } from "sonner";

/**
 * useVoiceRecording
 * Abstracts MediaRecorder logic from components.
 * Connects recording state to the Zustand store.
 */
const useVoiceRecording = () => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {
        isRecording,
        audioBlob,
        audioUrl,
        recordingDuration,
        isTranscribing,
        transcriptionError,
        setIsRecording,
        setAudioBlob,
        setRecordingDuration,
        clearAudio,
        transcribeVoice,
    } = useJobPostingStore();

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob, url);
                stream.getTracks().forEach((t) => t.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Duration timer
            timerRef.current = setInterval(() => {
                setRecordingDuration(useJobPostingStore.getState().recordingDuration + 1);
            }, 1000);
        } catch (err) {
            toast.error("Microphone access denied. Please allow microphone permissions.");
        }
    }, [setIsRecording, setAudioBlob, setRecordingDuration]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [setIsRecording]);

    const discardRecording = useCallback(() => {
        clearAudio();
        setRecordingDuration(0);
    }, [clearAudio, setRecordingDuration]);

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return {
        isRecording,
        audioBlob,
        audioUrl,
        recordingDuration,
        formattedDuration: formatDuration(recordingDuration),
        isTranscribing,
        transcriptionError,
        startRecording,
        stopRecording,
        discardRecording,
        transcribeVoice,
    };
};

export default useVoiceRecording;
