import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export const UserCardMatchPets = (pet) => {
  const [pets, setPets] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUserMatch();
  }, []);

  const fetchUserMatch = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/pets`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleSwipe = (liked) => {
    setDirection(liked ? 1 : -1);

    setTimeout(() => {
      if (index < pets.length - 1) {
        setIndex(index + 1);
      } else {
        alert("No hay más mascotas");
      }
    }, 600);
  };

  if (pets.length === 0) {
    return <p>Cargando mascotas...</p>;
  }

  const currentPet = pets[index];

  return (
    <div className="d-flex justify-content-center mt-4">
      <AnimatePresence>
        <motion.div
          key={currentPet.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            x: direction * 800,
            opacity: 0,
            rotate: direction * 50,
            transition: { duration: 1.5 }
          }}
          className="card"
          style={{ width: "22rem" }}>
          {currentPet.photoUrl ? (
            <img
              src={currentPet.photoUrl}
              className="card-img-top"
              alt={currentPet.name}
            />
          ) : (
            <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded mx-auto" style={{ height: "110px", width: "110px" }}>
              <small>No Photo</small>
            </div>
          )}
          <div className="card-body text-center">
            <h5 className="card-title">{currentPet.name}</h5>
            <p className="card-text">{currentPet.breed}</p>

            <div className="d-flex justify-content-around mt-3">
              <button
                className="btn btn-danger"
                onClick={() => handleSwipe(false)}
              >
                👎
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleSwipe(true)}
              >
                👍
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

