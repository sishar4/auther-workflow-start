'use strict';

app.controller('NavCtrl', function($scope, Auth) {

	$scope.submitLogout = function () {
		return Auth.logout();
	};
});