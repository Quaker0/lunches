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
	_.filter(reviews, review => review.review.trim()).forEach(review => reviewsItems.push(<div key={reviewToKey(review)}><p><i className="fas fa-quote-left"/><i className="pt-2">{review.review}</i><i className="fas fa-quote-right"/></p></div>));
	var tasteIcons = getRateCircles(aggregatedReviews.tasteScore)
  const imgSrc = _.find(reviews, r => r.imageRef).imageRef
	
	return (
		<div className="col-sm-6 col-xl-4 card-item">
			<h5 className="font-weight-bold">{reviews[0].meal.toUpperCase()}</h5>
				{ tasteIcons }
				{ pepperIcons }
			<p className="font-weight-light">{reviews[0].description}</p>
			{ reviewsItems }
      { imgSrc ? <img width={180} alt="meal" style={{borderRadius: "50%", display: "block", marginLeft: "auto", marginRight: "auto"}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${imgSrc}.jpg`} /> : <></> }
		</div>
	);
	}
}