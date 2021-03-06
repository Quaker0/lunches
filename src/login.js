import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { CognitoIdentityCredentials, config } from "aws-sdk/global";
import jwtDecode from "jwt-decode";

const poolData = {
  UserPoolId: "eu-central-1_845hqElSt",
  ClientId: "10ckl84jpvm8sjidd1knmcql1r",
};
var userPool = new CognitoUserPool(poolData);

function newCognitoIdentityCredentials(result) {
  return new CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:56488c86-9315-4fe8-b28b-883b593d5daa",
    Logins: {
      "cognito-idp.eu-central-1.amazonaws.com/eu-central-1_845hqElSt": result
      .getIdToken()
      .getJwtToken()
    }
  });
}

export async function forgotPassword(username, callback) {
  var userData = { 
    Username: username,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.forgotPassword({
    onSuccess: () => {
      callback({type: "forgotPasswordPending"});
    },
    onFailure: (err) => {
      console.error(err);
      callback({type: "failure", message: err.message});
    }
  });
}

export function confirmPassword(confirmationCode, username, newPassword, callback) {
  var userData = {
    ConfirmationCode: confirmationCode,
    Password: newPassword,
    Username: username,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmPassword(confirmationCode, newPassword, {
    onSuccess: () => {
      callback({type: "passwordResetted"});
    },
    onFailure: (err) => {
      console.error(err);
      callback({type: "failure"});
    }
  });
}


export function login(username, password, callback) {
  var authenticationData = {
    Username: username,
    Password: password,
  };
  var authenticationDetails = new AuthenticationDetails(
    authenticationData
  );
  var userData = {
    Username: username,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      config.region = "eu-central-1";
      config.credentials = newCognitoIdentityCredentials(result);
      window.gtag && window.gtag("event", "login", { "method": "Cognito" });
      callback({type: "loggedIn"});
    },
    newPasswordRequired: function(userAttributes) {
      console.log("newPasswordRequired");
      delete userAttributes.email_verified;
      callback({
        type: "updatePassword",
        callback: (newPassword) => cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
          onSuccess: (result) => {
            console.log("NEW PASSWORD COMPLETED");
            window.gtag && window.gtag("event", "password_recovery", { "method": "Cognito" });
            config.credentials = newCognitoIdentityCredentials(result);
            return result;
          },
          onFailure: (err) => {
            alert(err.message);
            console.error(err);
          }
        })
      });
    },
    onFailure: function(err) {
      callback({
        type: "failure", 
        message: err.message || JSON.stringify(err)
      });
    },
  });
}

export function isLoggedIn() {
  var cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) return false;
  return cognitoUser.getSession(function(err, session) {
    if (err) return false;
     return session.isValid();
  });
}

export function getIdToken() {
  var cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) return false;
  return cognitoUser.getSession(function(err, session) {
    if (!err && session.isValid()){
      return session.getIdToken().getJwtToken();
    }
  });
}

export function getDecodedJWT() {
  const idToken = getIdToken()
  if (!idToken) return;
  return jwtDecode(idToken);
}

export function getUsername() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) return cognitoUser.getUsername();
}
