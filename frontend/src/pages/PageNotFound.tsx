import { useNavigate } from "react-router-dom"
import Button from "@lib/components/common/Button"
import { Home, Compass } from "lucide-react"

const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <section className="min-h-screen bg-[#FFF3EE] flex flex-col items-center justify-center px-s4 py-s5 text-center">
            <div className="flex flex-col items-center gap-s3 max-w-md animate-fade-in">
                <div className="bg-white p-6 rounded-full shadow-lg text-primary mb-s2">
                    <Compass size={64} strokeWidth={1.5} />
                </div>
                
                <h1 className="text-8xl md:text-9xl font-extrabold text-primary opacity-30 drop-shadow-sm">
                    404
                </h1>
                
                <div className="-mt-8 md:-mt-10 z-10 flex flex-col gap-2">
                    <h2 className="text-h2 font-bold text-gray-900">
                        Lost your way?
                    </h2>
                    <p className="text-text-muted text-b2 mt-s2 mb-s5 px-4">
                        We can't seem to find the page you're looking for. It might have been removed, renamed, or is temporarily unavailable.
                    </p>
                    
                    <div className="w-full mt-s4">
                        <Button 
                            onClick={() => navigate("/")} 
                            fullWidth 
                            variant="primary" 
                            className="flex justify-center items-center gap-2 py-3"
                        >
                            <Home size={20} />
                            Take Me Home
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageNotFound