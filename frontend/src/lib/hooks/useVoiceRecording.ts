import { useEffect } from "react";
import { useVoiceVisualizer } from "react-voice-visualizer";
import useJobPostingStore from "./useJobPostingStore";

/**
 * useVoiceRecording
 * Wraps useVoiceVisualizer and connects it to the Zustand store.
 * Exposes both transcribeVoice (text mode) and submitVoiceJob (direct voice posting).
 */
const useVoiceRecording = () => {
    const recorderControls = useVoiceVisualizer();
    const {
        recordedBlob,
        isRecordingInProgress,
        recordingTime,
        startRecording,
        stopRecording,
        clearCanvas,
    } = recorderControls;

    const {
        isTranscribing,
        isSubmitting,
        transcriptionError,
        submissionError,
        setAudioBlob,
        setIsRecording,
        setRecordingDuration,
        clearAudio,
        transcribeVoice,
        submitVoiceJob,
    } = useJobPostingStore();

    // Sync isRecording state
    useEffect(() => {
        setIsRecording(isRecordingInProgress);
    }, [isRecordingInProgress, setIsRecording]);

    // Sync recording duration
    useEffect(() => {
        setRecordingDuration(recordingTime);
    }, [recordingTime, setRecordingDuration]);

    // Sync recorded blob to store when recording stops
    useEffect(() => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            setAudioBlob(recordedBlob, url);
        }
    }, [recordedBlob, setAudioBlob]);

    const discardRecording = () => {
        clearCanvas();
        clearAudio();
        setRecordingDuration(0);
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return {
        recorderControls,
        isRecording: isRecordingInProgress,
        recordedBlob,
        formattedDuration: formatDuration(recordingTime),
        isTranscribing,
        isSubmitting,
        transcriptionError,
        submissionError,
        startRecording,
        stopRecording,
        discardRecording,
        transcribeVoice,
        submitVoiceJob,
    };
};

export default useVoiceRecording;
