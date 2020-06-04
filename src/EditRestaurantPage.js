import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { GridRow } from "./adminReviewUtils.js";
import { reviewToKey } from "./utils.js";
import { getDecodedJWT, getUsername }  from "./login.js";
import EditReviewPage from "./EditReviewPage.js";
import _ from "lodash";

export default class EditRestaurantPage extends Component {
	constructor(props) {
		super(props);
		this.state = {username: getUsername(), jwt: getDecodedJWT()};
		this.selectReview = this.selectReview.bind(this);
		this.deleteReview = this.deleteReview.bind(this);
	}

	componentDidMount() {
		fetch(`https://www.sthlmlunch.se/restaurants/${this.props.reviewPointer}`)
        .then((response) => {
          response.json()
          .then((reviews) => {
            const userGroups = this.state.jwt["cognito:groups"]
            const reviewCards = this.buildReviewCards(reviews, userGroups);
            this.setState({reviewCards: <Grid container spacing={2}>{reviewCards}</Grid>, reviews: reviews});
          });
        });
	  }

	  buildReviewCards(reviews, userGroups) {
	  	const mealsReviews = _.groupBy(reviews, r => r.meal.toLowerCase());
        let reviewCards = [];
        Object.values(mealsReviews).forEach((mealReviews) => {
        	mealReviews.forEach(review => {
        		const show = review.reviewer.toLowerCase() === this.state.username.toLowerCase() || (userGroups && userGroups.includes("admins"));
    			reviewCards.push(
        			<GridRow key={reviewToKey(review)}>
        				<Button variant="contained" disabled={!show} onClick={() => this.selectReview(review)}>
        					{review.meal} - {review.timestamp} - {review.reviewer}
        				</Button>
        			</GridRow>
        		);
        	});
        });
        return reviewCards;
	  }

	 selectReview(review) {
	 	this.setState({"review": review});
	 }

	 deleteReview(review) {
	 	let { reviews } = this.state;
	 	const userGroups = this.state.jwt["cognito:groups"]
        const new_reviews = _.filter(reviews, (r) => r.timestamp === review.timestamp && r.reviewer === review.reviewer && r.meal === review.meal)
        const reviewCards = this.buildReviewCards(new_reviews, userGroups);
	 	this.setState({"review": null, reviewCards: reviewCards, reviews: new_reviews});
	 }

	render() {
		const { review, reviewCards } = this.state;
		if (review) {
			return <EditReviewPage review={review} deleteReview={this.deleteReview} reviewPointer={this.props.reviewPointer}/>;
		};
		return (
			<>
				<h1 className="page-header text-center">{ this.props.name }</h1>
				{ reviewCards }
			</>
		);
	}
}
