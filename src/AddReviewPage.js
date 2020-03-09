import React, { Component } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { 
  Button, TextField, Grid, Chip, Slider, Radio, RadioGroup, FormControlLabel, 
  FormLabel, InputAdornment, MenuItem, Select, FormControl, InputLabel
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import { svSE } from "@material-ui/core/locale";
import { firstLetterUpperCase } from "./utils.js"
import { getRestaurantMeta, getRestaurantReviews, addReview } from "./api.js"
import { List } from 'immutable';
import LoginForm from './LoginForm.js';
import { getUsername } from './login.js';
import _ from 'lodash';

const tagOptions = [
  {"id": "takeaway", "title": "Take Away"},
  {"id": "bookable", "title": "Bokningsbar"}
];
const originOptions = [
  "Afrika", "Asien", "Mellanöstern", "Nordamerika", "Nordeuropa", "Sydamerika", "Sydeuropa"
];
const heatOptions = ["Ingen hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];
const potionSizeOptions = ["Lite", "Under medel", "Medel", "Över medel", "Mycket"];
const waitTimeOptions = ["< 5 min", "< 10 min", "< 20 min", "< 30 min", "> 30 min"];
const defaultState = {
  newRestaurant:false, newMeal:false, description:"", price:"", portionSize: "Medel",
  meal:"", restaurant:"", address:"", website:"", seats:null, reviewError:false,
  mealReview:"", restaurantComment:"", tasteScore:5, environmentScore:5, innovationScore:5,
  extrasScore:5, heat:"Ingen hetta", waitTime:"< 20 min", payInAdvance:"Ja"
};

const saveWhiteList = [
  "tasteScore", "environmentScore", "meal", "description", "price",
  "totalPrice", "portionSize", "heat", "waitTime", "totalTime", "extrasScore", 
  "innovationScore", "restaurantComment", "mealReview", "timestamp"
]

const theme = createMuiTheme({
  palette: {
    primary: { main: "#e1e5eb" },
  }
}, svSE);


function buildReviewRequest(state) {
  const review = _.pick(state, saveWhiteList)
  if (!review.description) {
    review.description = state.meals[review.meal];
  }
  review.reviewer = firstLetterUpperCase(state.username);
  const request = { review: review };
  var tags = [];
  state.tags.forEach(tag => tags.push(tag.title))
  if (state.newRestaurant) {
    request.restaurant = {
      name: state.restaurant,
      tags: tags.sort().join(", "),
      origin: state.origin.sort().join(", "),
      address: state.address,
      website: state.website,
      payInAdvance: state.payInAdvance
    };
  } else {
    state.restaurantMeta.forEach(restaurant => {
      if (restaurant.name === state.restaurant) {
        request.reviewPointer = restaurant.reviewPointer
      }
    });
  }
  console.log(request);
  return request;
}


function save(state, clear, validate) {
  if (validate()) {
    addReview(buildReviewRequest(state)).then(response => {
      if (response.status !== 201) {
        alert(`Failed to add review! Error code: ${response.status}.`);
      }
    });
    clear();
  }
}

const SaveButton = function(props) {
  return (
    <Button onClick={() => save(props.state, props.clear, props.validate)} style={{"margin": 50}}>
      <SaveIcon fontSize="large" style={{ color: "green"}}/>
    </Button>
  );
}

const TagSelect = function(props) {
  return (
    <Autocomplete
      multiple
      id="tag-selector"
      options={tagOptions}
      getOptionLabel={option => option.title}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option.title} {...getTagProps({ index })} />
        ))
      }
      noOptionsText=""
      getOptionSelected={(x, y) => x && y && x.id === y.id}
      onChange={props.onChange}
      style={{ width: "50vw", margin: 10 }}
      renderInput={params => (
        <TextField {...params} label="Nyckelord" />
      )}
    />
  );
}

const OriginSelect = function(props) {
  return (
    <Autocomplete
      multiple
      id="origin-selector"
      options={originOptions}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      noOptionsText=""
      getOptionSelected={(x, y) => x && y && x.toLowerCase() === y.toLowerCase()}
      onChange={props.onChange}
      style={{ width: "50vw", margin: 10}}
      renderInput={params => (
        <TextField {...params} label="Ursprung" />
      )}
    />
  );
}

