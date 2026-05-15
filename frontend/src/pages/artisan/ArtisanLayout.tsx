

import { Outlet, Navigate } from "react-router-dom"
import useAuthStore from "@lib/hooks/useAuthStore"
import ArtisanFooter from "@/lib/components/artisan/ArtisanFooter"
import ClientArtisanNavbar from "@lib/components/ClientArtisanNavbar"

const ArtisanLayout = () => {
    const isAuth = useAuthStore((state) => state.isAuth)

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-slate-50 border border-accent">
            <ClientArtisanNavbar />
            <main className="py-s5 px-s2 bg-primary2/10">
                <div className="">
                    <Outlet />
                </div>
            </main>

            <ArtisanFooter />
        </div>
    )
}

export default ArtisanLayout

