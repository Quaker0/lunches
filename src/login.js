import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";

const poolData = {
	UserPoolId: "eu-central-1_845hqElSt",
	ClientId: "10ckl84jpvm8sjidd1knmcql1r",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function newCognitoIdentityCredentials(result) {
	return new AWS.CognitoIdentityCredentials({
		IdentityPoolId: "eu-central-1:56488c86-9315-4fe8-b28b-883b593d5daa",
		Logins: {
			"cognito-idp.eu-central-1.amazonaws.com/eu-central-1_845hqElSt": result
			.getIdToken()
			.getJwtToken(),
		},
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
			var accessToken = result.getAccessToken().getJwtToken();
			console.log(accessToken);
			AWS.config.region = "eu-central-1";
			AWS.config.credentials = newCognitoIdentityCredentials(result);

			AWS.config.credentials.refresh(error => {
				if (error) {
					console.error(error);
					callback({
						type: "failure", 
						message: error.message || JSON.stringify(error)
					});
				} else {
					console.log("Successfully logged!");
					callback({type: "success"});
				}
			});
		},

		newPasswordRequired: function(userAttributes, requiredAttributes) {
			console.log("newPasswordRequired");
			delete userAttributes.email_verified;
			console.log(userAttributes);
            callback({
            	type: "updatePassword", 
            	callback: (newPassword, pswCallback) => cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
					onSuccess: (result) => {
						console.log("NEW PASSWORD COMPLETED: ");
						console.log(result);
						pswCallback(result);
					},
					onFailure: (err) => {
						console.log(err);
						pswCallback(err);
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

export function getUser() {
	var cognitoUser = userPool.getCurrentUser();
 
	if (cognitoUser != null) {
	    cognitoUser.getSession(function(err, session) {
	        if (err) {
	            console.log(err.message || JSON.stringify(err));
	            return {
					type: "failure", 
					message: err.message || JSON.stringify(err)
				}
	        }
	        console.log("session validity: " + session.isValid());
	        AWS.config.credentials = newCognitoIdentityCredentials(session);
	 		return {type: "success"};
	    });
	}
	return {type: "userNotFound"};
}
