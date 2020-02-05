import React, { Component } from 'react';
import RestaurantCard from './RestaurantCard.js';
import _ from 'lodash';


export default class AllReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {"restaurantCards": ""}
  }

  componentDidMount() {
    fetch('http://lunch-static.s3-website.eu-north-1.amazonaws.com/reviews.json')
    .then((response) => {
      response.json()
      .then((reviews) => {
        if (reviews) {
          const groupedReviews = _.groupBy(reviews, r => r.restaurant);
          let restaurantCards = [];
          Object.keys(groupedReviews).forEach(restaurant => restaurantCards.push(
            <RestaurantCard key={restaurant} restaurant={restaurant} reviews={groupedReviews[restaurant]} />
          ));
          this.setState({"restaurantCards": restaurantCards});
        }
      }
      );
    })
  }

  render() {
    const { restaurantCards } = this.state;
    return (
      <>
        <div className="container-fluid" style={{"backgroundColor": "#d3dadb"}}>
          <div className="row" style={{"padding": "50px 0 70px 0"}}>
            <div className="mx-auto">
              <div className="site-heading text-center">
                <h1>Lunch STHLM</h1>
                <span className="subheading text-center">Den enda lunch-guiden i Stockholm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div id="reviews" className="row">
            { restaurantCards }
          </div>  
        </div>
      </>
    );
  }
}