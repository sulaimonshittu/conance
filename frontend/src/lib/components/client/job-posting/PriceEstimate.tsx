import { TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import type { AIPricingEstimate } from "@/lib/api/job.api";

interface PriceEstimateProps {
    estimate: AIPricingEstimate;
    onRefresh?: () => void;
}

const PriceEstimate = ({ estimate, onRefresh }: PriceEstimateProps) => {
    return (
        <div className="bg-[#F0F4F2] p-s3 rounded-3xl border border-[#E5EDE9]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#3B7A5F]/10 rounded-xl">
                        <TrendingUp size={18} className="text-[#3B7A5F]" />
                    </div>
                    <h3 className="text-b2 font-bold text-[#3B7A5F]">AI Price Estimate</h3>
                </div>
                {onRefresh && (
                    <button onClick={onRefresh} className="p-2 hover:bg-[#3B7A5F]/10 rounded-xl transition-colors">
                        <RefreshCw size={16} className="text-[#3B7A5F]" />
                    </button>
                )}
            </div>

            {/* Range */}
            <div className="text-center mb-4">
                <p className="text-[11px] text-[#3B7A5F]/70 font-bold uppercase tracking-widest">Expected range</p>
                <p className="text-h3 font-bold text-gray-900 leading-tight">
                    ₦{estimate.min.toLocaleString()} – ₦{estimate.max.toLocaleString()}
                </p>
                <p className="text-[13px] text-[#3B7A5F] font-medium mt-1">
                    Typical: <strong>₦{estimate.typical.toLocaleString()}</strong>
                </p>
            </div>

            {/* Breakdown */}
            {estimate.breakdown.length > 0 && (
                <div className="bg-white/70 rounded-2xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Breakdown</p>
                    {estimate.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-[13px] text-gray-700 font-medium">{item.label}</span>
                            <span className="text-[13px] font-bold text-gray-900">₦{item.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-start gap-2 mt-3">
                <AlertCircle size={13} className="text-[#3B7A5F]/60 shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#3B7A5F]/70 font-medium">
                    Estimates are AI-generated and may vary based on artisan negotiation.
                </p>
            </div>
        </div>
    );
};

export default PriceEstimate;
