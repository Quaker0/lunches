import React, { useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

export default function ReviewCard(props) {
  const { review, restaurantsMeta } = props;
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!review.pointer || !review.imageRef || imgError) return null
  
  const restaurantMeta = _.get(restaurantsMeta, review.pointer)
  if (!restaurantMeta) return null
  
  var restaurantRedirect = `/restaurant/${restaurantMeta.name.toLowerCase().trim()}`;

  return (
    <div className={"d-flex w-100 position-relative flex-wrap flex-row" + (show ? "fade-in": " invisible")} style={{borderRadius: "10px", border: "5px solid whitesmoke", boxShadow: "3px 3px lightgrey"}}>
      <div className="py-5" style={{paddingLeft: "4%", paddingRight: "6%"}}>
        <img onError={setImgError} onLoad={setShow} width={400} alt="meal-bg" style={{zIndex: -10, borderRadius: "50%", overflow: "hidden", objectFit: "cover", position: "absolute", opacity: 0.2}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${review.imageRef}.jpg`} />
        <img onError={setImgError} onLoad={setShow} width={380} alt="meal" style={{borderRadius: "50%", margin: "10px 0 0 10px", border: "4px solid white"}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${review.imageRef}.jpg`} />
      </div>
      <div className="d-flex flex-column justify-content-center" style={{paddingRight: "10%"}}>
        <div className="d-flex flex-row align-items-baseline pb-4 pt-2">
          <Link to={restaurantRedirect} className="pr-4"><h2 style={{fontVariant: "petite-caps"}}>{restaurantMeta.name}</h2></Link>
          <h3 className="font-weight-light px-5" style={{fontVariant: "all-petite-caps"}}>{review.meal}</h3> 
        </div>
        <p className="pb-4" style={{maxWidth: 600, fontVariant: "all-petite-caps", fontSize: "large"}}>{review.description}</p> 
      </div>  
    </div>
  );
}
