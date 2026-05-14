import logo from "@/assets/ConanceLogo.png"
import { ChevronDown } from "lucide-react"
const ArtisanNavBar = () => {
    return (
        <header className="sticky top-0 bg-white z-50 shadow-sm flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-2">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <span className="font-serif text-xl font-bold text-primary">Conance</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <span>Name</span>
                    <ChevronDown />
                </div>
            </div>
        </header>
    )
}

export default ArtisanNavBar