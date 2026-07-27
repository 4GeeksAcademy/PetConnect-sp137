import { Link, useActionData } from "react-router-dom";
import { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CardShelter = (props) => {
  //const { store, dispatch } = useGlobalReducer();
  //const [imageSrc, setImageSrc] = useState(`https://github.com/breatheco-de/swapi-images/blob/master/public/images/starships/${props.uid}.jpg?raw=true`);

  return (
    <div
      className="card mx-2 h-100"
      style={{ width: "15.6rem", minHeight: "15rem" }}>
      {/*<img src={rigoImageUrl} className="card-img-top" alt="..." style={{ width: "224px", height: "126px", objectFit: "cover" }} />*/}
      
{/*       <img
        src={imageSrc} 
        onError={() => setImageSrc('https://cdn1.vectorstock.com/i/1000x1000/32/45/no-image-symbol-missing-available-icon-gallery-vector-45703245.jpg')}
        className="card-img-top mt-3"
        alt="..."
        style={{ width: "224px", height: "200px", objectFit: "cover" }}/> */}

      <div className="card-body d-flex flex-column justify-content-between">
        <div style={{ minHeight: "80px" }}>
          <h5 className="card-title" style={{ fontSize: "1rem" }}>
            {props.name}
          </h5>
        </div>
        <div className="d-flex flex-column gap-2 mt-auto">
        </div>
      </div>
    </div>
  );
};
