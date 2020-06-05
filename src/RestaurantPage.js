import React, { Component } from "react";
import _ from "lodash";
import { getAggregatedReviews, getRateCircles, mode, cleanGet, reviewToKey } from "./utils.js"
import MealReviewCard from "./MealReviewCard.js";


export default class RestaurantPage extends Component {
	constructor(props) {
		super(props);
		const restaurant = this.props.match.params.restaurant;
		this.state = {reviewCards: "", restaurant: restaurant, reviews: [], width: 0};
		window.mixpanel.track("Page view", {page: "Restaurant page", restaurant: restaurant});
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);

		fetch("https://www.sthlmlunch.se/restaurants/meta.json")
		.then((response) => {
			response.json()
			.then((restaurantsMeta) => {
				if (restaurantsMeta) {
					const meta = Object.values(restaurantsMeta).filter(meta => meta.name.toLowerCase() === this.state.restaurant.toLowerCase())[0];
					this.setState({"restaurantMeta": meta});
					if (meta && this.state.restaurant) {
						fetch(`https://www.sthlmlunch.se/restaurants/${meta.reviewPointer}`)
						.then((response) => {
							response.json()
							.then((reviews) => {
								const mealsReviews = _.groupBy(reviews, r => r.meal.toLowerCase());
								let reviewCards = [];
								Object.values(mealsReviews).forEach((mealReviews) => reviewCards.push(<MealReviewCard key={reviewToKey(mealReviews[0])} reviews={mealReviews} />));
								this.setState({reviewCards: reviewCards, reviews: reviews});
							});
						});
					}
				}
			});
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth });
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (!nextState.reviews.length) {
			return false;
		} else if (!this.state.reviews.length && nextState.reviews.length) {
			return true;
		}
		const below1200 = this.state.width > 1200 && nextState.width < 1200;
		const above1200 = this.state.width < 1200 && nextState.width > 1200;
		const below1000 = this.state.width > 1000 && nextState.width < 1000;
		const above1000 = this.state.width < 1000 && nextState.width > 1000;
		
		return below1200 || above1200 || below1000 || above1000;
	}

	render() {
		const { reviewCards, reviews, width, restaurantMeta } = this.state;

		if (!reviews.length) {
			return "";
		}

		const aggregatedReviews = getAggregatedReviews(reviews);
		const seats = restaurantMeta.seats;
		const portionSize = cleanGet(reviews, "portionSize");
		const waitTime = cleanGet(reviews, "waitTime");
		const prices = cleanGet(reviews, "price");

		const topPrice = Math.max(...prices);
		const minPrice = Math.min(...prices);
		const mapWidth = width > 1200 ? "600" : width > 1000 ? "500" : "400";
		const mapURL = `https://maps.googleapis.com/maps/api/staticmap?&zoom=13&size=${mapWidth}x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C${restaurantMeta.address}&key=AIzaSyCQWr60KEp4VnNMdwb7AzQkIuptT3D2zNc`;
		const mapLink = `https://maps.google.com/maps?q=${restaurantMeta.address}`;

		var envIcons = getRateCircles(aggregatedReviews.envAvg);

		return (	
		<>	
			<div className="page-header text-center">
			<h2>{this.state.reviews[0].restaurant}</h2>
			</div>

			<div className="container-fluid">
			<div className="row justify-content-around">
				<a href={mapLink}><img alt="Map" src={mapURL} className="rounded"/></a>
				<div>
					<table className="table">
						<tbody>
						<tr>
							<th scope="row">Address</th>
							<td><i className="fas fa-sm fa-map-marker-alt"/> <a href={mapLink}>{restaurantMeta.address}</a></td>
						</tr>
						{ seats ?
							<tr>
							<th scope="row">Sittplatser</th>
							<td>{seats}</td>
							</tr>
							: <></>
						}
						{ portionSize.length ?
							<tr>
							<th scope="row">Portionsstorlek</th>
							<td>{mode(portionSize)}</td>
							</tr>
							: <></>
						}
						{ waitTime.length ?
							<tr>
							<th scope="row">Väntetid innan servering</th>
							<td>{mode(waitTime)}</td>
							</tr>
							: <></>
						}
						{ restaurantMeta.payInAdvance ?
							<tr>
							<th scope="row">Betala innan du sätter dig</th>
							<td>{restaurantMeta.payInAdvance}</td>
							</tr>
							: <></>
						}
						<tr>
							<th scope="row">Pris</th>
							<td>{minPrice}{topPrice !== minPrice ? " - " + topPrice : ""} kr</td>
						</tr>
						<tr>
							<th scope="row">Omgivningsbetyg</th>
							<td style={{color:"green"}}>{envIcons}</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
			</div>

			<div className="container-fluid card-item">
				<h3>Recenserade måltider</h3>
				<hr />
				<div id="reviews" className="row justify-content-start">
					{ reviewCards }
				</div>
			</div>
		</>
		);
	}
}