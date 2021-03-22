import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import { ThemeProvider } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import shortid from "shortid"

import { getUsername, getDecodedJWT } from "../login.js";
import { firstLetterUpperCase } from "../utils.js"
import { RoundImages, TasteHelp, heatOptions, potionSizeOptions, waitTimeOptions, theme, MenuType, Score, ReviewDate, SimpleSelect, GridRow, defaultState, SaveButton, saveReview, DeleteButton, deleteReview, SimpleModal } from "./adminReviewUtils.js";

export default class EditReviewPage extends Component {
	constructor(props) {
		super(props);
		this.state = {jwt: getDecodedJWT(), reviewId: shortid.generate(), openSaveModal: false, buttonsDisabled: false, openDeleteModal: false, username: getUsername(), reviewPointer: props.reviewPointer, ...defaultState, ...props.review, meta: props.meta};
    console.log(props.review)
		this.updateMenuType = (event, value) => this.setState({menuType: value});
		this.updatePrice = (event) => this.setState({price: parseInt(event.target.value.replace(/[^0-9,]/g, "") || 0)});
		this.updateTasteScore = (event, value) => this.setState({tasteScore: value});
		this.updateExtrasScore = (event, value) => this.setState({extrasScore: value});
		this.updateInnovationScore = (event, value) => this.setState({innovationScore: value});
		this.updateEnviromentScore = (event, value) => this.setState({environmentScore: value});
		this.updateReview = (event) => this.setState({review: firstLetterUpperCase(event.target.value), reviewError: ""});
		this.updateDescription = (event) => this.setState({description: firstLetterUpperCase(event.target.value)});
    this.updateMeal = (event) => this.setState({meal: firstLetterUpperCase(event.target.value)});
		this.updateHeat = (event) => this.setState({heat: event.target.value});
		this.updatePortionSize = (event) => this.setState({portionSize: event.target.value});
		this.updateWaitTime = (event) => this.setState({waitTime: event.target.value});
    this.updateDate = (event) => this.setState({timestamp: event.target.value});
		this.save = this.save.bind(this);
		this.delete = this.delete.bind(this);
		this.handleCloseSaveModal = this.handleCloseSaveModal.bind(this);
		this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
	}

	delete() {
    this.setState({buttonsDisabled: true})
		deleteReview(this.state).then(success => {
			if (success) {
				this.setState({openDeleteModal: true});
			} else {
				alert("APIet misslyckades med att radera recensionen");
			}
      this.setState({buttonsDisabled: false})
		});
	}

	save() {
    this.setState({buttonsDisabled: true})
		saveReview(this.state).then(success => {
			if (success) {
				this.setState({openSaveModal: true});
			} else {
				alert("APIet misslyckades med att uppdatera recensionen");
			}
      this.setState({buttonsDisabled: false})
		});
	}

	handleCloseSaveModal() {
    window.gtag && window.gtag("event", "edit_review", "admin");
		this.setState({openSaveModal: false});
	}

	handleCloseDeleteModal() {
		this.props.deleteReview(this.state);
	}

	render() {
		const { 
			tasteScore, heat, review, environmentScore, description, innovationScore, price, buttonsDisabled, meal, jwt,
			portionSize, extrasScore, waitTime, username, timestamp, menuType, openSaveModal, openDeleteModal, imageRef
		} = this.state;

    console.log(timestamp)

    let imageKeys;
    if (imageRef) {
      imageKeys = [`${imageRef}`]
    }
    const userGroups = jwt["cognito:groups"];
		return (
			<>
				<ThemeProvider theme={theme}>
					<Box>
						<Button variant="contained" onClick={() => this.props.back()}><ChevronLeftIcon /></Button>
					</Box>
					<h1 className="page-header text-center">Redigera recension</h1>
					<Grid container spacing={2} >
						<ReviewDate value={timestamp} updateDate={this.updateDate} disabled={!userGroups || !userGroups.includes("admins")}/>
            <GridRow>
              <TextField value={meal} onChange={this.updateMeal} id="meal-field" label="Måltid" style={{width: "50vw", margin: 10}} />
            </GridRow>
            <GridRow>
              <TextField value={description} onChange={this.updateDescription} id="description-field" label="Måltids beskrivning" style={{width: "50vw", margin: 10}} />
            </GridRow>
						<MenuType menuType={menuType} updateMenuType={this.updateMenuType}/>
						<GridRow>
							<TextField required value={price} onChange={this.updatePrice} id="price-field" label="Pris" style={{width: "50vw", margin:10}} InputProps={{endAdornment: <InputAdornment position="end">kr</InputAdornment>}} />
						</GridRow>
						<SimpleSelect id="wait-time" label="Tid innan servering" value={waitTime} onChange={this.updateWaitTime} options={waitTimeOptions}/>
						<SimpleSelect id="heat" label="Hetta" value={heat} onChange={this.updateHeat} options={heatOptions}/>
						<SimpleSelect id="portion-size" label="Portionsstorlek" value={portionSize} onChange={this.updatePortionSize} options={potionSizeOptions}/>
						<TasteHelp />
						<Score label="Smak" score={tasteScore} updateScore={this.updateTasteScore} multiplier={["hampus", "niclas"].includes(username) ? 10 : 1}/>
						<Score label="Omgivning" score={environmentScore} updateScore={this.updateEnvironmentScore} />
						<Score label="Nytänkande" score={innovationScore} updateScore={this.updateInnovationScore} />
						<Score label="Tillbehör" score={extrasScore} updateScore={this.updateExtrasScore} />
						<GridRow>
							<TextField required value={review} onChange={this.updateReview} id="review-field" label="Måltids recension" style={{width: "50vw", margin: 10}} />
						</GridRow>
						<GridRow>
							<SaveButton onClick={this.save} disabled={buttonsDisabled} />
							<DeleteButton onClick={this.delete} disabled={buttonsDisabled} />
						</GridRow>
            <GridRow>
            { imageRef ? (
              <Typography justify-self="center">
                Lägg till eller ta bort en bild genom att mejla den till <a href="mailto:pics@sthlmlunch.se">pics@sthlmlunch.se</a> med <code>ref={imageRef}</code> i ämnet.
              </Typography>
              ) : (
              <Typography justify-self="center">
                Den här recensionen var tillagd innan vi hade bilder, tryck spara <br/>
                för att skapa en referens som du kan använda när du mejlar in bilden.
              </Typography>
              )
            }
            </GridRow>
            <GridRow>
              <RoundImages imageKeys={imageKeys}/>
            </GridRow>
					</Grid>
				</ThemeProvider>
				<SimpleModal text="Recensionen har uppdaterats!" open={openSaveModal} handleClose={this.handleCloseSaveModal} />
				<SimpleModal text="Recensionen har raderats!" open={openDeleteModal} handleClose={this.handleCloseDeleteModal} />
			</>
		);
	}
}
