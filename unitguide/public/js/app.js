var app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource) {
  
	$scope.factories = $resource('../data/Factories.json').get(function() {
		//console.log($scope.factories);
	});
	
	$scope.units = $resource('../data/Units.json').get(function() {
		//console.log($scope.units);
	});
	
	$scope.selectFactory = function() {
		//console.log($scope.fac.builds);
	}
	
	$scope.unitFilterByFac = function(units) {
		console.log(units);
		return function(u) {
			// return true if in units
			var makes = units.indexOf(u.handle);
			return makes > 0;
		}
	}
  
});
