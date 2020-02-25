import React, { Component } from 'react';
import RestaurantCard from './RestaurantCard.js';
import SearchBar from './SearchBar.js';
import { getAggregatedReviews, filterSearchedReviews, sortReviews, groupReviews } from './utils.js'

export default class RestaurantReviewsPage extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search); 
    window.mixpanel.track("Page view", {"page": "Restaurants page"});
    const originFilter = params.get("origin");
    Object.keys(params).forEach(filterItem => window.mixpanel.track("Filter used", {"filterType": "origin"}));

    this.state = {
      reviews: null, aggregatedReviews: {}, searchPhrase: null, originFilter: originFilter
    };
    this.removeOriginFilter = this.removeOriginFilter.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.search = this.search.bind(this);
  }

  removeOriginFilter() {
    this.setState({originFilter: null});
  }
  sortBy(event) {
    const sortedReviews = sortReviews(Object.values(this.state.groupedReviews).flat(), this.state.aggregatedReviews, event.target.id);
    this.setState({groupedReviews: groupReviews(sortedReviews)});
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
          const groupedReviews = groupReviews(reviews);
          const aggregatedReviews = {};
          Object.keys(groupedReviews).forEach( restaurant => {
              aggregatedReviews[restaurant] = getAggregatedReviews(groupedReviews[restaurant])
            }
          )
          this.setState({groupedReviews: groupedReviews, aggregatedReviews: aggregatedReviews});
        }
      }
      );
    })
  }

  render() {
    const { groupedReviews, aggregatedReviews, searchPhrase, originFilter } = this.state;  
    var filteredReviews = Object.assign({}, groupedReviews);
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
        <h2 className="page-header text-center">Restauranger</h2>
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