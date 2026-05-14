import useAuthStore from "@/lib/hooks/useAuthStore"
import { Briefcase, Inbox, TrendingUp, ShieldCheck, Sparkles } from "lucide-react"

const SUMMARY_DATA = [
    {
        title: "Active Jobs",
        value: "1",
        icon: Briefcase,
        iconBg: "bg-[#FFF3EE]",
        iconColor: "text-primary",
    },
    {
        title: "Pending",
        value: "3",
        icon: Inbox,
        iconBg: "bg-[#F0FDF4]", // light green
        iconColor: "text-[#15803d]", // dark green
    },
    {
        title: "This Month",
        value: "₦285,000",
        icon: TrendingUp,
        iconBg: "bg-[#FEF9C3]", // light yellow
        iconColor: "text-[#A16207]", // dark yellow
    },
    {
        title: "Trust Score",
        value: "96",
        suffix: "/100",
        icon: ShieldCheck,
        iconBg: "bg-[#FFF3EE]",
        iconColor: "text-primary",
        badge: {
            text: "Elite",
            icon: Sparkles,
        }
    }
]

const WelcomeArtisan = () => {
    const currentArtisan = useAuthStore((state) => state.userDetails)

    return (
        <section>
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-primary mb-s2">
                    Welcome back, {currentArtisan?.name?.split(' ')[0]}
                </h1>
                <p className="text-slate-500">
                    Here's what's happening with your work
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {SUMMARY_DATA.map((item, index) => {
                    const Icon = item.icon
                    const BadgeIcon = item.badge?.icon

                    return (
                        <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl ${item.iconBg} ${item.iconColor}`}>
                                    <Icon size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-b2 text-slate-500 font-medium">{item.title}</span>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="font-serif text-h2 font-extrabold text-gray-900 tracking-tight">{item.value}</span>
                                    {item.suffix && <span className="text-xs text-slate-400 font-medium">{item.suffix}</span>}
                                </div>
                                {item.badge && BadgeIcon && (
                                    <div className="mt-s2 inline-flex items-center gap-s1 px-s2 py-s1 bg-[#FEF9C3] text-[#A16207] rounded-full text-b1 font-bold">
                                        <BadgeIcon size={12} fill="currentColor" />
                                        <span className="uppercase tracking-wider">{item.badge.text}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default WelcomeArtisan