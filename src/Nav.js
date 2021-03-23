import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import LoginForm from "./admin/LoginForm";
import { TABS, AdminNav, AdminDirectionNav } from "./admin/utils";
import { getUsername } from "./login";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const styles = () => ({
  tabLabel: {
    fontSize: "max(max(.8vw, .8vh), .8rem)",
    padding: "max(.2vw, .2vh)"
  },
});

function getTabs() {
  const location = useLocation();
  let tabs = [
    {label: "Topplista", link: "/top", linkPattern: /\/top.*/},
    {label: "Recensioner", link: "/recent", linkPattern: /\/recent.*/},
    {label: "Restauranger", link: "/restaurants", linkPattern: /\/restaurant.*/},
  ];
  if (location.pathname.startsWith("/admin")) {
    return TABS;
  }
  return tabs;
}

function Nav(props) {
  const { classes } = props;
  const history = useHistory();
  const location = useLocation();
  const username = getUsername();
  const adminSite = location.pathname.startsWith("/admin");
  const tabs = getTabs();
  
  const startIdx = tabs.findIndex(tab => location.pathname.match(tab.linkPattern));
  const [tabIdx, setTabIdx] = React.useState(startIdx);

  React.useEffect(() => {    
    const newTabIdx = tabs.findIndex(tab => location.pathname.match(tab.linkPattern));
    if (newTabIdx > 0 && tabIdx !== newTabIdx) setTabIdx(newTabIdx);
  }, [location.pathname])

  const handleTabClick= React.useCallback((e, v) => {
    history.push(tabs[v].link)
    setTabIdx(v);
  }, [history]);

  return (
    <>
      { adminSite ? <LoginForm/> : <></>}
      { username && adminSite ? <AdminNav/> : <></> }
      { username && !adminSite ? <AdminDirectionNav/> : <></> }
      <AppBar position="static" color="inherit">
        <Tabs value={tabIdx >= 0 ? tabIdx : 1} className={classes.tabs} onChange={handleTabClick} indicatorColor="primary" variant="fullWidth">
        {tabs.map((tab, idx) => <Tab icon={tab.icon} key={`tab-${idx}`} value={idx} label={<span className={classes.tabLabel}>{tab.label}</span>}/>)}
        </Tabs>
      </AppBar>
    </>
  );
}

export default withStyles(styles)(Nav);
