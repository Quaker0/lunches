import React, { Component } from 'react';


export default class ReviewCard extends Component {
  	render() {
  		const { review, idx } = this.props;
  		let gridClass = "";
  		if (idx % 5 < 3) {
			gridClass = "col-sm-12 col-md-6 col-xl-4 py-4";
		} else {
	  		gridClass = "col-sm-12 col-md-6 py-4";
	  	}
    	return (
    		<div className={gridClass}>
    			<h2>{review.restaurant}</h2>
    			<h4 className="font-weight-light">{review.meal}</h4>
    			<div>{review.description}</div>
    			<div className="font-italic p-3">reviewed by {review.reviewer}</div>
    			<div className="font-weight-bold">Pris: {review.price}kr</div>
    			<div className="container">
    				<div className="row pt-4">
    					<div className="col-sm-12 col-md-6 font-weight-light">Smak: {review.taste_score}</div>
    					<div className="col-sm-12 col-md-6 font-weight-light">Extras: {review.extras_score}</div>
    					<div className="col-sm-12 col-md-6 font-weight-light">Omgivning: {review.environment_score}</div>
    					<div className="col-sm-12 col-md-6 font-weight-light">Nytänkande: {review.innovation_score}</div>
    				</div>
    			</div>
    		</div>
    	);
  	}
}