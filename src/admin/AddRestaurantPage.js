import React from "react";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Explore from "@material-ui/icons/Explore";
import SubwayIcon from "@material-ui/icons/Subway";
import PhoneIcon from "@material-ui/icons/Phone";

import { RestaurantSelect, SaveButton, SimpleSelect, saveRestaurant, TagSelect, OriginSelect, RestaurantSeats, GridRow, SimpleModal } from "./adminReviewUtils.js";
import { firstLetterUpperCase, toPointer } from "../utils.js";
import { getRestaurantMeta, getPlaces, getPlaceDetails } from "../api";


export default function AddRestaurantPage(props) {
  const [ payInAdvance, setPayInAdvance ] = React.useState("Ja");
  const [ restaurant, setRestaurant ] = React.useState("");
  const [ address, setAddress ] = React.useState("");
  const [ website, setWebsite ] = React.useState("");
  const [ phoneNumber, setPhoneNumber ] = React.useState("");
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

  const RESTAURANT_SEPARATOR = " — ";

  function validateWebsite() {
    if (website && !website.match(/^https?:\/\/(www\.)?[\w\d]+\.[\w]+(\/[-a-z\d%_~+]+)*$/gi)){
      setErrors({website: "Invalid URL (has to start with http and can't end with a slash)"});
      return false;
    }
    setErrors({website: null});
    return true;
  }

  function validateRestaurant() {
    const restaurantSplit = restaurant.split(RESTAURANT_SEPARATOR);
    const restaurantPointer = toPointer(restaurant.split(RESTAURANT_SEPARATOR)[0]);
    const addr = address || (restaurantSplit.length > 1 ? restaurantSplit[1] : null);
    if (addr && restaurantPointer in restaurantMeta && restaurantMeta[restaurantPointer].places.some(place => place.address.toLowerCase().startsWith(addr.toLowerCase()))) {
      setErrors({restaurant: "Restaurangen finns redan!"});
      return false;
    } else if (addr && restaurantPointer in restaurantMeta) {
      const currentRestaurantMeta = restaurantMeta[restaurantPointer]
      if (tags && !tags.length && currentRestaurantMeta.tags) setTags(currentRestaurantMeta.tags.split(", "));
      if (origins && !origins.length && currentRestaurantMeta.origin) setOrigins(currentRestaurantMeta.origin.split(", "));
      if (currentRestaurantMeta.payInAdvance) setPayInAdvance(currentRestaurantMeta.payInAdvance);
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
      setLastRestaurantSearch("")
      setPlaceSearch({})
      setPlaces([])
      setPlaceDetails([])
      setPhoneNumber("")
      setWebsite("")
      setTags([])
      setOrigins([])
    }

    const lastSearchChanged = !lastRestaurantSearch || !restaurant.startsWith(lastRestaurantSearch) || Math.abs(lastRestaurantSearch.length - restaurant.length) > 2;
    
    if (restaurant.length > 3 && !restaurant.includes(RESTAURANT_SEPARATOR) && places !== null && lastSearchChanged) {
      setGetPlacesTimeout(setTimeout(() => getPlaces(restaurant).then(data => {
        setLastRestaurantSearch(restaurant)
        if (data && data.results && data.results.length) {
          setPlaces(data.results)
        }
      }), 1000));
    }

    if(places && places.length && restaurant.includes(RESTAURANT_SEPARATOR)) {
      const selectedPlace = places.find(place => `${place.name}${RESTAURANT_SEPARATOR}${place.formatted_address}` === restaurant)
      if (selectedPlace) {
        const geo = selectedPlace.geometry.location
        if (!lastPlaceSearch || (lastPlaceSearch.lat !== geo.lat || lastPlaceSearch.lng !== geo.lng)) {
          setGetPlaceDetailsTimeout(setTimeout(() => {
            setPlaceSearch(geo);
            getPlaceDetails(geo).then(data => {
              setPlaceDetails(data && data.results)
            });
            getPlaceDetails({placeId: selectedPlace.place_id}).then(data => {
              if(data && data.result) {
                setPhoneNumber(data.result.formatted_phone_number)
                setWebsite(data.result.website.replace(/\/$/g, ""))
              }
            });
        }, 1000));
        }
      }
    }
    return () => { 
      clearTimeout(getPlacesTimeout);
      clearTimeout(getPlaceDetailsTimeout);
    }
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

    if (restaurant.includes(RESTAURANT_SEPARATOR)) {
      const selectedPlace = places.find(place => `${place.name}${RESTAURANT_SEPARATOR}${place.formatted_address}` === restaurant)
      if (!selectedPlace) {
        setErrors({restaurant: "Ogiltigt restaurang namn!"});
        return null;
      } else {
        params.name = selectedPlace.name;
        params.address = selectedPlace.formatted_address;
        params.phoneNumber = phoneNumber
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
        setPhoneNumber("")
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

  return (
    <Grid container spacing={2} direction="column" alignContent="center">
      <GridRow>
        <RestaurantSelect freeSolo restaurants={places ? places.map(p => `${p.name}${RESTAURANT_SEPARATOR}${p.formatted_address}`) : []} updateRestaurant={(e, value) => setRestaurant(value)} error={!!errors.restaurant} helperText={errors.restaurant} />
      </GridRow>
      <GridRow>
        <Typography variant="caption" paragraph style={{width: "50vw"}}>Se till att det är det riktiga namnet och inte <strong>&quot;Bastard Burgers <span style={{color: "red"}}><u>Vasastan</u></span>&quot;</strong> (Google inkluderar det ibland).</Typography>
      </GridRow>
      { 
        placeDetails && placeDetails.length ? (
          <GridRow>
            <TextField value={placeDetails[0].name} disabled id="metro-field" label="Närmaste metro" style={{width: "50vw"}} InputProps={{endAdornment: <InputAdornment position="end"><SubwayIcon /></InputAdornment>}} />
          </GridRow>
        ) : <></>
      }
      { 
        phoneNumber ? (
          <GridRow>
            <TextField value={phoneNumber} disabled id="phone-number-field" label="Telefon" style={{width: "50vw"}} InputProps={{endAdornment: <InputAdornment position="end"><PhoneIcon /></InputAdornment>}} />
          </GridRow>
        ) : <></>
      }
      <SimpleSelect id="pay-in-advance" label="Betalade i förväg" disabled={!restaurant} value={payInAdvance} onChange={e => setPayInAdvance(e.target.value)} options={["Ja", "Nej"]}/>
      {
        !restaurant.includes(RESTAURANT_SEPARATOR) ? (
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
        <SaveButton disabled={saveDisabled || !(restaurant && (address || restaurant.includes(RESTAURANT_SEPARATOR)))} onClick={save} />
      </GridRow>
      <SimpleModal text="Restaurang tillagd!" open={openSaveConfirmation} handleClose={() => setOpenSaveConfirmation(false)} />
    </Grid>
  );
}