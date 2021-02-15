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
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { svSE } from "@material-ui/core/locale";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import CachedIcon from "@material-ui/icons/Cached";
import { firstLetterUpperCase } from "../utils"
import { List as ImmutableList } from "immutable";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import * as api from "../api"
import _ from "lodash";
import { getUsername } from "../login"

export const tagOptions = ["Take away", "Bokningsbar", "Företag", "Café", "Vegetariskt", "Veganskt", "Buffé", "Pizza", "Taco", "Ramen", "Hamburgare", "Kebab"];

export const TasteHelp = () => (
  <GridRow>
    <Typography variant="h6" justify-self="center">
      Betygssättning av smak
    </Typography>
    <Grid container direction="row" spacing={0}>
      <List dense >
        <ListItem>
          <ListItemText primary="10 - Inte gott" />
        </ListItem>
        <ListItem>
          <ListItemText primary="20 - Varierande kvalité eller smaklöst" />
        </ListItem>
        <ListItem>
          <ListItemText primary="30 - Lite tråkigt" />
        </ListItem>
        <ListItem>
          <ListItemText primary="40 - Bra men väldigt standard" />
        </ListItem>
        <ListItem>
          <ListItemText primary="50 - Goda komponenter men ingen perfekt rätt" />
        </ListItem>
        <ListItem>
          <ListItemText primary="60 - God rätt, äter den gärna igen" />
        </ListItem>
        <ListItem>
          <ListItemText primary="70 - Välkomponerad rätt med bra råvarorna" />
        </ListItem>
        <ListItem>
          <ListItemText primary="80 - Imponerande rätt, inkluderar smaker som är svårhittade i Stockholm" />
        </ListItem>
        <ListItem>
          <ListItemText primary="90 - En matupplevelse" />
        </ListItem>
        <ListItem>
          <ListItemText primary="100 - Bästa maträtten i Stockholm (i sin kategori)" />
        </ListItem>
      </List>
    </Grid>
  </GridRow>
);

export const UnmatchedImages = (props) => (
  <Box display="flex" flexDirection="column" alignItems="center" alignContent="center" p={2}>
    <Typography variant="h6">
       Inkludera en bild på måltiden
    </Typography>
    <Typography align="center" paragraph>Maila din bild till <a href="mailto:pics@sthlmlunch.se">pics@sthlmlunch.se</a> för att se den här och använda den i din recension.</Typography>
    {
      props.imageKeys && props.imageKeys.length ? props.imageKeys.map(imageKey => (
        <Box key={imageKey} display="flex" flexDirection="row" justifyContent="center" alignContent="center" alignItems="center">
          <Box display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img width={150} height={150} alt="pre-sent" style={{padding: "10px", borderRadius: "50%"}} src={"https://sthlmlunch-pics.s3.amazonaws.com/processed/" + imageKey}/>
            <input type="checkbox" value={imageKey.replace(".jpg", "")} checked={props.selectedImageRef === imageKey.replace(".jpg", "")} onChange={(e) => props.onChange(e.target.value)}/>
          </Box>
         </Box>
       )) : (
        <Typography align="center" paragraph>
          Inga bilder har laddats upp i förväg! <br/>Du kan skicka bilder till <a href="mailto:pics@sthlmlunch.se">pics@sthlmlunch.se</a> utan att ange någonting och sedan välja den här.
        </Typography>
      )
    }
  </Box>
);

export const originOptions = ["Afrika", "Asien", "Mellanöstern", "Nordamerika", "Nordeuropa", "Sydamerika", "Sydeuropa"];
export const heatOptions = ["Ingen hetta", "Lite hetta", "Lagom hetta", "Stark", "För stark", "Alldeles för stark"];
export const potionSizeOptions = ["Lite", "Under medel", "Medel", "Över medel", "Mycket"];
export const waitTimeOptions = ["< 5 min", "< 10 min", "< 20 min", "< 30 min", "> 30 min"];
export const defaultState = {
  newMeal: false, description: "", price: "", portionSize: "Medel", tasteScore: 5, environmentScore: 5, innovationScore: 5, unmatchedImages: [], menuType: "other",
  meal: "", restaurant: "", timestamp: new Date().toISOString().slice(0, 10), review: "", extrasScore: 5, heat: "Ingen hetta", waitTime: "< 20 min"
};

