import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { originMap, getPepperIcons} from './utils.js'

export default class ReviewCard extends Component {
	render() {
		const { review } = this.props;
    if (!review.restaurant) {
      return ""
    }
    const pepperIcons = getPepperIcons(review.heat);
    const firstOrigin = review.origin.split(",")[0];
    const restaurantRedirect = `/restaurant/${review.restaurant}`;

  	return (
  		<div className="col-sm-12 col-md-6 cardItem">
        <Link to={{pathname: "/restaurants", search: "?origin=" + review.origin}}>
          <i className={"fas fa-globe-" + _.get(originMap, firstOrigin, "asia") + " fa-sm float-right pb-2"} > {review.origin}</i>
        </Link>
  			<Link to={restaurantRedirect}><h2 style={{width:"60%", }}>{review.restaurant}</h2></Link>
		     <h3 className="font-weight-light">{review.meal}</h3> 
         {pepperIcons}
  			<div>{review.description}</div>
  			<div className="font-weight-bold">Pris: {review.price}kr</div>

  			<div className="container">
  				<div className="row pt-4">
  					<div className="col-sm-12 col-md-6 font-weight-light">Smak: {review.taste_score ? review.taste_score + "/10" : "–"}</div>
  					<div className="col-sm-12 col-md-6 font-weight-light">Tillbehör: {review.extras_score ? review.extras_score + "/10" : "–"}</div>
  					<div className="col-sm-12 col-md-6 font-weight-light">Omgivning: {review.environment_score ? review.environment_score + "/10" : "–"}</div>
  					<div className="col-sm-12 col-md-6 font-weight-light">Nytänkande: {review.innovation_score ? review.innovation_score + "/10" : "–"}</div>
  				</div>
  			</div>
        <div className="font-italic py-3">recenserad av {review.reviewer}</div>
  		</div>
  	);
	}
}