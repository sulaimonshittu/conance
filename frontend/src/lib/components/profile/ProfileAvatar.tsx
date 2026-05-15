import { Camera } from "lucide-react"

interface ProfileAvatarProps {
    src?: string
    name: string
    onUpload?: (file: File) => void
    editable?: boolean
}

const ProfileAvatar = ({ src, name, onUpload, editable = true }: ProfileAvatarProps) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0] && onUpload) {
            onUpload(e.target.files[0])
        }
    }

    return (
        <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {src ? (
                    <img src={src} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
                )}
            </div>
            {editable && (
                <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary2 transition-all active:scale-90">
                    <Camera size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                </label>
            )}
        </div>
    )
}

export default ProfileAvatar
