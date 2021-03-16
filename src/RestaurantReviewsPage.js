import React, { Component } from "react";
import { filterSearchedReviews } from "./utils"
import { getRestaurantMeta } from "./api";
import { Helmet } from "react-helmet";
import _sortBy from "lodash/sortBy"

import RestaurantPage from "./RestaurantPage";
import RestaurantCard from "./RestaurantCard";
import SearchBar from "./SearchBar";

export default class RestaurantReviewsPage extends Component {
	constructor(props) {
		super(props);
    if (!this.props.restaurant) {
      window.mixpanel && window.mixpanel.track("Page view", {"page": "Restaurants page"});
    }
		this.state = {
			reviews: null, aggregatedReviews: {}, searchPhrase: null, originFilter: null, restaurant: this.props.restaurant
		};
		this.removeOriginFilter = this.removeOriginFilter.bind(this);
		this.sortBy = this.sortBy.bind(this);
		this.search = this.search.bind(this);
    this.controller = new AbortController();
	}

	removeOriginFilter() {
		this.setState({originFilter: null});
	}

	sortBy(event) {
		this.setState({sortByValue: event.target.id});
	}

	search(event) {
		if (event.target.value !== this.state.searchPhrase) {
			this.setState({searchPhrase: event.target.value});
		}
	}

	componentDidMount() {
		getRestaurantMeta({signal: this.controller.signal}).then(meta => this.setState({"restaurantsMeta": meta}))
	}

  componentWillUnmount() {
    this.controller.abort()
  }

	render() {
		const { restaurant, restaurantsMeta, searchPhrase, originFilter, sortByValue } = this.state;
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

		var metaData = Object.values(filteredMeta).filter(meta => meta.reviewPointer && meta.tasteScore);
		if (sortByValue) {
			metaData = _sortBy(_sortBy(metaData, meta => meta.name), meta => meta[sortByValue]);
    }

		let restaurantCards = [];
		metaData.reverse().forEach((meta, idx) => restaurantCards.push(
			<RestaurantCard key={meta.name} idx={idx} restaurantMeta={meta} />
		));
		return (
			<div className="py-2 tab-page" style={{backgroundColor: "rgba(0,0,0,0.05)"}}>
        <Helmet>
          <title>STHLM LUNCH - Restaurants</title>
        </Helmet>
				<SearchBar search={this.search} sortBy={this.sortBy}/>
				<div className="container-fluid">
					{originFilter ? <p className="d-inline-block text-info px-2">Filtrerat på <strong>{originFilter}</strong> <button onClick={this.removeOriginFilter} type="button" className="btn p-1" style={{"marginTop": "-2px"}} ><i className="fas fa-times"/></button></p> : <></>}
					<div id="reviews" className="d-flex flex-wrap justify-content-center align-items-center w-80">
						{ restaurantCards }
					</div>	
				</div>
			</div>
		);
	}
}