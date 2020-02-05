import React, { Component } from 'react';
import _ from 'lodash';

function aggregateReviews(reviews) {
  const scores = ["taste_score", "environment_score", "extras_score", "innovation_score"];
  var agg = {};
  scores.forEach(score => {
    agg[score] = _.sumBy(reviews, r => parseInt(r[score]));
  });
  return agg;
}

function toAvg(sum, samples) {
  return (Math.round(10 * sum / samples) / 10).toFixed(1);
}

export default class RestaurantCard extends Component {
  	render() {
      console.log(this.props);
  		const { restaurant, reviews} = this.props;
      const scoreSums = aggregateReviews(reviews);
      const tasteAvg = toAvg(scoreSums.taste_score, reviews.length);
      const extrasAvg = toAvg(scoreSums.extras_score, reviews.length);
      const envAvg = toAvg(scoreSums.environment_score, reviews.length);
      const innovationAvg = toAvg(scoreSums.innovation_score, reviews.length);

    	return (
    		<div className="col-sm-12 col-md-6 col-xl-4 py-4">
    			<h2>{restaurant}</h2>
          <div>Smak: {tasteAvg>0 ? tasteAvg : "-"}</div>
          <div>Omgivning: {envAvg>0 ? envAvg : "-"}</div>
          <div>Tillbehör: {extrasAvg>0 ? extrasAvg : "–"}</div>
          <div>Nytänkande: {innovationAvg>0 ? innovationAvg : "-"}</div>
    		</div>
    	);
  	}
}