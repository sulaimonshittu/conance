import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_TOP_ARTISANS } from '@/lib/utils/mockData'
import {
    Star,
    ShieldCheck,
    Sparkles,
    ChevronLeft,
    MessageCircle,
    Zap,
    Briefcase,
    Clock,
    Award
} from 'lucide-react'

const ArtisanDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // Find artisan from mock data
    const artisan = MOCK_TOP_ARTISANS.find(a => a.id === id)

    if (!artisan) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] px-s4 text-center">
                <h2 className="text-h3 font-bold text-gray-900 mb-2">Artisan Not Found</h2>
                <p className="text-text-muted mb-6">The artisan you're looking for doesn't exist or has moved.</p>
                <button
                    onClick={() => navigate('/client')}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold"
                >
                    Back to Home
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pb-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent/10 px-s3 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-b1 font-bold text-gray-900">Artisan Profile</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Profile Hero */}
            <div className="px-s3 pt-s3 flex flex-col items-center text-center">
                <div className="relative">
                    <img
                        src={artisan.image}
                        alt={artisan.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-lg">
                        <ShieldCheck size={24} className="text-primary fill-primary/10" />
                    </div>
                </div>

                <h2 className="mt-4 text-h3 font-bold text-gray-900 flex items-center gap-2">
                    {artisan.name}
                </h2>
                <p className="text-b2 text-text-muted font-medium">{artisan.title}</p>

                {artisan.isElite && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-[#FEF9C3] text-[#854D0E] px-4 py-1.5 rounded-full border border-[#FEF08A]">
                        <Sparkles size={16} className="text-[#A16207]" />
                        <span className="text-[13px] font-bold tracking-tight uppercase">Elite Artisan</span>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 px-s3 mt-s4">
                <div className="bg-[#F8FAFC] p-3 rounded-2xl flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-primary">
                        <Star size={16} className="fill-primary" />
                        <span className="text-b2 font-bold">{artisan.rating}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Rating</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-2xl flex flex-col items-center gap-1">
                    <span className="text-b2 font-bold text-gray-900">{artisan.reviews}</span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Reviews</span>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-2xl flex flex-col items-center gap-1">
                    <span className="text-b2 font-bold text-gray-900">98%</span>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">On-Time</span>
                </div>
            </div>

            {/* Bio/Stats Section */}
            <div className="px-s3 mt-s4">
                <div className="bg-[#F0F4F2] p-4 rounded-3xl border border-[#E5EDE9]">
                    <div className="flex items-start gap-3">
                        <Zap size={20} className="text-[#3B7A5F] mt-1 shrink-0" />
                        <div>
                            <h3 className="text-b2 font-bold text-[#3B7A5F]">AI Performance Insights</h3>
                            <p className="text-[13px] text-[#3B7A5F]/80 font-medium mt-1 leading-relaxed">
                                {artisan.description || "This artisan is among the top 5% of service providers in Lagos with a perfect record of 0 disputes."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className=" w-full bg-white border-t border-accent/10 p-s3 flex gap-3">
                <button
                    onClick={() => navigate(`/client/chat?id=${artisan.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 border border-accent py-3.5 rounded-2xl font-bold text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
                >
                    <MessageCircle size={20} />
                    Chat
                </button>
                <button
                    onClick={() => navigate(`/client/create-job?artisanId=${artisan.id}`)}
                    className="flex-[2] bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    Hire {artisan.name}
                </button>
            </div>

            {/* Specialties/Skills */}
            <div className="px-s3 mt-s4">
                <h3 className="text-b1 font-bold text-gray-900 mb-3">Specialties & Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {artisan.skills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-[13px] font-bold border border-gray-200 shadow-sm"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Details */}
            <div className="px-s3 mt-s4 space-y-s3">
                <h3 className="text-b1 font-bold text-gray-900">Service Highlights</h3>

                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Briefcase size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-b2 font-bold text-gray-900">142+ Jobs Completed</p>
                        <p className="text-[12px] text-text-muted font-medium">Verified carpentry services across Lagos</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Clock size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-b2 font-bold text-gray-900">Typical response time</p>
                        <p className="text-[12px] text-text-muted font-medium">Usually replies within 5 minutes</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2.5 rounded-xl">
                        <Award size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-b2 font-bold text-gray-900">Certified Professional</p>
                        <p className="text-[12px] text-text-muted font-medium">Identity and skills verified by Conance</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ArtisanDetails