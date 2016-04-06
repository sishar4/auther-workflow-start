'use strict';

app.factory('Auth', function ($http, $window) {
	var Auth = {};

	Auth.signUpUser = function (email, password) {
		console.log(email);
		console.log(password);

		$http.post('/signup', {email:email, password:password})
		.then(function(response) {
			console.log("Successful Sign Up");
			console.log(response);
			$window.location.href = '/stories';
		})
		.catch(function(err) {
			console.log("Failed Sign Up");
			console.log(err);
		});
	};

	Auth.submitLogin = function (email, password) {
		console.log(email);
		console.log(password);

		$http.post('/login', {email:email, password:password})
		.then(function(response) {
			console.log("Successful Login");
			console.log(response);
			$window.location.href = '/stories';
		})
		.catch(function(err) {
			console.log("Failed login");
			console.log(err);
		});
	};

	Auth.logout = function() {
		$http.get('/logout')
		.then(function(response) {
			console.log("Successful Logout");
			console.log(response);
			$window.location.href = '/login';
		})
		.catch(function(err) {
			console.log("Failed logout");
			console.log(err);
		});
	};

	return Auth;
});