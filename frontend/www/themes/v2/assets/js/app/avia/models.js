var AviaResult, AviaResultSet, FlightPart, SearchParams, Voyage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

FlightPart = (function() {

  function FlightPart(part) {
    this.departureDate = new Date(part.datetimeBegin);
    this.arrivalDate = new Date(part.datetimeEnd);
    this.departureCity = part.departureCity;
    this.departureAirport = part.departureAirport;
    this.arrivalCity = part.arrivalCity;
    this.arrivalCityPre = part.arrivalCityPre;
    this.arrivalAirport = part.arrivalAirport;
    this._duration = part.duration;
    this.transportAirline = part.transportAirline;
    this.transportAirlineName = part.transportAirlineName;
    this.flightCode = part.transportAirline + ' ' + part.flightCode;
  }

  FlightPart.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  FlightPart.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  FlightPart.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  return FlightPart;

})();

Voyage = (function() {

  function Voyage(flight) {
    var part, _i, _len, _ref;
    this.parts = [];
    _ref = flight.flightParts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      this.parts.push(new FlightPart(part));
    }
    this.direct = this.parts.length === 1;
    this.serviceClass = 'E';
    this.departureDate = new Date(flight.departureDate);
    this.arrivalDate = new Date(this.parts[this.parts.length - 1].arrivalDate);
    this._duration = flight.fullDuration;
    this.departureAirport = this.parts[0].departureAirport;
    this.arrivalAirport = this.parts[this.parts.length - 1].arrivalAirport;
    this.departureCity = flight.departureCity;
    this.arrivalCity = flight.arrivalCity;
    this.departureCityPre = flight.departureCityPre;
    this.arrivalCityPre = flight.arrivalCityPre;
    this._backVoyages = [];
    this.activeBackVoyage = ko.observable();
    this.visible = ko.observable(true);
  }

  Voyage.prototype.departureInt = function() {
    return this.departureDate.getTime();
  };

  Voyage.prototype.hash = function() {
    return this.departureTime() + this.arrivalTime();
  };

  Voyage.prototype.push = function(voyage) {
    return this._backVoyages.push(voyage);
  };

  Voyage.prototype.stacked = function() {
    return this._backVoyages.length > 1;
  };

  Voyage.prototype.departureDayMo = function() {
    return dateUtils.formatDayMonth(this.departureDate);
  };

  Voyage.prototype.departurePopup = function() {
    return dateUtils.formatDayMonthWeekday(this.departureDate);
  };

  Voyage.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  Voyage.prototype.departureTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.departureDate);
  };

  Voyage.prototype.arrivalDayMo = function() {
    return dateUtils.formatDayMonth(this.arrivalDate);
  };

  Voyage.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  Voyage.prototype.arrivalTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.arrivalDate);
  };

  Voyage.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  Voyage.prototype.stopoverText = function() {
    var part, result, _i, _len, _ref;
    result = [];
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push(part.arrivalCityPre);
    }
    return result.join(', ');
  };

  Voyage.prototype.stopsRatio = function() {
    var data, index, part, result, _i, _j, _len, _len1, _ref;
    result = [];
    if (this.direct) {
      return result;
    }
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push(Math.ceil(part.duration / this._duration * 80));
    }
    for (index = _j = 0, _len1 = result.length; _j < _len1; index = ++_j) {
      data = result[index];
      if (index > 1) {
        result[index] = result[index - 1] + data;
      } else {
        result[index] = data + 10;
      }
    }
    return result;
  };

  Voyage.prototype.sort = function() {
    this._backVoyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    return this.activeBackVoyage(this._backVoyages[0]);
  };

  Voyage.prototype.filter = function(filters) {
    var match_arrival_time, match_departure_time, result, rtVoyage, _i, _len, _ref;
    result = true;
    match_departure_time = false;
    if (filters.departureTime.timeFrom <= this.departureTimeNumeric() && filters.departureTime.timeTo >= this.departureTimeNumeric()) {
      match_departure_time = true;
    }
    result = result && match_departure_time;
    match_arrival_time = false;
    if (filters.arrivalTime.timeFrom <= this.arrivalTimeNumeric() && filters.arrivalTime.timeTo >= this.arrivalTimeNumeric()) {
      match_arrival_time = true;
    }
    result = result && match_arrival_time;
    if (filters.onlyDirect) {
      result = result && this.direct;
    }
    if (filters.serviceClass !== 'A') {
      result = result && this.serviceClass === filters.serviceClass;
    }
    _ref = this._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rtVoyage = _ref[_i];
      match_departure_time = false;
      if (filters.departureTimeReturn.timeFrom <= rtVoyage.departureTimeNumeric() && filters.departureTimeReturn.timeTo >= rtVoyage.departureTimeNumeric()) {
        match_departure_time = true;
      }
      result = result && match_departure_time;
      if (filters.onlyDirect) {
        result = result && rtVoyage.direct;
      }
      match_arrival_time = false;
      if (filters.arrivalTimeReturn.timeFrom <= rtVoyage.arrivalTimeNumeric() && filters.arrivalTimeReturn.timeTo >= rtVoyage.arrivalTimeNumeric()) {
        match_arrival_time = true;
      }
      result = result && match_arrival_time;
    }
    return this.visible(result);
  };

  return Voyage;

})();

