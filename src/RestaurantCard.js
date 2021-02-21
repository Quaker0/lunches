import React, { Component } from "react";
import { Link } from "react-router-dom";
import { frame } from "./content/frame.png";

export default class RestaurantCard extends Component {
	render() {
		const { restaurantMeta} = this.props;
		if (restaurantMeta === {}) {
			return ""
		}
		const { tasteScore, environmentScore, extrasScore, innovationScore, price } = restaurantMeta;
		const redirect = `/restaurant/${restaurantMeta.name.toLowerCase()}`;
    const priceScore = price < 1000 ? "$" : price < 1450 ? "$$" : "$$$";

		return (
			<div className="p-4 m-4" style={{width: 350, overflow: "none", border: "1px solid lightgray"}}>
				<div className="inline-block pb-2" style={{fontVariant: "petite-caps"}}>
					<Link to={redirect} className="h3">{restaurantMeta.name}</Link>
				</div>
        <div className="d-flex flex-row flex-nowrap justify-content-between">
        <table style={{fontFamily: "cursive", fontSize: "1rem"}}>
          <tbody>
            <tr style={{borderBottom: "1px solid lightgray"}}>
              <td className="th">Smak</td>
              <td><span style={{fontSize: "1.2rem"}}>{tasteScore/10}</span><span style={{fontSize: "0.8rem"}}>/10</span></td>
            </tr>
            <tr style={{borderBottom: "1px solid lightgray"}}>
              <td className="th">Omgivning</td>
              <td><span style={{fontSize: "1.2rem"}}>{environmentScore/10}</span><span style={{fontSize: "0.8rem"}}>/10</span></td>
            </tr>
            <tr>
              <td className="th">Pris</td>
              <td style={{fontSize: "1.2rem"}}>{priceScore}</td>
            </tr>
          </tbody>
        </table>
        <div></div>
        </div>
      </div>
		);
	}
}