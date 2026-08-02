import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { UserCard } from "../components/UserCard.jsx";
import { useNavigate } from "react-router-dom"

export const User = () => {

const [user, setUser] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="m-0">Usuarios</h1>
              <button className="btn btn-primary" onClick={() => navigate("/userCreate")}> + Crear user</button>
            </div>
                <div className="row g-5 justify-content-center">
                  {user.map((user, index) => (
                    <div className="col-auto" key={index}>
                    <UserCard 
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