const ComboBox = function(props) {
  let timeoutVar = null;
  function onInputChange(event, value, reason) {
    props.onChange(event, value)
    if (timeoutVar) {
      clearTimeout(timeoutVar);
    }
    if (value && reason !== "reset") {
      timeoutVar = setTimeout(() => props.addNew(true), 1000);
    } else {
      props.addNew(false)
    }
  }
  return (
    <>
      <Autocomplete
        freeSolo
        forcePopupIcon
        clearOnEscape
        id={`${props.id}-combo-box`}
        value={props.value}
        options={props.options}
        noOptionsText=""
        openText={props.openText}
        style={{width: "50vw"}}
        renderInput={params => <TextField {...params} required error={props.error} label={props.label} />}
        onInputChange={onInputChange}
      />
    </>
  );
}
const RestaurantSelect = function(props) {
  return <ComboBox value={props.restaurant} error={props.error} label="Restaurang" id="restaurant" onChange={props.updateRestaurant} options={props.restaurants} addNew={props.addNew} openText="Öppna" />;
}

const NewRestaurant = function(props) {
  return (
    <>
      <GridRow>
        <h4 >Definera ny restaurang</h4>
      </GridRow>
      <GridRow>
        <SimpleSelect id="pay-in-advance" label="Betalade i förväg" value={props.payInAdvance} onChange={props.updatePayInAdvance} options={["Ja", "Nej"]}/>
      </GridRow>
      <GridRow>
        <TextField required value={props.address} onChange={props.updateAddress} error={props.addressError} id="restaurant-address-field" label="Address" style={{width: "50vw", margin: 10}} />
      </GridRow>
      <GridRow>
        <TextField required value={props.website} onChange={props.updateWebsite} error={props.websiteError}id="restaurant-website-field" label="Hemsida" style={{width: "50vw", margin: 10}} />
      </GridRow>
      <GridRow>
        <TagSelect onChange={props.updateTags} />
      </GridRow>
      <GridRow>
        <OriginSelect onChange={props.updateOrigin} />
      </GridRow>
      <GridRow>
        <RestaurantSeats seats={props.seats} updateSeats={props.updateSeats} />
      </GridRow>
    </>
  );
}

const NewMeal = props => (
  <>
    <h4 style={{marginTop: 20}}>Definera ny måltid</h4>
    <TextField required error={props.descError} value={props.desc} id="meal-description-field" label="Beskrivning" style={{width: "50vw", marginBottom: 30}} onChange={props.updateDesc}/>
  </>
);

const RestaurantSeats = props => (
  <div className="py-2">
    <FormLabel id="seats-range-slider" component="legend">Sittplatser</FormLabel>
    <RadioGroup row aria-label="seats" name="Seats" value={props.value || "25-35"} onChange={props.updateSeats}>
      <FormControlLabel value="<15" control={<Radio />} label="<15" />
      <FormControlLabel value="15-25" control={<Radio />} label="15-25" />
      <FormControlLabel value="25-35" control={<Radio />} label="25-35" />
      <FormControlLabel value="35-50" control={<Radio />} label="35-50" />
      <FormControlLabel value=">50" control={<Radio />} label=">50" />
    </RadioGroup>
  </div>
)

const Score = props => (
  <>
    <FormLabel component="legend">
      {props.label}
    </FormLabel>
    <Slider
      step={1/props.multiplier}
      min={0}
      max={10}
      scale={x => props.multiplier*x}
      onChange={props.updateScore}
      valueLabelDisplay="auto"
      value={props.score == null ? 5 : props.score}
      valueLabelFormat={value => value.toString()}
      style={{width: "50vw"}}
    />
  </>
);
Score.defaultProps = {multiplier: 1}

const ReviewDate = props => (
  <form noValidate>
    <TextField
      id="review-date"
      label="Datum recenserat"
      type="date"
      defaultValue={new Date().toISOString().slice(0, 10)}
      InputLabelProps={{shrink: true}}
      onChange={props.updateDate}
      style={{width: "50vw", margin:10}}
    />
  </form>
)

