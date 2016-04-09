'use strict';

app.controller('LoginCtrl', function($scope, $state, Auth) {

	$scope.submitLogin = function () {
		Auth.login($scope.user.email, $scope.user.password)
		.then(function() {
			console.log("Successful Login");
			$state.go('stories');
		})
		.catch(function(err) {
			console.log("Failed login");
			console.log(err);
		});
	};
});