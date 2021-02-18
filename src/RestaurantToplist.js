import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import brisketAndFriends from "./content/brisket&friends.png"
import menoMaleIcon from "./content/menomale.svg"
import kapibaraLogo from "./content/kapibara.webp"

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 600,
    margin: 30
  },
  position: {
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: "300%",
    padding: "20px",
    color: "goldenrod"
  },
}));

function RankCard(props) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <div className={classes.position}>{props.index}.</div>
      <CardContent className={classes.content}>
        <Typography component="h5" variant="h5" className="m-2">
          <Link to={`/restaurant/${props.restaurant.toLowerCase().replace(/\s/g, "")}`} className={props.class}>
            {props.logo ? <img src={props.logo} width={40} alt={`${props.restaurant} logo`}/> : <></>}
            {props.nameIcon ? <img src={props.nameIcon} width={150} alt={props.restaurant}/> : props.restaurant}
          </Link>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" style={{lineHeight: "130%"}} align="left">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
}


export default function RestaurantMap() {
  React.useEffect(() => document.title = "STHLM LUNCH - Top Restaurants", []);

  return (
    <div className="p-4">
      <Grid container spacing={1} justify="center" align="center">
        <Grid item xs={12}>
        <RankCard index={1} restaurant="Kapibara" description="Ett nytt foodie mecka mitt i Östermalm, värt att vallfärda hit för både Donburi och Ramen." nameIcon={kapibaraLogo}/>
          <RankCard index={2} restaurant="Brisket & Friends" description="Ensam i sin kategory att servera rökt bringa och annat kött av bästa kvalité med amerikanska tillbehör." nameIcon={brisketAndFriends}/>
          <RankCard index={3} restaurant="Meno Male" description="Saftiga smakrika napolitanska pizzor som kommer i många olika varianter. Lagat med mycket kärlek av pratglada italienare i en levande atmosfär." nameIcon={menoMaleIcon}/>
        </Grid>
      </Grid>
    </div>
  );
}