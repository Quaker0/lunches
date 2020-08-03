import React, { Component } from "react";
import RestaurantCard from "./RestaurantCard.js";
import SearchBar from "./SearchBar.js";
import RestaurantPage from "./RestaurantPage.js";
import { filterSearchedReviews, ga } from "./utils.js"
import { getUsername } from "./login.js";
import _ from "lodash";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export default class RestaurantReviewsPage extends Component {
	constructor(props) {
		super(props);
		window.mixpanel.track("Page view", {"page": "Restaurants page"});
    ga.pageview("/restaurants");
		this.state = {
			reviews: null, aggregatedReviews: {}, searchPhrase: null, originFilter: null, restaurant: this.props.restaurant,
      username: getUsername()
		};
		this.removeOriginFilter = this.removeOriginFilter.bind(this);
		this.sortBy = this.sortBy.bind(this);
		this.search = this.search.bind(this);
	}

	removeOriginFilter() {
		this.setState({originFilter: null});
	}

	sortBy(event) {
		this.setState({sortBy: event.target.id});
	}

	search(event) {
		if (event.target.value !== this.state.searchPhrase) {
			this.setState({searchPhrase: event.target.value});
		}
	}

	componentDidMount() {
		fetch("https://www.sthlmlunch.se/restaurants/meta.json")
		.then((response) => {
			response.json()
			.then((meta) => {
				if (meta) {
					this.setState({restaurantsMeta: meta});
				}
			});
		})
	}

	render() {
		const { restaurant, restaurantsMeta, searchPhrase, originFilter, sortBy, username } = this.state;	
    if (restaurant) {
      return <RestaurantPage restaurant={restaurant} />
    }
		var filteredMeta = Object.assign({}, restaurantsMeta);
		if (searchPhrase) {
			filteredMeta = filterSearchedReviews(filteredMeta, searchPhrase);
		}
		if (originFilter) {
			Object.keys(filteredMeta).forEach(pointer => {
				if (!filteredMeta[pointer].origin.includes(originFilter)) {
					delete filteredMeta[pointer];
				}
			});
		}

		var metaData = Object.values(filteredMeta);
		if (sortBy) {
			metaData = _(metaData).chain()
			.sortBy(meta => meta.name)
			.sortBy(meta => meta[sortBy])
			.reverse()
			.value();
		}

		let restaurantCards = [];
		metaData.forEach(meta => restaurantCards.push(
			<RestaurantCard key={meta.name} restaurantMeta={meta} />
		));
		return (
			<>
        { username ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#/admin">Admin</Fab></Box> : <></> }
				<SearchBar search={this.search} sortBy={this.sortBy}/>
				<div className="container-fluid">
					{originFilter ? <p className="d-inline-block text-info px-2">Filtrerat på <strong>{originFilter}</strong> <button onClick={this.removeOriginFilter} type="button" className="btn p-1" style={{"marginTop": "-2px"}} ><i className="fas fa-times"/></button></p> : <></>}
					<div id="reviews" className="row">
						{ restaurantCards }
					</div>	
				</div>
			</>
		);
	}
}