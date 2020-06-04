import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { GridRow } from "./adminReviewUtils.js";
import EditRestaurantPage from "./EditRestaurantPage.js";

export default class EditPage extends Component {
	constructor() {
		super();
		this.state = {"restaurantsMeta": {}}
		this.selectRestaurant = this.selectRestaurant.bind(this);
	}
	componentDidMount() {
	    fetch("https://www.sthlmlunch.se/restaurants/meta.json")
	    .then((response) => {
	      response.json()
	      .then((restaurantsMeta) => {
	        if (restaurantsMeta) {
	        	const metaRows = Object.entries(restaurantsMeta).map(([key, meta]) => <GridRow key={key}><Button onClick={() => this.selectRestaurant(key, meta)}>{meta.name}</Button></GridRow>);
	         	this.setState({"restaurantsMeta": restaurantsMeta, metaRows: <Grid container spacing={2}>{metaRows}</Grid>})
	        }
	      });
	    });
	  }

	 selectRestaurant(key, meta) {
	 	this.setState({"restaurantKey": key, restaurantMeta: meta})
	 }

	render() {
		const { restaurantMeta, metaRows } = this.state;

		if (restaurantMeta) {
			return (<EditRestaurantPage {...restaurantMeta}/>);
		}
		return metaRows || "";
	}
}
