import { useNavigate } from "react-router-dom";

export const Contact = () => {
    const navigate = useNavigate();

    return (
        <main className="pc-contact-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="pc-contact-hero">

                <div className="pc-contact-hero-content">
                    <span>GET IN TOUCH</span>

                    <h1>Contact Pet Connect</h1>

                    <p>
                        Have a question, need help or want to learn more
                        about Pet Connect? We would love to hear from you.
                    </p>
                </div>

            </section>


            {/* =========================================
                CONTACT CONTENT
            ========================================= */}

            <section className="pc-contact-section">

                <div className="pc-contact-info">

                    <span>CONTACT US</span>

                    <h2>
                        We are here
                        <br />
                        to help.
                    </h2>

                    <p>
                        Whether you are looking to adopt a dog, need
                        veterinary information or want to learn more
                        about our platform, feel free to contact us.
                    </p>


                    <div className="pc-contact-details">

                        <div className="pc-contact-detail">
                            <div className="pc-contact-icon">
                                ✉
                            </div>

                            <div>
                                <h3>Email</h3>
                                <p>hello@petconnect.com</p>
                            </div>
                        </div>


                        <div className="pc-contact-detail">
                            <div className="pc-contact-icon">
                                ●
                            </div>

                            <div>
                                <h3>Location</h3>
                                <p>Madrid, Spain</p>
                            </div>
                        </div>


                        <div className="pc-contact-detail">
                            <div className="pc-contact-icon">
                                ♥
                            </div>

                            <div>
                                <h3>Community</h3>
                                <p>Dogs, shelters and pet lovers</p>
                            </div>
                        </div>

                    </div>

                </div>


                {/* =========================================
                    FORM
                ========================================= */}

                <div className="pc-contact-form-container">

                    <form
                        className="pc-contact-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                    >

                        <div className="pc-contact-form-row">

                            <div className="pc-contact-field">
                                <label htmlFor="name">
                                    Your name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    required
                                />
                            </div>


                            <div className="pc-contact-field">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Your email address"
                                    required
                                />
                            </div>

                        </div>


                        <div className="pc-contact-field">
                            <label htmlFor="subject">
                                Subject
                            </label>

                            <input
                                id="subject"
                                type="text"
                                placeholder="How can we help?"
                                required
                            />
                        </div>


                        <div className="pc-contact-field">
                            <label htmlFor="message">
                                Message
                            </label>

                            <textarea
                                id="message"
                                rows="6"
                                placeholder="Write your message..."
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            className="pc-main-button"
                        >
                            Send message
                        </button>

                    </form>

                </div>

            </section>


            {/* =========================================
                CTA
            ========================================= */}

            <section className="pc-contact-cta">

                <div>
                    <span>LOOKING FOR A COMPANION?</span>

                    <h2>
                        Your new best friend
                        <br />
                        may be waiting for you.
                    </h2>
                </div>

                <button
                    className="pc-main-button"
                    onClick={() => navigate("/sheltersView")}
                >
                    Find a dog
                </button>

            </section>

        </main>
    );
};
