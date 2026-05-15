import { useState } from "react"
import { Loader2, Save } from "lucide-react"

interface ProfileFormProps {
    initialData: {
        name: string
        email: string
        bio?: string
        title?: string
    }
    isUpdating?: boolean
    onSave: (data: any) => void
    isArtisan?: boolean
}

const ProfileForm = ({ initialData, isUpdating, onSave, isArtisan }: ProfileFormProps) => {
    const [formData, setFormData] = useState(initialData)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-s3 rounded-3xl border border-accent/10 shadow-sm">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-accent p-3 rounded-2xl text-b3 font-medium outline-none focus:border-primary transition-colors"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-accent p-3 rounded-2xl text-b3 font-medium outline-none focus:border-primary transition-colors"
                />
            </div>

            {isArtisan && (
                <>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Professional Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Master Carpenter"
                            className="w-full bg-slate-50 border border-accent p-3 rounded-2xl text-b3 font-medium outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">About / Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-50 border border-accent p-3 rounded-2xl text-b3 font-medium outline-none focus:border-primary transition-colors resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </>
            )}

            <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
            >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isUpdating ? "Saving Changes..." : "Save Changes"}
            </button>
        </form>
    )
}

export default ProfileForm
