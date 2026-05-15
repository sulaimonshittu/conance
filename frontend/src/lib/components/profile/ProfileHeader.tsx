import ProfileAvatar from "./ProfileAvatar"

interface ProfileHeaderProps {
    name: string
    title?: string
    role: "client" | "artisan"
    avatar?: string
    onAvatarUpload?: (file: File) => void
}

const ProfileHeader = ({ name, title, role, avatar, onAvatarUpload }: ProfileHeaderProps) => {
    return (
        <div className="bg-white p-s3 rounded-3xl border border-accent/10 shadow-sm flex flex-col items-center text-center gap-4">
            <ProfileAvatar src={avatar} name={name} onUpload={onAvatarUpload} />
            <div>
                <h1 className="text-h3 font-bold text-gray-900">{name}</h1>
                <p className="text-b3 font-medium text-text-muted">
                    {title || (role === "client" ? "Member" : "Artisan")}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-accent rounded-full">
                    <span className={`w-2 h-2 rounded-full ${role === 'artisan' ? 'bg-primary' : 'bg-green-500'}`} />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{role}</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
