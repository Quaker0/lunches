import React, { Component } from "react";
import _ from "lodash";
import { TabMenu, getAggregatedReviews, getRateCircles, mode, cleanGet, reviewToKey, ga } from "./utils.js"
import MealReviewCard from "./MealReviewCard.js";
import { getUsername } from "./login.js";
import { Redirect } from "react-router";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export default function RestaurantPage(props) {
  console.log(props)
  const restaurant = props.restaurant || props.match.params.restaurant;
  window.mixpanel.track("Page view", {page: "Restaurant page", restaurant: restaurant});
  ga.pageview(props.location.pathname);
  const [tabs, setTabs] = React.useState([
    {title: "Topplista", page: <Redirect to="/"/>},
    {title: "Recensioner", page: <Redirect to="/recentReviews"/>}, 
    {title: `Restauranger > ${restaurant}`, page: <RestaurantInfo restaurant={restaurant}/>}
  ]);
  const [value, setValue] = React.useState(2);
  const handleChange = (event, newValue) => { 
    if (value === newValue) {
      setTabs([
        {title: "Topplista", page: <Redirect to="/"/>},
        {title: "Recensioner", page: <Redirect to="/recentReviews"/>}, 
        {title: "Restauranger", page: <Redirect to="/restaurants"/>}
      ]);
    }
    setValue(newValue);
  };
  return (
    <>
      <div className="container-fluid sthlm-cover" />
      <TabMenu tabs={tabs} handleChange={handleChange} value={value}/>
    </>
  );
}


class RestaurantInfo extends Component {
	constructor(props) {
		super(props);
		let restaurant = this.props.restaurant || this.props.match.params.restaurant;
    restaurant = restaurant.toLowerCase().replace(/\s/g, "");
		this.state = {reviewCards: "", restaurant: restaurant, reviews: [], width: 0, username: getUsername()};
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
					const meta = Object.values(restaurantsMeta).filter(meta => meta.name.toLowerCase().replace(/\s/g, "") === this.state.restaurant)[0];
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
		const { reviewCards, reviews, width, restaurantMeta, username } = this.state;

		if (!reviews.length) {
			return "";
		}

		const aggregatedReviews = getAggregatedReviews(reviews);
		const seats = restaurantMeta.seats;
    const website = restaurantMeta.website;
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
      { username ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#/admin">Admin</Fab></Box> : <></> }
			<div className="page-header text-center">
			<h2>{restaurantMeta.name}</h2>
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
            { website ?
              <tr>
              <th scope="row">Hemsida</th>
              <td><a href={`${website}?utm_source=sthlmlunch.se&utm_medium=referral`}>{website.slice(0, 65)}</a></td>
              </tr>
              : <></>
            }
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