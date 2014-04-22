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
		// would rather just do $filter(unitFilterByFac)
		var units = [];
		angular.forEach($scope.units.data, function(u) {
			var makes = builds.indexOf(u.handle);
			if (makes > -1) units.push(u);
		});
		// loop through collecting stats
		var stats = {}
		angular.forEach($scope.unitStats, function(t,k) {
			stats[k] = {'max': 0, 'vals':[]};
			angular.forEach(units, function(u) {	
				stats[k].vals.push(u[k]);
			});
			// some maths
			stats[k].max = Math.max.apply(Math, stats[k].vals);
		});
		$scope.stats = stats;
	}
	
	// used for filtering units list
	$scope.unitFilterByFac = function(units) {
		return function(u) {
			// return true if in the build list
			var makes = units.indexOf(u.handle);
			return makes > -1;
		}
	}
	
	// display detail for units
	$scope.unitStats = {
		health: 'Health',
		cost:   'Cost',
		damage: 'Damage',
		dps:    'DPS',
		range:  'Range',
		speed:  'Speed',
	};
	
	// figure out a good width for the "strength indicator"
	$scope.myWidth = function(stat,val) {
		var max = $scope.stats[stat].max;
		var perc = (val/max > 0.99) ? "99%" : (100*val/max)+"%";
		return perc;
	}

});
