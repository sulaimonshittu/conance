

import { Outlet } from "react-router-dom"

const BaseLayout = () => {
    return (
        <div className="min-h-screen border border-accent">
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

export default BaseLayout

