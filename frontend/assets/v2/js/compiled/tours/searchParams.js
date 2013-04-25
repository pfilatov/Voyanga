// Generated by CoffeeScript 1.4.0
var ComplexSearchParams, DestinationSearchParams, RoomsSearchParams, SimpleSearchParams, TourSearchParams,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DestinationSearchParams = (function() {

  function DestinationSearchParams() {
    this.city = ko.observable('');
    this.dateFrom = ko.observable('');
    this.dateTo = ko.observable('');
  }

  return DestinationSearchParams;

})();

ComplexSearchParams = (function() {

  function ComplexSearchParams() {
    this.segments = [];
    this.hotelId = ko.observable(false);
    this.urlChanged = ko.observable(false);
    this.hotelChanged = ko.observable(false);
  }

  ComplexSearchParams.prototype.fromString = function(data) {
    var beforeUrl, hotelIdBefore, pair, segment, sp, wantedKeys, _i, _j, _len, _len1, _ref, _ref1;
    beforeUrl = this.url();
    hotelIdBefore = this.hotelId();
    data = PEGHashParser.parse(data, 'tour');
    this.segments = [];
    _ref = data.segments;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      segment = _ref[_i];
      if (segment.avia) {
        sp = new AviaSearchParams;
        sp.fromPEGObject(segment);
        this.segments.push(sp);
      }
      if (segment.hotels) {
        sp = new HotelsSearchParams;
        sp.fromPEGObject(segment);
        this.segments.push(sp);
      }
    }
    wantedKeys = {
      eventId: 1,
      orderId: 1,
      flightHash: 1
    };
    this.hotelId(false);
    _ref1 = data.extra;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      pair = _ref1[_j];
      if (wantedKeys[pair.key]) {
        this[pair.key] = pair.value;
      }
      if (pair.key === 'hotelId') {
        this.hotelId(pair.value);
      }
    }
    if (beforeUrl === this.url()) {
      this.urlChanged(false);
      if (hotelIdBefore === this.hotelId()) {
        return this.hotelChanged(false);
      } else {
        return this.hotelChanged(true);
      }
    } else {
      this.urlChanged(true);
      return this.hotelChanged(false);
    }
  };

  ComplexSearchParams.prototype.fromTourData = function(data) {
    var segment, _i, _len, _results;
    this.segments = [];
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      segment = data[_i];
      _results.push(this.segments.push(segment.panel.sp));
    }
    return _results;
  };

  ComplexSearchParams.prototype.url = function() {
    var i, param, params, result, segment, _i, _j, _len, _len1, _ref, _ref1;
    result = "tour/search/complex?";
    params = [];
    _ref = this.segments;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      segment = _ref[i];
      _ref1 = segment.getParams(true);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        param = _ref1[_j];
        params.push((("items[" + i + "][") + param.replace("[", "][").replace("=", "]=")).replace("]]", "]").replace("[]", ""));
      }
    }
    result += params.join("&");
    return result;
  };

  return ComplexSearchParams;

})();

RoomsSearchParams = (function() {

  function RoomsSearchParams() {
    this.adt = ko.observable(2);
    this.chd = ko.observable(0);
    this.chdAge = ko.observable(false);
    this.cots = ko.observable(false);
  }

  return RoomsSearchParams;

})();

