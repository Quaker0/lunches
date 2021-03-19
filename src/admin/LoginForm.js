import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login, isLoggedIn, forgotPassword, confirmPassword } from "../login.js";
import Dialog from "@material-ui/core/Dialog";

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


const getPasswordError = password => {
  if (password && password.length < 8) {
     return "För kort!";
  }
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [loginResult, setLoginResult] = useState();
  const [forgottenPassword, setForgottenPassword] = useState(false);
  const [open, setOpen] = useState(true);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  setTimeout(() => {
    setLoggedIn(isLoggedIn())
    setOpen(true)
  }, 15000);

  const handleLoginResult = (result) => {
    if (result) {
      console.log(result.type);
      if (result.type === "updatePassword") {
        return (
          <NewPasswordDialog 
            validate
            username={username} 
            password={password} 
            setUsername={setUsername} 
            setPassword={setPassword} 
            onSubmit={submitSignup}
            passwordError={getPasswordError(password)}
          />
        );
      }
      else if (result.type === "forgotPasswordPending") {
        return <ConfirmPasswordDialog 
          setConfirmCode={setConfirmCode} password={password} setPassword={setPassword}
          passwordError={getPasswordError(password)} onSubmit={submitConfirmPassword}/>
      }
      else if (result.type === "failure") {
        setLoginResult(null);
        setForgottenPassword(false);
        alert(result.message);
      }
      else if (result.type === "loggedIn") {
        setForgottenPassword(false);
        setLoginResult(null);
        setLoggedIn(true);
        setOpen(false);
      }
      else if (result.type === "passwordResetted") {
        setForgottenPassword(false)
        setLoginResult(null);
      }
      else {
        console.error(result);
        setLoginResult(null);
        alert("Unknown error!")
      }
    }
  }

  const submitSignup = (event) => {
    event.preventDefault();
    loginResult.callback(password);
    setLoginResult(null);
    setOpen(false);
  }

  const submitLogin = (event) => {
    event.preventDefault();
    login(username, password, setLoginResult);
    setPassword("")
  }

  const submitForgotPassword = (event) => {
    event.preventDefault();
    forgotPassword(username, setLoginResult)
  }

  const submitConfirmPassword = (event) => {
    event.preventDefault();
    confirmPassword(confirmCode, username, password, setLoginResult)
  }

  if (open && loginResult) {
    return handleLoginResult(loginResult);
  }
  else if (forgottenPassword) {
    return <ForgotPasswordDialog username={username} setUsername={setUsername} onSubmit={submitForgotPassword}/>
  }

  return (
    <LoginDialog 
      open={open}
      loggedIn={loggedIn} 
      username={username} 
      password={password} 
      setUsername={setUsername} 
      setPassword={setPassword}
      setForgottenPassword={setForgottenPassword}
      onSubmit={submitLogin}
    />
  );
}

const LoginDialog = props => (
  <Dialog open={props.open && !props.loggedIn}>
    <Form
      username={props.username}
      password={props.password}
      setUsername={props.setUsername} 
      setPassword={props.setPassword} 
      setForgottenPassword={props.setForgottenPassword} 
      onSubmit={props.onSubmit} 
    />
  </Dialog>
);

const ForgotPasswordDialog = props => (
  <Dialog open>
    <ForgotPasswordForm
      username={props.username}
      setUsername={props.setUsername} 
      onSubmit={props.onSubmit} 
    />
  </Dialog>
);

const ConfirmPasswordDialog = props => (
  <Dialog open>
    <ConfirmPasswordForm
      setConfirmCode={props.setConfirmCode}
      password={props.password}
      setPassword={props.setPassword}
      passwordError={props.passwordError}
      onSubmit={props.onSubmit}
    />
  </Dialog>
);

const NewPasswordDialog = props => (
  <Dialog open>
    <Form 
      setUsername={props.setUsername} 
      setPassword={props.setPassword} 
      onSubmit={props.onSubmit} 
      username={props.username}
      password={props.password}
      passwordError={props.passwordError}
      usernameDisabled={true}
      actionMessage="Nytt lösenord"
    />
  </Dialog>
);


function Form(props) {
  const classes = useStyles();
  const {setUsername, setPassword, onSubmit, username, password, usernameDisabled, actionMessage, passwordError, setForgottenPassword } = props;

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
          error={!!passwordError}
          variant="outlined"
          helperText={passwordError}
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
          disabled={!!passwordError}
          className={classes.submit}
        >
        {actionMessage || "Logga in"}
        </Button>
        {
          setForgottenPassword ?
          <Button onClick={() => setForgottenPassword(true)}>Glömt lösenord</Button>
          : <></>
        }
      </form>
      </div>
    </Container>
  );
}

function ForgotPasswordForm(props) {
  const classes = useStyles();
  const { setUsername, username, onSubmit } = props;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Glömt lösenord
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Användarnamn"
          name="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Återställ lösenord
        </Button>
      </form>
      </div>
    </Container>
  );
}

function ConfirmPasswordForm(props) {
  const classes = useStyles();
  const { setConfirmCode, onSubmit, password, setPassword, passwordError } = props;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Glömt lösenord
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="confirmCode"
          label="Verifieringskod"
          name="ConfirmCode"
          onChange={event => setConfirmCode(event.target.value)}
          autoFocus
        />
        <TextField
          error={!!passwordError}
          variant="outlined"
          helperText={passwordError}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Nytt lösenord"
          type="password"
          id="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          disabled={!!passwordError}
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Återställ lösenord
        </Button>
      </form>
      </div>
    </Container>
  );
}