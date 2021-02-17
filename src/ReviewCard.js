import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ReviewCard(props) {
  const { review, restaurantsMeta, imageKeys } = props;
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (imgError) return null;
  
  const restaurantMeta = restaurantsMeta[review.pointer];
  var restaurantRedirect = `/restaurant/${restaurantMeta.name.toLowerCase().trim()}`;

  return (
    <div className={"meal-row" + (show ? " fade-in": " invisible")} style={{border: "8px solid whitesmoke"}}>
      <div className="py-5 meal-logos">
        <img onError={setImgError} onLoad={setShow} alt="meal-bg" className="meal-logo-bg-lg" style={{zIndex: -10, borderRadius: "50%", overflow: "hidden", objectFit: "cover", position: "absolute", opacity: 0.2}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${review.imageRef}.jpg`} />
        <img onError={setImgError} onLoad={setShow} alt="meal" className="meal-logo-lg" style={{borderRadius: "50%", border: "4px solid white"}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${review.imageRef}.jpg`} />
      </div>
      <div className="d-flex flex-column justify-content-center">
        <div className="d-flex flex-row align-items-baseline pb-4 pt-2 meal-header-text">
          <Link to={restaurantRedirect} className="pr-3"><h2 style={{fontVariant: "petite-caps"}}>{restaurantMeta.name}</h2></Link>
          <h3 className="font-weight-light pl-3" style={{fontVariant: "all-petite-caps"}}>{review.meal}</h3> 
        </div>
        <p className="pb-4" style={{maxWidth: 600, fontVariant: "all-petite-caps"}}>{review.description}</p> 
      </div>  
    </div>
  );
}