export const saveWhiteList = [
  "tasteScore", "environmentScore", "meal", "description", "price", "menuType", "totalPrice", "portionSize", "heat", 
  "waitTime", "totalTime", "extrasScore", "innovationScore", "review", "timestamp", "restaurant"
]

export const theme = createMuiTheme({
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
  review.imageRef = state.imageRef || state.reviewId;
  const request = { review: review };
  if (state.reviewPointer) {
      request.reviewPointer = state.reviewPointer;
  } else {
    state.restaurantMeta.forEach(restaurant => {
      if (restaurant.name === state.restaurant) {
        request.reviewPointer = restaurant.reviewPointer;
      }
    });
  }
  return request;
}


export function saveNewReview(state) {
  window.mixpanel.track("Add review", {"reviewer": state.username});
  return api.addReview(buildReviewRequest(state)).then(response => response.status === 201);
}

export function saveRestaurant(params) {
  window.mixpanel.track("Add restaurant", {"reviewer": getUsername()});
  return api.addRestaurant(params);
}

export function saveReview(state) {
  window.mixpanel.track("Edit review", {"reviewer": state.username});
  return api.editReview(buildReviewRequest(state)).then(response => response.status === 201);
}

export function deleteReview(state) {
  window.mixpanel.track("Delete review", {"reviewer": state.username});
  return api.deleteReview(buildReviewRequest(state)).then(response => response.status === 201);
}

export const SaveButton = function(props) {
  const saveIconNode = <SaveIcon style={{ color: "green", opacity: props.disabled ? .4 : 1}}/>;
  return (
    <Button size="large" style={{margin: 10}} variant="outlined" onClick={props.onClick} disabled={props.disabled} startIcon={saveIconNode}>
      Spara
    </Button>
  );
}

export const ReloadButton = function(props) {
  const reloadIconNode = <CachedIcon style={{ color: "green", opacity: props.disabled ? .4 : 1}}/>;
  return (
    <Button size="large" style={{margin: 10}} variant="outlined" onClick={props.onClick} disabled={props.disabled} startIcon={reloadIconNode}>
      Hämta om bilder
    </Button>
  );
}

export const DeleteButton = function(props) {
  const deleteIconNode = <DeleteIcon fontSize="large" style={{ color: "red"}}/>;
  return (
    <Button size="large" style={{margin: 10}} variant="outlined" onClick={props.onClick} disabled={props.disabled} startIcon={deleteIconNode}>
      Radera
    </Button>
  );
}

export const TagSelect = function(props) {
  return (
    <GridRow>
      <Autocomplete
        forcePopupIcon
        autoSelect
        multiple
        freeSolo
        value={props.value}
        disabled={props.disabled}
        options={tagOptions}
        id="tag-selector"
        renderTags={(value, getTagProps) => (
          value.map((option, index) => (
            <Chip key={option} label={firstLetterUpperCase(option)} {...getTagProps({ index })} />
          ))
        )}
        noOptionsText=""
        getOptionSelected={(x, y) => x && y && x.toLowerCase() === y.toLowerCase()}
        onChange={props.onChange}
        style={{ width: "50vw", margin: 10 }}
        renderInput={params => <TextField {...params} label="Nyckelord" />}
      />
    </GridRow>
  );
}

export const OriginSelect = function(props) {
  return (
    <GridRow>
      <Autocomplete
        forcePopupIcon
        multiple
        id="origin-selector"
        value={props.value}
        disabled={props.disabled}
        options={originOptions}
        renderTags={(value, getTagProps) => (
          value.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))
        )}
        noOptionsText=""
        getOptionSelected={(x, y) => x && y && x.toLowerCase() === y.toLowerCase()}
        onChange={props.onChange}
        style={{ width: "50vw", margin: 10}}
        renderInput={params => (
          <TextField {...params} label="Ursprung" />
        )}
      />
    </GridRow>
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
      forcePopupIcon={!!props.options.length}
      noOptionsText=""
      getOptionSelected={(x, y) => x && y && x.toLowerCase() === y.toLowerCase()}
      openText={props.openText}
      style={{width: "50vw"}}
      renderInput={params => <TextField {...params} required error={props.error} helperText={props.helperText} label={props.label} />}
      onInputChange={onInputChange}
    />
  );
}

