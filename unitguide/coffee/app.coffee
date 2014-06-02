app = angular.module('unitguide', ['ngResource'])

app.controller('MainCtrl', ($scope, $resource, $filter) ->
	
	# ----------------------------
	# App Paging
	# ----------------------------
	
	# Select a new page
	$scope.modeSelect = (v) ->
		$scope.selectedMode = v
	
	# Default page
	$scope.selectedMode = "fac";
	
	# All the pages
	$scope.modes = [
		{str:'Factory Mode',key:'fac'},
		{str:'Compare Mode',key:'com'}
	]
		
	# ----------------------------
	# Unit Stats
	# str:  label for stat
	# active: default on/off
	# ----------------------------
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
	}
	
	# ----------------------------
	# Fetch json data onload
	# ----------------------------
	
	$scope.factories = $resource('../data/Factories.json').get () -> # fetch factories		
		$scope.units = $resource('../data/Units.json').get () -> # then fetch units
			# go to Factory mode
			if typeof $scope.selectedPage != undefined
				# default to... I dunno... Cloaky?
				fac = $scope.factories.data[10]
				getFilterStats fac.builds
				$scope.facPage.selectedFactory = fac
	
	# ----------------------------
	# Factory page logic
	# ----------------------------
	$scope.facPage = {}
	
	# default sorting - alphabetical
	$scope.facPage.unitSort = 'name'
	$scope.facPage.unitSeq = false
	$scope.facPage.facSort = 'name'
	
	# choosing a new factory
	$scope.facPage.selectFactory = () ->
		builds = $scope.facPage.selectedFactory.builds
		getFilterStats builds

	
	# used for filtering units list for a specific factory
	$scope.facPage.unitFilterByFac = (units) ->
		return (u) ->
			# return true if in the build list
			makes = units.indexOf u.handle
			return makes > -1
	
	# updating the sort fields
	$scope.facPage.updateSortFields = () ->
		angular.forEach($scope.unitStats, (v,k) ->
			if (v.active)
				$scope.facPage.sortFields[k] = v.str
			else
				delete $scope.facPage.sortFields[k]
		)
	
	# instantiate the sort fields
	$scope.facPage.sortFields = {}
	$scope.facPage.updateSortFields()
	
	# sorting the sort fields
	$scope.facPage.unitSortCallback = (sortBy) ->
		# swap order if no other changes
		if ($scope.facPage.unitSort == sortBy)
			$scope.facPage.unitSeq = !$scope.facPage.unitSeq
		$scope.facPage.unitSort = sortBy
	
	
	# ----------------------------
	# Other stuff
	# ----------------------------
	
	# figure out a good width for the "strength indicator"
	$scope.myWidth = (stat,val) ->
		max = $scope.stats[stat].max
		min = $scope.stats[stat].min
		calc = 100*Math.log(val)/Math.log(max)
		# completely arbitrary math..
		calc = calc*2-120
		perc = if calc > 99 then "100%" else Math.floor(calc)+"%"
		return perc
	
	
	# find the details of current units
	getFilterStats = (builds) ->
		
		# would rather just do $filter(unitFilterByFac)
		units = []
		angular.forEach($scope.units.data, (u) ->
			makes = builds.indexOf u.handle
			if makes > -1 then units.push u
		)
		# loop through collecting stats
		stats = {}
		angular.forEach($scope.unitStats, (t,k) ->
			stats[k] = {'max': 0, 'vals':[]}
			angular.forEach(units, (u) ->
				stats[k].vals.push u[k]
			)		
			# some maths
			stats[k].max = Math.max.apply(Math, stats[k].vals)
		)
		
		$scope.stats = stats
		
	console.log $scope
)
	
	