import { MapPin, Tag } from "lucide-react";
import useJobPostingStore from "@/lib/hooks/useJobPostingStore";

const CATEGORIES = [
    "Carpentry", "Plumbing", "Electrical", "Painting",
    "Masonry", "Tiling", "Welding", "Tailoring", "Cleaning", "Other"
];

const TextJobForm = () => {
    const { draft, updateDraft } = useJobPostingStore();

    return (
        <div className="flex flex-col gap-4">
            {/* Job Description */}
            <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                    Describe the job *
                </label>
                <textarea
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                    placeholder="e.g. I need someone to fix my leaking bathroom pipe and replace the shower head..."
                    rows={5}
                    className="w-full bg-white border border-accent/50 rounded-2xl px-4 py-3 text-b3 font-medium text-gray-900 placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
                <p className="text-[11px] text-text-muted mt-1 text-right">
                    {draft.description.length} characters
                </p>
            </div>

            {/* Job Title */}
            <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                    Job Title (optional)
                </label>
                <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="e.g. Bathroom Plumbing Repair"
                    className="w-full bg-white border border-accent/50 rounded-2xl px-4 py-3 text-b3 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            {/* Category */}
            <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                    <Tag size={12} className="inline mr-1" />
                    Category
                </label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => updateDraft({ category: cat })}
                            className={`px-4 py-2 rounded-xl text-[13px] font-bold border transition-all ${
                                draft.category === cat
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white border-accent/50 text-text-muted hover:border-primary/40 hover:text-primary"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="text-[12px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                    <MapPin size={12} className="inline mr-1" />
                    Location
                </label>
                <input
                    type="text"
                    value={draft.location}
                    onChange={(e) => updateDraft({ location: e.target.value })}
                    placeholder="e.g. Yaba, Lagos"
                    className="w-full bg-white border border-accent/50 rounded-2xl px-4 py-3 text-b3 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>
        </div>
    );
};

export default TextJobForm;
