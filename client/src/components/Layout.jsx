import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet} from "react-router-dom";

function Layout() {

    return (
        <div className="min-h-screen bg-[#030a2a] select-none">
            <Navbar/>
            <main className="">
                <Outlet />
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;
