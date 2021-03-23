import React, { Component } from "react";
import _keyBy from "lodash/keyBy";

import { getRestaurantMeta, getRecentReviews } from "./api";
import ReviewCard from "./ReviewCard";
import mixpanel from "mixpanel-browser";

mixpanel.init("d7a7c6b2479a03ab4163bd44a5c0b26d", {
    api_host: "https://api-eu.mixpanel.com",
})

export default class RecentReviewsPage extends Component {
  constructor(props) {
    super(props);
    document.title = "STHLM LUNCH - Recent Reviews"
    mixpanel.track("Page view", {"page": "Reviews page"});
    this.state = {reviews: []};
    this.controller = new AbortController();
  }

  componentDidMount() {
    getRecentReviews({ signal: this.controller.signal }).then(reviews => this.setState({ "reviews": reviews }));
    getRestaurantMeta({ signal: this.controller.signal }).then(meta => this.setState({ "restaurantsMeta": meta }));
  }

  componentWillUnmount(){
    this.controller.abort();
  }

  render() {
    const { reviews, restaurantsMeta } = this.state;

    if (!restaurantsMeta || !Object.keys(restaurantsMeta).length) return null;

    const isValidReview = review  => (
      review.pointer && review.imageRef && restaurantsMeta[review.pointer]
    );

    const deduplicatedReviews = Object.values(_keyBy(reviews, review => `${review.pointer}-${review.meal}`)).filter(isValidReview);

    const reviewCards = deduplicatedReviews.map((review, idx) => (
      <ReviewCard key={idx} idx={idx} review={review} restaurantsMeta={restaurantsMeta} />
    ))
    
    return (
      <>
        <div className="reviews-list">
          <div className="d-flex flex-column align-items-center" style={{minWidth: "50%"}}>
          { reviewCards.splice(0, Math.round(deduplicatedReviews.length / 2)).map(review => review) }
          </div>
          <div className="d-flex flex-column align-items-center" style={{minWidth: "50%"}}>
          { reviewCards }
          </div>
        </div>
      </>
    );
  }
}
