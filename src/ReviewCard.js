import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { originMap, getPepperIcons} from "./utils.js"

export default class ReviewCard extends Component {
	render() {
		const { review, restaurantsMeta } = this.props;
		if (!review.pointer) {
			return ""
		}
		const restaurantMeta = _.get(restaurantsMeta, review.pointer, {})
		const pepperIcons = getPepperIcons(review.heat);
		const firstOrigin = (restaurantMeta.origin || "").split(",")[0];
		var restaurantRedirect = "#";
		if (restaurantMeta.name) {
			restaurantRedirect = `/restaurant/${restaurantMeta.name.toLowerCase()}`;
		}

		return (
			<div className="col-sm-12 col-md-6 card-item">
				{
					firstOrigin ? 
					<i className={"fas fa-globe-" + _.get(originMap, firstOrigin, "asia") + " fa-sm float-right pb-2"}>{restaurantMeta.origin}</i>
					: <></>
				}
				<Link to={restaurantRedirect}><h2 style={{width:"60%", }}>{restaurantMeta.name}</h2></Link>
				<h3 className="font-weight-light">{review.meal}</h3> 
				{pepperIcons}
				<div>{review.description}</div>
				<div className="font-weight-bold">Pris: {review.price}kr</div>
					<div className="container">
						<div className="row pt-4">
							<div className="col-sm-12 col-md-6 font-weight-light">Smak: {review.tasteScore ? review.tasteScore + "/10" : "–"}</div>
							<div className="col-sm-12 col-md-6 font-weight-light">Tillbehör: {review.extrasScore ? review.extrasScore + "/10" : "–"}</div>
							<div className="col-sm-12 col-md-6 font-weight-light">Omgivning: {review.environmentScore ? review.environmentScore + "/10" : "–"}</div>
							<div className="col-sm-12 col-md-6 font-weight-light">Nytänkande: {review.innovationScore ? review.innovationScore + "/10" : "–"}</div>
						</div>
					</div>
				<div className="font-italic py-3">recenserad av {review.reviewer}</div>
			</div>
		);
	}
}
