import React, { Component } from "react";
import { Redirect } from "react-router";
import { TabMenu } from "./utils.js"
import asiaBanner from "./content/asia-banner-se.png"

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
      <></>
    );
  }
}