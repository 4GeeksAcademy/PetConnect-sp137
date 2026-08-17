import { useNavigate } from "react-router-dom";

export const About = () => {
    const navigate = useNavigate();

    return (
        <main className="pc-about-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="pc-about-hero">

                <div className="pc-about-hero-content">
                    <span>ABOUT PET CONNECT</span>

                    <h1>
                        Connecting dogs
                        <br />
                        with loving homes.
                    </h1>

                    <p>
                        Pet Connect is a platform created to make dog adoption,
                        veterinary care and responsible pet ownership easier
                        and more accessible.
                    </p>
                </div>

            </section>


            {/* =========================================
                ABOUT US
            ========================================= */}

            <section className="pc-about-intro">

                <div className="pc-about-intro-image">
                    <img
                        src="/src/front/assets/img/images.jpg"
                        alt="Dog"
                    />
                </div>

                <div className="pc-about-intro-content">

                    <span>WHO WE ARE</span>

                    <h2>
                        More than adoption.
                        <br />
                        A complete connection.
                    </h2>

                    <p>
                        Pet Connect was created with a simple purpose:
                        to help dogs find the right home while connecting
                        people with the resources they need to take care
                        of their companions.
                    </p>

                    <p>
                        Our platform brings together adopters, shelters,
                        veterinarians and dog lovers in one place, creating
                        a safer and more responsible experience for everyone.
                    </p>

                </div>

            </section>


            {/* =========================================
                WHAT WE DO
            ========================================= */}

            <section className="pc-about-services">

                <div className="pc-section-heading">
                    <span>WHAT WE DO</span>

                    <h2>Everything dogs need.</h2>

                    <p>
                        Pet Connect brings the essential tools and services
                        together in one platform.
                    </p>
                </div>


                <div className="pc-about-services-grid">

                    <article className="pc-about-service-card">

                        <div className="pc-about-service-icon">
                            🐾
                        </div>

                        <h3>Responsible Adoption</h3>

                        <p>
                            We help people discover dogs that are looking
                            for a loving and responsible home.
                        </p>

                    </article>


                    <article className="pc-about-service-card">

                        <div className="pc-about-service-icon">
                            ♥
                        </div>

                        <h3>Veterinary Care</h3>

                        <p>
                            We connect pet owners with veterinary
                            professionals and help them manage their
                            pets' medical care.
                        </p>

                    </article>


                    <article className="pc-about-service-card">

                        <div className="pc-about-service-icon">
                            +
                        </div>

                        <h3>Dog Information</h3>

                        <p>
                            Discover dog breeds, characteristics and
                            information to help you find the right
                            companion for your lifestyle.
                        </p>

                    </article>

                </div>

            </section>


            {/* =========================================
                MISSION
            ========================================= */}

            <section className="pc-about-mission">

                <div className="pc-about-mission-content">

                    <span>OUR MISSION</span>

                    <h2>
                        Every dog deserves
                        <br />
                        a loving home.
                    </h2>

                    <p>
                        We believe technology can help create better
                        connections between people and animals.
                        Pet Connect is designed to make adoption more
                        responsible, pet care more accessible and the
                        journey of welcoming a dog into your family easier.
                    </p>

                </div>

            </section>


            {/* =========================================
                CTA
            ========================================= */}

            <section className="pc-about-cta">

                <div>

                    <span>FIND YOUR COMPANION</span>

                    <h2>
                        Ready to meet
                        <br />
                        your new best friend?
                    </h2>

                </div>

                <button
                    className="pc-main-button"
                    onClick={() => navigate("/sheltersView")}
                >
                    Explore adoption
                </button>

            </section>

        </main>
    );
};