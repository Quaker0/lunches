import React, { Component } from "react";
import { groupBy } from "lodash";
import { getAggregatedReviews, getRateCircles, mode, cleanGet, reviewToKey } from "./utils"
import { getRestaurantMeta } from "./api";

import MealReviewCard from "./MealReviewCard";

export default class RestaurantPage extends Component {
  constructor(props) {
    super(props);
    let restaurant = props.match.params.restaurant;
    window.mixpanel && window.mixpanel.track("Page view", {page: "Restaurant page", restaurant: restaurant});
    restaurant = restaurant.toLowerCase().replace(/\s/g, "");
    this.state = {reviewCards: "", restaurant: restaurant, reviews: [], width: 0};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.controller = new AbortController();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    getRestaurantMeta({ signal: this.controller.signal }).then(restaurantsMeta => {
      if (restaurantsMeta) {
        const meta = Object.values(restaurantsMeta).filter(meta => meta.name.toLowerCase().replace(/\s/g, "") === this.state.restaurant)[0];
        if (meta && this.state.restaurant) {
          document.title = `STHLM LUNCH - ${meta.name}`
          this.setState({"restaurantMeta": meta});
          fetch(`https://www.sthlmlunch.se/restaurants/${meta.reviewPointer}`, { signal: this.controller.signal })
          .then((response) => response.json())
          .then((reviews) => {
            const mealsReviews = groupBy(reviews, r => r.meal.toLowerCase());
            let reviewCards = [];
            Object.values(mealsReviews).forEach((mealReviews) => reviewCards.push(<MealReviewCard key={reviewToKey(mealReviews[0])} reviews={mealReviews} />));
            this.setState({reviewCards: reviewCards, reviews: reviews});
          })
          .catch(e => {
            if (e.name !== "AbortError") console.error(e);
          });
        }
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    this.controller.abort()
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.reviews.length) {
      return false;
    } else if (!this.state.reviews.length && nextState.reviews.length) {
      return true;
    }
    const below1200 = this.state.width > 1200 && nextState.width < 1200;
    const above1200 = this.state.width < 1200 && nextState.width > 1200;
    const below1000 = this.state.width > 1000 && nextState.width < 1000;
    const above1000 = this.state.width < 1000 && nextState.width > 1000;
    
    return below1200 || above1200 || below1000 || above1000;
  }

  render() {
    const { reviewCards, reviews, width, restaurantMeta } = this.state;

    if (!reviews.length) {
      return "";
    }

    const aggregatedReviews = getAggregatedReviews(reviews);
    const seats = restaurantMeta.seats;
    const website = restaurantMeta.website;
    const portionSize = cleanGet(reviews, "portionSize");
    const waitTime = cleanGet(reviews, "waitTime");
    const prices = cleanGet(reviews, "price");

    const topPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const mapWidth = width > 1200 ? "600" : width > 1000 ? "500" : "400";
    const mapURL = `https://maps.googleapis.com/maps/api/staticmap?&zoom=13&size=${mapWidth}x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C${restaurantMeta.places[0].address}&key=AIzaSyCQWr60KEp4VnNMdwb7AzQkIuptT3D2zNc`;
    const mapLink = `https://maps.google.com/maps?q=${restaurantMeta.places[0].address}`;

    var envIcons = getRateCircles(aggregatedReviews.envAvg);

    return (  
    <>
      <div className="page-header text-center">
        <h2 style={{fontVariant: "petite-caps"}}>{restaurantMeta.name}</h2>
      </div>

      <div className="container-fluid">
      <div className="row justify-content-around">
        <a href={mapLink}><img alt="Map" src={mapURL} className="rounded"/></a>
        <div>
          <table className="table">
            <tbody>
            <tr>
              <th scope="row">Address</th>
              <td><i className="fas fa-sm fa-map-marker-alt"/> <a href={mapLink}>{restaurantMeta.places[0].address}</a></td>
            </tr>
            { website ?
              <tr>
              <th scope="row">Hemsida</th>
              <td><a href={`${website}?utm_source=sthlmlunch.se&utm_medium=referral`}>{website.replace(/https?:\/\//, "").slice(0, 65)}</a></td>
              </tr>
              : <></>
            }
            { seats ?
              <tr>
              <th scope="row">Sittplatser</th>
              <td>{seats}</td>
              </tr>
              : <></>
            }
            { portionSize.length ?
              <tr>
              <th scope="row">Portionsstorlek</th>
              <td>{mode(portionSize)}</td>
              </tr>
              : <></>
            }
            { waitTime.length ?
              <tr>
              <th scope="row">Väntetid innan servering</th>
              <td>{mode(waitTime)}</td>
              </tr>
              : <></>
            }
            { restaurantMeta.payInAdvance ?
              <tr>
              <th scope="row">Betala innan du sätter dig</th>
              <td>{restaurantMeta.payInAdvance}</td>
              </tr>
              : <></>
            }
            <tr>
              <th scope="row">Pris</th>
              <td>{minPrice}{topPrice !== minPrice ? " - " + topPrice : ""} kr</td>
            </tr>
            <tr>
              <th scope="row">Omgivningsbetyg</th>
              <td style={{color:"green"}}>{envIcons}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>

      <div className="container-fluid card-item" style={{paddingBottom: "10%"}}>
        <div className="text-center p-4">
          <h3>Recenserade måltider</h3>
        </div>
        <div id="reviews" className="d-flex justify-content-start flex-wrap" style={{overflow: "auto"}}>
          { reviewCards }
        </div>
      </div>
    </>
    );
  }
}