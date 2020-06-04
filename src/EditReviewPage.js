import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { ThemeProvider } from "@material-ui/core/styles";
import { getUsername } from "./login.js";
import { firstLetterUpperCase } from "./utils.js"
import { TasteHelp, heatOptions, potionSizeOptions, waitTimeOptions, theme, MenuType, Score, ReviewDate, SimpleSelect, GridRow, defaultState, SaveButton, saveReview, DeleteButton, deleteReview } from "./adminReviewUtils.js";

export default class EditReviewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {username: getUsername(), reviewPointer: props.reviewPointer, ...defaultState, ...props.review};
    this.updateMenuType = (event, value) => this.setState({menuType: value});
    this.updatePrice = (event) => this.setState({price: parseInt(event.target.value.replace(/[^0-9,]/g, "") || 0)});
    this.updateTasteScore = (event, value) => this.setState({tasteScore: value});
    this.updateExtrasScore = (event, value) => this.setState({extrasScore: value});
    this.updateInnovationScore = (event, value) => this.setState({innovationScore: value});
    this.updateEnviromentScore = (event, value) => this.setState({environmentScore: value});
    this.updateReview = (event) => this.setState({review: firstLetterUpperCase(event.target.value), reviewError: ""});
    this.updateComment = (event) => this.setState({restaurantComment: firstLetterUpperCase(event.target.value)});
    this.updateHeat = (event) => this.setState({heat: event.target.value});
    this.updatePortionSize = (event) => this.setState({portionSize: event.target.value});
    this.updateWaitTime = (event) => this.setState({waitTime: event.target.value});
    this.cleanupReview = this.cleanupReview.bind(this);
  }

  cleanupReview(state) {
    deleteReview(state)
    this.props.deleteReview(state)
  }

  render() {
    const { 
      tasteScore, heat, review, environmentScore, restaurantComment, innovationScore, price,
      portionSize, extrasScore, waitTime, username, timestamp, menuType
    } = this.state;
    return (
      <>
        <ThemeProvider theme={theme}>
          <h1 className="page-header text-center">Redigera recension</h1>
          <Grid container spacing={2} >
            <ReviewDate value={timestamp}/>
            <MenuType menuType={menuType} updateMenuType={this.updateMenuType}/>
            <GridRow>
              <TextField required value={price} onChange={this.updatePrice} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
            </GridRow>
            <SimpleSelect id="wait-time" label="Tid innan servering" value={waitTime} onChange={this.updateWaitTime} options={waitTimeOptions}/>
            <SimpleSelect id="heat" label="Hetta" value={heat} onChange={this.updateHeat} options={heatOptions}/>
            <SimpleSelect id="portion-size" label="Portionsstorlek" value={portionSize} onChange={this.updatePortionSize} options={potionSizeOptions}/>
            <TasteHelp />
            <Score label="Smak" score={tasteScore} updateScore={this.updateTasteScore} multiplier={username === "hampus" ? 10 : 1}/>
            <Score label="Omgivning" score={environmentScore} updateScore={this.updateEnvironmentScore} />
            <Score label="Nytänkande" score={innovationScore} updateScore={this.updateInnovationScore} />
            <Score label="Tillbehör" score={extrasScore} updateScore={this.updateExtrasScore} />
            <GridRow>
              <TextField value={restaurantComment} onChange={this.updateComment} id="comment-field" label="Restaurang kommentar" style={{width: "50vw", margin: 10}} />
            </GridRow>
            <GridRow>
              <TextField required value={review} onChange={this.updateReview} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
            </GridRow>
            <GridRow>
              <SaveButton state={this.state} onClick={saveReview} />
              <DeleteButton state={this.state} onClick={this.cleanupReview} />
            </GridRow>
          </Grid>
        </ThemeProvider>
      </>
    );
  }
}
