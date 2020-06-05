import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class RestaurantCard extends Component {
	render() {
		const { restaurantMeta} = this.props;
		if (restaurantMeta === {}) {
			return ""
		}
		const { tasteScore, environmentScore, extrasScore, innovationScore } = restaurantMeta;
		const redirect = `/restaurant/${restaurantMeta.name.toLowerCase()}`;

		return (
			<div className="col-sm-12 col-md-6 col-xl-4 card-item">
				<div className="inline-block">
					<Link to={redirect} className="h3 text-dark">{restaurantMeta.name}</Link>
				</div>
				<div>Smak: {tasteScore>0 ? tasteScore/10 + "/10" : "–"}</div>
				<div>Omgivning: {environmentScore>0 ? environmentScore/10 + "/10" : "–"}</div>
				{extrasScore>80 ? <div className="font-italic">+ Imponerande tillbehör</div> : extrasScore>50 && <div className="font-italic">+ Bra tillbehör</div>}
				{innovationScore>80 ? <div className="font-italic">+ Nytänkande</div> : innovationScore>60 && <div className="font-italic">+ Maträtt som sticker ut</div>}
			</div>
		);
	}
}