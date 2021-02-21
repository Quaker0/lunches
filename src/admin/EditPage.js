import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { GridRow } from "./adminReviewUtils";
import EditRestaurantPage from "./EditRestaurantPage";
import SearchBar from "../SearchBar";

export default class EditPage extends Component {
	constructor() {
		super();
		this.state = {restaurantsMeta: {}, searchPhrase: ""}
		this.selectRestaurant = this.selectRestaurant.bind(this);
		this.search = this.search.bind(this);
	}

	buildMetaRows(restaurantsMeta, searchPhrase) {
		if (restaurantsMeta) {
			const metaRows = Object.entries(restaurantsMeta).map(([key, meta]) => {
				if (!searchPhrase || meta.name.toLowerCase().includes(searchPhrase.toLowerCase())) {
					return (
						<GridRow key={ key }>
							<Button onClick={ () => this.selectRestaurant(key, meta) }>
								{ meta.name }
							</Button>
						</GridRow>
					);
				} else {
					return null;
				}
			}).reverse();
			return <Grid>{ metaRows }</Grid>
		}
	}

	componentDidMount() {
		fetch("https://www.sthlmlunch.se/restaurants/meta.json")
		.then((response) => {
			response.json()
			.then((restaurantsMeta) => {
				this.setState({
					restaurantsMeta: restaurantsMeta, 
					metaRows: this.buildMetaRows(restaurantsMeta)
				})
			}
			);
		});
	}

	search(event) {
		if (event.target.value !== this.state.searchPhrase) {
			const { restaurantsMeta } = this.state;
			this.setState({
				searchPhrase: event.target.value, 
				metaRows: this.buildMetaRows(restaurantsMeta, event.target.value)
			});
		}
	}

	selectRestaurant(key, meta) {
		this.setState({restaurantKey: key, restaurantMeta: meta})
	}

	render() {
		const { restaurantMeta, metaRows } = this.state;
		if (restaurantMeta) {
			return <EditRestaurantPage back={this.selectRestaurant} {...restaurantMeta}/>;
		}
		return (
			<>
				<SearchBar search={this.search} />
				{ metaRows }
			</>
		);
	}
}
