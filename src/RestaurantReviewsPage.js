import React, { Component } from 'react';
import RestaurantCard from './RestaurantCard.js';
import SearchBar from './SearchBar.js';
import { filterSearchedReviews, sortReviews, groupReviews } from './utils.js'
import _ from 'lodash';

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
    this.setState({sortBy: event.target.id});
  }

  search(event) {
    if (event.target.value !== this.state.searchPhrase) {
      this.setState({"searchPhrase": event.target.value});
    }
  }

  componentDidMount() {
    fetch('https://www.sthlmlunch.se/restaurants/meta.json')
    .then((response) => {
      response.json()
      .then((meta) => {
        if (meta) {
          this.setState({restaurantsMeta: meta});
        }
      }
      );
    })
  }

  render() {
    const { restaurantsMeta, searchPhrase, originFilter, sortBy } = this.state;  
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

    var metaData = Object.values(filteredMeta)

    if (sortBy) {
      metaData = _(metaData).chain()
      .sortBy(meta => meta.name)
      .sortBy(meta => meta[sortBy])
      .reverse()
      .value()
    }

    let restaurantCards = [];
    metaData.forEach(meta => restaurantCards.push(
      <RestaurantCard key={meta.name} restaurantMeta={meta} />
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