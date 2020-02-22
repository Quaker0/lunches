import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class RestaurantCard extends Component {
  	render() {
  		const { restaurant, reviews, aggregatedReviews} = this.props;
      if (!reviews.length) {
        return ""
      }
      const {tasteScore, envAvg, extrasAvg, innovationAvg, mostInnovation, bestTaste, mostValue, bestDate} = aggregatedReviews;
      const restaurantName = reviews[0].restaurant
      const redirect = `/restaurant/${restaurant}`;

    	return (
    		<div className="col-sm-12 col-md-6 col-xl-4 py-4">
          <div className="inline-block">
      			<Link to={redirect} className="h3 text-dark">{restaurantName}</Link>
            {mostInnovation && <i className="fas fa-pencil-ruler fa-sm p-1 pt-3" style={{float: "right", color:"sandybrown"}}/>}
            {mostValue && <i className="fas fa-award fa-sm p-1 pt-3" style={{float: "right", color:"mediumseagreen"}}/>}
            {bestTaste && <i className="fas fa-trophy fa-sm p-1 pt-3" style={{float: "right", color:"gold"}}/>}
            {bestDate && <i className="fas fa-heart fa-sm p-1 pt-3" style={{float: "right", color:"red"}}/>}
          </div>
          <div>Smak: {tasteScore>0 ? Math.round(tasteScore) + "/10" : "–"}</div>
          <div>Omgivning: {envAvg>0 ? Math.round(envAvg) + "/10" : "–"}</div>
          {extrasAvg>8 ? <div className="font-italic">+ Imponerande tillbehör</div> : extrasAvg>5 && <div className="font-italic">+ Bra tillbehör</div>}
          {innovationAvg>8 ? <div className="font-italic">+ Nytänkande</div> : innovationAvg>6 && <div className="font-italic">+ Maträtt som sticker ut</div>}
    		</div>
    	);
  	}
}