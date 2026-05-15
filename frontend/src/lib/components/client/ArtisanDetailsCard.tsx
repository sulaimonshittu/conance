import { useNavigate } from 'react-router-dom'
import { Star, MapPin, ShieldCheck, Sparkles } from 'lucide-react'

interface ArtisanDetailsCardProps {
    id: string
    name: string
    title: string
    description?: string // Map to the stats bar content in this design
    location: string // e.g. "0.8 km away"
    price: string // e.g. "3,500"
    image: string
    rating?: number
    reviews?: number
    isElite?: boolean
    jobsCompleted?: number
    onTimeRate?: string
}

const ArtisanDetailsCard: React.FC<ArtisanDetailsCardProps> = ({
    id,
    name,
    title,
    description = "Top match · 142 carpentry jobs in Yaba · 98% on-time · 0 disputes",
    location,
    price,
    image,
    rating = 4.9,
    reviews = 127,
    isElite = true,
}) => {
    const navigate = useNavigate()

    return (
        <div 
            onClick={() => navigate(`/client/artisan-details/${id}`)}
            className="bg-white p-s3 rounded-3xl shadow-sm border border-accent/10 flex flex-col gap-4 max-w-[400px] cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
        >
            {/* Header: Avatar and Info */}
            <div className="flex gap-4">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex flex-col gap-1 justify-center">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-[19px] font-bold text-gray-900 tracking-tight leading-none">
                            {name}
                        </h3>
                        <ShieldCheck size={18} className="text-primary fill-primary/10" />
                    </div>
                    <p className="text-b3 text-text-muted font-medium leading-none">
                        {title}
                    </p>
                    {isElite && (
                        <div className="mt-1 flex">
                            <div className="bg-[#FEF9C3] text-[#854D0E] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#FEF08A]">
                                <Sparkles size={14} className="text-[#A16207]" />
                                <span className="text-[12px] font-bold tracking-tight">Elite</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-[#F0F4F2] px-4 py-3 rounded-2xl flex items-start gap-3 border border-[#E5EDE9]">
                <Sparkles size={18} className="text-[#3B7A5F] mt-0.5 shrink-0" />
                <p className="text-[13px] text-[#3B7A5F] font-medium leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Meta: Rating & Location */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star size={20} className="text-primary fill-primary" />
                    <span className="text-b2 font-bold text-gray-900">{rating}</span>
                    <span className="text-b3 text-text-muted font-medium">({reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                    <MapPin size={18} />
                    <span className="text-b3 font-medium">{location}</span>
                </div>
            </div>

            <hr className="border-accent/30" />

            {/* Pricing Section */}
            <div className="flex items-center justify-between pt-1">
                <span className="text-b2 text-text-muted font-medium tracking-tight">
                    Starting at
                </span>
                <div className="flex items-baseline text-primary">
                    <span className="text-h4 font-bold tracking-tighter">₦{price}</span>
                    <span className="text-b3 font-bold ml-0.5">/hr</span>
                </div>
            </div>
        </div>
    )
}

export default ArtisanDetailsCard
