import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login, isLoggedIn } from "./login.js";
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginResult, setLoginResult] = useState();
	const [open, setOpen] = useState(true);

	const handleLoginResult = (result) => {
		if (result) {
			if (result.type === "updatePassword") {
				console.log("updatePassword");
				return (
					<Dialog open >
			        	<Form 
							setUsername={setUsername} 
							setPassword={setPassword} 
							onSubmit={(event) => submitSignup(event, result.callback)} 
							username={username}
							password={password}
							usernameDisabled={true}
							actionMessage="Nytt lösenord"
						/>
				    </Dialog>
				);
			}
			else if (result.type === "failure") {
				alert(result.message);
			}
			else if (result.type === "success") {
				console.log("Success");
				setOpen(false);
			}
			else {
				console.error(result);
			}
			return (
				<Dialog open={open && !isLoggedIn()}>
			        <Form
						username={username}
						password={password}
						setUsername={setUsername} 
						setPassword={setPassword} 
						onSubmit={submitLogin} 
					/>
			    </Dialog>
			);
		}
	}

	const submitLogin = (event) => {
		event.preventDefault();
		const result = login(username, password, setLoginResult);
		setPassword("")
		setLoginResult(result);
	}

	const submitSignup = (event, callback) => {
		event.preventDefault();
		callback(password);
	}

	if (open && loginResult) {
		return handleLoginResult(loginResult);
	}

	return (
		<Dialog open={open && !isLoggedIn()}>
			<Form
				username={username}
				password={password}
				setUsername={setUsername} 
				setPassword={setPassword} 
				onSubmit={submitLogin} 
			/>
		</Dialog>
	);
}

function Form(props) {
	const classes = useStyles();
	const {setUsername, setPassword, onSubmit, username, password, usernameDisabled, actionMessage } = props;

	return (
		<Container component="main" maxWidth="xs">
		  <CssBaseline />
		  <div className={classes.paper}>
		    <Avatar className={classes.avatar}>
		      <LockOutlinedIcon />
		    </Avatar>
		    <Typography component="h1" variant="h5">
		      { actionMessage || "Logga in" }
		    </Typography>
		    <form className={classes.form} noValidate onSubmit={onSubmit}>
		      <TextField
		        variant="outlined"
		        margin="normal"
		        required
		        fullWidth
		        disabled={usernameDisabled}
		        id="username"
		        label="Användarnamn"
		        name="username"
		        value={username}
		        onChange={event => setUsername(event.target.value)}
		        autoFocus
		      />
		      <TextField
		        variant="outlined"
		        margin="normal"
		        required
		        fullWidth
		        name="password"
		        label="Lösenord"
		        type="password"
		        id="password"
		        value={password}
		        onChange={event => setPassword(event.target.value)}
		      />
		      <Button
		        type="submit"
		        fullWidth
		        variant="contained"
		        color="primary"
		        className={classes.submit}
		      >
		        {actionMessage || "Logga in"}
		      </Button>
		    </form>
		  </div>
		</Container>
	);
}