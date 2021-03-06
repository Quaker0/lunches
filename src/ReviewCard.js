import React, { useState } from "react";
import LazyLoad, { forceVisible } from "react-lazyload";
import { Link } from "react-router-dom";
import FastAverageColor from "fast-average-color";


export default function ReviewCard(props) {
  const { review, restaurantsMeta, idx } = props;
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [themeColor, setThemeColor] = useState(false);

  if (imgError) return null;

  function onLoad(e) {
    const fac = new FastAverageColor();
    const color = fac.getColor(e.target);
    setThemeColor(color)
    setShow(true);
  }

  if (idx < 2) {
    forceVisible()
  }

  const restaurantMeta = restaurantsMeta[review.pointer];
  var restaurantRedirect = `/restaurant/${restaurantMeta.name.toLowerCase().trim()}`;

  return (
    <LazyLoad style={{width: "100%"}} height={500} once>
      <div className={"meal-row" + (show ? " fade-in": " invisible")} style={{border: "8px solid whitesmoke"}}>
        <div className="py-5 meal-logos">
          <img crossOrigin="anonymous" onError={setImgError} onLoad={onLoad} alt="meal-bg" className="meal-logo-bg-lg" style={{zIndex: -10, borderRadius: "50%", overflow: "hidden", objectFit: "cover", position: "absolute", opacity: 0.2}} src={`https://pics.sthlmlunch.se/${review.imageRef}`} />
          <img crossOrigin="anonymous" onError={setImgError} onLoad={onLoad} alt="meal" className="meal-logo-lg" style={{borderRadius: "50%", border: "4px solid white"}} src={`https://pics.sthlmlunch.se/${review.imageRef}`} />
        </div>
        <div className="d-flex flex-column justify-content-center pr-3">
          <div className="d-flex flex-row align-items-baseline pb-4 pt-2 meal-header-text">
            <Link to={restaurantRedirect} className="pr-3 custom-hover restaurant-name"><h2 style={{fontVariant: "petite-caps", color: themeColor.hex}}>{restaurantMeta.name}</h2></Link>
            <h3 className="font-weight-light pl-3" style={{fontVariant: "all-petite-caps"}}>{review.meal}</h3> 
          </div>
          <p className="pb-4" style={{maxWidth: 800, fontVariant: "all-petite-caps"}}>{review.description}</p> 
        </div>  
      </div>
    </LazyLoad>
  );
}
