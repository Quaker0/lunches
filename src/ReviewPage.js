import React from "react";

import { TabMenu } from "./utils.js";
import AllReviewsPage from "./AllReviewsPage.js";
import RestaurantReviewsPage from "./RestaurantReviewsPage.js";

const tabs = [
	{title: "Recensioner", page: <AllReviewsPage/>}, 
	{title: "Restauranger", page: <RestaurantReviewsPage/>}
];

export default function ReviewPage() {
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => { setValue(newValue) };
	return <TabMenu tabs={tabs} handleChange={handleChange} value={value}/>;
}