import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const ShelterCardCheck = (props) => {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [shelters, setShelters] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPets, resBreeds, resShelters] = await Promise.all([
          fetch(`${backendUrl}/api/pets`),
          fetch(`${backendUrl}/api/breed`),
          fetch(`${backendUrl}/api/shelter`)
        ]);

        if (resPets.ok) setPets(await resPets.json());
        if (resBreeds.ok) setBreeds(await resBreeds.json());
        if (resShelters.ok) setShelters(await resShelters.json());
      } catch (error) {
        console.error("Error fetching data for shelter check:", error);
      }
    };

    fetchData();
  }, [backendUrl]);

  const shelterPets = pets.filter(
    (pet) => Number(pet.shelter_id || pet.idShelter) === Number(props.id)
  );

  return (
    <div className="card mb-4 shadow-sm w-100">
      <img
        src="https://www.mdzol.com/u/fotografias/m/2022/10/26/f768x1-1305623_1305750_79.jpg"
        className="card-img-top"
        alt="..."
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title text-center">{props.name}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item"><strong>City:</strong> {props.city}</li>
        <li className="list-group-item"><strong>Address:</strong> {props.address}</li>
        <li className="list-group-item"><strong>Postal Code:</strong> {props.pc}</li>
        <li className="list-group-item"><strong>CIF:</strong> {props.cif}</li>
        <li className="list-group-item"><strong>Email:</strong> {props.email}</li>
      </ul>

      <div className="card-body border-top bg-light w-100">
        <h6 className="mb-3 text-center">Associated Pets</h6>
        {shelterPets.length === 0 ? (
          <p className="text-center text-muted mb-0">No pets assigned to this shelter.</p>
        ) : (
          <div className="container-fluid px-0">
            <div className="row g-3">
              {shelterPets.map((pet) => {
                const foundBreed = breeds.find((b) => b.id === pet.breed_id);
                const breedName = foundBreed ? foundBreed.breedName : "Not specified";

                const foundShelter = shelters.find((s) => s.id === (pet.shelter_id || pet.idShelter));
                const shelterName = foundShelter ? foundShelter.name : "Not assigned";

                return (
                  <div className="col-12 col-sm-6 col-lg-2" key={pet.id}>
                    <div className="card h-100 shadow-sm border d-flex flex-column">
                      {pet.photoUrl && (
                        <img
                          src={pet.photoUrl}
                          className="card-img-top"
                          alt={pet.name}
                          style={{ height: "140px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body p-2 flex-grow-1">
                        <h6 className="card-title text-center mb-2">{pet.name}</h6>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Breed:</strong> {breedName}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Shelter:</strong> {shelterName}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Gender:</strong> {pet.genre}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Size:</strong> {pet.size}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Color:</strong> {pet.color}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Chip:</strong> {pet.chipNumber || "No chip"}</p>
                        <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}><strong>Birth:</strong> {pet.birthDate ? pet.birthDate.split("T")[0] : "Unknown"}</p>
                        <p className="card-text mb-2" style={{ fontSize: "0.85rem" }}><strong>Castrated:</strong> {pet.castrated ? "Yes" : "No"}</p>
                      </div>
                      <div className="card-footer bg-transparent p-2 border-0">
                        <Link to="/adopt-as-user" state={{ pet }} className="btn btn-primary btn-sm w-100">
                          Adopt
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};