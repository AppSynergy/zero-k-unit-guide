// Generated by CoffeeScript 1.4.0
var app,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app = angular.module('unitguide', ['ngResource']);

app.controller('MainCtrl', function($scope, $resource, $filter) {
  var ComMode, FacMode, ZkMode, loadUnitsByHandle;
  $scope.modeSelect = function(v) {
    return $scope.selectedMode = v;
  };
  $scope.selectedMode = "com";
  $scope.modes = [
    {
      str: 'Browse units by factory',
      key: 'fac'
    }, {
      str: 'Compare individual units',
      key: 'com'
    }
  ];
  $scope.dataSource = {};
  $scope.dataSource.statDefs = {
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
      active: true
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
  $scope.stillLoading = true;
  loadUnitsByHandle = function() {
    $scope.dataSource.unitByHandle = {};
    return angular.forEach($scope.dataSource.units.data, function(u) {
      return $scope.dataSource.unitByHandle[u.handle] = u;
    });
  };
  $scope.dataSource.factories = $resource('../data/Factories.json').get(function() {
    return $scope.dataSource.units = $resource('../data/Units.json').get(function() {
      var fac;
      loadUnitsByHandle();
      if (typeof $scope.selectedMode !== void 0) {
        fac = $scope.dataSource.factories.data[10];
        $scope.facPage.selectedFactory = fac;
        $scope.facPage.selectFactory();
        return $scope.stillLoading = false;
      }
    });
  });
  ZkMode = (function() {

    ZkMode.prototype.stats = {};

    ZkMode.prototype.statDefs = {};

    function ZkMode() {
      this.statDefs = $scope.dataSource.statDefs;
    }

    ZkMode.prototype.getFilterStats = function(unitNames) {
      var stats, units;
      units = [];
      angular.forEach($scope.dataSource.units.data, function(u) {
        var makes;
        makes = unitNames.indexOf(u.handle);
        if (makes > -1) {
          return units.push(u);
        }
      });
      stats = {};
      angular.forEach(this.statDefs, function(t, k) {
        stats[k] = {
          'max': 0,
          'vals': []
        };
        angular.forEach(units, function(u) {
          return stats[k].vals.push(u[k]);
        });
        return stats[k].max = Math.max.apply(Math, stats[k].vals);
      });
      return stats;
    };

    ZkMode.prototype.myWidth = function(stat, val) {
      var calc, max, min, perc;
      max = this.stats[stat].max;
      min = this.stats[stat].min;
      calc = 100 * Math.log(val) / Math.log(max);
      calc = calc * 2 - 120;
      perc = calc > 99 ? "100%" : Math.floor(calc) + "%";
      return perc;
    };

    return ZkMode;

  })();
  ComMode = (function(_super) {

    __extends(ComMode, _super);

    ComMode.prototype.selectedUnitHandles = [];

    ComMode.prototype.selectedUnits = [];

    ComMode.prototype.currentFields = {};

    function ComMode() {
      this.removeUnit = __bind(this.removeUnit, this);

      this.addUnit = __bind(this.addUnit, this);

      var _this = this;
      ComMode.__super__.constructor.call(this, "ComMode");
      angular.forEach(this.statDefs, function(obj, k) {
        return _this.currentFields[k] = obj.str;
      });
    }

    ComMode.prototype.addUnit = function(handle) {
      var unit;
      if (this.selectedUnitHandles.indexOf(handle) < 0) {
        unit = $scope.dataSource.unitByHandle[handle];
        this.selectedUnits.push(unit);
        this.selectedUnitHandles.push(handle);
        return this.stats = this.getFilterStats(this.selectedUnitHandles);
      }
    };

    ComMode.prototype.removeUnit = function(u) {
      var suhi, sui;
      sui = this.selectedUnits.indexOf(u);
      if (sui > -1) {
        this.selectedUnits.splice(sui, 1);
      }
      suhi = this.selectedUnitHandles.indexOf(u.handle);
      if (suhi > -1) {
        this.selectedUnitHandles.splice(suhi, 1);
      }
      return this.stats = this.getFilterStats(this.selectedUnitHandles);
    };

    return ComMode;

  })(ZkMode);
  $scope.comPage = new ComMode;
  FacMode = (function(_super) {

    __extends(FacMode, _super);

    FacMode.prototype.selectedFactory = {};

    FacMode.prototype.currentFields = {};

    FacMode.prototype.unitSort = 'name';

    FacMode.prototype.facSort = 'name';

    FacMode.prototype.unitSeq = false;

    function FacMode() {
      this.updateCurrentFields = __bind(this.updateCurrentFields, this);
      FacMode.__super__.constructor.call(this, "FacMode");
      this.updateCurrentFields();
    }

    FacMode.prototype.selectFactory = function() {
      var builds;
      builds = this.selectedFactory.builds;
      return this.stats = this.getFilterStats(builds);
    };

    FacMode.prototype.unitFilterByFac = function(units) {
      return function(u) {
        var makes;
        makes = units.indexOf(u.handle);
        return makes > -1;
      };
    };

    FacMode.prototype.updateCurrentFields = function() {
      var _this = this;
      return angular.forEach(this.statDefs, function(obj, k) {
        if (obj.active) {
          return _this.currentFields[k] = obj.str;
        } else {
          return delete _this.currentFields[k];
        }
      });
    };

    FacMode.prototype.unitSortCallback = function(sortBy) {
      if (this.unitSort === sortBy) {
        this.unitSeq = !this.unitSeq;
      }
      return this.unitSort = sortBy;
    };

    return FacMode;

  })(ZkMode);
  $scope.facPage = new FacMode;
  console.log($scope);
  return true;
});
