import React, { Component } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Button, TextField, Grid, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import { svSE } from "@material-ui/core/locale";
import { firstLetterUpperCase } from "./utils.js"
import { getRestaurantMeta, getRestaurantReviews } from "./api.js"
import { List } from 'immutable';

const tags = [
  {"id": "takeaway", "title": "Take Away"},
  {"id": "bookable", "title": "Bokningsbar"}
];


const theme = createMuiTheme({
  palette: {
    primary: { main: "#e1e5eb" },
  },
}, svSE);


function save(state, clear, validate) {
  if (validate()) {
    clear();
  }
}

const SaveButton = function(props) {
  return (
    <Button onClick={() => save(props.state, props.clear, props.validate)} style={{"marginBottom": 50}}>
      <SaveIcon fontSize="large" style={{ color: "green"}}/>
    </Button>
  );
}

const TagSelect = function(props) {
  return (
    <Autocomplete
      multiple
      id="tag-selector"
      options={tags}
      getOptionLabel={option => option.title}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option.title} {...getTagProps({ index })} />
        ))
      }
      noOptionsText=""
      getOptionSelected={(x, y) => x && y && x.id === y.id}
      disableOpenOnFocus={true}
      style={{ width: 500 }}
      renderInput={params => (
        <TextField {...params} label="Nyckelord" />
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
        loading={!props.options}
        noOptionsText=""
        openText={props.openText}
        style={{width: 500, "minWidth": 300}}
        renderInput={params => <TextField {...params} required error={props.error} label={props.label} variant="outlined" />}
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
      <h4>Definera ny restaurang</h4>
      <div className="row p-2">
        <TextField required value={props.address} onChange={props.updateAddress} error={props.addressError} id="restaurant-address-field" label="Address" style={{width: 500}}/>
      </div>
      <div className="row p-2">
        <TextField required value={props.website} onChange={props.updateWebsite} error={props.websiteError}id="restaurant-website-field" label="Hemsida" style={{width: 500}}/>
      </div>
      <div className="row p-2">
        <TagSelect />
      </div>
    </>
  );
}

const NewMeal = props => (
  <>
    <h4>Definera ny måltid</h4>
    <div className="row p-2">
      <TextField required error={props.descError} value={props.desc} id="meal-description-field" label="Beskrivning" style={{width: 500}} onChange={props.updateDesc}/>
    </div>
  </>
);

const MealSelect = function(props) {
  return <ComboBox value={props.meal} error={props.error} label="Måltid" id="meal" options={props.meals} addNew={props.addNew} onChange={props.updateMeal} />;
}

export default class AddReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {restaurantMeta:[], meals:[], newRestaurant:false, newMeal:false, newMealDesc:"", meal:"", restaurant:"", address:"", website:""};
    this.toggleNewRestaurant = (show) => this.setState({newRestaurant: show});
    this.toggleNewMeal = (show) => this.setState({newMeal: show});
    this.updateMeal = (event, value) => this.setState({meal: firstLetterUpperCase(value), mealError:false});
    this.updateNewMealDesc = (event) => this.setState({newMealDesc: firstLetterUpperCase(event.target.value), newMealDescError:false});
    this.updateWebsite = (event) => this.setState({website: firstLetterUpperCase(event.target.value), websiteError:false});
    this.updateAddress = (event) => this.setState({address: firstLetterUpperCase(event.target.value), addressError:false});
    this.clear = this.clear.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.updateRestaurant = this.updateRestaurant.bind(this);
  }

  updateRestaurant(event, value) {
    const { restaurantMeta } = this.state;
    let restaurantName = firstLetterUpperCase(value);
    this.setState({restaurant: restaurantName, restaurantError: false})

    restaurantMeta.forEach(restaurant => {
      if (restaurantName === restaurant.name) {
        getRestaurantReviews(restaurant.reviewPointer)
        .then(reviews => {;
          this.setState({"meals": [...new Set(reviews.map(review => review.meal) || [])]});
        });
      }
    });
  }

  validateFields() {
    const { meal, restaurant, restaurantMeta, newMealDesc, website, address } = this.state;
    const isNewRestaurant = !restaurantMeta.some(meta => meta.name === restaurant);
    const missingDefaultValues = [meal, restaurant].filter(v => !v).length;
    const missingNewRestaurantValues = isNewRestaurant && [newMealDesc, website, address].filter(v => !v).length;


    if (!missingDefaultValues && !missingNewRestaurantValues) {
      return true;
    }
    if (!meal) {
      this.setState({"mealError": true});
    }
    if (!restaurant) {
      this.setState({"restaurantError": true});
    }
    if (isNewRestaurant) {
      if (!newMealDesc) {
        this.setState({"newMealDescError": true});
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
    this.setState({newMealDesc: "", meal: "", restaurant: ""});
  }

  componentDidMount() {
    getRestaurantMeta()
    .then(
      meta => this.setState({restaurantMeta: Object.values(meta)})
    );
  }


  render() {
    const { 
      restaurantMeta, restaurant, newRestaurant, meals, newMeal, newMealDesc, meal, mealError,
      restaurantError, newMealDescError, website, websiteError, address, addressError 
    } = this.state;
    const restaurants = List(restaurantMeta).map(meta => meta.name).toArray();
    
    
    return (
      <ThemeProvider theme={theme}>
        <h1 className="page-header text-center">Recensera</h1>
        <Grid container spacing={3} className="card-item pb-5">
          <Grid container item direction="row" justify="center">
            <RestaurantSelect restaurant={restaurant} error={restaurantError} restaurants={restaurants} updateRestaurant={this.updateRestaurant} addNew={this.toggleNewRestaurant}/>
          </Grid>
          <Grid container item direction="row" justify="center">
            <div className={!newRestaurant ? "collapse in" : ""}>
              <NewRestaurant website={website} websiteError={websiteError} updateWebsite={this.updateWebsite} address={address} addressError={addressError} updateAddress={this.updateAddress}/>
            </div>
          </Grid>
          <Grid container item direction="row" justify="center">
            <MealSelect meal={meal} error={mealError} updateMeal={this.updateMeal} meals={meals} addNew={this.toggleNewMeal}/>
          </Grid>
          <Grid container item direction="row" justify="center">
            <div className={!newMeal ? "collapse in" : ""}>
              <NewMeal desc={newMealDesc} descError={newMealDescError} updateDesc={this.updateNewMealDesc}/>
            </div>
          </Grid>
        </Grid>
        <Grid container item direction="row" justify="center">
          <SaveButton state={this.state} clear={this.clear} validate={this.validateFields}/>
        </Grid>
      </ThemeProvider>
    );
  }
}