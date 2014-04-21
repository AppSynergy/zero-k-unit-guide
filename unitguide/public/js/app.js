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
		//console.log($scope.selectedFactory);
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
		health: 'Health',
		cost:   'Cost',
		damage: 'Damage',
		dps:    'DPS',
		range:  'Range',
	};
	
	// figure out a good width for the "strength indicator"
	$scope.myWidth = function(key) {
		var perc = (key/50 > 100) ? "100%" : (key/50)+"%";
		console.log(key);
		return perc;
	}

});
