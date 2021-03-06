import React, { Component } from "react";
import LazyLoad from "react-lazyload";
import _filter from "lodash/filter";
import _get from "lodash/get";
import { getAggregatedReviews, getPepperIcons, getRateCircles, mode, cleanGet, reviewToKey } from "./utils.js"

const Review = (props) => (
  <div key={reviewToKey(props.review)} className="text-center">
    <p>
      <i className="fas fa-quote-left px-2"/>
      <i className="pt-2">{props.review.review}</i>
      <i className="fas fa-quote-right px-2"/>
    </p>
  </div>
)


export default class MealReviewCard extends Component {
  render() {
  const { reviews } = this.props;
  const heat = mode(cleanGet(reviews, "heat"));
  const pepperIcons = getPepperIcons(heat)

  const aggregatedReviews = getAggregatedReviews(reviews);
  const filteredReviews = _filter(reviews, review => review.review.trim());
  const reviewsItems = filteredReviews.map(review => <Review key={reviewToKey(review)} review={review}/>);
  const tasteIcons = getRateCircles(aggregatedReviews.tasteScore);
  const imgSrc = _get(reviews.find(r => r.imageRef), "imageRef");
  
  return (
    <div className="d-flex flex-column align-items-center p-2 mx-2 mb-2" style={{position: "relative", width: 350, borderRadius: "10px", border: "4px solid whitesmoke", boxShadow: "2px 2px lightgrey"}}>
      <LazyLoad height={300} width={300} once>
        { imgSrc ? <img width={300} height={300} alt="" style={{zIndex: 1, borderRadius: "50%", overflow: "hidden", objectFit: "cover", position: "absolute", opacity: 0.2}} src={`https://pics.sthlmlunch.se/${imgSrc}`} /> : <></> }
        { imgSrc ? <img width={280} height={280} alt="" style={{zIndex: 10, borderRadius: "50%", margin: "10px 0 25px 0", border: "2px solid white"}} src={`https://pics.sthlmlunch.se/${imgSrc}`} /> : <></> }
      </LazyLoad>
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