import React, { Component } from "react";
import ReviewCard from "./ReviewCard.js";
import { getUsername } from "./login.js";
import _ from "lodash";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export default class AllReviewsPage extends Component {
	constructor(props) {
    super(props);
    document.title = "STHLM LUNCH - Recent Reviews"
		window.mixpanel.track("Page view", {"page": "Reviews page"});
		this.state = {reviews: [], username: getUsername()};
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
		const { reviews, restaurantsMeta, username } = this.state;
    const deduplicatedReviews = _.values(_.keyBy(reviews, review => `${review.pointer}-${review.meal}`));
		
		return (
			<>
        { username ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#/admin">Admin</Fab></Box> : <></> }
          <div className="d-flex flex-column align-items-center">
            { 
              deduplicatedReviews.map((review, idx) => (
                <ReviewCard key={idx} review={review} restaurantsMeta={restaurantsMeta} />
              )) 
            }
					</div>
			</>
		);
	}
}