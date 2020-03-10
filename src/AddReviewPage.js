import React, { Component } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { 
  Button, TextField, Grid, Chip, Slider, Radio, RadioGroup, FormControlLabel, FormControl,
  FormLabel, InputAdornment, MenuItem, Select, InputLabel, List, ListItem, ListItemText, Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Explore from '@material-ui/icons/Explore';
import { svSE } from "@material-ui/core/locale";
import { firstLetterUpperCase } from "./utils.js"
import { getRestaurantMeta, getRestaurantReviews, addReview } from "./api.js"
import { List as ImmutableList } from 'immutable';
import LoginForm from './LoginForm.js';
import { getUsername } from './login.js';
import _ from 'lodash';

const tagOptions = [
  {"id": "takeaway", "title": "Take away"},
  {"id": "bookable", "title": "Bokningsbar"},
  {"id": "businessLunch", "title": "Business lunch"}
];

const TasteHelp = () => (
  <>
    <Typography variant="h6" justify-self="center">
        Betygssättning av smak
    </Typography>
    <Grid container direction="row" spacing={0}>
      <List dense >
        <ListItem>
          <ListItemText primary="1 - Inte gott" />
        </ListItem>
        <ListItem>
          <ListItemText primary="2 - Varierande kvalité eller smaklöst" />
        </ListItem>
        <ListItem>
          <ListItemText primary="3 - Lite tråkigt" />
        </ListItem>
        <ListItem>
          <ListItemText primary="4 - Bra men väldigt standard" />
        </ListItem>
        <ListItem>
          <ListItemText primary="5 - Goda komponenter men ingen perfekt rätt" />
        </ListItem>
        <ListItem>
          <ListItemText primary="6 - God rätt, äter den gärna igen" />
        </ListItem>
        <ListItem>
          <ListItemText primary="7 - God rätt som sticker ut i hur välkomponerad den är eller i kvaliteten av råvarorna" />
        </ListItem>
        <ListItem>
          <ListItemText primary="8 - Imponerande rätt, inkluderar smaker som är svårhittade i Stockholm" />
        </ListItem>
        <ListItem>
          <ListItemText primary="9 - En matupplevelse" />
        </ListItem>
        <ListItem>
          <ListItemText primary="10 - Bästa maträtten i Stockholm (i sin kategori)" />
        </ListItem>
      </List>
    </Grid>
  </>
);

const originOptions = [
  "Afrika", "Asien", "Mellanöstern", "Nordamerika", "Nordeuropa", "Sydamerika", "Sydeuropa"
];
const heatOptions = ["Ingen hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];
const potionSizeOptions = ["Lite", "Under medel", "Medel", "Över medel", "Mycket"];
const waitTimeOptions = ["< 5 min", "< 10 min", "< 20 min", "< 30 min", "> 30 min"];
const defaultState = {
  newRestaurant:false, newMeal:false, description:"", price:"", portionSize: "Medel",
  meal:"", restaurant:"", address:"", website:"", seats:null, timestamp:new Date().toISOString().slice(0, 10),
  review:"", restaurantComment:"", tasteScore:5, environmentScore:5, innovationScore:5,
  extrasScore:5, heat:"Ingen hetta", waitTime:"< 20 min", payInAdvance:"Ja", menuType: "other"
};

const saveWhiteList = [
  "tasteScore", "environmentScore", "meal", "description", "price", "menuType",
  "totalPrice", "portionSize", "heat", "waitTime", "totalTime", "extrasScore", 
  "innovationScore", "restaurantComment", "review", "timestamp"
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
  if (state.newRestaurant) {
    var tags = [];
    if (state.tags) {
      state.tags.forEach(tag => tags.push(tag.title))
    }
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
    <Autocomplete
      autoComplete
      clearOnEscape
      freeSolo
      id={`${props.id}-combo-box`}
      options={props.options}
      noOptionsText=""
      getOptionSelected={(x, y) => x && y && x.toLowerCase() === y.toLowerCase()}
      openText={props.openText}
      style={{width: "50vw"}}
      renderInput={params => <TextField {...params} required error={props.error} label={props.label} />}
      onInputChange={onInputChange}
    />
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
        <TextField required value={props.address} onChange={props.updateAddress} error={!!props.addressError} helperText={props.addressError} id="restaurant-address-field" label="Address" style={{width: "50vw", margin: 10}} InputProps={{endAdornment: <InputAdornment position="end"><LocationOnIcon /></InputAdornment>}} />
      </GridRow>
      <GridRow>
        <TextField required value={props.website} onChange={props.updateWebsite} error={!!props.websiteError} helperText={props.websiteError} id="restaurant-website-field" label="Hemsida" style={{width: "50vw", margin: 10}} InputProps={{endAdornment: <InputAdornment position="end"><Explore /></InputAdornment>}} />
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
    <TextField required error={!!props.error} helperText={props.descError} value={props.desc} id="meal-description-field" label="Beskrivning" style={{width: "50vw", marginBottom: 30}} onChange={props.updateDesc}/>
  </>
);

const RestaurantSeats = props => (
  <div className="mt-2">
    <FormLabel id="seats" component="legend">Sittplatser</FormLabel>
    <RadioGroup row aria-label="seats" name="Seats" value={props.seats || "25-35"} onChange={props.updateSeats}>
      <FormControlLabel value="<15" control={<Radio />} label="<15" />
      <FormControlLabel value="15-25" control={<Radio />} label="15-25" />
      <FormControlLabel value="25-35" control={<Radio />} label="25-35" />
      <FormControlLabel value="35-50" control={<Radio />} label="35-50" />
      <FormControlLabel value=">50" control={<Radio />} label=">50" />
    </RadioGroup>
  </div>
)

const MenuType = props => (
  <div className="mt-2">
    <FormLabel id="menu-type" component="legend">Rättens menu-typ</FormLabel>
    <RadioGroup row aria-label="menu-type" name="Seats" value={props.menuType || "other"} onChange={props.updateMenuType}>
      <FormControlLabel value="daily" control={<Radio />} label="Dagens rätt" />
      <FormControlLabel value="weekly" control={<Radio />} label="Veckans rätt" />
      <FormControlLabel value="other" control={<Radio />} label="Annan" />
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
      min={1}
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
      value={props.value}
      InputLabelProps={{shrink: true}}
      onChange={props.updateDate}
      style={{width: "50vw", margin:10}}
    />
  </form>
)

const MealSelect = function(props) {
  return <ComboBox value={props.meal} error={!!props.error} helperText={props.error} label="Måltid" id="meal" options={props.meals} addNew={props.addNew} onChange={props.updateMeal} />;
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
      {ImmutableList(props.options).map(item => <MenuItem value={item} key={item}>{item}</MenuItem>).toArray()}
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
      var websiteError = "";
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
    this.setState({restaurant: value, restaurantError: ""})

    restaurantMeta.forEach(restaurant => {
      if (value.toLowerCase() === restaurant.name.toLowerCase()) {
        getRestaurantReviews(restaurant.reviewPointer)
        .then(reviews => {;
          var meals = {};
          reviews.forEach(review => {
            if (!meals[review.meal]) {
              meals[review.meal] = review.description
            }
          });

          this.setState({meals: meals, newRestaurant: false, restaurant: restaurant.name});
        });
      } else {
        this.setState({meals: []});
      }
    });
  }

  validateFields() {
    const { 
      meal, restaurant, restaurantMeta, description, website, address, review, price
    } = this.state;
    const isNewRestaurant = !restaurantMeta.some(meta => meta.name === restaurant);
    const missingDefaultValues = [meal, restaurant, review, price].filter(v => !v).length;
    const missingNewRestaurantValues = isNewRestaurant && [description, website, address].filter(v => !v).length;


    if (!missingDefaultValues && !missingNewRestaurantValues) {
      return true;
    }
    if (!meal) {
      this.setState({"mealError": "Missing value"});
    }
    if (!price) {
      this.setState({"priceError": "Missing value"});
    }
    if (!review) {
      this.setState({"reviewError": "Missing value"});
    }
    if (!restaurant) {
      this.setState({"restaurantError": "Missing value"});
    }
    if (isNewRestaurant) {
      if (!description) {
        this.setState({"descriptionError": "Missing value"});
      }
      if (!website) {
        this.setState({"websiteError": "Missing value"});
      }
      if (!address) {
        this.setState({"addressError": "Missing value"});
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
      review, reviewError, environmentScore, restaurantComment, innovationScore, price, priceError,
      portionSize, extrasScore, waitTime, payInAdvance, username, timestamp, menuType
    } = this.state;
    const restaurants = ImmutableList(restaurantMeta).map(meta => meta.name).toArray();

    return (
      <>
        <LoginForm/>
        <ThemeProvider theme={theme}>
          <h1 className="page-header text-center">Recensera</h1>
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
            <GridRow>
              <ReviewDate value={timestamp} updateDate={this.updateDate} />
            </GridRow>
            <GridRow>
              <MenuType menuType={menuType} updateMenuType={this.updateMenuType}/>
            </GridRow>  
            <GridRow>
              <TextField required value={price} onChange={this.updatePrice} error={!!priceError} helperText={priceError} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
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
              <TasteHelp />
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
              <TextField required value={review} onChange={this.updateReview} error={!!reviewError} helperText={reviewError} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
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