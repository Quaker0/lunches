import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import { firstLetterUpperCase } from "../utils.js"
import { getRestaurantMeta, getRestaurantReviews } from "../api.js"
import { getUsername } from "../login.js";
import { ThemeProvider } from "@material-ui/core/styles";
import shortid from "shortid"
import { TasteHelp, heatOptions, potionSizeOptions, waitTimeOptions, defaultState, theme, SaveButton, RestaurantSelect, NewRestaurant, NewMeal, MenuType, Score, ReviewDate, MealSelect, SimpleSelect, GridRow, saveNewReview, SimpleModal, ImportImageHelp } from "./adminReviewUtils.js";

export default class AddReviewPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reviewId: shortid.generate(), openSaveModal: false, restaurantMeta:[], meals:[], username:getUsername(), ...defaultState
		};
		this.toggleNewRestaurant = (show) => {
			const { restaurantMeta, restaurant } = this.state;
			if (restaurantMeta.some(meta => meta.name.toLowerCase() === restaurant.toLowerCase())) {
				this.setState({newRestaurant: false});
			} else {
				this.setState({newRestaurant: show});
			}
		}
		this.toggleNewMeal = (show) => {
			const { meals, meal } = this.state;
			if (Object.keys(meals).some(m => m.toLowerCase() === meal.toLowerCase())) {
				this.setState({newMeal: false});
			} else {
				this.setState({newMeal: show});
			}
		}
		this.updateMeal = (event, value) => this.setState({meal: firstLetterUpperCase(value), mealError: ""});
		this.updateNewMealDesc = (event) => this.setState({description: firstLetterUpperCase(event.target.value), descriptionError: ""});
		this.updateWebsite = (event) => {
			let websiteError = "";
			if (!event.target.value.match(/^https?:\/\/(www\.)?[\w\d]+\.[\w]+(\/[\w\d]+)*$/g)) {
				websiteError = "Invalid URL (has to start with http and can't end with a slash)";
			}
			this.setState({website: event.target.value, websiteError: websiteError});
		}
		this.updateAddress = (event) => this.setState({address: firstLetterUpperCase(event.target.value), addressError: ""});
		this.updateSeats = (event, value) => this.setState({seats: value});
		this.updateMenuType = (event, value) => this.setState({menuType: value});
		this.updateDate = (event, value) => this.setState({timestamp: value});
		this.updatePrice = (event) => this.setState({price: parseInt(event.target.value.replace(/[^0-9,]/g, "") || 0)});
		this.updateTaste = (event, value) => this.setState({tasteScore: value});
		this.updateExtras = (event, value) => this.setState({extrasScore: value});
		this.updateInnovation = (event, value) => this.setState({innovationScore: value});
		this.updateReview = (event) => this.setState({review: firstLetterUpperCase(event.target.value), reviewError: ""});
		this.updateComment = (event) => this.setState({restaurantComment: firstLetterUpperCase(event.target.value)});
		this.updateEnviroment = (event, value) => this.setState({environmentScore: value});
		this.updateHeat = (event) => this.setState({heat: event.target.value});
		this.updatePortionSize = (event) => this.setState({portionSize: event.target.value});
		this.updateWaitTime = (event) => this.setState({waitTime: event.target.value});
		this.updatePayInAdvance = (event) => this.setState({payInAdvance: event.target.value});
		this.updateTags = (event, value) => this.setState({tags: value});
		this.updateOrigin = (event, value) => this.setState({origin: value});
		this.validateFields = this.validateFields.bind(this);
		this.updateRestaurant = this.updateRestaurant.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.sendReview = this.sendReview.bind(this);
		this.handleCloseSaveModal = this.handleCloseSaveModal.bind(this);
	}

	onFocus() {
		this.setState({username: getUsername()});
	}

	updateRestaurant(event, value) {
		const { restaurantMeta } = this.state;
		this.setState({restaurant: value, restaurantError: ""})

		restaurantMeta.forEach(restaurant => {
			if (value.toLowerCase() === restaurant.name.toLowerCase()) {
				getRestaurantReviews(restaurant.reviewPointer)
				.then(reviews => {
					let meals = {};
					reviews.forEach(review => {
						if (!meals[review.meal]) {
							meals[review.meal] = review.description;
						}
					});
					this.setState({meals: meals, newRestaurant: false, restaurant: restaurant.name});
				});
			} else {
				this.setState({meals: []});
			}
		});
	}

  enforceFields(requiredFields) {
    let errors = {};
    requiredFields.forEach((entry) => { errors[entry[0]] = null; });
    requiredFields.forEach((entry) => {
      if (!entry[1]) { errors[entry[0]] = "Värde saknas" }
    });
    return errors;
  }

	validateFields() {
		const { 
			meal, restaurant, newRestaurant, description, website, address, review, price
		} = this.state;
		const missingDefaultValues = [meal, restaurant, price].filter(v => !v).length;
		const missingNewRestaurantValues = newRestaurant && [review, description, website, address].filter(v => !v).length;

		if (!missingDefaultValues && !missingNewRestaurantValues) {
			return true;
		}
    const requiredFields = [["mealError", meal], ["priceError", price], ["restaurantError", restaurant]];
    let errors = this.enforceFields(requiredFields);
		
		if (newRestaurant) {
      const requiredRestaurantFields = [
        ["reviewError", review], ["descriptionError", description], ["websiteError", website], ["addressError", address]
      ];
      errors = {errors, ...this.enforceFields(requiredRestaurantFields)};
		}

    this.setState(errors)
		return false;
	}

	sendReview() {
		if (this.validateFields()) {
			saveNewReview(this.state).then(success => {
				if (success) {
					this.setState({openSaveModal: true});
				} else {
					alert("Misslyckades med att spara recensionen");
				}
			});
		}
	}

	handleCloseSaveModal() {
		this.setState({openSaveModal: false});
	}

	componentDidMount() {
		window.addEventListener("focus", this.onFocus);
		getRestaurantMeta()
		.then(meta => this.setState({restaurantMeta: Object.values(meta)}));
	}

	componentWillUnmount() {
		window.removeEventListener("focus", this.onFocus);
	}

	render() {
		const { 
			restaurantMeta, seats, restaurant, newRestaurant, meals, newMeal, description, meal, mealError,
			restaurantError, descriptionError, website, websiteError, address, addressError, tasteScore, heat,
			review, reviewError, environmentScore, restaurantComment, innovationScore, price, priceError,
			portionSize, extrasScore, waitTime, payInAdvance, username, timestamp, menuType, reviewId
		} = this.state;
		const restaurants = restaurantMeta.map(meta => meta.name);

		return (
			<>
				<ThemeProvider theme={theme}>
					<Grid container spacing={2} >
						<GridRow>
							<RestaurantSelect restaurant={restaurant} error={!!restaurantError} helperText={restaurantError} restaurants={restaurants} updateRestaurant={this.updateRestaurant} addNew={this.toggleNewRestaurant}/>
						</GridRow>
						<GridRow collapse={!newRestaurant}>
							<NewRestaurant website={website} websiteError={websiteError} updateWebsite={this.updateWebsite} address={address} addressError={addressError} updateAddress={this.updateAddress} 
							seats={seats} updateSeats={this.updateSeats} updateTags={this.updateTags} updateOrigin={this.updateOrigin} payInAdvance={payInAdvance} updatePayInAdvance={this.updatePayInAdvance} />
						</GridRow>
						<GridRow>
							<MealSelect meal={meal} error={mealError} updateMeal={this.updateMeal} meals={Object.keys(meals)} addNew={this.toggleNewMeal}/>
						</GridRow>
						<GridRow collapse={!newMeal}>
							<NewMeal desc={description} updateDesc={this.updateNewMealDesc} error={descriptionError} />
						</GridRow>
						</Grid>
						<Grid container spacing={2} >
						<ReviewDate value={timestamp} updateDate={this.updateDate} />
						<MenuType menuType={menuType} updateMenuType={this.updateMenuType}/>
						<GridRow>
							<TextField required value={price} onChange={this.updatePrice} error={!!priceError} helperText={priceError} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
						</GridRow>
						<SimpleSelect id="wait-time" label="Tid innan servering" value={waitTime} onChange={this.updateWaitTime} options={waitTimeOptions}/>
						<SimpleSelect id="heat" label="Hetta" value={heat} onChange={this.updateHeat} options={heatOptions}/>
						<SimpleSelect id="portion-size" label="Portionsstorlek" value={portionSize} onChange={this.updatePortionSize} options={potionSizeOptions}/>
						<TasteHelp />
						<Score label="Smak" score={tasteScore} updateScore={this.updateTaste} multiplier={username === "hampus" ? 10 : 1}/>
						<Score label="Omgivning" score={environmentScore} updateScore={this.updateEnviroment} />
						<Score label="Nytänkande" score={innovationScore} updateScore={this.updateInnovation} />
						<Score label="Tillbehör" score={extrasScore} updateScore={this.updateExtras} />
						<GridRow>
							<TextField value={restaurantComment} onChange={this.updateComment} id="comment-field" label="Restaurang kommentar" style={{width: "50vw", margin: 10}} />
						</GridRow>
						<GridRow>
							<TextField required={!!newRestaurant} value={review} onChange={this.updateReview} error={!!reviewError} helperText={reviewError} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
						</GridRow>
            <ImportImageHelp imageRef={reviewId}/>
						<GridRow>
							<SaveButton onClick={this.sendReview} />
						</GridRow>
					</Grid>
				</ThemeProvider>
				<SimpleModal text="Tack for din recension!" open={this.state.openSaveModal} handleClose={this.handleCloseSaveModal} />
			</>
		);
	}
}
