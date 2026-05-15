import { useRef } from 'react'

const CATEGORIES = [
    'All',
    'Carpentry',
    'Plumbing',
    'Tailoring',
    'Welding',
    'Pottery',
    'Electrical',
    'Painting',
    'Metalwork',
    'Ceramics',
    'Hairdressing',
    'Beauty',
    'Mechanics',
    'Generator Repair',
]

interface SliderFilterProps {
    selected: string
    onChange: (category: string) => void
}

const SliderFilter = ({ selected, onChange }: SliderFilterProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-1 px-s3 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {CATEGORIES.map((cat) => {
                const isActive = selected === cat
                return (
                    <button
                        key={cat}
                        onClick={() => onChange(cat)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 ${
                            isActive
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'bg-[#F5F0EA] text-gray-600 hover:bg-[#EDE8E0]'
                        }`}
                    >
                        {cat}
                    </button>
                )
            })}
        </div>
    )
}

export default SliderFilter