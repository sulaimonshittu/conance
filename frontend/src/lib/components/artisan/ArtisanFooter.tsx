import { NavLink } from "react-router-dom"
import { LayoutDashboard, Inbox, Hammer, MessageSquare, DollarSign } from "lucide-react"

const NAV_ITEMS = [
    { name: "Dashboard", path: "/artisan", icon: LayoutDashboard },
    { name: "Requests", path: "/artisan/requests", icon: Inbox },
    { name: "My Work", path: "/artisan/work", icon: Hammer },
    { name: "Messages", path: "/artisan/chat", icon: MessageSquare },
    { name: "Earnings", path: "/artisan/earnings", icon: DollarSign },
]

const ArtisanFooter = () => {
    return (
        <footer className="fixed bottom-0 w-full max-w-[400px] bg-white border-t border-accent z-50">
            <nav className="flex justify-between items-center px-4 py-2 pb-3">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/artisan"}
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

export default ArtisanFooter