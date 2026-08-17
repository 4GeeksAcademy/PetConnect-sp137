import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100 bg-paws-tile">

                <Navbar />

                <div className="flex-grow-1">
                    <Outlet />
                </div>

                <Footer />

            </div>
        </ScrollToTop>
    )
}