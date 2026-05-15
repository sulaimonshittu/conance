import { Search } from "lucide-react"

interface ChatSearchProps {
    value: string
    onChange: (val: string) => void
}

const ChatSearch = ({ value, onChange }: ChatSearchProps) => {
    return (
        <div className="px-s3 py-s2 border-b border-accent/30 bg-white sticky top-0 z-10">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full bg-[#FAF7F2] border border-[#F1E9DA] rounded-full py-2.5 pl-10 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0D3D34]/10 transition-shadow text-gray-900 placeholder:text-gray-400"
                />
            </div>
        </div>
    )
}

export default ChatSearch
