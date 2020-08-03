import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import jwtDecode from "jwt-decode";

const poolData = {
  UserPoolId: "eu-central-1_845hqElSt",
  ClientId: "10ckl84jpvm8sjidd1knmcql1r",
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function newCognitoIdentityCredentials(result) {
  return new AWS.CognitoIdentityCredentials({
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
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.forgotPassword({
    onSuccess: (result) => {
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
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmPassword(confirmationCode, newPassword, {
    onSuccess: (result) => {
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
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );
  var userData = {
    Username: username,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      AWS.config.region = "eu-central-1";
      AWS.config.credentials = newCognitoIdentityCredentials(result);
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
            AWS.config.credentials = newCognitoIdentityCredentials(result);
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
  if (cognitoUser != null) {
    return cognitoUser.getSession(function(err, session) {
      if (err) { return false }
       return session.isValid();
    });
  }
  return false;
}

export function getIdToken() {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    return cognitoUser.getSession(function(err, session) {
      if (!err && session.isValid()){
        return session.getIdToken().getJwtToken();
      } 
    });
  }
  return false;
}

export function getDecodedJWT() {
  return jwtDecode(getIdToken());
}

export function getUsername() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) { return cognitoUser.getUsername(); }
}
