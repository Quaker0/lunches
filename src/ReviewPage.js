import React from "react";

import { TabMenu } from "./utils.js";
import RecentReviewsPage from "./RecentReviewsPage.js";
import RestaurantReviewsPage from "./RestaurantReviewsPage.js";
import RestaurantMap from "./RestaurantMap.js";
import { createHashHistory } from "history"

const history = createHashHistory()
const tabs = [
  {title: "Topplista", page: <RestaurantMap/>},
  {title: "Recensioner", page: <RecentReviewsPage/>}, 
  {title: "Restauranger", page: <RestaurantReviewsPage/>},
];

export default function ReviewPage(props) {
  const [value, setValue] = React.useState(props.tab || 0);
  const handleChange = (event, newValue) => { 
    setValue(newValue); 
    switch (newValue) {
      case 0:
        return history.push("/");
      case 1:
        return history.push("/recentReviews");
      case 2:
        return history.push("/restaurants");
      default:
        return history.push("/");
    }
  };
  return (
    <>
      <div className="container-fluid sthlm-cover" />
      <TabMenu tabs={tabs} handleChange={handleChange} value={value}/>
    </>
  );
}
