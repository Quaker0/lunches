import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import { firstLetterUpperCase } from "../utils"
import { getRestaurantMeta, getRestaurantReviews } from "../api"
import shortid from "shortid"
import { TasteHelp, heatOptions, potionSizeOptions, waitTimeOptions, defaultState, SaveButton, RestaurantSelect, NewMeal, MenuType, Score, ReviewDate, MealSelect, SimpleSelect, GridRow, saveNewReview, SimpleModal, UnmatchedImages } from "./adminReviewUtils";
import xmlParser from "fast-xml-parser";

export default class AddReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewId: shortid.generate(), saveDisabled: false, openSaveModal: false, restaurantMeta: [], meals: [], ...defaultState
    };
    fetch("https://sthlmlunch-pics.s3.amazonaws.com")
    .then(response => response.text())
    .then(body => {
      this.setState({unmatchedImages: xmlParser.parse(body).ListBucketResult.Contents.map(content => {
        if (content.Key.startsWith("processed/unmatched")) {
          return content.Key;
        }
        return null;
      }).filter(Boolean)})
    })
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
    this.validateFields = this.validateFields.bind(this);
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.sendReview = this.sendReview.bind(this);
    this.handleCloseSaveModal = this.handleCloseSaveModal.bind(this);
    this.setSelectedImageRef = this.setSelectedImageRef.bind(this);
  }

  setSelectedImageRef(newImageRef) {
    const { imageRef } = this.state;
    this.setState({imageRef: newImageRef !== imageRef ? newImageRef : null});
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
          this.setState({meals: meals, restaurant: restaurant.name});
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
    const {  meal, restaurant, price } = this.state;
    const missingDefaultValues = [meal, restaurant, price].filter(v => !v).length;
    if (!missingDefaultValues) return true;
    
    const requiredFields = [
      ["mealError", meal], ["priceError", price], ["restaurantError", restaurant]
    ];
    this.setState(this.enforceFields(requiredFields));
    return false;
  }

  sendReview() {
    const { saveDisabled } = this.state;
    if (saveDisabled) return null;

    this.setState({saveDisabled: true});
    if (this.validateFields()) {
      saveNewReview(this.state).then(success => {
        if (success) {
          this.setState({openSaveModal: true, ...defaultState});
        } else {
          alert("Misslyckades med att spara recensionen");
        }
        this.setState({saveDisabled: false});
      });
    }
    else {
      this.setState({saveDisabled: false});
    }
  }

  handleCloseSaveModal() {
    this.setState({openSaveModal: false});
  }

  componentDidMount() {
    getRestaurantMeta({cache: "no-cache"}).then(meta => this.setState({restaurantMeta: Object.values(meta)}));
  }

  render() {
    const { 
      restaurantMeta, meals, newMeal, description, meal, mealError, restaurantError, descriptionError, tasteScore, heat, 
      review, reviewError, environmentScore, restaurantComment, innovationScore, price, priceError, saveDisabled, portionSize, 
      extrasScore, waitTime, timestamp, menuType, imageRef, reviewId, unmatchedImages, openSaveModal
    } = this.state;
    const restaurants = restaurantMeta.map(meta => meta.name);

    return (
      <>
        <Grid container spacing={2} direction="column" alignContent="center">
          <GridRow>
            <RestaurantSelect error={!!restaurantError} helperText={restaurantError} restaurants={restaurants} updateRestaurant={this.updateRestaurant}/>
          </GridRow>
          <GridRow>
            <MealSelect meal={meal} error={mealError} updateMeal={this.updateMeal} meals={Object.keys(meals)} addNew={this.toggleNewMeal}/>
          </GridRow>
          <GridRow collapse={!newMeal}>
            <NewMeal desc={description} updateDesc={this.updateNewMealDesc} error={descriptionError} />
          </GridRow>
          <ReviewDate value={timestamp} updateDate={this.updateDate} />
          <MenuType menuType={menuType} updateMenuType={this.updateMenuType}/>
          <GridRow>
            <TextField required value={price} onChange={this.updatePrice} error={!!priceError} helperText={priceError} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
          </GridRow>
          <SimpleSelect id="wait-time" label="Tid innan servering" value={waitTime} onChange={this.updateWaitTime} options={waitTimeOptions}/>
          <SimpleSelect id="heat" label="Hetta" value={heat} onChange={this.updateHeat} options={heatOptions}/>
          <SimpleSelect id="portion-size" label="Portionsstorlek" value={portionSize} onChange={this.updatePortionSize} options={potionSizeOptions}/>
          <TasteHelp />
          <Score label="Smak" score={tasteScore} updateScore={this.updateTaste} multiplier={10}/>
          <Score label="Omgivning" score={environmentScore} updateScore={this.updateEnviroment} />
          <Score label="Nytänkande" score={innovationScore} updateScore={this.updateInnovation} />
          <Score label="Tillbehör" score={extrasScore} updateScore={this.updateExtras} />
          <GridRow>
            <TextField value={restaurantComment} onChange={this.updateComment} id="comment-field" label="Restaurang kommentar" style={{width: "50vw", margin: 10}} />
          </GridRow>
          <GridRow>
            <TextField value={review} onChange={this.updateReview} error={!!reviewError} helperText={reviewError} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
          </GridRow>
          <UnmatchedImages imageKeys={unmatchedImages} onChange={this.setSelectedImageRef} selectedImageRef={imageRef}/>
          <GridRow>
            <SaveButton disabled={saveDisabled} onClick={this.sendReview} />
          </GridRow>
        </Grid>
        <SimpleModal text="Tack for din recension!" node={<p>Du kan fortfarande maila in en ny bild eller ersätta en existerande med ämnet <code>ref={reviewId}</code></p>} open={openSaveModal} handleClose={this.handleCloseSaveModal} />
      </>
    );
  }
}
