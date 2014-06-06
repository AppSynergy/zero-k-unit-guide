app = angular.module('unitguide', ['ngResource'])

app.controller('MainCtrl', ($scope, $resource, $filter) ->
	
	# ----------------------------
	# App Paging
	# ----------------------------
	
	# Select a new page
	$scope.modeSelect = (v) ->
		$scope.selectedMode = v
	
	# Default page
	$scope.selectedMode = "com";
	
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
	$scope.dataSource = {}
	
	$scope.dataSource.statDefs = {
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
	$scope.dataSource.factories = $resource('../data/Factories.json').get () -> # fetch factories		
		$scope.dataSource.units = $resource('../data/Units.json').get () -> # then fetch units
			# go to Factory mode
			if typeof $scope.selectedMode != undefined
				# default to... I dunno... Cloaky?
				fac = $scope.dataSource.factories.data[10]
				$scope.facPage.selectedFactory = fac
				$scope.facPage.selectFactory()
	
	# ----------------------------
	# Compare page logic
	# ----------------------------	
	class ComMode
	
	$scope.comPage = new ComMode
	
	# ----------------------------
	# Factory page logic
	# ----------------------------	
	class FacMode	
		# which factory are we viewing
		selectedFactory: {}
		# stats of all the units in that factory
		stats: {}
		statDefs: {}
		# visible (sortable) stats
		sortFields: {}
		# default sorting - alphabetical
		unitSort: 'name'
		facSort: 'name'
		# asc vs desc
		unitSeq: false
		
		# setup stat definitions & initial sort fields
		constructor: () ->	
			@statDefs = $scope.dataSource.statDefs
			@updateSortFields()
		
		# choosing a new factory
		selectFactory: () ->
			builds = @selectedFactory.builds
			@stats = @getFilterStats builds

		# used for filtering units list for a specific factory
		unitFilterByFac: (units) ->
			return (u) ->
				# return true if in the build list
				makes = units.indexOf u.handle
				return makes > -1
	
		# updating the sort fields
		updateSortFields: () =>
			angular.forEach(@statDefs, (obj,k) =>
				if obj.active
					# @TODO: something wrong here
					@sortFields[k] = obj.str
				else
					delete @sortFields[k]
			)
			
		# sorting the sort fields
		unitSortCallback: (sortBy) ->
			# swap order if no other changes
			if (@unitSort == sortBy)
				@unitSeq = !@unitSeq
			@unitSort = sortBy
			
		# find all stats for the selected factory
		getFilterStats: (builds) ->
			units = []
			angular.forEach($scope.dataSource.units.data, (u) ->
				makes = builds.indexOf u.handle
				if makes > -1 then units.push u
			)
			# loop through collecting stats
			stats = {}
			angular.forEach(@statDefs, (t,k) ->
				stats[k] = {'max': 0, 'vals':[]}
				angular.forEach(units, (u) ->
					stats[k].vals.push u[k]
				)		
				# some maths
				stats[k].max = Math.max.apply(Math, stats[k].vals)
			)
			return stats
			
		# figure out a good width for the "strength indicator"
		myWidth: (stat,val) ->
			max = @stats[stat].max
			min = @stats[stat].min
			calc = 100*Math.log(val)/Math.log(max)
			# completely arbitrary math..
			calc = calc*2-120
			perc = if calc > 99 then "100%" else Math.floor(calc)+"%"
			return perc
	
	# ----------------------------
	# Instantiate the factory page
	# ----------------------------
	$scope.facPage = new FacMode
	
	console.log $scope # debug
	true # because coffee
)
	
	