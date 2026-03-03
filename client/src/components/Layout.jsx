import DashLayout from "./DashLayout";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();

    const isDashboard = location.pathname.startsWith("/dashboard");
    const isAuth = location.pathname === "/login" || location.pathname === "/register";
    return (
        <div className="min-h-screen bg-[#030a2a] select-none">
            {!isAuth && !isDashboard && <Navbar />}
            {isDashboard && <DashLayout /> }
            
            {!isDashboard && 
                <main className="">
                    <Outlet />
                </main>
            }
            {/* footer only on landing */}
            {!isDashboard && !isAuth && <Footer />}
        </div>
    );
}

export default Layout;