SimpleSearchParams = (function(_super) {

  __extends(SimpleSearchParams, _super);

  function SimpleSearchParams() {
    this.GAData = __bind(this.GAData, this);

    this.GAKey = __bind(this.GAKey, this);

    this.fromString = __bind(this.fromString, this);

    var _this = this;
    if (window.currentCityCode) {
      this.startCity = ko.observable(window.currentCityCode);
    } else {
      this.startCity = ko.observable('LED');
    }
    this.returnBack = ko.observable(1);
    this.destinations = ko.observableArray([]);
    this.rooms = ko.observableArray([new SpRoom(this)]);
    this.rooms()[0].adults(1);
    this.hotelId = ko.observable(false);
    this.urlChanged = ko.observable(false);
    this.hotelChanged = ko.observable(false);
    this.overall = ko.computed(function() {
      var result, room, _i, _len, _ref;
      result = 0;
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        room = _ref[_i];
        result += room.adults();
        result += room.children();
      }
      return result;
    });
    this.adults = ko.computed(function() {
      var result, room, _i, _len, _ref;
      result = 0;
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        room = _ref[_i];
        result += room.adults();
      }
      return result;
    });
    this.children = ko.computed(function() {
      var result, room, _i, _len, _ref;
      result = 0;
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        room = _ref[_i];
        result += room.children();
      }
      return result;
    });
  }

  SimpleSearchParams.prototype.fromString = function(data) {
    var beforeUrl, dest, destination, hotelIdBefore, pair, r, room, wantedKeys, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    data = PEGHashParser.parse(data, 'tour');
    beforeUrl = this.url();
    hotelIdBefore = this.hotelId();
    this.startCity(data.start.from);
    this.returnBack(data.start.rt);
    this.destinations([]);
    this.rooms([]);
    _ref = data.destinations;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dest = _ref[_i];
      destination = new DestinationSearchParams();
      destination.city(dest.to);
      destination.dateFrom(dest.dateFrom);
      destination.dateTo(dest.dateTo);
      this.destinations.push(destination);
    }
    _ref1 = data.rooms;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      r = _ref1[_j];
      room = new SpRoom(this);
      room.fromPEGObject(r);
      this.rooms.push(room);
    }
    wantedKeys = {
      eventId: 1,
      orderId: 1,
      flightHash: 1
    };
    this.hotelId(false);
    _ref2 = data.extra;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      pair = _ref2[_k];
      if (wantedKeys[pair.key]) {
        this[pair.key] = pair.value;
      }
      if (pair.key === 'hotelId') {
        this.hotelId(pair.value);
      }
    }
    if (beforeUrl === this.url()) {
      this.urlChanged(false);
      if (hotelIdBefore === this.hotelId()) {
        return this.hotelChanged(false);
      } else {
        return this.hotelChanged(true);
      }
    } else {
      this.urlChanged(true);
      return this.hotelChanged(false);
    }
  };

  SimpleSearchParams.prototype.fromObject = function(data) {
    var _this = this;
    this.rooms([]);
    _.each(data.destinations, function(destination) {
      destination = new DestinationSearchParams();
      destination.city(destination.city);
      destination.dateFrom(moment(destination.dateFrom, 'D.M.YYYY').toDate());
      destination.dateTo(moment(destination.dateTo, 'D.M.YYYY').toDate());
      return this.destinations.push(destination);
    });
    _.each(data.rooms, function(r) {
      var room;
      room = new SpRoom(_this);
      room.fromObject(r);
      return _this.rooms.push(room);
    });
    if (data.eventId) {
      return this.eventId = data.eventId;
    }
  };

  SimpleSearchParams.prototype.url = function() {
    var params, result,
      _this = this;
    result = 'tour/search?';
    params = [];
    params.push('start=' + this.startCity());
    params.push('return=' + this.returnBack());
    _.each(this.destinations(), function(destination, ind) {
      var dateFrom, dateTo;
      if (moment(destination.dateFrom())) {
        dateFrom = moment(destination.dateFrom()).format('D.M.YYYY');
      } else {
        dateFrom = '1.1.1970';
      }
      if (moment(destination.dateTo())) {
        dateTo = moment(destination.dateTo()).format('D.M.YYYY');
      } else {
        dateTo = '1.1.1970';
      }
      params.push('destinations[' + ind + '][city]=' + destination.city());
      params.push('destinations[' + ind + '][dateFrom]=' + dateFrom);
      return params.push('destinations[' + ind + '][dateTo]=' + dateTo);
    });
    _.each(this.rooms(), function(room, ind) {
      return params.push.apply(params, room.getParams(ind));
    });
    if (this.eventId) {
      params.push('eventId=' + this.eventId);
    }
    if (this.orderId) {
      params.push('orderId=' + this.orderId);
    }
    result += params.join("&");
    return result;
  };

  SimpleSearchParams.prototype.hash = function() {
    var hash, parts;
    parts = [this.startCity(), this.returnBack()];
    _.each(this.destinations(), function(destination) {
      parts.push(destination.city());
      parts.push(moment(destination.dateFrom()).format('D.M.YYYY'));
      return parts.push(moment(destination.dateTo()).format('D.M.YYYY'));
    });
    parts.push('rooms');
    _.each(this.rooms(), function(room) {
      return parts.push(room.getHash());
    });
    hash = 'tours/search/' + parts.join('/') + '/';
    return hash;
  };

  SimpleSearchParams.prototype.GAKey = function() {
    var destination, result, _i, _len, _ref;
    result = [];
    _ref = this.destinations();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      destination = _ref[_i];
      result.push(destination.city());
    }
    return result.join('//');
  };

  SimpleSearchParams.prototype.GAData = function() {
    var destination, passangers, passangersData, result, room, stayData, _i, _j, _len, _len1, _ref, _ref1;
    passangersData = "1";
    passangers = [0, 0, 0];
    _ref = this.rooms();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      passangers[0] += room.adults();
      passangers[1] += room.children();
      passangers[2] += room.infants();
    }
    passangersData += ", " + passangers.join(" - ");
    result = [];
    _ref1 = this.destinations();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      destination = _ref1[_j];
      stayData = passangersData + ", " + moment(destination.dateFrom()).format('D.M.YYYY') + ' - ' + moment(destination.dateTo()).format('D.M.YYYY');
      stayData += ", " + moment(destination.dateFrom()).diff(moment(), 'days') + " - " + moment(destination.dateTo()).diff(moment(destination.dateFrom()), 'days');
      result.push(stayData);
    }
    return result.join("//");
  };

  return SimpleSearchParams;

})(RoomsContainerMixin);

