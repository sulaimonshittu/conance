import { useEffect, useState } from "react"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import useProfileStore from "../../hooks/useProfileStore"
import useWalletStore from "../../hooks/useWalletStore"
import ProfileHeader from "./ProfileHeader"
import ProfileTabs, { type ProfileTabId } from "./ProfileTabs"
import ProfileForm from "./ProfileForm"
import ProfileLocationSelector from "./ProfileLocationSelector"
import ProfilePortfolio from "./ProfilePortfolio"
import EarningsSummary from "../artisan/artisan-earning/EarningsSummary"
import WalletSummary from "../client/wallet/Summary"

interface RoleBasedProfileLayoutProps {
    role: "client" | "artisan"
}

const RoleBasedProfileLayout = ({ role }: RoleBasedProfileLayoutProps) => {
    const { 
        profile, 
        isLoading, 
        fetchProfile, 
        updateProfile, 
        updateLocations, 
        addPortfolio, 
        removePortfolio,
        isUpdating,
        error
    } = useProfileStore()
    
    const { summary, fetchSummary } = useWalletStore()
    const [activeTab, setActiveTab] = useState<ProfileTabId>("personal")

    useEffect(() => {
        fetchProfile(role)
        fetchSummary()
    }, [role, fetchProfile, fetchSummary])

    if (isLoading && !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="text-primary animate-spin" />
                <p className="mt-4 text-b3 font-bold text-text-muted">Loading your profile...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-s3 text-center">
                <div className="p-4 bg-red-50 rounded-full text-error mb-4">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-h4 font-bold text-gray-900">Oops! Something went wrong</h2>
                <p className="mt-2 text-b3 text-text-muted">{error}</p>
                <button 
                    onClick={() => fetchProfile(role)}
                    className="mt-6 px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="max-w-2xl mx-auto space-y-s3 px-s3 py-s4 pb-24">
            <ProfileHeader 
                name={profile.name} 
                role={role} 
                title={"title" in profile ? profile.title : undefined}
                avatar={profile.avatar}
            />

            <ProfileTabs 
                active={activeTab} 
                onTabChange={setActiveTab} 
                isArtisan={role === "artisan"} 
            />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "personal" && (
                    <ProfileForm 
                        initialData={{ 
                            name: profile.name, 
                            email: profile.email,
                            bio: "bio" in profile ? profile.bio : "",
                            title: "title" in profile ? profile.title : ""
                        }} 
                        isUpdating={isUpdating}
                        onSave={updateProfile}
                        isArtisan={role === "artisan"}
                    />
                )}

                {activeTab === "professional" && role === "artisan" && (
                    <div className="space-y-6">
                        <div className="bg-white p-s3 rounded-3xl border border-accent/10 shadow-sm space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Professional Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {("skills" in profile ? profile.skills : []).map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-slate-50 border border-accent rounded-xl text-b3 font-bold text-gray-700 hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-accent/50 space-y-2">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Experience Level</label>
                                <p className="text-b2 font-bold text-gray-900">{"experience" in profile ? profile.experience : "Not set"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "portfolio" && role === "artisan" && (
                    <ProfilePortfolio 
                        items={"portfolio" in profile ? profile.portfolio : []} 
                        onAdd={addPortfolio} 
                        onRemove={removePortfolio} 
                    />
                )}

                {activeTab === "locations" && (
                    <div className="space-y-2">
                        <ProfileLocationSelector 
                            locations={profile.locations} 
                            onChange={updateLocations} 
                        />
                    </div>
                )}

                {activeTab === "wallet" && (
                    <div className="space-y-s3 animate-in fade-in zoom-in-95 duration-300">
                        {role === "artisan" ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-b2 font-bold text-gray-900">Earnings Summary</h3>
                                </div>
                                <EarningsSummary />
                            </div>
                        ) : (
                            summary && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-b2 font-bold text-gray-900">Wallet Summary</h3>
                                    </div>
                                    <WalletSummary 
                                        escrow={summary.escrow}
                                        released={summary.released}
                                        balance={summary.balance}
                                        accountDetails={summary.accountDetails}
                                    />
                                </div>
                            )
                        )}
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="bg-white p-s3 rounded-3xl border border-accent/10 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-b1 font-bold text-gray-900">Security & Account</h3>
                            <p className="text-b4 text-text-muted mt-1">Manage your password and account preferences.</p>
                        </div>
                        
                        <div className="space-y-3">
                            <button className="w-full text-left px-5 py-4 rounded-2xl border border-accent hover:bg-slate-50 hover:border-primary/30 transition-all flex justify-between items-center group active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <span className="text-b3 font-bold text-gray-700">Change Password</span>
                                </div>
                                <span className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all">→</span>
                            </button>
                            
                            <button className="w-full text-left px-5 py-4 rounded-2xl border border-accent hover:bg-red-50 hover:border-red-200 text-error transition-all flex justify-between items-center group active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                        <AlertCircle size={20} />
                                    </div>
                                    <span className="text-b3 font-bold">Delete Account</span>
                                </div>
                                <span className="group-hover:translate-x-1 transition-all">→</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoleBasedProfileLayout
