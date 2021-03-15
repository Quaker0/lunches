import React, { Component } from "react";
import _ from "lodash";
import { getAggregatedReviews, getPepperIcons, getRateCircles, mode, cleanGet, reviewToKey } from "./utils.js"


export default class MealReviewCard extends Component {
  render() {
  const { reviews } = this.props;
  const heat = mode(cleanGet(reviews, "heat"));
  const pepperIcons = getPepperIcons(heat)

  const aggregatedReviews = getAggregatedReviews(reviews);
  let reviewsItems = [];
  _.filter(reviews, review => review.review.trim()).forEach(review => reviewsItems.push(<div key={reviewToKey(review)} className="text-center"><p><i className="fas fa-quote-left px-2"/><i className="pt-2">{review.review}</i><i className="fas fa-quote-right px-2"/></p></div>));
  var tasteIcons = getRateCircles(aggregatedReviews.tasteScore);
  const imgSrc = _.get(_.find(reviews, r => r.imageRef), "imageRef");
  
  return (
    <div className="d-flex flex-column align-items-center p-2 mx-2 mb-2" style={{position: "relative", width: 350, borderRadius: "10px", border: "4px solid whitesmoke", boxShadow: "2px 2px lightgrey"}}>
    { imgSrc ? <img width={300} height={300} alt="" style={{zIndex: 1, borderRadius: "50%", overflow: "hidden", objectFit: "cover", position: "absolute", opacity: 0.2}} src={`https://pics.sthlmlunch.se/${imgSrc}`} /> : <></> }
    { imgSrc ? <img width={280} height={280} alt="" style={{zIndex: 10, borderRadius: "50%", margin: "10px 0 25px 0", border: "2px solid white"}} src={`https://pics.sthlmlunch.se/${imgSrc}`} /> : <></> }
      <h5 style={{fontVariant: "petite-caps"}}>{reviews[0].meal.toUpperCase()}</h5>
      { tasteIcons }
      <div className="d-flex p-2">
        { pepperIcons }
      </div>
      <p className="font-weight-light text-center" style={{fontVariant: "all-petite-caps"}}>{reviews[0].description}</p>
      { reviewsItems }
    </div>
  );
  }
}