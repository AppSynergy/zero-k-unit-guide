var app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource, $filter) {
	
	// these are the stats you can choose from and sort
	$scope.unitStats = {
		health:      {str:'Health',active:true},
		cost:        {str:'Cost',active:true},
		damage:      {str:'Damage',active:false},
		dps:         {str:'DPS',active:true},
		dpspcost:    {str:'DPS / 1000 Metal',active:true},
		healthpcost: {str:'Health / 1000 Metal',active:true},
		range:       {str:'Range',active:false},
		speed:       {str:'Speed',active:false},
		deathDmg:    {str:'Death Damage',active:false},
	};
	
	// INITIALIZE
	// fetch factories
	$scope.factories = $resource('../data/Factories.json').get(function() {
		// fetch units
		$scope.units = $resource('../data/Units.json').get(function() {
			// default to... I dunno... Cloaky?
			var fac = $scope.factories.data[10];
			getFilterStats(fac.builds);
			$scope.selectedFactory = fac;
		});	
	});
	
	// choosing a new factory
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
	
	// used for filtering units list for a specific factory
	$scope.unitFilterByFac = function(units) {
		return function(u) {
			// return true if in the build list
			var makes = units.indexOf(u.handle);
			return makes > -1;
		}
	}
	
	// default sorting - alphabetical
	$scope.unitSort = 'name';
	$scope.unitSeq = false;
	$scope.facSort = 'name';
	
	// updating the sort fields
	$scope.updateSortFields = function() {
		angular.forEach($scope.unitStats, function(v,k) {
			if (v.active) $scope.sortFields[k] = v.str;
			else delete $scope.sortFields[k];
		});
	};
	
	// instantiate the sort fields
	$scope.sortFields = {};
	$scope.updateSortFields();
	
	// sorting the sort fields
	$scope.unitSortCallback = function(sortBy) {
		// swap order if no other changes
		if ($scope.unitSort == sortBy) $scope.unitSeq = !$scope.unitSeq;
		$scope.unitSort = sortBy;
	}
	
	// figure out a good width for the "strength indicator"
	$scope.myWidth = function(stat,val) {
		var max = $scope.stats[stat].max;
		var min = $scope.stats[stat].min;
		var calc = 100*Math.log(val)/Math.log(max);
		var perc = (calc > 99) ? "100%" : Math.floor(calc)+"%";
		return perc;
	};

});
