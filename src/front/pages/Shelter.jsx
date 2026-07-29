import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
//import { Link } from "react-router-dom";
import { CardShelter } from "../components/CardShelter.jsx";





export const Shelter = () => {
  //const { store, dispatch } = useGlobalReducer();

  /* useEffect(() => {
  async function getData() {
    const [resShelter] = await Promise.all([
      fetch("https://special-space-garbanzo-6666w7r6jp399g-3001.app.github.dev/admin/shelter/"),

    ]);

    const [shelter] = await Promise.all([
      resShelter.json(),
    ]);

    dispatch({
      type: "load_data",
      payload: {
        nuevoShelter: shelter.results,
      },
    });
  }

  getData();
}, []); */

const [shelter, setShelter] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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



  return (
    <>
      <div>
        <div className="text-center bg-secondary-subtle text-dark w-100">
          <div className="container-fluid px-5 py-5">
            <h1 className="text-body-emphasis">Refugios</h1>
                <div className="row g-5 justify-content-center">
                  {shelter.map((shelter, index) => (
                    <div className="col-auto" key={index}>
                    <CardShelter 
                      id={shelter.id} 
                      //key={index}
                      key={shelter.id}
                      name={shelter.name} 
                      city={shelter.city} 
                      CIF={shelter.CIF} 
                      adress={shelter.adress} 
                      email={shelter.email} 
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