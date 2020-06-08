import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import { getUsername } from "../login.js";
import _ from "lodash";

export default class UserPage extends Component {
	constructor() {
		super();
		this.state = {username: getUsername()};
		this.buildReviewGrid = this.buildReviewGrid.bind(this);
	}

	componentDidMount() {
		fetch("https://www.sthlmlunch.se/userMeta.json")
		.then((response) => {
			response.json()
			.then((userMeta) => {
				this.setState({userMeta: userMeta})
			});
		});
	}

	buildReviewGrid(reviewer, reviews) {
		const reviewCards = _(reviews)
			.sortBy(["timestamp", "restaurant"])
			.map((review, index) => (
				<Grid item key={`${review.restaurant}${review.timestamp}${index}`}>
					<Box bgcolor={grey[300]} p={2}>
						{review.restaurant} - {review.timestamp}
					</Box>
				</Grid>
			))
			.compact()
			.reverse()
			.slice(0, 10)
			.value();
		return <Box mt={2}><Grid container spacing={1}>{reviewCards}</Grid></Box>;
	}

	render() {
		const { userMeta, username } = this.state;

		if (!userMeta) {
			return <></>;
		}

		const reviewer = username[0].toUpperCase() + username.slice(1); 
		const tasteScores = userMeta[reviewer].map((review) => review.tasteScore);
		const favorites = _(userMeta[reviewer]).sortBy(["tasteScore"]).reverse().value();
		const tasteAvg = Math.round(10 * _.sum(tasteScores) / userMeta[reviewer].length) / 10;
		const restaurants = _(userMeta[reviewer]).map((review) => review.restaurant).uniq().value();
		const reviewGrid = this.buildReviewGrid(reviewer, userMeta[reviewer]);

		return (
			<>
				<Box textAlign="center" mb={4}>
					<h1>{reviewer}</h1>
				</Box>
				<Box m={4}>
					<Grid container spacing={1}>
						<Grid item xs={12} sm={12} md={6} lg={4}>
							<Box bgcolor={blueGrey[700]} color="primary.contrastText" fontWeight="fontWeightBold" textAlign="center" p={2} height={1}>
								Smak medelvärde: {tasteAvg}, min: {Math.min(...tasteScores)}, max: {Math.max(...tasteScores)}
							</Box>
						</Grid>
						<Grid item xs={12} sm={6} md={3} lg={4}>
							<Box bgcolor={blueGrey[700]} color="primary.contrastText" fontWeight="fontWeightBold" textAlign="center" p={2} height={1}>
								Besökta restauranger: {restaurants.length}
							</Box>
						</Grid>
						<Grid item xs={12} sm={6} md={3} lg={4}>
							<Box bgcolor={blueGrey[700]} color="primary.contrastText" fontWeight="fontWeightBold" textAlign="center" p={2} height={1}>
								Recensioner: {userMeta[reviewer].length}
							</Box>
						</Grid>
						<Grid item xs={12} sm={6} md={3} lg={4}>
							<Box bgcolor={blueGrey[700]} color="primary.contrastText" fontWeight="fontWeightBold" textAlign="center" p={2} height={1}>
								Favorit: {favorites[0].restaurant}
							</Box>
						</Grid>
					</Grid>
				</Box>
				<Box m={4} textAlign="center">
					<h3>Senaste recensioner</h3>
					{ reviewGrid }
				</Box>
			</>
		);
	}
}