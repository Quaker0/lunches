import React, { Component } from 'react';
import RestaurantCard from './RestaurantCard.js';
import SearchBar from './SearchBar.js';
import { getAggregatedReviews, filterReviews, filterSearchedReviews } from './utils.js'
import _ from 'lodash';

export default class RestaurantReviewsPage extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search); 
    window.mixpanel.track("Page view", {"page": "Restaurants page"});
    if (params.get("origin")) {
      window.mixpanel.track("Origin filter used");
    }
    this.state = {
      "reviews": "", "aggregatedReviews": {}, "bestTaste": false, "bestDate": false, "mostValue": false, "mostInnovative": false, "searchPhrase": null, "originFilter": params.get("origin")
    };
    this.toggleTasteCheckbox = this.toggleTasteCheckbox.bind(this);
    this.toggleDateCheckbox = this.toggleDateCheckbox.bind(this);
    this.toggleValueCheckbox = this.toggleValueCheckbox.bind(this);
    this.toggleInnovationCheckbox = this.toggleInnovationCheckbox.bind(this);
    this.removeOriginFilter = this.removeOriginFilter.bind(this);
    this.search = this.search.bind(this);
  }

  toggleTasteCheckbox() {
    this.setState({"bestTaste": !this.state.bestTaste});
  }
  toggleDateCheckbox() {
    this.setState({"bestDate": !this.state.bestDate});
  }
  toggleValueCheckbox() {
    this.setState({"mostValue": !this.state.mostValue});
  }
  toggleInnovationCheckbox() {
    this.setState({"mostInnovative": !this.state.mostInnovative});
  }
  removeOriginFilter() {
    this.setState({"originFilter": null});
  }
  search(event) {
    if (event.target.value !== this.state.searchPhrase) {
      this.setState({"searchPhrase": event.target.value});
    }
  }

  componentDidMount() {
    fetch('https://www.sthlmlunch.se/reviews.json')
    .then((response) => {
      response.json()
      .then((reviews) => {
        if (reviews) {
          const groupedReviews = _.groupBy(reviews, r => r.restaurant.toLowerCase());
          const aggregatedReviews = {};
          Object.keys(groupedReviews).forEach( restaurant => {
              aggregatedReviews[restaurant] = getAggregatedReviews(groupedReviews[restaurant])
            }
          )
          this.setState({"reviews": groupedReviews, "aggregatedReviews": aggregatedReviews});
        }
      }
      );
    })
  }

  render() {
    const { reviews, aggregatedReviews, bestTaste, bestDate, mostValue, mostInnovative, searchPhrase, originFilter } = this.state;  
    var filteredReviews = Object.assign({}, reviews);
    if (bestTaste) {
      filteredReviews = filterReviews(filteredReviews, aggregatedReviews, "bestTaste");
    }
    if (bestDate) {
      filteredReviews = filterReviews(filteredReviews, aggregatedReviews, "bestDate");
    }
    if (mostValue) {
      filteredReviews = filterReviews(filteredReviews, aggregatedReviews, "mostValue");
    }
    if (mostInnovative) {
      filteredReviews = filterReviews(filteredReviews, aggregatedReviews, "mostInnovative");
    }
    if (searchPhrase) {
      filteredReviews = filterSearchedReviews(filteredReviews, searchPhrase);
    }
    if (originFilter) {
      Object.keys(filteredReviews).forEach(restaurant => {
        if (!filteredReviews[restaurant][0].origin.includes(originFilter)) {
          delete filteredReviews[restaurant];
        }
      });
    }
    let restaurantCards = [];
    Object.keys(filteredReviews).forEach(restaurant => restaurantCards.push(
      <RestaurantCard key={restaurant} restaurant={restaurant} reviews={filteredReviews[restaurant]} aggregatedReviews={aggregatedReviews[restaurant]} />
    ));
    return (
      <>
        <h2 className="page-header text-center">Lunch Restauranger</h2>
        <SearchBar toggleTaste={this.toggleTasteCheckbox} toggleDateCheckbox={this.toggleDateCheckbox} toggleValueCheckbox={this.toggleValueCheckbox} toggleInnovationCheckbox={this.toggleInnovationCheckbox} search={this.search}/>
        <div className="container">
          {originFilter ? <p className="d-inline-block text-info px-2">Filtrerat på <strong>{originFilter}</strong> <button onClick={this.removeOriginFilter} type="button" className="btn p-1" style={{"marginTop": "-2px"}} ><i className="fas fa-times"/></button></p> : <></>}
          <div id="reviews" className="row">
            { restaurantCards }
          </div>  
        </div>
      </>
    );
  }
}