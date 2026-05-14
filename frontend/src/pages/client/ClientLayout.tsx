import { Outlet, Navigate } from "react-router-dom"
import useAuthStore from "@lib/hooks/useAuthStore"
import ClientFooter from "@lib/components/client/ClientFooter"
import ArtisanNavBar from "@lib/components/artisan/ArtisanNavBar"

const ClientLayout = () => {
    const isAuth = useAuthStore((state) => state.isAuth)

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-slate-50 border border-accent">
            <ArtisanNavBar />
            <main className="">
                <div className="">
                    <Outlet />
                </div>
            </main>

            <ClientFooter />
        </div>
    )
}

export default ClientLayout

