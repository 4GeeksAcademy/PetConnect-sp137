import teamMember1 from "../assets/img/4907123354456755493.jpg";
import teamMember2 from "../assets/img/4907123354456755494.jpg";
import teamMember3 from "../assets/img/4909375154270440534.jpg";

const teamMembers = [
    {
        name: "Sergi Villalobos Gascón",
        role: "Full Stack Developer",
        image: teamMember1,
        github: "https://github.com/Sergidev",
    },
    {
        name: "Pascual March Merino",
        role: "Full Stack Developer",
        image: teamMember2,
        github: "https://github.com/FullPas",
    },
    {
        name: "Paula Nataly Zuluaga Sanchez",
        role: "Full Stack Developer",
        image: teamMember3,
        github: "https://github.com/Nataly-04",
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

                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pc-team-github"
                                >
                                    GitHub →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

            </section>
        </main>
    );
};
