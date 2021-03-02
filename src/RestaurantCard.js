import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class RestaurantCard extends Component {
	render() {
		const { restaurantMeta} = this.props;
		if (restaurantMeta === {}) {
			return ""
		}
		const { tasteScore, environmentScore, price } = restaurantMeta;
		const redirect = `/restaurant/${restaurantMeta.name.toLowerCase()}`;
    const priceScore = price < 1000 ? <>$<span style={{opacity:0.2}}>$$</span></> : price < 1450 ? <>$$<span style={{opacity:0.2}}>$</span></> : price > 1700 ? "$$$+" : "$$$";
    let imgSrc;
    if ("imageRefs" in restaurantMeta && restaurantMeta["imageRefs"].length) {
      imgSrc = restaurantMeta["imageRefs"].reverse()[0];
    }

		return (
			<div className="m-4 restaurant-card" style={{width: 250}}>
        { imgSrc ? <img width={250} alt="" style={{borderTopRightRadius: "5%", borderTopLeftRadius: "5%"}} src={`https://sthlmlunch-pics.s3.amazonaws.com/processed/${imgSrc}.jpg`} /> : <></> }
        <div className="p-2" style={{backgroundColor: "white", borderBottomLeftRadius: "5%", borderBottomRightRadius: "5%"}}>
  				<div className="inline-block pb-2 text-center" style={{fontVariant: "petite-caps"}}>
  					<Link to={redirect} className="h4" style={{color: "black"}}>{restaurantMeta.name}</Link>
  				</div>
          <div className="d-flex flex-row flex-nowrap justify-content-center pb-1">
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
          </div>
        </div>
      </div>
		);
	}
}