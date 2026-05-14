import ArtisanDetailsCard from '@/lib/components/client/ArtisanDetailsCard'

const SearchForArtisan = () => {
    // Mock data for demonstration
    const artisans = [
        {
            name: "Tunde Adeyemi",
            title: "Master Carpenter",
            location: "0.8 km away",
            price: "3,500",
            image: "https://i.pravatar.cc/150?u=tunde",
            rating: 4.9,
            reviews: 127,
            isElite: true
        },
        {
            name: "Sarah Okoro",
            title: "Professional Painter",
            location: "1.2 km away",
            price: "2,800",
            image: "https://i.pravatar.cc/150?u=sarah",
            rating: 4.8,
            reviews: 89,
            isElite: false
        }
    ]

    return (
        <div className="flex flex-col gap-s3 p-s3 bg-slate-50 min-h-screen">
            <h1 className="text-h3 font-bold text-gray-900 mt-4 px-2">
                Top artisans for you
            </h1>

            <div className="flex flex-col gap-s3 pb-24">
                {artisans.map((artisan, index) => (
                    <ArtisanDetailsCard
                        key={index}
                        {...artisan}
                        description={index === 0 ? undefined : "Great match · 45 painting jobs nearby · 95% on-time"}
                    />
                ))}
            </div>
        </div>
    )
}

export default SearchForArtisan
