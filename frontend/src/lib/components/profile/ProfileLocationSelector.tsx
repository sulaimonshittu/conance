import { useState } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import type { ProfileLocation } from '../../api/profile.api'

interface ProfileLocationSelectorProps {
    locations: ProfileLocation[]
    onChange: (locations: ProfileLocation[]) => void
}

const NIGERIAN_STATES = ["Lagos", "Abuja", "Rivers", "Kano", "Oyo"] // Mock list

const ProfileLocationSelector = ({ locations, onChange }: ProfileLocationSelectorProps) => {
    const [isAdding, setIsAdding] = useState(false)
    const [newLoc, setNewLoc] = useState<Partial<ProfileLocation>>({
        state: "", city: "", lga: "", address: "", isPrimary: false
    })

    const handleAdd = () => {
        if (newLoc.state && newLoc.city && newLoc.address) {
            const updated = [...locations, { ...newLoc, id: Date.now().toString(), isPrimary: locations.length === 0 } as ProfileLocation]
            onChange(updated)
            setIsAdding(false)
            setNewLoc({ state: "", city: "", lga: "", address: "", isPrimary: false })
        }
    }

    const handleRemove = (id: string) => {
        const updated = locations.filter(l => l.id !== id)
        if (updated.length > 0 && !updated.some(l => l.isPrimary)) {
            updated[0].isPrimary = true
        }
        onChange(updated)
    }

    const setPrimary = (id: string) => {
        const updated = locations.map(l => ({ ...l, isPrimary: l.id === id }))
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-b2 font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    Saved Locations
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-primary hover:bg-primary/5 p-1 rounded-lg transition-colors flex items-center gap-1 text-b3 font-bold"
                >
                    <Plus size={16} />
                    Add New
                </button>
            </div>

            <div className="grid gap-3">
                {locations.map((loc) => (
                    <div key={loc.id} className={`p-4 rounded-2xl border transition-all ${loc.isPrimary ? 'border-primary bg-primary/5' : 'border-accent bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-b3 font-bold text-gray-900">{loc.address}</p>
                                    {loc.isPrimary && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Primary</span>}
                                </div>
                                <p className="text-b4 text-text-muted">{loc.city}, {loc.lga}, {loc.state} State</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!loc.isPrimary && (
                                    <button onClick={() => setPrimary(loc.id)} className="text-b4 font-bold text-primary hover:underline">Set Primary</button>
                                )}
                                <button onClick={() => handleRemove(loc.id)} className="text-error hover:bg-red-50 p-2 rounded-xl transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-accent space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">State</label>
                            <select
                                value={newLoc.state}
                                onChange={e => setNewLoc({ ...newLoc, state: e.target.value })}
                                className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                            >
                                <option value="">Select State</option>
                                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">City</label>
                            <input
                                type="text"
                                value={newLoc.city}
                                onChange={e => setNewLoc({ ...newLoc, city: e.target.value })}
                                placeholder="e.g. Lekki"
                                className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">LGA</label>
                        <input
                            type="text"
                            value={newLoc.lga}
                            onChange={e => setNewLoc({ ...newLoc, lga: e.target.value })}
                            placeholder="e.g. Eti-Osa"
                            className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Street Address</label>
                        <input
                            type="text"
                            value={newLoc.address}
                            onChange={e => setNewLoc({ ...newLoc, address: e.target.value })}
                            placeholder="e.g. 123 Admiralty Way"
                            className="w-full bg-white border border-accent p-2.5 rounded-xl text-b3 font-medium outline-none"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-b3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleAdd} className="flex-1 py-3 bg-primary text-white text-b3 font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">Save Location</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileLocationSelector
