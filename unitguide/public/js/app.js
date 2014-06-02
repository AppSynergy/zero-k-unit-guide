// Generated by CoffeeScript 1.4.0
var app;

app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource, $filter) {
  var FacMode;
  $scope.modeSelect = function(v) {
    return $scope.selectedMode = v;
  };
  $scope.selectedMode = "fac";
  $scope.modes = [
    {
      str: 'Factory Mode',
      key: 'fac'
    }, {
      str: 'Compare Mode',
      key: 'com'
    }
  ];
  $scope.unitStats = {
    health: {
      str: 'Health',
      active: true
    },
    cost: {
      str: 'Cost',
      active: true
    },
    damage: {
      str: 'Damage',
      active: false
    },
    dps: {
      str: 'DPS',
      active: true
    },
    dpspcost: {
      str: 'DPS / 1000 Metal',
      active: true
    },
    healthpcost: {
      str: 'Health / 1000 Metal',
      active: true
    },
    range: {
      str: 'Range',
      active: false
    },
    speed: {
      str: 'Speed',
      active: false
    },
    deathDmg: {
      str: 'Death Damage',
      active: false
    }
  };
  $scope.factories = $resource('../data/Factories.json').get(function() {
    return $scope.units = $resource('../data/Units.json').get(function() {
      var fac;
      if (typeof $scope.selectedMode !== void 0) {
        fac = $scope.factories.data[10];
        $scope.facPage.getFilterStats(fac.builds);
        return $scope.facPage.selectedFactory = fac;
      }
    });
  });
  FacMode = (function() {

    function FacMode() {}

    FacMode.prototype.selectedFactory = {};

    FacMode.prototype.stats = {};

    FacMode.prototype.sortFields = {};

    FacMode.prototype.unitSort = 'name';

    FacMode.prototype.facSort = 'name';

    FacMode.prototype.unitSeq = false;

    FacMode.prototype.selectFactory = function() {
      var builds;
      builds = this.selectedFactory.builds;
      return this.getFilterStats(builds);
    };

    FacMode.prototype.unitFilterByFac = function(units) {
      return function(u) {
        var makes;
        makes = units.indexOf(u.handle);
        return makes > -1;
      };
    };

    FacMode.prototype.updateSortFields = function() {
      return angular.forEach($scope.unitStats, function(v, k) {
        if (v.active) {
          return $scope.facPage.sortFields[k] = v.str;
        } else {
          return delete $scope.facPage.sortFields[k];
        }
      });
    };

    FacMode.prototype.unitSortCallback = function(sortBy) {
      if (this.unitSort === sortBy) {
        this.unitSeq = !this.unitSeq;
      }
      return this.unitSort = sortBy;
    };

    FacMode.prototype.getFilterStats = function(builds) {
      var stats, units;
      units = [];
      angular.forEach($scope.units.data, function(u) {
        var makes;
        makes = builds.indexOf(u.handle);
        if (makes > -1) {
          return units.push(u);
        }
      });
      stats = {};
      angular.forEach($scope.unitStats, function(t, k) {
        stats[k] = {
          'max': 0,
          'vals': []
        };
        angular.forEach(units, function(u) {
          return stats[k].vals.push(u[k]);
        });
        return stats[k].max = Math.max.apply(Math, stats[k].vals);
      });
      return this.stats = angular.copy(stats);
    };

    FacMode.prototype.myWidth = function(stat, val) {
      var calc, max, min, perc;
      max = this.stats[stat].max;
      min = this.stats[stat].min;
      calc = 100 * Math.log(val) / Math.log(max);
      calc = calc * 2 - 120;
      perc = calc > 99 ? "100%" : Math.floor(calc) + "%";
      return perc;
    };

    return FacMode;

  })();
  $scope.facPage = new FacMode;
  $scope.facPage.updateSortFields();
  console.log($scope);
  return true;
});