AviaResult = (function() {

  function AviaResult(data) {
    this.closeDetails = __bind(this.closeDetails, this);

    this.showDetails = __bind(this.showDetails, this);

    this.chooseRtStacked = __bind(this.chooseRtStacked, this);

    this.chooseStacked = __bind(this.chooseStacked, this);

    var fields, flights, name, rtName, _i, _len,
      _this = this;
    _.extend(this, Backbone.Events);
    flights = data.flights;
    this.price = Math.ceil(data.price);
    this._stacked = false;
    this.roundTrip = flights.length === 2;
    this.visible = ko.observable(true);
    this.airline = data.valCompany;
    this.airlineName = data.valCompanyName;
    this.activeVoyage = new Voyage(flights[0]);
    if (this.roundTrip) {
      this.activeVoyage.push(new Voyage(flights[1]));
    }
    this.voyages = [];
    this.voyages.push(this.activeVoyage);
    this.activeVoyage = ko.observable(this.activeVoyage);
    fields = ['departureCity', 'departureAirport', 'departureDayMo', 'departurePopup', 'departureTime', 'arrivalCity', 'arrivalAirport', 'arrivalDayMo', 'arrivalTime', 'duration', 'direct', 'stopoverText', 'departureTimeNumeric', 'arrivalTimeNumeric', 'hash', 'stopsRatio'];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      name = fields[_i];
      this[name] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage());
          }
          return field;
        };
      })(name);
      rtName = 'rt' + name.charAt(0).toUpperCase() + name.slice(1);
      this[rtName] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage().activeBackVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage().activeBackVoyage());
          }
          return field;
        };
      })(name);
    }
  }

  AviaResult.prototype.filter = function(filters) {
    var field, fields, found, match_lines, match_ports, _i, _len;
    match_ports = true;
    found = false;
    fields = ['departureAirport', 'arrivalAirport'];
    if (this.roundTrip) {
      fields.push('rtDepartureAirport');
      fields.push('rtArrivalAirport');
    }
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      if (filters.airports.indexOf(this[field]()) >= 0) {
        found = true;
      }
    }
    match_ports = found;
    if (filters.airports.length === 0) {
      match_ports = true;
    }
    some_visible = false;
    _ref = this.voyages;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      voyage = _ref[_j];
      voyage.filter(filters);
      if (!some_visible && voyage.visible()) {
        some_visible = true;
        this.activeVoyage(voyage);
      }
    }
    found = false;
    if (filters.airlines.indexOf(this.airline) >= 0) {
      found = true;
    }
    match_lines = found;
    if (filters.airlines.length === 0) {
      match_lines = true;
    }
    return this.visible(match_ports && match_lines && some_visible);
  };

  AviaResult.prototype.stacked = function() {
    return this._stacked;
  };

  AviaResult.prototype.rtStacked = function() {
    return this.activeVoyage().stacked();
  };

  AviaResult.prototype.push = function(data) {
    var backVoyage, newVoyage, result;
    this._stacked = true;
    newVoyage = new Voyage(data.flights[0]);
    if (this.roundTrip) {
      backVoyage = new Voyage(data.flights[1]);
      newVoyage.push(backVoyage);
      result = _.find(this.voyages, function(voyage) {
        return voyage.hash() === newVoyage.hash();
      });
      if (result) {
        result.push(backVoyage);
        return;
      }
    }
    return this.voyages.push(newVoyage);
  };

  AviaResult.prototype.chooseStacked = function(voyage) {
    window.voyanga_debug("Choosing stacked voyage", voyage);
    return this.activeVoyage(voyage);
  };

  AviaResult.prototype.chooseRtStacked = function(voyage) {
    window.voyanga_debug("Choosing RT stacked voyage", voyage);
    return this.activeVoyage().activeBackVoyage(voyage);
  };

  AviaResult.prototype.rtVoyages = function() {
    return this.activeVoyage()._backVoyages;
  };

  AviaResult.prototype.sort = function() {
    this.voyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    if (this.roundTrip) {
      _.each(this.voyages, function(x) {
        return x.sort();
      });
    }
    return this.activeVoyage(this.voyages[0]);
  };

  AviaResult.prototype.showDetails = function() {
    var _this = this;
    window.voyanga_debug("Setting popup result", this);
    this.trigger("popup", this);
    $('body').prepend('<div id="popupOverlay"></div>');
    $('#body-popup').show();
    SizeBox();
    ResizeBox();
    return $('#popupOverlay').click(function() {
      return _this.closeDetails();
    });
  };

  AviaResult.prototype.closeDetails = function() {
    window.voyanga_debug("Hiding popup");
    $('#body-popup').hide();
    return $('#popupOverlay').remove();
  };

  return AviaResult;

})();

