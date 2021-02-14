import React from "react";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

import AddPage from "./AddPage.js";
import EditPage from "./EditPage.js";
import StatPage from "./StatPage.js";
import UserPage from "./UserPage.js";
import LoginForm from "./LoginForm.js";
import { TabMenu } from "../utils.js";
import { isLoggedIn } from "../login.js";
import { Helmet } from "react-helmet";

export default function AdminPage() {
	const [value, setValue] = React.useState(1);
  const [loggedIn, setLoggedIn] = React.useState(isLoggedIn());
	const handleChange = (event, newValue) => { setValue(newValue) };

  const tabs = [
    {title: "Användare", icon: <AccountCircleIcon />, page: <UserPage/>}, 
    {title: "Lägg till", icon: <AddIcon />, page: <AddPage setLoggedIn={setLoggedIn} />}, 
    {title: "Redigera", icon: <EditIcon />, page: <EditPage/>},
    {title: "Statistik", icon: <TimelineIcon />, page: <StatPage/>}
  ];

  if(loggedIn) {
    window.gtag("set", "user_properties", {
      role: "admin"
    });
  }
	return (
		<>
      <Helmet>
        <title>STHLM LUNCH - Admin</title>
      </Helmet>
			{ !loggedIn ? <LoginForm/> : <></> }
      <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/#">Hemsida</Fab></Box>
			<TabMenu tabs={tabs} handleChange={handleChange} value={value} />
		</>
	);
}