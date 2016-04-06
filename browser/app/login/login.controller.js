'use strict';

app.controller('LoginCtrl', function($scope, Auth) {

	$scope.submitLogin = function () {
		return Auth.submitLogin($scope.user.email, $scope.user.password);
	};
});