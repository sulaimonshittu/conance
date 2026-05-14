import { Tag, MapPin, DollarSign, FileText } from "lucide-react";
import type { JobDraft } from "@/lib/api/job.api";

interface JobSummaryProps {
    draft: JobDraft;
}

const JobSummary = ({ draft }: JobSummaryProps) => {
    const items = [
        { icon: Tag, label: "Category", value: draft.category || "Not detected" },
        { icon: MapPin, label: "Location", value: draft.location || "Not specified" },
        {
            icon: DollarSign,
            label: "Budget Range",
            value: draft.budgetMin > 0
                ? `₦${draft.budgetMin.toLocaleString()} – ₦${draft.budgetMax.toLocaleString()}`
                : "AI will estimate"
        },
    ];

    return (
        <div className="bg-white border border-accent/20 rounded-3xl p-s3 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-primary" />
                <h3 className="text-b2 font-bold text-gray-900">Job Summary</h3>
            </div>

            {/* Description Preview */}
            {draft.description && (
                <div className="bg-[#FAF7F2] rounded-2xl px-4 py-3 mb-4">
                    <p className="text-[13px] text-gray-700 font-medium leading-relaxed line-clamp-3">
                        {draft.description}
                    </p>
                </div>
            )}

            {/* Meta Items */}
            <div className="space-y-3">
                {items.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-xl">
                            <Icon size={16} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{label}</p>
                            <p className="text-b3 font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobSummary;
