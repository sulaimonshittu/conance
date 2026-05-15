import logo from "@/assets/ConanceLogo.png"
import { ChevronDown, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@lib/hooks/useAuth"

const ClientArtisanNavBar = () => {
    const { user, logout, isLoading, role } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 bg-white z-50 shadow-sm flex justify-between items-center px-s3 py-2 border-b border-accent">
            <div className="flex items-center gap-2">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <span className="font-serif text-xl font-bold text-primary">Conance</span>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
                >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} />
                        )}
                    </div>
                    <span className="text-b3 font-bold text-gray-700 hidden sm:block">
                        {user?.name || "User"}
                    </span>
                    <ChevronDown size={16} className={`text-text-muted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-accent z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-s2 border-b border-accent bg-slate-50/50">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Signed in as</p>
                                <p className="text-b2 font-bold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-b4 font-medium text-text-muted truncate">{user?.email}</p>
                            </div>
                            
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        const profilePath = role === "artisan" ? "/artisan/profile" : "/client/profile"
                                        window.location.href = profilePath 
                                    }}
                                    className="w-full flex items-center gap-3 px-s2 py-s2 text-gray-700 hover:bg-slate-50 transition-colors text-b3 font-bold rounded-xl"
                                >
                                    <User size={18} className="text-primary" />
                                    My Profile
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        logout()
                                    }}
                                    disabled={isLoading}
                                    className="w-full flex items-center gap-3 px-s2 py-s2 text-error hover:bg-red-50 transition-colors text-b3 font-bold disabled:opacity-50 rounded-xl"
                                >
                                    <LogOut size={18} />
                                    {isLoading ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default ClientArtisanNavBar