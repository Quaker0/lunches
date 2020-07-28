import React, { Component } from "react";
import ReviewCard from "./ReviewCard.js";
import { reviewToKey } from "./utils.js";
import { getUsername } from "./login.js";
import _ from "lodash";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

export default class AllReviewsPage extends Component {
	constructor(props) {
    super(props);
		window.mixpanel.track("Page view", {"page": "Reviews page"});
    window.ga("send", "pageview", "/recentReviews");
		this.state = {reviews: [], username: getUsername()};
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
		fetch("https://www.sthlmlunch.se/recentReviews.json")
		.then((response) => {
			response.json()
			.then((reviews) => {
			if (reviews) {
				this.setState({"reviews": reviews});
			}
			});
		});
		fetch("https://www.sthlmlunch.se/restaurants/meta.json")
		.then((response) => {
			response.json()
			.then((meta) => {
			if (meta) {
				this.setState({"restaurantsMeta": meta});
			}
			});
		});
	}

	render() {
		const { reviews, restaurantsMeta, reviewerFilter, username } = this.state;
		let filteredReviews = [];
		if (reviewerFilter) {
			filteredReviews = _.filter(reviews, review => review.reviewer.toLowerCase() === reviewerFilter);
		} else {
			filteredReviews = Object.assign([], reviews);
		}
		
		let reviewCards = [];
		filteredReviews.forEach((review) => reviewCards.push(
			<ReviewCard key={reviewToKey(review)} review={review} restaurantsMeta={restaurantsMeta} />
		));
		return (
			<>
        { username ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#/admin">Admin</Fab></Box> : <></> }
          <Box m={3}>
            <Grid container spacing={5}>
            { reviewCards }
            </Grid>
					</Box>
			</>
		);
	}
}