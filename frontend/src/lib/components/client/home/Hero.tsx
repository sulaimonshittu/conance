import { MapPin, Mic } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col gap-s3 px-s3 py-s3 bg-white">
            {/* Title & Subtitle */}
            <div className="flex flex-col gap-2">
                <h1 className="text-h3 font-bold text-gray-900 leading-tight tracking-tight font-heading">
                    Find trusted  artisans <br /> across  Lagos
                </h1>
                <p className="text-b3 text-text-muted font-medium font-body">
                    Verified work. Squad-secured escrow. <br />
                    Real reputation.
                </p>
            </div>

            {/* Location Bar */}
            <div className="flex items-center gap-3 bg-[#F4F4F5] rounded-full px-s3 py-2.5 border border-accent/20">
                <MapPin size={18} className="text-text-muted" />
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <span className="text-b3 font-bold text-gray-800">Lagos, Nigeria</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">
                            - Yaba, Surulere, Lekki & more
                        </span>
                    </div>
                </div>
            </div>

            {/* Post a Job Action Box */}
            <button
                onClick={() => navigate("/client/create-job")}
                className="flex items-center gap-s3 bg-primary p-s2 rounded-[20px] text-white text-left hover:bg-primary2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 group">
                <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Mic size={24} className="text-white" />
                </div>
                <div className="flex flex-col gap-0.5 font-heading">
                    <h2 className="text-b1 font-bold leading-tight font-heading">
                        Post a job  (speak or type)
                    </h2>
                    <p className="text-[12px] text-white/80 font-medium leading-tight font-body">
                        AI will structure it and find you the right artisans
                    </p>
                </div>
            </button>
        </div>
    )
}

export default Hero