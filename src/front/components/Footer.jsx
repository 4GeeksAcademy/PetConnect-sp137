import petConnectLogo from "../assets/img/pet-connect-navbar.png";

export const Footer = () => {
        return (
                <footer className="pc-footer">
                        <div className="pc-footer-main">

                                {/* BRAND */}
                                <div className="pc-footer-brand">
                                        <div className="pc-footer-logo">
                                                <img
                                                        src={petConnectLogo}
                                                        alt="Pet Connect"
                                                        className="pc-footer-logo-image"
                                                />
                                        </div>

                                        <p className="pc-footer-description">
                                                Connecting dogs with loving homes and better care.
                                        </p>

                                        <div className="pc-footer-contact">
                                                <p>
                                                        <strong>Email:</strong>{" "}
                                                        hello@petconnect.com
                                                </p>
                                                <p>
                                                        <strong>Location:</strong>{" "}
                                                        Madrid, Spain
                                                </p>
                                        </div>
                                </div>

                                {/* INFORMATION */}
                                <div className="pc-footer-column">
                                        <h3>Information</h3>

                                        <ul>
                                                <li>
                                                        <a href="/about">About Pet Connect</a>
                                                </li>
                                                <li>
                                                        <a href="/adoption">Adoption</a>
                                                </li>
                                                <li>
                                                        <a href="/breed">Dog Breeds</a>
                                                </li>
                                                <li>
                                                        <a href="/veterinariansView">
                                                                Veterinary Care
                                                        </a>
                                                </li>
                                                <li>
                                                        <a href="/sheltersView">Shelters</a>
                                                </li>
                                        </ul>
                                </div>

                                {/* CUSTOMER SERVICE */}
                                <div className="pc-footer-column">
                                        <h3>Customer service</h3>

                                        <ul>
                                                <li>
                                                        <a href="/profile">My Account</a>
                                                </li>
                                                <li>
                                                        <a href="/contact">Contact Us</a>
                                                </li>
                                                <li>
                                                        <a href="/faq">FAQ's</a>
                                                </li>
                                                <li>
                                                        <a href="/adoption">Adoption Process</a>
                                                </li>
                                                <li>
                                                        <a href="/help">Help Center</a>
                                                </li>
                                        </ul>
                                </div>

                                {/* NEWSLETTER */}
                                <div className="pc-footer-newsletter">
                                        <h3>Subscribe to our newsletter!</h3>

                                        <p>
                                                Sign up for updates about adoption, dog care
                                                and our Pet Connect community.
                                        </p>

                                        <form
                                                className="pc-newsletter-form"
                                                onSubmit={(event) => event.preventDefault()}
                                        >
                                                <input
                                                        type="email"
                                                        placeholder="Your email address"
                                                        aria-label="Your email address"
                                                />

                                                <button type="submit" aria-label="Subscribe">
                                                        →
                                                </button>
                                        </form>

                                        <p className="pc-footer-newsletter-note">
                                                Stay connected with Pet Connect.
                                        </p>
                                </div>

                        </div>

                        {/* COPYRIGHT */}
                        <div className="pc-footer-bottom">
                                <p>
                                        © {new Date().getFullYear()} Pet Connect.
                                        <span> All rights reserved.</span>
                                </p>
                        </div>
                </footer>
        );
};