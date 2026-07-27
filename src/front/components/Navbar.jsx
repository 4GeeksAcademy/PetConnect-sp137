import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>

				<div className="d-flex align-items-center gap-2">
					<Link to="/pets">
						<button className="btn btn-primary">Pets</button>
					</Link>
					<Link to="/breed">
						<button className="btn btn-primary">Breed</button>
					</Link>
					<Link to="/shelter">
						<button className="btn btn-primary">Shelter</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};