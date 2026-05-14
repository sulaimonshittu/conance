import { Navigate } from "react-router-dom"
import useAuthStore from "@lib/hooks/useAuthStore"
import DirectToAuth from "@lib/components/home/onboarding/DirectToAuth"

const Home = () => {
    const { isAuth, role } = useAuthStore()

    if (isAuth) {
        if (role === "artisan") return <Navigate to="/artisan" replace />
        if (role === "client") return <Navigate to="/client" replace />
    }

    return (
        <section className="min-h-screen border border-accent">
            <DirectToAuth />
        </section>
    )
}

export default Home