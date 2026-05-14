import { Outlet, Navigate } from "react-router-dom"
import useAuthStore from "@/lib/hooks/useAuthStore"

const ClientLayout = () => {
    const isAuth = useAuthStore((state) => state.isAuth)

    if (!isAuth) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen bg-slate-50 border border-accent">
            <main className="">
                <div className="">
                    <Outlet />
                </div>
            </main>

            <footer className="mt-auto border-t border-slate-200 py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Conance. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default ClientLayout

