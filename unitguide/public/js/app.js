var app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource) {
	
	// fetch factories
	$scope.factories = $resource('../data/Factories.json').get(function() {
		// default to first factory (Cloaky)
		$scope.selectedFactory = $scope.factories.data[0];
	});
	
	// fetch units
	$scope.units = $resource('../data/Units.json').get(function() {
		//console.log($scope.units);
	});
	
	// choose a new factory
	$scope.selectFactory = function() {
		console.log($scope.selectedFactory);
	}
	
	// used for filtering units list
	$scope.unitFilterByFac = function(units) {
		return function(u) {
			// return true if in units
			var makes = units.indexOf(u.handle);
			return makes > 0;
		}
	}
	
	// display detail for units
	$scope.unitStats = {
		damage:'Damage',
		dps:'DPS',
	};
  
});
