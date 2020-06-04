import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import InputAdornment from "@material-ui/core/InputAdornment";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { svSE } from "@material-ui/core/locale";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Explore from "@material-ui/icons/Explore";
import { firstLetterUpperCase } from "./utils.js"
import { List as ImmutableList } from "immutable";
import * as api from "./api.js"
import _ from "lodash";

export const tagOptions = [
  {"id": "takeaway", "title": "Take away"},
  {"id": "bookable", "title": "Bokningsbar"},
  {"id": "businessLunch", "title": "Business lunch"},
  {"id": "vegetarian", "title": "Vegetariskt"},
  {"id": "vegan", "title": "Veganskt"}
];

export const TasteHelp = () => (
  <GridRow>
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
  </GridRow>
);

export const originOptions = [
  "Afrika", "Asien", "Mellanöstern", "Nordamerika", "Nordeuropa", "Sydamerika", "Sydeuropa"
];
export const heatOptions = ["Ingen hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];
export const potionSizeOptions = ["Lite", "Under medel", "Medel", "Över medel", "Mycket"];
export const waitTimeOptions = ["< 5 min", "< 10 min", "< 20 min", "< 30 min", "> 30 min"];
export const defaultState = {
  newRestaurant:false, newMeal:false, description:"", price:"", portionSize: "Medel",
  meal:"", restaurant:"", address:"", website:"", seats:null, timestamp:new Date().toISOString().slice(0, 10),
  review:"", restaurantComment:"", tasteScore:5, environmentScore:5, innovationScore:5,
  extrasScore:5, heat:"Ingen hetta", waitTime:"< 20 min", payInAdvance:"Ja", menuType: "other"
};

export const saveWhiteList = [
  "tasteScore", "environmentScore", "meal", "description", "price", "menuType",
  "totalPrice", "portionSize", "heat", "waitTime", "totalTime", "extrasScore", 
  "innovationScore", "restaurantComment", "review", "timestamp"
]

export const theme = createMuiTheme({
  palette: {
    primary: { main: "#e1e5eb" },
  }
}, svSE);


function buildReviewRequest(state) {
  console.log(state)
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
    if (state.reviewPointer) {
      request.reviewPointer = state.reviewPointer
    } else {
      state.restaurantMeta.forEach(restaurant => {
        if (restaurant.name === state.restaurant) {
          request.reviewPointer = restaurant.reviewPointer
        }
      });
    }
  }
  return request;
}


export function saveNewReview(state, clear, validate) {
  if (!validate || validate()) {
    api.addReview(buildReviewRequest(state)).then(response => {
      if (response.status !== 201) {
        alert(`Failed to add review! Error code: ${response.status}.`);
      }
    });
    if (clear) {
      clear();
    }
  }
}

export function saveReview(state) {
  api.editReview(buildReviewRequest(state)).then(response => {
    if (response.status !== 201) {
      alert(`Failed to edit review! Error code: ${response.status}.`);
    }
  });
}

export function deleteReview(state) {
  api.deleteReview(buildReviewRequest(state)).then(response => {
    if (response.status !== 201) {
      alert(`Failed to delete review! Error code: ${response.status}.`);
    }
  });
}

export const SaveButton = function(props) {
  return (
    <Button onClick={() => props.onClick(props.state, props.clear, props.validate)} style={{"margin": 50}}>
      <SaveIcon fontSize="large" style={{ color: "green"}}/>
      Spara
    </Button>
  );
}

export const DeleteButton = function(props) {
  return (
    <Button onClick={() => props.onClick(props.state)} style={{"margin": 50}}>
      <DeleteIcon fontSize="large" style={{ color: "red"}}/>
      Radera
    </Button>
  );
}

export const TagSelect = function(props) {
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

export const OriginSelect = function(props) {
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

export const ComboBox = function(props) {
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
export const RestaurantSelect = function(props) {
  return <ComboBox value={props.restaurant} error={props.error} label="Restaurang" id="restaurant" onChange={props.updateRestaurant} options={props.restaurants} addNew={props.addNew} openText="Öppna" />;
}

export const NewRestaurant = function(props) {
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

export const NewMeal = props => (
  <>
    <h4 style={{marginTop: 20}}>Definera ny måltid</h4>
    <TextField required error={!!props.error} helperText={props.descError} value={props.desc} id="meal-description-field" label="Beskrivning" style={{width: "50vw", marginBottom: 30}} onChange={props.updateDesc}/>
  </>
);

export const RestaurantSeats = props => (
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

export const MenuType = props => (
  <GridRow>
    <div className="mt-2">
      <FormLabel id="menu-type" component="legend">Rättens menu-typ</FormLabel>
      <RadioGroup row aria-label="menu-type" name="Seats" value={props.menuType || "other"} onChange={props.updateMenuType}>
        <FormControlLabel value="daily" control={<Radio />} label="Dagens rätt" />
        <FormControlLabel value="weekly" control={<Radio />} label="Veckans rätt" />
        <FormControlLabel value="other" control={<Radio />} label="Annan" />
      </RadioGroup>
    </div>
  </GridRow>
)

export const Score = props => (
  <GridRow>
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
  </GridRow>
);
Score.defaultProps = {multiplier: 1}

export const ReviewDate = props => (
  <GridRow>
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
  </GridRow>
)

export const MealSelect = function(props) {
  return <ComboBox value={props.meal} error={!!props.error} helperText={props.error} label="Måltid" id="meal" options={props.meals} addNew={props.addNew} onChange={props.updateMeal} />;
}

export const SimpleSelect = props => (
  <GridRow>
      <InputLabel id={props.id + "-select-label"}>{props.label}</InputLabel>
      <Select
        labelId={props.id + "-select-label"}
        id={props.id + "-select"}
        value={props.value}
        onChange={props.onChange}
        style={{width: "50vw"}}
      >
        {ImmutableList(props.options).map(item => <MenuItem value={item} key={item}>{item}</MenuItem>).toArray()}
      </Select>
  </GridRow>
);

export const GridRow = (props) => (
  <Grid container item direction="row" justify={props.justify || "center"} >
    <div className={props.collapse ? "collapse in" : ""}>
      {props.children}
    </div>
  </Grid>
  )