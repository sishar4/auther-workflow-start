'use strict';

app.factory('Auth', function ($http, $rootScope) {
	$rootScope.currentUser = null;
	var Auth = {};

	Auth.signup = function (email, password) {
		console.log(email);
		console.log(password);

		return $http.post('/signup', {
			email:email, 
			password:password
		})
		.then(function(response) {
			$rootScope.currentUser = response.data;
		});
	};

	Auth.login = function (email, password) {
		console.log(email);
		console.log(password);

		return $http.post('/login', {
			email:email, 
			password:password
		})
		.then(function(response) {
			$rootScope.currentUser = response.data;
		});
	};

	Auth.logout = function () {
		return $http.delete('/logout')
		.then(function() {
			$rootScope.currentUser = null;
		})
	};

	Auth.getCurrentUser = function () {
		return $http.get('/me')
		.then(function (response) {
			return response.data;
		});
	};

	return Auth;
});