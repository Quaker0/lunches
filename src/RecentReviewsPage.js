import React, { Component } from "react";
import ReviewCard from "./ReviewCard";
import { getRestaurantMeta, getRecentReviews, getAllImages } from "./api";
import _ from "lodash";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export default class RecentReviewsPage extends Component {
  constructor(props) {
    super(props);
    document.title = "STHLM LUNCH - Recent Reviews"
    window.mixpanel.track("Page view", {"page": "Reviews page"});
    this.state = {reviews: [], imageKeys: []};
    this.controller = new AbortController();
  }

  componentDidMount() {
    getRecentReviews({ signal: this.controller.signal }).then(reviews => this.setState({ "reviews": reviews }));
    getRestaurantMeta({ signal: this.controller.signal }).then(meta => this.setState({ "restaurantsMeta": meta }));
    getAllImages({ signal: this.controller.signal }).then(imageKeys => this.setState({imageKeys: imageKeys}));
  }

  componentWillUnmount(){
    this.controller.abort();
  }

  render() {
    const { reviews, restaurantsMeta, imageKeys } = this.state;
    const deduplicatedReviews = _.values(_.keyBy(reviews, review => `${review.pointer}-${review.meal}`));
    
    return (
      <>
        <div className="d-flex flex-column align-items-center">
          { 
            deduplicatedReviews.map((review, idx) => (
              <ReviewCard key={idx} review={review} restaurantsMeta={restaurantsMeta} imageKeys={imageKeys} />
            )) 
          }
        </div>
    </>
    );
  }
}