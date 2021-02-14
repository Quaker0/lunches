import React from "react";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Explore from "@material-ui/icons/Explore";
import SubwayIcon from "@material-ui/icons/Subway";

import { RestaurantSelect, SaveButton, SimpleSelect, saveRestaurant, TagSelect, OriginSelect, RestaurantSeats, GridRow, SimpleModal } from "./adminReviewUtils.js";
import { firstLetterUpperCase, toPointer } from "../utils.js";
import { getRestaurantMeta, getPlaces, getPlaceDetails } from "../api";


export default function AddRestaurantPage(props) {
  const [ payInAdvance, setPayInAdvance ] = React.useState("Ja");
  const [ restaurant, setRestaurant ] = React.useState("");
  const [ address, setAddress ] = React.useState("");
  const [ website, setWebsite ] = React.useState("");
  const [ tags, setTags ] = React.useState([]);
  const [ origins, setOrigins ] = React.useState([]);
  const [ seats, setSeats ] = React.useState("25-35");
  const [ errors, setErrors ] = React.useState({});
  const [ saveDisabled, setSaveDisabled ] = React.useState(false);
  const [ restaurantMeta, setRestaurantMeta ] = React.useState({});
  const [ places, setPlaces ] = React.useState([]);
  const [ placeDetails, setPlaceDetails ] = React.useState([]);
  const [ openSaveConfirmation, setOpenSaveConfirmation ] = React.useState(false);
  const [ lastRestaurantSearch, setLastRestaurantSearch ] = React.useState("");
  const [ lastPlaceSearch, setPlaceSearch ] = React.useState({});
  const [ getPlacesTimeout, setGetPlacesTimeout ] = React.useState();
  const [ getPlaceDetailsTimeout, setGetPlaceDetailsTimeout ] = React.useState();

  console.log(places)

  function validateWebsite() {
    if (website && !website.match(/^https?:\/\/(www\.)?[\w\d]+\.[\w]+(\/[\w\d]+)*$/gi)){
      setErrors({website: "Invalid URL (has to start with http and can't end with a slash)"});
      return false;
    }
    setErrors({website: null});
    return true;
  }

  function validateRestaurant() {
    const restaurantPointer = toPointer(restaurant.split(" - ")[0]);
    if (restaurantPointer in restaurantMeta){
      setErrors({restaurant: "Restaurangen finns redan!"});
      return false;
    }
    setErrors({restaurant: null});
    return true;
  }

  React.useEffect(() => {
    if (website) validateWebsite();
  }, [website]);

  React.useEffect(() => {
    clearTimeout(getPlacesTimeout);
    clearTimeout(getPlaceDetailsTimeout);
    if (restaurant) validateRestaurant();
    
    if (restaurant.match(/burger/ig)) {
      setTags(["Hamburgare"])
      setOrigins(["Nordamerika"])
    } 
    else if (restaurant.match(/ramen/ig)) {
      setTags(["Ramen"])
      setOrigins(["Asien"])
    } 
    else if (restaurant.match(/kebab/ig)) {
      setTags(["Kebab"])
      setOrigins(["Mellanöstern"])
    } 
    else if (restaurant.match(/pizza/ig)) {
      setTags(["Pizza"])
      setOrigins(["Sydeuropa"])
    }

    if (!restaurant) {
      setPlaces([])
      setLastRestaurantSearch("")
    }
    
    if (restaurant.length > 3 && places && (!lastRestaurantSearch || !restaurant.startsWith(lastRestaurantSearch) || Math.abs(lastRestaurantSearch.length - restaurant.length) > 2)) {
      setLastRestaurantSearch(restaurant)
      setGetPlacesTimeout(setTimeout(() => getPlaces(restaurant).then(data => {
        console.log(data)
        setPlaces(data && data.results)
      }), 1000));
    }

    console.log(places)

    if(places && places.length && restaurant.includes(" - ")) {
      const selectedPlace = places.find(place => `${place.name} - ${place.formatted_address}` === restaurant)
      if (selectedPlace) {
        const geo = selectedPlace.geometry.location
        console.log(geo)
        if (!lastPlaceSearch || (lastPlaceSearch.lat !== geo.lat || lastPlaceSearch.lng !== geo.lng)) {
          setPlaceSearch(geo);
          setGetPlaceDetailsTimeout(setTimeout(() => getPlaceDetails(geo.lat, geo.lng).then(data => {
            console.log(data)
            setPlaceDetails(data && data.results)
          }), 1000));
        }
      }
    }
    return () => clearTimeout(getPlacesTimeout);
  }, [restaurant]);

  React.useEffect(() => {
    getRestaurantMeta({cache: "no-cache"}).then(meta => setRestaurantMeta(meta));
  }, []);

  function save() {
    if (saveDisabled) return null;
    if (!validateWebsite()) return null;
    if (!validateRestaurant()) return null

    const params = {
      payInAdvance, seats,
      name: restaurant,
      address: firstLetterUpperCase(address), 
      website: website.toLowerCase(),
      origin: origins.sort().filter(Boolean).join(", "),
      tags: tags.sort().filter(Boolean).join(", "),
    }

    if (restaurant.includes(" - ")) {
      const selectedPlace = places.find(place => `${place.name} - ${place.formatted_address}` === restaurant)
      if (!selectedPlace) {
        setErrors({restaurant: "Ogiltigt restaurang namn!"});
        return null;
      } else {
        params.name = selectedPlace.name;
        params.address = selectedPlace.formatted_address;
        params.googlePlaceId = selectedPlace.place_id;
        if (placeDetails && placeDetails.length) {
          params.closestMetro = placeDetails[0].name;
        }
      }
    }
    
    setSaveDisabled(true);
    saveRestaurant(params).then(response => {
      if (response.success) {
        setOpenSaveConfirmation(true);
        setAddress("")
        setWebsite("")
        setTags([])
        setOrigins([])
        setPlaces([])
        setPlaceDetails([])
      } else if (response.status === 401) {
        props.setLoggedIn(false);
      }
      else {
        alert(response.error || "Misslyckades med att spara recensionen");
      }
      setSaveDisabled(false);
    });
  }

  console.log(places)

  return (
    <Grid container spacing={2} direction="column" alignContent="center">
      <GridRow>
        <RestaurantSelect freeSolo restaurants={places ? places.map(p => `${p.name} - ${p.formatted_address}`) : []} updateRestaurant={(e, value) => setRestaurant(value)} error={!!errors.restaurant} helperText={errors.restaurant} />
      </GridRow>
      { 
        placeDetails && placeDetails.length ? (
          <GridRow>
            <TextField value={placeDetails[0].name} disabled id="metro-field" label="Närmaste metro" style={{width: "50vw"}} InputProps={{endAdornment: <InputAdornment position="end"><SubwayIcon /></InputAdornment>}} />
          </GridRow>
        ) : <></>
      }
      <SimpleSelect id="pay-in-advance" label="Betalade i förväg" disabled={!restaurant} value={payInAdvance} onChange={e => setPayInAdvance(e.target.value)} options={["Ja", "Nej"]}/>
      {
        !restaurant.includes(" - ") ? (
          <GridRow>
            <TextField required value={address} onChange={e => setAddress(e.target.value)} disabled={!restaurant} error={!!errors.address} helperText={errors.address} id="restaurant-address-field" label="Address" style={{width: "50vw"}} InputProps={{endAdornment: <InputAdornment position="end"><LocationOnIcon /></InputAdornment>}} />
          </GridRow>
        ): <></>
      }
      <GridRow>
        <TextField value={website} onChange={e => setWebsite(e.target.value)} disabled={!restaurant} error={!!errors.website} helperText={errors.website} id="restaurant-website-field" label="Hemsida" style={{width: "50vw"}} InputProps={{endAdornment: <InputAdornment position="end"><Explore /></InputAdornment>}} />
      </GridRow>
      <TagSelect value={tags} onChange={(e, values) => setTags(values.map(firstLetterUpperCase))} disabled={!restaurant} />
      <OriginSelect value={origins} onChange={(e, values) => setOrigins(values)} disabled={!restaurant} />
      <RestaurantSeats seats={seats} onChange={e => setSeats(e.target.value)} disabled={!restaurant} />
      <GridRow>
        <SaveButton disabled={saveDisabled || !(restaurant && (address || restaurant.includes(" - ")))} onClick={save} />
      </GridRow>
      <SimpleModal text="Restaurang tillagd!" open={openSaveConfirmation} handleClose={() => setOpenSaveConfirmation(false)} />
    </Grid>
  );
}