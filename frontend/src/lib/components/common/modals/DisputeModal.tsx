import { useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { disputesApi } from "@/lib/api/disputes.api";

interface DisputeModalProps {
    jobId: string;
    openerId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

/**
 * DisputeModal
 * Allows either party (client or artisan) to open a dispute for a job.
 * On success, shows a confirmation and calls onSuccess.
 */
const DisputeModal = ({ jobId, openerId, onClose, onSuccess }: DisputeModalProps) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim() || reason.trim().length < 20) {
            toast.error("Please describe the issue in at least 20 characters.");
            return;
        }

        setIsSubmitting(true);
        const res = await disputesApi.openDispute(jobId, openerId, reason.trim());
        setIsSubmitting(false);

        if (res.success) {
            setSubmitted(true);
            onSuccess?.();
        } else {
            toast.error(res.message || "Failed to open dispute.");
        }
    };

    return (
        <div className="bg-white rounded-t-[2rem] p-s3 flex flex-col gap-s3 min-h-[60vh]">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-50 rounded-xl">
                        <AlertTriangle size={22} className="text-warning" />
                    </div>
                    <div>
                        <h2 className="text-b1 font-bold text-gray-900 leading-tight">Open a Dispute</h2>
                        <p className="text-[12px] text-text-muted font-medium">AI mediator will review within 24h</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-text-muted" />
                </button>
            </div>

            {submitted ? (
                /* ── Success State ──────────────────────────── */
                <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                        <ShieldCheck size={32} className="text-success" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-b1 font-bold text-gray-900 mb-1">Dispute Submitted</h3>
                        <p className="text-b3 text-text-muted max-w-[260px] leading-relaxed">
                            Our AI mediator will review your case and propose a fair resolution within 24 hours.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary2 transition-all active:scale-95"
                    >
                        Done
                    </button>
                </div>
            ) : (
                /* ── Form State ─────────────────────────────── */
                <>
                    {/* Info banner */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
                        <p className="text-[12px] text-orange-800 font-medium leading-relaxed">
                            Only open a dispute if you cannot resolve the issue directly with the other party.
                            Funds remain in escrow until the dispute is resolved.
                        </p>
                    </div>

                    {/* Reason input */}
                    <div>
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                            Describe the issue *
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. The artisan left before completing the work. The pipe is still leaking and I cannot reach them..."
                            rows={5}
                            className="w-full bg-gray-50 border border-accent/50 rounded-2xl px-4 py-3 text-b3 font-medium text-gray-900 placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-warning/30 focus:border-warning/50 transition-all resize-none"
                        />
                        <p className={`text-[11px] mt-1 text-right font-medium ${reason.length < 20 && reason.length > 0 ? "text-error" : "text-text-muted"}`}>
                            {reason.length} / 20 min chars
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || reason.trim().length < 20}
                        className="w-full flex items-center justify-center gap-2 bg-warning text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-warning/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <AlertTriangle size={18} />
                        )}
                        {isSubmitting ? "Submitting..." : "Open Dispute"}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full text-b3 text-text-muted font-bold hover:text-gray-900 py-2 transition-colors"
                    >
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
};

export default DisputeModal;