implement(SimpleSearchParams, ISearchParams);

implement(SimpleSearchParams, IRoomsContainer);

TourSearchParams = (function() {

  function TourSearchParams() {
    this.hotelChanged = __bind(this.hotelChanged, this);

    this.hotelId = __bind(this.hotelId, this);

    this.urlChanged = __bind(this.urlChanged, this);

    this.getStartCity = __bind(this.getStartCity, this);

    this.getRoomsContainer = __bind(this.getRoomsContainer, this);

    this.getLastDestination = __bind(this.getLastDestination, this);

    this.removeDestination = __bind(this.removeDestination, this);

    this.addDestination = __bind(this.addDestination, this);

    this.startCity = __bind(this.startCity, this);

    this.children = __bind(this.children, this);

    this.adults = __bind(this.adults, this);

    this.overall = __bind(this.overall, this);

    this.GAData = __bind(this.GAData, this);

    this.GAKey = __bind(this.GAKey, this);
    this.simpleSP = new SimpleSearchParams();
    this.complexSP = new ComplexSearchParams();
    this.activeSP = this.simpleSP;
    this.complex = false;
    this.returnBack = this.simpleSP.returnBack;
  }

  TourSearchParams.prototype.url = function() {
    return this.activeSP.url();
  };

  TourSearchParams.prototype.hash = function() {
    return this.activeSP.hash();
  };

  TourSearchParams.prototype.fromString = function(data) {
    if (data.indexOf('a/') === 0 || data.indexOf('h/') === 0) {
      this.activeSP = this.complexSP;
      this.complex = true;
    }
    this.activeSP.fromString(data);
    this.flightHash = this.activeSP.flightHash;
    this.eventId = this.activeSP.eventId;
    return this.orderId = this.activeSP.orderId;
  };

  TourSearchParams.prototype.fromObject = function(data) {
    return this.simpleSP.fromObject(data);
  };

  TourSearchParams.prototype.fromTourData = function(data) {
    this.complex = true;
    this.activeSP = this.complexSP;
    return this.complexSP.fromTourData(data);
  };

  TourSearchParams.prototype.GAKey = function() {
    if (this.complex) {
      return;
    }
    return this.simpleSP.GAKey();
  };

  TourSearchParams.prototype.GAData = function() {
    if (this.complex) {
      return;
    }
    return this.simpleSP.GAData();
  };

  TourSearchParams.prototype.overall = function() {
    return this.simpleSP.overall();
  };

  TourSearchParams.prototype.adults = function() {
    return this.simpleSP.adults();
  };

  TourSearchParams.prototype.children = function() {
    return this.simpleSP.children();
  };

  TourSearchParams.prototype.startCity = function() {
    return this.simpleSP.startCity();
  };

  TourSearchParams.prototype.addDestination = function() {
    return this.simpleSP.destinations.push(new DestinationSearchParams());
  };

  TourSearchParams.prototype.removeDestination = function(index, len) {
    return this.simpleSP.destinations.splice(index, len);
  };

  TourSearchParams.prototype.getLastDestination = function() {
    return _.last(this.simpleSP.destinations());
  };

  TourSearchParams.prototype.getRoomsContainer = function() {
    return this.simpleSP;
  };

  TourSearchParams.prototype.getStartCity = function() {
    return this.simpleSP.startCity;
  };

  TourSearchParams.prototype.urlChanged = function() {
    return this.activeSP.urlChanged();
  };

  TourSearchParams.prototype.hotelId = function() {
    return this.activeSP.hotelId();
  };

  TourSearchParams.prototype.hotelChanged = function() {
    return this.activeSP.hotelChanged();
  };

  return TourSearchParams;

})();
