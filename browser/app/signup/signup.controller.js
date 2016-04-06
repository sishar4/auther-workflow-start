'use strict'

app.controller('SignupCtrl', function($scope, Auth) {

	$scope.signUpUser = function () {
	  return Auth.signUpUser($scope.newUser.email, $scope.newUser.password);
	};
});