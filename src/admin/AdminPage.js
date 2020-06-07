import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import AddReviewPage from "./AddReviewPage.js";
import LoginForm from "../LoginForm.js";
import EditPage from "./EditPage.js";
import StatPage from "./StatPage.js";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			id={`simple-tabpanel-${index}`}
			{...other}
		>
			{value === index && <Box py={3}>{children}</Box>}
		</Typography>
	);
}

export default function AdminPage() {
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<LoginForm/>
			<AppBar position="static" color="inherit">
				<Tabs value={value} onChange={handleChange} indicatorColor="primary" variant="fullWidth">
					<Tab icon={<AddIcon />} label="Lägg till" />
					<Tab icon={<EditIcon />} label="Redigera" />
          <Tab icon={<TimelineIcon />} label="Statistik" />
				</Tabs>
			</AppBar>
			
			<TabPanel value={value} index={0}>
				<AddReviewPage />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<EditPage />
			</TabPanel>
      <TabPanel value={value} index={2}>
        <StatPage />
      </TabPanel>
		</>
	);
}