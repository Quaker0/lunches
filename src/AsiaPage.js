import React, { Component } from "react";
import { Redirect } from "react-router";
import { TabMenu } from "./utils.js"
import asiaBanner from "./content/asia-banner-se.png"
import ramenImg from "./content/ramen.png"
import Grid from "@material-ui/core/Grid";


export default function AsiaPage(props) {
  const [value, setValue] = React.useState(3);
  const handleChange = (event, newValue) => { setValue(newValue) };
  const tabs = [
    {title: "Topplista", page: <Redirect to="/"/>},
    {title: "Recensioner", page: <Redirect to="/recentReviews"/>}, 
    {title: "Restauranger", page: <Redirect to="/restaurants"/>},
    {title: "Asien", page: <AsiaPageContent/>}
  ];
  return (
    <>
      <img src={asiaBanner} alt="banner asia" className="asia-banner"/>
      <div className="container-fluid asia-cover" />
      <TabMenu tabs={tabs} handleChange={handleChange} value={value}/>
    </>
  );
}

class AsiaPageContent extends Component {
  render() {
    return (
      <Grid container spacing={1} justify="space-between" align="center">
        <Grid item xs={12} sm={6}>
          <img src={ramenImg} height={300} alt="ramen splash"/>
        </Grid>
        <Grid item xs={12} sm={6}>
        </Grid>
      </Grid>
    );
  }
}