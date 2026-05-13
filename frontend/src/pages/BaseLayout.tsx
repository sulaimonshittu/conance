

import { Outlet } from "react-router-dom"

const BaseLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[calc(100vh-8rem)] p-6">
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

export default BaseLayout

