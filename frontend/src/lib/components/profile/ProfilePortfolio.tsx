import { Plus, Trash2, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import type { PortfolioItem } from "../../api/profile.api"

interface ProfilePortfolioProps {
    items: PortfolioItem[]
    onAdd: (item: Omit<PortfolioItem, "id">) => void
    onRemove: (id: string) => void
}

const ProfilePortfolio = ({ items, onAdd, onRemove }: ProfilePortfolioProps) => {
    const [isAdding, setIsAdding] = useState(false)
    const [newItem, setNewItem] = useState({ title: "", description: "", image: "" })

    const handleAdd = () => {
        if (newItem.title && newItem.image) {
            onAdd(newItem)
            setIsAdding(false)
            setNewItem({ title: "", description: "", image: "" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-b2 font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    Portfolio
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-primary hover:bg-primary/5 p-1 rounded-lg transition-colors flex items-center gap-1 text-b3 font-bold"
                >
                    <Plus size={16} />
                    Add Work
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-accent overflow-hidden group relative">
                        <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                        <div className="p-3">
                            <h4 className="text-b4 font-bold text-gray-900 truncate">{item.title}</h4>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-error rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-accent space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Project Title</label>
                        <input
                            type="text"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="e.g. Modern Bookshelf"
                            className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Image URL</label>
                        <input
                            type="text"
                            value={newItem.image}
                            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                            placeholder="Paste image link here"
                            className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-b3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleAdd} className="flex-1 py-3 bg-primary text-white text-b3 font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">Add to Portfolio</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePortfolio
