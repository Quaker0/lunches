import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { theme } from "./adminReviewUtils.js";
import { ThemeProvider } from "@material-ui/core/styles";
import { TabPanel } from "../utils";
import AddReviewPage from "./AddReviewPage";
import AddRestaurantPage from "./AddRestaurantPage";

export default function AddPage(props) {
  const [tab, setTab] = React.useState(0);
  return (
    <ThemeProvider theme={theme}>
         <Tabs
          value={tab}
          onChange={(e, tab) => setTab(tab)}
          aria-label="Lägg till meny"
          indicatorColor="primary"
          centered
        >
          <Tab label="Ny restaurang" />
          <Tab label="Ny recension" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <AddRestaurantPage {...props} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <AddReviewPage {...props} />
        </TabPanel>
    </ThemeProvider>
  );
}