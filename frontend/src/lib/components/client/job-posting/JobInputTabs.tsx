import { Mic, Keyboard } from "lucide-react";

interface JobInputTabsProps {
    activeTab: "voice" | "text";
    onChange: (tab: "voice" | "text") => void;
}

const JobInputTabs = ({ activeTab, onChange }: JobInputTabsProps) => {
    const tabs: { id: "voice" | "text"; label: string; Icon: typeof Mic }[] = [
        { id: "voice", label: "Voice", Icon: Mic },
        { id: "text", label: "Type", Icon: Keyboard },
    ];

    return (
        <div className="bg-white border border-accent/20 p-1.5 rounded-2xl flex gap-1 shadow-sm">
            {tabs.map(({ id, label, Icon }) => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        activeTab === id
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-text-muted hover:text-gray-900"
                    }`}
                >
                    <Icon size={16} />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default JobInputTabs;
