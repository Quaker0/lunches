import React, { lazy } from "react";

const AddIcon = lazy(() => import("@material-ui/icons/Add"));
const EditIcon = lazy(() => import("@material-ui/icons/Edit"));
const TimelineIcon = lazy(() => import("@material-ui/icons/Timeline"));
const AccountCircleIcon = lazy(() => import("@material-ui/icons/AccountCircle"));

import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";

export const TABS = [
  {label: "Användare", icon: <AccountCircleIcon/>, link: "/admin/user", linkPattern: /\/admin\/user.*/}, 
  {label: "Lägg till", icon: <AddIcon/>, link: "/admin/add", linkPattern: /\/admin\/add/}, 
  {label: "Redigera", icon: <EditIcon/>, link: "/admin/edit", linkPattern: /\/admin\/edit/},
  {label: "Statistik", icon: <TimelineIcon/>, link: "/admin/stats", linkPattern: /\/admin\/stats/}
];

export const AdminNav = () => (
  <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/">Hemsida</Fab></Box>
);

export const AdminDirectionNav = () => (
  <Box position="fixed" top={10} right={10} zIndex={1}><Fab variant="extended" href="/admin">Admin</Fab></Box>
);
