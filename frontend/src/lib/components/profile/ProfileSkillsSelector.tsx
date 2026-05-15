import { useState, useRef, useEffect } from "react"
import { Search, X, Plus } from "lucide-react"

interface ProfileSkillsSelectorProps {
    currentSkills: string[]
    availableSkills: string[]
    onUpdate: (skills: string[]) => void
    isUpdating?: boolean
}

const ProfileSkillsSelector = ({ currentSkills, availableSkills, onUpdate, isUpdating }: ProfileSkillsSelectorProps) => {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filtered = availableSkills.filter(s => 
        s.toLowerCase().includes(search.toLowerCase()) && !currentSkills.includes(s)
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const toggleSkill = (skill: string) => {
        if (currentSkills.includes(skill)) {
            onUpdate(currentSkills.filter(s => s !== skill))
        } else {
            onUpdate([...currentSkills, skill])
            setSearch("")
        }
    }

    return (
        <div className="space-y-4" ref={dropdownRef}>
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Professional Skills</label>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {currentSkills.length} Selected
                </span>
            </div>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                {currentSkills.map(skill => (
                    <div 
                        key={skill} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-xl text-b3 font-bold animate-in zoom-in-95 duration-200"
                    >
                        {skill}
                        <button 
                            onClick={() => toggleSkill(skill)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                {currentSkills.length === 0 && (
                    <p className="text-b4 text-text-muted italic">No skills selected yet.</p>
                )}
            </div>

            {/* Search & Dropdown */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        value={search}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setIsOpen(true)
                        }}
                        placeholder="Search for skills..."
                        className="w-full bg-slate-50 border border-accent pl-10 pr-4 py-3 rounded-2xl text-b3 font-medium outline-none focus:border-primary transition-all"
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-accent rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200 scrollbar-hide">
                        {filtered.length > 0 ? (
                            <div className="p-2">
                                {filtered.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                    >
                                        <span className="text-b3 font-medium text-gray-700">{skill}</span>
                                        <Plus size={16} className="text-primary" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-b3 text-text-muted">
                                    {search ? `No skills matching "${search}"` : "All available skills selected"}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isUpdating && (
                <div className="flex items-center gap-2 text-[11px] text-primary font-bold animate-pulse">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Saving skills...
                </div>
            )}
        </div>
    )
}

export default ProfileSkillsSelector
