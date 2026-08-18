import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const ShelterCardCheck = (props) => {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [shelters, setShelters] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const defaultImage =
    "https://via.placeholder.com/600x400?text=Shelter";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPets, resBreeds, resShelters] = await Promise.all([
          fetch(`${backendUrl}/api/pets`),
          fetch(`${backendUrl}/api/breed`),
          fetch(`${backendUrl}/api/shelter`)
        ]);

        if (resPets.ok) {
          setPets(await resPets.json());
        }

        if (resBreeds.ok) {
          setBreeds(await resBreeds.json());
        }

        if (resShelters.ok) {
          setShelters(await resShelters.json());
        }
      } catch (error) {
        console.error(
          "Error fetching data for shelter check:",
          error
        );
      }
    };

    fetchData();
  }, [backendUrl]);

  const shelterPets = pets.filter(
    (pet) =>
      Number(pet.shelter_id || pet.idShelter) === Number(props.id)
  );

  const currentShelter = shelters.find(
    (shelter) => Number(shelter.id) === Number(props.id)
  );

  const shelterImageUrl =
    props.iconUrl ||
    props.icon_url ||
    currentShelter?.iconUrl ||
    currentShelter?.icon_url ||
    defaultImage;

  return (
    <article className="pc-shelter-list-card">

      <div className="pc-shelter-list-image">
        <img
          src={shelterImageUrl}
          alt={props.name || "Shelter"}
          onError={(event) => {
            event.currentTarget.src = defaultImage;
          }}
        />
      </div>

      <div className="pc-shelter-list-content">

        <h2>{props.name}</h2>

        <p className="pc-shelter-location">
          {props.city || "Location not available"}
        </p>

        <div className="pc-shelter-details">

          <div>
            <strong>Address</strong>
            <span>{props.address || "Not available"}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{props.email || "Not available"}</span>
          </div>

          <div>
            <strong>Postal Code</strong>
            <span>{props.pc || "Not available"}</span>
          </div>

        </div>

      </div>

      <div className="pc-shelter-pets">

        <div className="pc-shelter-pets-header">
          <h3>Available dogs</h3>
          <span>{shelterPets.length}</span>
        </div>

        {shelterPets.length === 0 ? (
          <p className="pc-no-pets">
            No dogs currently available.
          </p>
        ) : (
          <div className="pc-shelter-pets-grid">

            {shelterPets.map((pet) => {

              const foundBreed = breeds.find(
                (breed) => breed.id === pet.breed_id
              );

              const breedName = foundBreed
                ? foundBreed.breedName
                : "Not specified";

              return (
                <div
                  className="pc-shelter-pet"
                  key={pet.id}
                >

                  <img
                    src={
                      pet.photoUrl ||
                      pet.photo_url ||
                      defaultImage
                    }
                    alt={pet.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        defaultImage;
                    }}
                  />

                  <div className="pc-shelter-pet-info">

                    <h4>{pet.name}</h4>

                    <p>{breedName}</p>

                    <Link
                      to="/adopt-as-user"
                      state={{ pet }}
                      className="pc-shelter-adopt-btn"
                    >
                      Adopt
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </article>
  );
};