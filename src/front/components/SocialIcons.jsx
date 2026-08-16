import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SocialIcons.css"; // estilos opcionales

const SocialIcons = ({
  linkedin = "https://www.linkedin.com/",
  github = "https://github.com/",
}) => {
  return (
    <section className="hgroup-right">
      <div className="social-icons clearfix">
        <ul className="list-unstyled d-flex gap-2 m-0 p-0">
          <li className="linkedin">
            <a
              href={linkedin}
              title="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>
          <li className="github">
            <a
              href={github}
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fab fa-github"></i>
            </a>
          </li>
          <li className="separator">|</li>
        </ul>
      </div>
    </section>
  );
};

export default SocialIcons;
