import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { UserNavbar } from "../components/UserNavbar"
import { Footer } from "../components/Footer"
import { Sidebar } from "../components/Sidebar"
import pawsImage from "../assets/img/paws.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Layout = () => {
    const { store } = useGlobalReducer();

    const isLoggedIn = Boolean(
        store.userAuth || 
        store.shelterAuth || 
        store.currentUser || 
        store.currentShelter || 
        localStorage.getItem("token") || 
        localStorage.getItem("sheltertoken")
    );

    return (
        <ScrollToTop>
            <div className="d-flex vh-100 overflow-hidden bg-paws">
                {isLoggedIn && <Sidebar />}
                <div className="d-flex flex-column flex-grow-1 overflow-y-auto">
                    {isLoggedIn ? <UserNavbar /> : <Navbar />}
                    <div className="flex-grow-1">
                        <Outlet />
                    </div>
                    {/*<Footer />*/}
                </div>
            </div>
        </ScrollToTop>
    )
}