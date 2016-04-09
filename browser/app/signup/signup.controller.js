'use strict'

app.controller('SignupCtrl', function($scope, $state, Auth) {

	$scope.signUpUser = function () {
	  	Auth.signup($scope.newUser.email, $scope.newUser.password)
	  	.then(function() {
			console.log("Successful Sign Up");
			$state.go('stories');
		})
		.catch(function(err) {
			console.log("Failed Sign Up");
			console.log(err);
		});
	};
});