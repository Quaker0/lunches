import React, { Component } from "react";
import ReviewCard from "./ReviewCard.js";
import _ from "lodash";

export default class AllReviewsPage extends Component {
  constructor(props) {
    window.mixpanel.track("Page view", {"page": "Reviews page"});
    super(props);
    this.state = {"reviews": []};
    this.toggleReviewerFilter = this.toggleReviewerFilter.bind(this);
  }

  toggleReviewerFilter(reviewer) {
    if (this.state.reviewerFilter === reviewer) {
      this.setState({"reviewerFilter": null})
    } else {
      this.setState({"reviewerFilter": reviewer})
    }
  }

  componentDidMount() {
    fetch("https://www.sthlmlunch.se/reviews.json")
    .then((response) => {
      response.json()
      .then((reviews) => {
        if (reviews) {
          this.setState({"reviews": reviews.slice(0, 50)});
        }
      }
      );
    })
  }

  render() {
    const { reviews, reviewerFilter } = this.state;
    let filteredReviews = [];
    if (reviewerFilter) {
      filteredReviews = _.filter(reviews, review => review.reviewer.toLowerCase() === reviewerFilter);
    } else {
      filteredReviews = Object.assign([], reviews);
    }
    
    let reviewCards = [];
    filteredReviews.forEach((review) => reviewCards.push(<ReviewCard key={review.timestamp} review={review}/>));
    return (
      <>
        <h1 className="page-header text-center">Recensioner</h1>
        <div className="container-fluid">
          <div id="reviews" className="row">
           { reviewCards }
          </div>
        </div>
      </>
    );
  }
}