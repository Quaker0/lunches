import React from "react";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import AddReviewPage from "./AddReviewPage.js";
import EditPage from "./EditPage.js";
import StatPage from "./StatPage.js";
import UserPage from "./UserPage.js";
import LoginForm from "../LoginForm.js";
import { TabMenu } from "../utils.js";

const tabs = [
		{title: "Användare", icon: <AccountCircleIcon />, page: <UserPage/>}, 
		{title: "Lägg till", icon: <AddIcon />, page: <AddReviewPage/>}, 
		{title: "Redigera", icon: <EditIcon />, page: <EditPage/>},
		{title: "Statistik", icon: <TimelineIcon />, page: <StatPage/>}
	];

export default function AdminPage() {
	const [value, setValue] = React.useState(1);
	const handleChange = (event, newValue) => { setValue(newValue) };
	return (
		<>
			<LoginForm/>
			<TabMenu tabs={tabs} handleChange={handleChange} value={value} />
		</>
	);
}