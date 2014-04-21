var App = angular.module('App', []);

App.controller('FactoryCtrl', function($scope, $http) {
	$http.get('data/Factories.json').then(function(res){
		$scope.factories = res.data;                
	});
});