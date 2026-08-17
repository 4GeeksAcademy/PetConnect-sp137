import teamMember1 from "../assets/img/4907123354456755493.jpg";
import teamMember2 from "../assets/img/4907123354456755494.jpg";
import teamMember3 from "../assets/img/4909375154270440534.jpg";

const teamMembers = [
    {
        name: "Sergi Villalobos Gascón",
        role: "Full Stack Developer",
        image: teamMember1,
        github: "https://github.com/Sergidev",
        linkedin: "https://www.linkedin.com/in/sergi-villalobos-gasc%C3%B3n-791278192/?locale=es",
    },
    {
        name: "Pascual March Merino",
        role: "Full Stack Developer",
        image: teamMember2,
        github: "https://github.com/FullPas",
        linkedin: "http://www.linkedin.com/in/pascual-m-37666b19b",
    },
    {
        name: "Paula Nataly Zuluaga Sánchez",
        role: "Full Stack Developer",
        image: teamMember3,
        github: "https://github.com/Nataly-04",
        linkedin: "https://www.linkedin.com/in/paula-nataly-zuluaga-s%C3%A1nchez-609607227?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    },
];

export const Team = () => {
    return (
        <main className="pc-team-page">
            <section className="pc-team-section">

                <div className="pc-section-heading">
                    <span>OUR TEAM</span>

                    <h1>Meet Our Team</h1>

                    <p>
                        The people behind Pet Connect, working together
                        to connect dogs with loving homes.
                    </p>
                </div>

                <div className="pc-team-grid">
                    {teamMembers.map((member, index) => (
                        <article
                            className="pc-team-card"
                            key={index}
                        >
                            <div className="pc-team-image">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                    />
                                ) : (
                                    <div className="pc-team-placeholder">
                                        Photo coming soon
                                    </div>
                                )}
                            </div>

                            <div className="pc-team-content">
                                <h2>{member.name}</h2>

                                <p>{member.role}</p>

                                <div className="pc-team-socials">

                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pc-team-social"
                                    >
                                        <i className="fa-brands fa-github"></i>
                                        <span>GitHub</span>
                                    </a>

                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pc-team-social"
                                    >
                                        <i className="fa-brands fa-linkedin-in"></i>
                                        <span>LinkedIn</span>
                                    </a>

                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </section>
        </main>
    );
};