const MealSelect = function(props) {
  return <ComboBox value={props.meal} error={props.error} label="Måltid" id="meal" options={props.meals} addNew={props.addNew} onChange={props.updateMeal} />;
}

const SimpleSelect = props => (
  <FormControl style={{width: "50vw", margin:20}}>
    <InputLabel id={props.id + "-select-label"}>{props.label}</InputLabel>
    <Select
      labelId={props.id + "-select-label"}
      id={props.id + "-select"}
      value={props.value}
      onChange={props.onChange}
    >
      {List(props.options).map(item => <MenuItem value={item} key={item}>{item}</MenuItem>).toArray()}
    </Select>
  </FormControl>
  )

const GridRow = (props) => (
  <Grid container item direction="row" justify={props.justify || "center"}>
    <div className={props.collapse ? "collapse in" : ""}>
      {props.children}
    </div>
  </Grid>
  )

export default class AddReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantMeta:[], meals:[], username:getUsername(), ...defaultState
    };
    this.toggleNewRestaurant = (show) => this.setState({newRestaurant: show});
    this.toggleNewMeal = (show) => this.setState({newMeal: show});
    this.updateMeal = (event, value) => this.setState({meal: firstLetterUpperCase(value), mealError:false});
    this.updateNewMealDesc = (event) => this.setState({description: firstLetterUpperCase(event.target.value), descriptionError:false});
    this.updateWebsite = (event) => this.setState({website: event.target.value, websiteError:false});
    this.updateAddress = (event) => this.setState({address: firstLetterUpperCase(event.target.value), addressError:false});
    this.updateSeats = (event, value) => this.setState({seats: value});
    this.updateDate = (event, value) => this.setState({timestamp: value});
    this.updatePrice = (event) => this.setState({price: parseInt(event.target.value.replace(/[^0-9,]/g, "") || 0)});
    this.updateTaste = (event, value) => this.setState({tasteScore: value});
    this.updateExtras = (event, value) => this.setState({extrasScore: value});
    this.updateInnovation = (event, value) => this.setState({innovationScore: value});
    this.updateReview = (event) => this.setState({mealReview: firstLetterUpperCase(event.target.value), reviewError:false});
    this.updateComment = (event) => this.setState({restaurantComment: firstLetterUpperCase(event.target.value)});
    this.updateEnviroment = (event, value) => this.setState({environmentScore: value});
    this.updateHeat = (event) => this.setState({heat: event.target.value});
    this.updatePortionSize = (event) => this.setState({portionSize: event.target.value});
    this.updateWaitTime = (event) => this.setState({waitTime: event.target.value});
    this.updatePayInAdvance = (event) => this.setState({payInAdvance: event.target.value});
    this.updateTags = (event, value) => this.setState({tags: value});
    this.updateOrigin = (event, value) => this.setState({origin: value});
    this.clear = this.clear.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onFocus() {
    this.setState({username: getUsername()});
  }

  updateRestaurant(event, value) {
    const { restaurantMeta } = this.state;
    this.setState({restaurant: value, restaurantError: false})

    restaurantMeta.forEach(restaurant => {
      if (value === restaurant.name) {
        getRestaurantReviews(restaurant.reviewPointer)
        .then(reviews => {;
          var meals = {};
          reviews.forEach(review => {
            if (!meals[review.meal]) {
              meals[review.meal] = review.description
            }
          });

          this.setState({"meals": meals});
        });
      } else {
        this.setState({"meals": []});
      }
    });
  }

  validateFields() {
    const { 
      meal, restaurant, restaurantMeta, description, website, address, mealReview, price
    } = this.state;
    const isNewRestaurant = !restaurantMeta.some(meta => meta.name === restaurant);
    const missingDefaultValues = [meal, restaurant, mealReview, price].filter(v => !v).length;
    const missingNewRestaurantValues = isNewRestaurant && [description, website, address].filter(v => !v).length;


    if (!missingDefaultValues && !missingNewRestaurantValues) {
      return true;
    }
    if (!meal) {
      this.setState({"mealError": true});
    }
    if (!price) {
      this.setState({"priceError": true});
    }
    if (!mealReview) {
      this.setState({"reviewError": true});
    }
    if (!restaurant) {
      this.setState({"restaurantError": true});
    }
    if (isNewRestaurant) {
      if (!description) {
        this.setState({"descriptionError": true});
      }
      if (!website) {
        this.setState({"websiteError": true});
      }
      if (!address) {
        this.setState({"addressError": true});
      }
    }
    return false;
  }

  clear() {
    this.setState(defaultState);
  }

  componentDidMount() {
    window.addEventListener("focus", this.onFocus)
    getRestaurantMeta()
    .then(
      meta => this.setState({restaurantMeta: Object.values(meta)})
    );
  }

  componentWilUnmount() {
      window.removeEventListener("focus", this.onFocus)
  }

  render() {
    const { 
      restaurantMeta, seats, restaurant, newRestaurant, meals, newMeal, description, meal, mealError,
      restaurantError, descriptionError, website, websiteError, address, addressError, tasteScore, heat,
      mealReview, reviewError, environmentScore, restaurantComment, innovationScore, price, priceError,
      portionSize, extrasScore, waitTime, payInAdvance, username
    } = this.state;
    const restaurants = List(restaurantMeta).map(meta => meta.name).toArray();

    return (
      <>
        <LoginForm/>
        <ThemeProvider theme={theme}>
          <h1 className="page-header text-center">Recensera</h1>
          <Grid container spacing={2} >
            <GridRow>
              <RestaurantSelect restaurant={restaurant} error={restaurantError} restaurants={restaurants} updateRestaurant={this.updateRestaurant} addNew={this.toggleNewRestaurant}/>
            </GridRow>
            <GridRow collapse={!newRestaurant}>
              <NewRestaurant website={website} websiteError={websiteError} updateWebsite={this.updateWebsite} address={address} addressError={addressError} updateAddress={this.updateAddress} 
              seats={seats} updateSeats={this.updateSeats} updateTags={this.updateTags} updateOrigin={this.updateOrigin} payInAdvance={payInAdvance} updatePayInAdvance={this.updatePayInAdvance} />
            </GridRow>
            <GridRow>
              <MealSelect meal={meal} error={mealError} updateMeal={this.updateMeal} meals={Object.keys(meals)} addNew={this.toggleNewMeal}/>
            </GridRow>
            <GridRow collapse={!newMeal}>
              <NewMeal desc={description} descError={descriptionError} updateDesc={this.updateNewMealDesc} />
            </GridRow>
          </Grid>
          <Grid container spacing={2} >
            <GridRow>
              <ReviewDate updateDate={this.updateDate} />
            </GridRow>  
            <GridRow>
              <TextField required value={price} onChange={this.updatePrice} error={priceError} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
            </GridRow>
            <GridRow>
              <SimpleSelect id="wait-time" label="Tid innan servering" value={waitTime} onChange={this.updateWaitTime} options={waitTimeOptions}/>
            </GridRow>
            <GridRow>
              <SimpleSelect id="heat" label="Hetta" value={heat} onChange={this.updateHeat} options={heatOptions}/>
            </GridRow>
            <GridRow>
              <SimpleSelect id="portion-size" label="Portionsstorlek" value={portionSize} onChange={this.updatePortionSize} options={potionSizeOptions}/>
            </GridRow>
            <GridRow>
              <Score label="Smak" score={tasteScore} updateScore={this.updateTaste} multiplier={username === "hampus" ? 10 : 1}/>
            </GridRow>
            <GridRow>
              <Score label="Omgivning" score={environmentScore} updateScore={this.updateEnviroment} />
            </GridRow>
            <GridRow>
              <Score label="Nytänkande" score={innovationScore} updateScore={this.updateInnovation} />
            </GridRow>
            <GridRow>
              <Score label="Tillbehör" score={extrasScore} updateScore={this.updateExtras} />
            </GridRow>
            <GridRow>
              <TextField value={restaurantComment} onChange={this.updateComment} id="comment-field" label="Restaurang kommentar" style={{width: "50vw", margin: 10}} />
            </GridRow>
            <GridRow>
              <TextField required value={mealReview} onChange={this.updateReview} error={reviewError} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
            </GridRow>
            <GridRow>
              <SaveButton state={this.state} clear={this.clear} validate={this.validateFields} />
            </GridRow>
          </Grid>
        </ThemeProvider>
      </>
    );
  }
}