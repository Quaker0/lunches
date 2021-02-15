import React from "react";
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

import { getUsername } from "./login";

export default function Nav(props) {
  const history = useHistory();
  const location = useLocation();
  const username = getUsername();
  let tabs = [
    {label: "Topplista", link: "/"},
    {label: "Recensioner", link: "/recentReviews"},
    {label: "Restauranger", link: "/restaurants"},
  ];

  const adminSite = location.pathname.startsWith("/admin");

  if (adminSite) {
    tabs = [
      {label: "Användare", icon: <AccountCircleIcon />, link: "/admin/user"}, 
      {label: "Lägg till", icon: <AddIcon />, link: "/admin/add"}, 
      {label: "Redigera", icon: <EditIcon />, link: "/admin/edit"},
      {label: "Statistik", icon: <TimelineIcon />, link: "/admin/stats"}
    ];
  }
  
  const startIdx = tabs.findIndex(tab => location.pathname.startsWith(tab.link)) || false;
  const [tabIdx, setTabIdx] = React.useState(startIdx);
  const handleTabClick= React.useCallback((e, v) => {
    history.push(tabs[v].link)
    setTabIdx(v);
  }, [history]);
  return (
    <>
      { username && adminSite ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/">Hemsida</Fab></Box> : <></> }
      { username && !adminSite ? <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/admin">Admin</Fab></Box> : <></> }
      <div className="container-fluid sthlm-cover" />
      <AppBar position="static" color="inherit">
        <Tabs value={tabIdx} onChange={handleTabClick} indicatorColor="primary" variant="fullWidth">
        {tabs.map((tab, idx) => <Tab icon={tab.icon} key={`tab-${idx}`} value={idx} label={tab.label}/>)}
        </Tabs>
      </AppBar>
    </>
  );
}