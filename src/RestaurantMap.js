import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import map from "./content/sthlm-map.png"
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import brisketAndFriends from "./content/brisket&friends.png"
import menoMaleIcon from "./content/menomale.svg"
import IngersKitchenLogo from "./content/ingerskitchenlogo.png"

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


export default class RestaurantMap extends Component {
  constructor(props) {
    super(props);
    window.ga("send", "pageview", "/");
    this.state = {width: Math.min(window.innerWidth *.8, 600)};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.drawCircle = this.drawCircle.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    const img = this.refs.image
    img.onload = () => setTimeout(() => this.drawCircle(Math.min(this.state.width, 600)), 1000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const newWidth = Math.min(window.innerWidth *.8, 600);
    this.setState({ width: newWidth});
    this.drawCircle(newWidth)
  }

  drawCircle(width) {
    const height = width / 1.5;
    const canvas = this.refs.canvas
    const img = this.refs.image

    canvas.style.position = "absolute";
    canvas.style.left = img.offsetLeft + "px";
    canvas.style.top = img.offsetTop + "px";
    
    const ctx = canvas.getContext("2d")
    ctx.lineWidth = "5";
    ctx.strokeStyle = "goldenrod";
    ctx.fillStyle = "black";

    if (width > 550) {
      ctx.font = "normal small-caps bold 2vw roboto"
      ctx.fillText("1", width * 0.38, height * 0.33);
      ctx.fillText("2", width * 0.32, height * 0.49);
      ctx.fillText("3", width * 0.47, height * 0.35);
    }
    
    ctx.beginPath();
    ctx.arc(width * 0.42, height * 0.35, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.arc(width * 0.355, height * 0.51, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(width * 0.505, height * 0.37, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }

  render() {
    const { width } = this.state;
    return (
      <>
        <Grid container spacing={1} justify="center" align="center">
          <Grid item xs={12}>
            <RankCard index={1} restaurant="Brisket & Friends" description="Ensam i sin kategory att servera rökt bringa och annat kött av bästa kvalité med amerikanska tillbehör." nameIcon={brisketAndFriends}/>
            <RankCard index={2} restaurant="Meno Male" description="Saftiga smakrika napolitanska pizzor som kommer i många olika varianter. Maten är lagad med mycket kärlek av glada italienare i en levande atmosfär." nameIcon={menoMaleIcon}/>
            <RankCard index={3} restaurant="Ingers Kitchen" description="En dold juvel med god och stark mat. Det är som att teleporteras till Kina och kliva in i någons vardagsrum. Troligtvis inte vad du förknippar med kinesisk mat!" logo={IngersKitchenLogo} class="text-danger"/>
          </Grid>
        </Grid>
        <Box style={{textAlign: "center"}}>
          <img src={map} ref="image" alt="STHLM LUNCH MAP" width={width} style={{backgroundColor: "black", borderRadius: "5%"}}/>          
        </Box>
        <canvas ref="canvas" width={width} height={width / 1.5}/>
      </>

    );
  }
}