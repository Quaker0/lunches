import React, { Component } from "react";
import { keyBy } from "lodash";

import ReviewCard from "./ReviewCard";
import { getRestaurantMeta, getRecentReviews } from "./api";


export default class RecentReviewsPage extends Component {
  constructor(props) {
    super(props);
    document.title = "STHLM LUNCH - Recent Reviews"
    window.mixpanel && window.mixpanel.track("Page view", {"page": "Reviews page"});
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

    const deduplicatedReviews = Object.values(keyBy(reviews, review => `${review.pointer}-${review.meal}`)).filter(isValidReview);

    const reviewCards = deduplicatedReviews.map((review, idx) => (
      <ReviewCard key={idx} review={review} restaurantsMeta={restaurantsMeta} />
    ))
    
    return (
      <>
        <div className="reviews-list">
          <div className="d-flex flex-column align-items-center" style={{minWidth: "50%"}}>
          { reviewCards.splice(0, Math.round(deduplicatedReviews.length / 2)).map(review => review) }
          </div>
          <div className="d-flex flex-column align-items-center" style={{minWidth: "50%"}}>
          { reviewCards}
          </div>
        </div>
      </>
    );
  }
}
