var app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource, $filter) {
	
	// fetch factories
	$scope.factories = $resource('../data/Factories.json').get(function() {
		// fetch units
		$scope.units = $resource('../data/Units.json').get(function() {
			// default to first factory (Cloaky)
			var fac = $scope.factories.data[0];
			getFilterStats(fac.builds);
			$scope.selectedFactory = fac;
		});	
	});	
	
	// choose a new factory
	$scope.selectFactory = function() {
		var builds = $scope.selectedFactory.builds;
		getFilterStats(builds);
	}
	
	// find the details of current units
	function getFilterStats(builds) {
		console.log(builds);
		// would rather just do $filter(unitFilterByFac)
		var units = [];
		angular.forEach($scope.units.data, function(u) {
			var makes = builds.indexOf(u.handle);
			if (makes > 0) units.push(u);
		});
		angular.forEach(units, function(u) {
			angular.forEach($scope.unitStats, function(s) {
				//sriously?
			});
		});
	}
	
	// used for filtering units list
	$scope.unitFilterByFac = function(units) {
		return function(u) {
			// return true if in the build list
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
		//console.log(key);
		return perc;
	}

});
