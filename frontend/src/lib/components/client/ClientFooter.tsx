import { NavLink } from "react-router-dom"
import { MapPin, MessageSquare, Briefcase, Wallet } from "lucide-react"

const NAV_ITEMS = [
    { name: "Discover", path: "/client", icon: MapPin },
    { name: "Messages", path: "/client/chat", icon: MessageSquare },
    { name: "Jobs", path: "/client/jobs", icon: Briefcase },
    { name: "Wallet", path: "/client/wallet", icon: Wallet },
]

const ClientFooter = () => {
    return (
        <footer className="fixed bottom-0 w-full max-w-[400px] bg-white border-t border-accent z-50">
            <nav className="flex justify-between items-center px-4 py-2 pb-3">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/client"}
                            className="flex-1"
                        >
                            {({ isActive }) => (
                                <div
                                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive
                                        ? "text-primary font-medium"
                                        : "text-text-muted font-normal hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[11px] leading-none">{item.name}</span>
                                </div>
                            )}
                        </NavLink>
                    )
                })}
            </nav>
        </footer>
    )
}

export default ClientFooter