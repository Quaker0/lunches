import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory, useLocation } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

import LoginForm from "./admin//LoginForm";
import { getUsername } from "./login";

const styles = theme => ({
  tabLabel: {
    fontSize: "max(max(.8vw, .8vh), .8rem)",
    padding: "max(.1vw, .1vh)"
  },
});

function getTabs() {
  const location = useLocation();
  let tabs = [
    {label: "Topplista", link: "/top", linkPattern: /\/top.*/},
    {label: "Recensioner", link: "/recent", linkPattern: /\/recent.*/},
    {label: "Restauranger", link: "/restaurants", linkPattern: /\/restaurant.*/},
  ];

  const adminSite = location.pathname.startsWith("/admin");

  if (adminSite) {
    tabs = [
      {label: "Användare", icon: <AccountCircleIcon />, link: "/admin/user", linkPattern: /\/admin\/user.*/}, 
      {label: "Lägg till", icon: <AddIcon />, link: "/admin/add", linkPattern: /\/admin\/add/}, 
      {label: "Redigera", icon: <EditIcon />, link: "/admin/edit", linkPattern: /\/admin\/edit/},
      {label: "Statistik", icon: <TimelineIcon />, link: "/admin/stats", linkPattern: /\/admin\/stats/}
    ];
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
  const [tabIdx, setTabIdx] = React.useState(startIdx < 0 ? false : startIdx);

  React.useEffect(() => {
    const newTabIdx = tabs.findIndex(tab => location.pathname.match(tab.linkPattern));
    setTabIdx(newTabIdx < 0 ? false : newTabIdx);
  }, [location.pathname])

  const handleTabClick= React.useCallback((e, v) => {
    history.push(tabs[v].link)
    setTabIdx(v);
  }, [history]);
  return (
    <>
      { adminSite ? <LoginForm/> : <></>}
      { username && adminSite ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/">Hemsida</Fab></Box> : <></> }
      { username && !adminSite ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/admin">Admin</Fab></Box> : <></> }
      <div className="container-fluid sthlm-cover" />
      <AppBar position="static" color="inherit">
        <Tabs value={tabIdx} className={classes.tabs} onChange={handleTabClick} indicatorColor="primary" variant="fullWidth">
        {tabs.map((tab, idx) => <Tab icon={tab.icon} key={`tab-${idx}`} value={idx} label={<span className={classes.tabLabel}>{tab.label}</span>}/>)}
        </Tabs>
      </AppBar>
    </>
  );
}

export default withStyles(styles)(Nav);