export const RestaurantSelect = function(props) {
  return (
    <Autocomplete
      clearOnEscape
      autoHighlight
      freeSolo={props.freeSolo}
      id="restaurant-combo-box"
      options={props.restaurants}
      noOptionsText=""
      filterOptions={options => options}
      getOptionSelected={(x, y) => x && y && x.toLowerCase().replace(/[^a-zåäö0-9]/g, "") === y.toLowerCase().replace(/[^a-zåäö0-9]/g, "")}
      openText="Öppna"
      style={{width: "50vw"}}
      renderInput={params => <TextField {...params} required error={props.error} helperText={props.helperText} label="Restaurang" />}
      onInputChange={props.updateRestaurant}
    />
  );
}

export const NewMeal = props => (
  <>
    <h4 style={{marginTop: 20}}>Definera ny måltid</h4>
    <TextField required error={!!props.error} helperText={props.descError} value={props.desc} id="meal-description-field" label="Beskrivning" style={{width: "50vw", marginBottom: 30}} onChange={props.updateDesc}/>
  </>
);

export const RestaurantSeats = props => (
  <GridRow>
    <div className="mt-2">
    <FormLabel id="seats" component="legend">Sittplatser</FormLabel>
    <RadioGroup row aria-label="seats" name="Seats" value={props.seats} onChange={props.onChange}>
      <FormControlLabel disabled={props.disabled} value="<15" control={<Radio />} label="<15" />
      <FormControlLabel disabled={props.disabled} value="15-25" control={<Radio />} label="15-25" />
      <FormControlLabel disabled={props.disabled} value="25-35" control={<Radio />} label="25-35" />
      <FormControlLabel disabled={props.disabled} value="35-50" control={<Radio />} label="35-50" />
      <FormControlLabel disabled={props.disabled} value=">50" control={<Radio />} label=">50" />
    </RadioGroup>
    </div>
  </GridRow>
);

export const MenuType = props => (
  <GridRow>
    <div className="mt-2">
      <FormLabel id="menu-type" component="legend">Rättens menu-typ</FormLabel>
      <RadioGroup row aria-label="menu-type" name="Seats" value={props.menuType || "other"} onChange={props.updateMenuType}>
      <FormControlLabel disabled={props.disabled} value="daily" control={<Radio />} label="Dagens rätt" />
      <FormControlLabel disabled={props.disabled} value="weekly" control={<Radio />} label="Veckans rätt" />
      <FormControlLabel disabled={props.disabled} value="other" control={<Radio />} label="Annan" />
      </RadioGroup>
    </div>
  </GridRow>
);

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
      valueLabelDisplay="on"
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
      disabled={props.disabled}
      />
    </form>
  </GridRow>
)

export const MealSelect = function(props) {
  return <ComboBox value={props.meal} error={!!props.error} helperText={props.error} label="Måltid" id="meal" options={props.meals} addNew={props.addNew} onChange={props.updateMeal} />;
}

export const SimpleSelect = props => (
  <GridRow>
    <InputLabel id={props.id + "-select-label"} style={{fontSize: ".8rem"}}>{props.label}</InputLabel>
    <Select
    labelId={props.id + "-select-label"}
    id={props.id + "-select"}
    value={props.value}
    disabled={props.disabled}
    onChange={props.onChange}
    style={{width: "50vw"}}
    >
    {ImmutableList(props.options).map(item => <MenuItem value={item} key={item}>{item}</MenuItem>).toArray()}
    </Select>
  </GridRow>
);

export const GridRow = (props) => (
  <Grid container item direction="column" justify={props.justify || "center"} alignContent={props.alignContent || "center"} alignItems={props.alignItems || "center"}>
    <Box className={props.collapse ? "collapse in" : ""}>
      {props.children}
    </Box>
  </Grid>
);

export function SimpleModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <div>
      <Modal
      aria-labelledby="modal-title"
      open={props.open}
      onClose={props.handleClose}
      >
      <div style={modalStyle} className={classes.paper}>
        { props.text ? <h2 id="modal-title" className="text-center">{props.text}</h2>  : <></>}
        { props.node }
      </div>
      </Modal>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  page: {
    width: "80%"
  },
  paper: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    border: "2px solid green",
    padding: theme.spacing(4),
    margin: "auto",
    textAlign: "center"
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: "50%",
    transform: `translate(-${top}%, -${left}%)`,
  };
}
