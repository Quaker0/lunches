import React from "react";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

import AddReviewPage from "./AddReviewPage.js";
import EditPage from "./EditPage.js";
import StatPage from "./StatPage.js";
import UserPage from "./UserPage.js";
import LoginForm from "./LoginForm.js";
import { TabMenu } from "../utils.js";
import { isLoggedIn } from "../login.js";

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
			{ !isLoggedIn() ? <LoginForm/> : <></> }
      <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#">Hemsida</Fab></Box>
			<TabMenu tabs={tabs} handleChange={handleChange} value={value} />
		</>
	);
}