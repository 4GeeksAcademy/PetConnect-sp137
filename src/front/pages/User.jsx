import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
//import { Link } from "react-router-dom";
import { CardUser } from "../components/CardUser.jsx";


export const User = () => {

const [user, setUser] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchUser = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

const handleDeleteUser = (id) => {
  setUser(prev => prev.filter(item => item.id !== id));
};


    useEffect(() => {
        fetchUser();
    }, []);



  return (
    <>
      <div>
        <div className="text-center bg-secondary-subtle text-dark w-100">
          <div className="container-fluid px-5 py-5">
            <h1 className="text-body-emphasis">Usuarios</h1>
                <div className="row g-5 justify-content-center">
                  {user.map((user, index) => (
                    <div className="col-auto" key={index}>
                    <CardUser 
                      id={user.id} 
                      //key={index}
                      key={user.id}
                      name={user.name}
                      legalDocument={user.legalDocument}
                      birthDate={user.birthDate} 
                      city={user.city} 
                      adress={user.adress} 
                      email={user.email} 
                      pc={user.pc} 
                      onDelete={handleDeleteUser} />
                    
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