import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { GridRow } from "./adminReviewUtils.js";
import { reviewToKey } from "../utils.js";
import { getDecodedJWT, getUsername }	from "../login.js";
import EditReviewPage from "./EditReviewPage.js";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
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
			const reviewGrid = this.buildReviewGrid(reviews, userGroups);
			this.setState({reviewGrid: reviewGrid, reviews: reviews});
			});
		});
	}

	buildReviewGrid(reviews, userGroups) {
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
		return <Grid container spacing={2}>{reviewCards}</Grid>;
	}

	selectReview(review) {
		this.setState({review: review});
	}

	deleteReview(review) {
		let { reviews } = this.state;
		const userGroups = this.state.jwt["cognito:groups"]
		const new_reviews = _.filter(reviews, (r) => !(r.timestamp === review.timestamp && r.reviewer === review.reviewer && r.meal === review.meal))
		const reviewGrid = this.buildReviewGrid(new_reviews, userGroups);
		this.setState({review: null, reviewGrid: reviewGrid, reviews: new_reviews});
	}

	render() {
		const { review, reviewGrid } = this.state;
		if (review) {
			return <EditReviewPage review={review} deleteReview={this.deleteReview} reviewPointer={this.props.reviewPointer} back={this.selectReview}/>;
		}
		return (
			<>
        <Box mt={-3}>
            <Button variant="contained" onClick={() => this.props.back()}><ChevronLeftIcon /></Button>
          </Box>
				<h1 className="page-header text-center">{ this.props.name }</h1>
				{ reviewGrid }
			</>
		);
	}
}
