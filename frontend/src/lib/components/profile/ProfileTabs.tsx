import { User, Shield, Briefcase, MapPin, Wallet } from "lucide-react"

export type ProfileTabId = "personal" | "professional" | "portfolio" | "locations" | "security" | "wallet"

interface ProfileTab {
    id: ProfileTabId
    label: string
    icon: any
}

interface ProfileTabsProps {
    active: ProfileTabId
    onTabChange: (id: ProfileTabId) => void
    isArtisan: boolean
}

const ProfileTabs = ({ active, onTabChange, isArtisan }: ProfileTabsProps) => {
    const tabs: ProfileTab[] = [
        { id: "personal", label: "Account", icon: User },
        ...(isArtisan ? [
            { id: "professional", label: "Professional", icon: Briefcase },
            { id: "portfolio", label: "Portfolio", icon: Briefcase }
        ] : []),
        { id: "locations", label: "Locations", icon: MapPin },
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "security", label: "Security", icon: Shield },
    ] as ProfileTab[]

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = active === tab.id
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-b3 font-bold transition-all ${
                            isActive 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-white text-text-muted hover:text-gray-900 border border-accent/50'
                        }`}
                    >
                        <Icon size={18} />
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}

export default ProfileTabs