AviaResultSet = (function() {

  function AviaResultSet(rawVoyages) {
    var flightVoyage, foo, key, result, _airlines, _airports, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    this._results = {};
    for (_i = 0, _len = rawVoyages.length; _i < _len; _i++) {
      flightVoyage = rawVoyages[_i];
      key = flightVoyage.price + "_" + flightVoyage.valCompany;
      if (this._results[key]) {
        this._results[key].push(flightVoyage);
      } else {
        result = new AviaResult(flightVoyage);
        this._results[key] = result;
        result.on("popup", function(data) {
          return _this.popup(data);
        });
      }
    }
    this.cheapest = ko.observable();
    this.data = [];
    this.airports = [];
    this.airlines = [];
    this.timeLimits = {
      'departureFromTime': 1440,
      'departureToTime': 0,
      'departureFromToTimeActive': ko.observable('0;1440'),
      'arrivalFromTime': 1440,
      'arrivalToTime': 0,
      'arrivalFromToTimeActive': ko.observable('0;1440'),
      'departureFromTimeReturn': 1440,
      'departureToTimeReturn': 0,
      'departureFromToTimeReturnActive': ko.observable('0;1440'),
      'arrivalFromTimeReturn': 1440,
      'arrivalToTimeReturn': 0,
      'arrivalFromToTimeReturnActive': ko.observable('0;1440')
    };
    _airports = {};
    _airlines = {};
    _ref = this._results;
    for (key in _ref) {
      result = _ref[key];
      result.sort();
      this.data.push(result);
      _airlines[result.airline] = 1;
      _airports[result.departureAirport()] = 1;
      _airports[result.arrivalAirport()] = 1;
      if (result.roundTrip) {
        _airports[result.rtDepartureAirport()] = 1;
        _airports[result.rtArrivalAirport()] = 1;
      }
      _ref1 = result.voyages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        voyage = _ref1[_j];
        if (voyage.departureTimeNumeric() < this.timeLimits.departureFromTime) {
          this.timeLimits.departureFromTime = voyage.departureTimeNumeric();
        }
        if (voyage.departureTimeNumeric() > this.timeLimits.departureToTime) {
          this.timeLimits.departureToTime = voyage.departureTimeNumeric();
        }
        if (voyage.arrivalTimeNumeric() < this.timeLimits.arrivalFromTime) {
          this.timeLimits.arrivalFromTime = voyage.arrivalTimeNumeric();
        }
        if (voyage.arrivalTimeNumeric() > this.timeLimits.arrivalToTime) {
          this.timeLimits.arrivalToTime = voyage.arrivalTimeNumeric();
        }
        if (result.roundTrip) {
          _ref2 = voyage._backVoyages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            rtVoyage = _ref2[_k];
            if (rtVoyage.departureTimeNumeric() < this.timeLimits.departureFromTimeReturn) {
              this.timeLimits.departureFromTimeReturn = rtVoyage.departureTimeNumeric();
            }
            if (rtVoyage.departureTimeNumeric() > this.timeLimits.departureToTimeReturn) {
              this.timeLimits.departureToTimeReturn = rtVoyage.departureTimeNumeric();
            }
            if (rtVoyage.arrivalTimeNumeric() < this.timeLimits.arrivalFromTimeReturn) {
              this.timeLimits.arrivalFromTimeReturn = rtVoyage.arrivalTimeNumeric();
            }
            if (rtVoyage.arrivalTimeNumeric() > this.timeLimits.arrivalToTimeReturn) {
              this.timeLimits.arrivalToTimeReturn = rtVoyage.arrivalTimeNumeric();
            }
          }
        }
      }
    }
    for (key in _airports) {
      foo = _airports[key];
      this.airports.push({
        'name': key,
        'active': ko.observable(0)
      });
    }
    for (key in _airlines) {
      foo = _airlines[key];
      this.airlines.push({
        'name': key,
        'active': ko.observable(0)
      });
    }
    this._airportsFilters = ko.computed(function() {
      var port, _l, _len3, _ref3;
      result = [];
      _ref3 = _this.airports;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        port = _ref3[_l];
        if (port.active()) {
          result.push(port.name);
        }
      }
      return result;
    });
    this._airlinesFilters = ko.computed(function() {
      var line, _l, _len3, _ref3;
      result = [];
      _ref3 = _this.airlines;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        line = _ref3[_l];
        if (line.active()) {
          result.push(line.name);
        }
      }
      return result;
    });
    this._departureTimeFilter = ko.computed(function() {
      var from_to;
      from_to = _this.timeLimits.departureFromToTimeActive();
      from_to = from_to.split(';');
      result = {
        'timeFrom': from_to[0],
        'timeTo': from_to[1]
      };
      return result;
    });
    this._arrivalTimeFilter = ko.computed(function() {
      var from_to;
      from_to = _this.timeLimits.arrivalFromToTimeActive();
      from_to = from_to.split(';');
      result = {
        'timeFrom': from_to[0],
        'timeTo': from_to[1]
      };
      return result;
    });
    this._departureTimeReturnFilter = ko.computed(function() {
      var from_to;
      from_to = _this.timeLimits.departureFromToTimeReturnActive();
      from_to = from_to.split(';');
      result = {
        'timeFrom': from_to[0],
        'timeTo': from_to[1]
      };
      return result;
    });
    this._arrivalTimeReturnFilter = ko.computed(function() {
      var from_to;
      from_to = _this.timeLimits.arrivalFromToTimeReturnActive();
      from_to = from_to.split(';');
      result = {
        'timeFrom': from_to[0],
        'timeTo': from_to[1]
      };
      return result;
    });
    this.onlyDirectFilter = ko.observable(0);
    this.onlyShortFilter = ko.observable(0);
    this.serviceClassFilter = ko.observable('A');
    this._allFilters = ko.computed(function() {
      return {
        'airlines': _this._airlinesFilters(),
        'airports': _this._airportsFilters(),
        'departureTime': _this._departureTimeFilter(),
        'departureTimeReturn': _this._departureTimeReturnFilter(),
        'arrivalTime': _this._arrivalTimeFilter(),
        'arrivalTimeReturn': _this._arrivalTimeReturnFilter(),
        'onlyDirect': _this.onlyDirectFilter(),
        'onlyShort': _this.onlyShortFilter(),
        'serviceClass': _this.serviceClassFilter()
      };
    });
    this._allFilters.subscribe(function(value) {
      _.each(_this.data, function(x) {
        return x.filter(value);
      });
      return _this.update_cheapest();
    });
    _ref3 = this.data;
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      result = _ref3[_l];
      result.sort();
    }
    this.update_cheapest();
    this.popup = ko.observable(this.cheapest());
  }

  AviaResultSet.prototype.update_cheapest = function() {
    var cheapest_reseted, key, result, _ref, _results;
    cheapest_reseted = false;
    _ref = this._results;
    _results = [];
    for (key in _ref) {
      result = _ref[key];
      if (result.visible()) {
        if (!cheapest_reseted) {
          this.cheapest(result);
          cheapest_reseted = true;
          continue;
        }
        if (result.price < this.cheapest().price) {
          _results.push(this.cheapest(result));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return AviaResultSet;

})();

SearchParams = (function() {

  function SearchParams() {
    this.dep = ko.observable('MOW');
    this.arr = ko.observable('PAR');
    this.date = '02.10.2012';
    this.adults = ko.observable(5).extend({
      integerOnly: 'adult'
    });
    this.children = ko.observable(2).extend({
      integerOnly: true
    });
    this.infants = ko.observable(2).extend({
      integerOnly: 'infant'
    });
    this.rt = ko.observable(false);
    this.rt_date = '12.10.2012';
  }

  SearchParams.prototype.url = function() {
    var params, result;
    result = 'http://api.voyanga/v1/flight/search/withParams?';
    params = [];
    params.push('destinations[0][departure]=' + this.dep());
    params.push('destinations[0][arrival]=' + this.arr());
    params.push('destinations[0][date]=' + this.date);
    if (this.rt()) {
      params.push('destinations[1][departure]=' + this.arr());
      params.push('destinations[1][arrival]=' + this.dep());
      params.push('destinations[1][date]=' + this.rt_date);
    }
    params.push('adt=' + this.adults());
    params.push('chd=' + this.children());
    params.push('inf=' + this.infants());
    result += params.join("&");
    window.voyanga_debug("Generated search url", result);
    return result;
  };

  SearchParams.prototype.key = function() {
    var key;
    key = this.dep() + this.arr() + this.date;
    if (this.rt) {
      key += this.rt_date;
    }
    key += this.adults();
    key += this.children();
    key += this.infants();
    return key;
  };

  SearchParams.prototype.getHash = function() {
    var hash;
    hash = 'avia/search/' + [this.dep(), this.arr(), this.date, this.adults(), this.children(), this.infants()].join('/') + '/';
    window.voyanga_debug("Generated hash for avia search", hash);
    return hash;
  };

  SearchParams.prototype.fromList = function(data) {
    this.dep(data[0]);
    this.arr(data[1]);
    this.date = data[2];
    this.adults(data[3]);
    this.children(data[4]);
    return this.infants(data[5]);
  };

  return SearchParams;

})();
