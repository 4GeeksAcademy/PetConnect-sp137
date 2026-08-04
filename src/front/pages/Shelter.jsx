import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ShelterCard } from "../components/ShelterCard.jsx";
import { useNavigate } from "react-router-dom"


export const Shelter = () => {

  const [shelter, setShelter] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()
  const { store } = useGlobalReducer();

  const fetchShelter = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/shelter`);
      if (response.ok) {
        const data = await response.json();
        setShelter(data);
      }
    } catch (error) {
      console.error("Error fetching shelters:", error);
    }
  };

  const handleDeleteShelter = (id) => {
    setShelter(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchShelter();
  }, []);

  if (!store.adminUserAuth) {
    return (
      <div className="container mt-4">
        <p>Private Admin</p>
      </div>
    );
  }

  return (
    <>

      <div>
        <div className="text-center bg-secondary-subtle text-dark w-100">
          <div className="container-fluid px-5 py-5 ">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="m-0">Refugios</h1>
              <button className="btn btn-primary" onClick={() => navigate("/ShelterCreate")}> + Crear shelter</button>
            </div>
            <div className="row g-5 justify-content-center">
              {shelter.map((shelter, index) => (
                <div className="col-auto" key={index}>
                  <ShelterCard
                    id={shelter.id}
                    //key={index}
                    key={shelter.id}
                    name={shelter.name}
                    city={shelter.city}
                    cif={shelter.cif}
                    address={shelter.address}
                    email={shelter.email}
                    password={shelter.password}
                    pc={shelter.pc}
                    iconUrl={shelter.iconUrl}
                    onDelete={handleDeleteShelter} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Link to="/">
          <span className="btn btn-primary btn-lg" href="#" role="button">Back home</span>
        </Link>
      </div>
    </>
  );
};