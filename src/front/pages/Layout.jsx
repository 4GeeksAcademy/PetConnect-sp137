import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Sidebar } from "../components/Sidebar"
import { UserNavbar } from "../components/UserNavbar"

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex vh-100 overflow-hidden bg-paws-tile">
                <Sidebar />
                <div className="d-flex flex-column flex-grow-1 overflow-y-auto">
                    {/*<Navbar />*/}
                    <UserNavbar />
                    <div className="flex-grow-1">
                        <Outlet />
                    </div>
                    {/*<Footer />*/}
                </div>
            </div>
        </ScrollToTop>
    )
}