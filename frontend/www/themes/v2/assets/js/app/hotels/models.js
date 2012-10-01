var HotelFilter, HotelInfoParams, HotelNameFilter, HotelResult, HotelServicesFilter, HotelStarsFilter, HotelsResultSet, Room, RoomSet, STARS_VERBOSE,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five'];

HotelFilter = (function() {

  function HotelFilter(data) {
    this.data = data;
    this.name = 'noname';
  }

  HotelFilter.prototype.filter = function(value) {
    if (!value) {
      return console.log('filtered by ' + this.name);
    }
  };

  return HotelFilter;

})();

HotelNameFilter = (function(_super) {

  __extends(HotelNameFilter, _super);

  function HotelNameFilter(hotelNames) {
    this.name = 'NameFilter';
    this.active = ko.observable('');
  }

  HotelNameFilter.prototype.filter = function(object) {
    var expr, result;
    result = true;
    if (this.active() !== '') {
      expr = new RegExp(this.active(), 'ig');
      result = expr.test(object.hotelName);
    }
    HotelNameFilter.__super__.filter.call(this, result);
    return result;
  };

  return HotelNameFilter;

})(HotelFilter);

HotelServicesFilter = (function(_super) {

  __extends(HotelServicesFilter, _super);

  function HotelServicesFilter(servicesNames) {
    this.reset = __bind(this.reset, this);

    var foo, serviceName,
      _this = this;
    this.name = 'ServicesFilter';
    this.services = [];
    for (serviceName in servicesNames) {
      foo = servicesNames[serviceName];
      this.services.push({
        'name': serviceName,
        'active': ko.observable(0)
      });
    }
    this.active = ko.computed(function() {
      var line, result, _i, _len, _ref;
      result = [];
      _ref = _this.services;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.active()) {
          result.push(line.name);
        }
      }
      return result;
    });
  }

  HotelServicesFilter.prototype.reset = function() {
    var line, _i, _len, _ref, _results;
    _ref = this.services;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _results.push(line.active(0));
    }
    return _results;
  };

  HotelServicesFilter.prototype.filter = function(object) {
    var found, result, serviceName, _active, _i, _len, _ref;
    result = true;
    _active = this.active();
    if (_active.length > 0) {
      found = false;
      if (object.hasHotelServices) {
        _ref = object.hotelServices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          serviceName = _ref[_i];
          if (_active.indexOf(serviceName) !== -1) {
            found = true;
            break;
          }
        }
      }
      result = found;
    }
    HotelServicesFilter.__super__.filter.call(this, result);
    return result;
  };

  return HotelServicesFilter;

})(HotelFilter);

HotelStarsFilter = (function(_super) {

  __extends(HotelStarsFilter, _super);

  function HotelStarsFilter() {
    var i, _i,
      _this = this;
    this.name = 'StarsFilter';
    this.stars = [];
    for (i = _i = 1; _i <= 5; i = ++_i) {
      this.stars.push({
        'name': i,
        'active': ko.observable(0)
      });
    }
    this.active = ko.computed(function() {
      var line, result, _j, _len, _ref;
      result = [];
      _ref = _this.stars;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        line = _ref[_j];
        if (line.active()) {
          result.push(line.name);
        }
      }
      return result;
    });
  }

  HotelStarsFilter.prototype.filter = function(object) {
    var found, result, _active;
    result = true;
    _active = this.active();
    if (_active.length > 0) {
      found = false;
      if (_active.indexOf(object.stars) !== -1) {
        found = true;
      }
      result = found;
    }
    HotelStarsFilter.__super__.filter.call(this, result);
    return result;
  };

  return HotelStarsFilter;

})(HotelFilter);

Room = (function() {

  function Room(data) {
    this.name = data.showName;
    this.meal = data.mealName;
    if (typeof this.meal === "undefined" || this.meal === '') {
      this.meal = 'Не известно';
    }
    this.hasMeal = this.meal !== 'Без питания' && this.meal !== 'Не известно';
  }

  return Room;

})();

RoomSet = (function() {

  function RoomSet(data, duration) {
    var room, _i, _len, _ref;
    if (duration == null) {
      duration = 1;
    }
    this.price = Math.ceil(data.rubPrice);
    this.savings = 0;
    this.pricePerNight = Math.ceil(this.price / duration);
    this.visible = ko.observable(true);
    this.rooms = [];
    _ref = data.rooms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      this.rooms.push(new Room(room));
    }
  }

  return RoomSet;

})();

HotelResult = (function() {

  function HotelResult(data, duration) {
    if (duration == null) {
      duration = 1;
    }
    this.smallMapUrl = __bind(this.smallMapUrl, this);

    this.select = __bind(this.select, this);

    this.back = __bind(this.back, this);

    this.showMap = __bind(this.showMap, this);

    this.showMapInfo = __bind(this.showMapInfo, this);

    this.showMapDetails = __bind(this.showMapDetails, this);

    this.showDetails = __bind(this.showDetails, this);

    this.showPhoto = __bind(this.showPhoto, this);

    _.extend(this, Backbone.Events);
    this.hotelId = data.hotelId;
    this.hotelName = data.hotelName;
    this.address = data.address;
    this.description = data.description;
    this.photos = data.images;
    this.numPhotos = 0;
    this.frontPhoto = {
      smallUrl: 'http://upload.wikimedia.org/wikipedia/en/thumb/7/78/Trollface.svg/200px-Trollface.svg.png',
      largeUrl: 'http://ya.ru'
    };
    if (this.photos && this.photos.length) {
      this.frontPhoto = this.photos[0];
      this.numPhotos = this.photos.length;
    }
    this.activePhoto = this.frontPhoto['largeUrl'];
    this.stars = STARS_VERBOSE[data.categoryId - 1];
    this.rating = data.rating;
    this.lat = data.latitude / 1;
    this.lng = data.longitude / 1;
    this.distanceToCenter = Math.round(data.centerDistance / 1000);
    this.duration = duration;
    this.hasHotelServices = data.facilities ? true : false;
    this.hotelServices = data.facilities;
    this.hasRoomAmenities = data.roomAmenities ? true : false;
    this.roomAmenities = data.roomAmenities;
    this.roomSets = [];
    this.visible = ko.observable(true);
    this.push(data);
  }

  HotelResult.prototype.push = function(data) {
    var set;
    set = new RoomSet(data, this.duration);
    set.resultId = data.resultId;
    if (this.roomSets.length === 0) {
      this.cheapest = set.price;
      this.minPrice = set.pricePerNight;
      this.maxPrice = set.pricePerNight;
    } else {
      this.cheapest = set.price < this.cheapest ? set.price : this.cheapest;
      this.minPrice = set.pricePerNight < this.minPrice ? set.pricePerNight : this.minPrice;
      this.maxPrice = set.pricePerNight > this.maxPrice ? set.pricePerNight : this.maxPrice;
    }
    this.roomSets.push(set);
    return this.roomSets = _.sortBy(this.roomSets, function(entry) {
      return entry.price;
    });
  };

  HotelResult.prototype.showPhoto = function() {
    return new PhotoBox(this.photos);
  };

  HotelResult.prototype.showDetails = function() {
    this.readMoreExpanded = false;
    new GenericPopup('#hotels-body-popup', this);
    SizeBox('hotels-body-popup');
    ResizeBox('hotels-body-popup');
    sliderPhoto('.photo-slide-hotel');
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    return this.mapInitialized = false;
  };

  HotelResult.prototype.showMapDetails = function() {
    this.showDetails();
    return this.showMap();
  };

  HotelResult.prototype.showMapInfo = function(context, event) {
    var coords, el, map, mapOptions, marker;
    event.preventDefault();
    el = $('#hotel-info-tumblr-map');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('#descr').hide();
    $('#map').show();
    if (!this.mapInitialized) {
      coords = new google.maps.LatLng(this.lat, this.lng);
      mapOptions = {
        center: coords,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map($('#hotel-info-gmap')[0], mapOptions);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: this.hotelName
      });
      return this.mapInitialized = true;
    }
  };

  HotelResult.prototype.showDescriptionInfo = function(context, event) {
    var el;
    el = $('#hotel-info-tumblr-description');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('#map').hide();
    $('#descr').show();
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    return $('#boxContent').css('height', 'auto');
  };

  HotelResult.prototype.showMap = function(context, event) {
    var coords, el, map, mapOptions, marker;
    el = $('#hotels-popup-tumblr-map');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-map').show();
    $('#boxContent').css('height', $('#hotels-popup-map').height() + $('#hotels-popup-header1').height() + $('#hotels-popup-header2').height() + 'px');
    if (!this.mapInitialized) {
      coords = new google.maps.LatLng(this.lat, this.lng);
      mapOptions = {
        center: coords,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map($('#hotels-popup-gmap')[0], mapOptions);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: this.hotelName
      });
      this.mapInitialized = true;
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.showDescription = function(context, event) {
    var el;
    el = $('#hotels-popup-tumblr-description');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-description').show();
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    $('#boxContent').css('height', 'auto');
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.readMore = function(context, event) {
    var el, rel, text_el, var_heightCSS;
    el = $(event.currentTarget);
    text_el = el.parent().find('.text');
    if (!el.hasClass('active')) {
      var_heightCSS = el.parent().find('.text').css('height');
      var_heightCSS = Math.abs(parseInt(var_heightCSS.slice(0, -2)));
      text_el.attr('rel', var_heightCSS).css('height', 'auto');
      text_el.dotdotdot({
        watch: 'window'
      });
      text_el.css('overflow', 'visible');
      el.text('Свернуть');
      el.addClass('active');
    } else {
      rel = el.parent().find('.text').attr('rel');
      text_el.css('height', rel + 'px');
      el.text('Подробнее');
      el.removeClass('active');
      text_el.dotdotdot({
        watch: 'window'
      });
      text_el.css('overflow', 'hidden');
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.back = function() {
    return this.trigger('back');
  };

  HotelResult.prototype.select = function(room) {
    if (room.roomSets) {
      room = room.roomSets[0];
    }
    return this.trigger('select', {
      room: room,
      hotel: this
    });
  };

  HotelResult.prototype.smallMapUrl = function() {
    var base;
    base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=310x259&maptype=roadmap&markers=color:red%7Ccolor:red%7C";
    base += "%7C";
    base += this.lat + "," + this.lng;
    base += "&sensor=false";
    return base;
  };

  return HotelResult;

})();

HotelsResultSet = (function() {

  function HotelsResultSet(rawHotels, searchParams) {
    var checkIn, checkOut, duration, hotel, key, result, service, _i, _j, _k, _len, _len1, _len2, _ref, _ref1,
      _this = this;
    this.searchParams = searchParams;
    this._results = {};
    this.tours = false;
    this.checkIn = moment(this.searchParams.checkIn);
    this.checkOut = moment(this.checkIn).add('days', this.searchParams.duration);
    if (duration === 0) {
      for (_i = 0, _len = rawHotels.length; _i < _len; _i++) {
        hotel = rawHotels[_i];
        if (typeof hotel.duration === 'undefined') {
          checkIn = dateUtils.fromIso(hotel.checkIn);
          console.log(checkIn);
          checkOut = dateUtils.fromIso(hotel.checkOut);
          console.log(hotel.checkOut);
          console.log(checkOut);
          duration = checkOut.valueOf() - checkIn.valueOf();
          duration = Math.floor(duration / (3600 * 24 * 1000));
        } else {
          duration = hotel.duration;
        }
        break;
      }
    }
    this.minPrice = false;
    this.maxPrice = false;
    for (_j = 0, _len1 = rawHotels.length; _j < _len1; _j++) {
      hotel = rawHotels[_j];
      key = hotel.hotelId;
      if (this._results[key]) {
        this._results[key].push(hotel);
        this.minPrice = this._results[key].minPrice < this.minPrice ? this._results[key].minPrice : this.minPrice;
        this.maxPrice = this._results[key].maxPrice > this.maxPrice ? this._results[key].maxPrice : this.maxPrice;
      } else {
        result = new HotelResult(hotel, duration);
        this._results[key] = result;
        if (this.minPrice === false) {
          this.minPrice = this._results[key].minPrice;
          this.maxPrice = this._results[key].maxPrice;
        } else {
          this.minPrice = this._results[key].minPrice < this.minPrice ? this._results[key].minPrice : this.minPrice;
          this.maxPrice = this._results[key].maxPrice > this.maxPrice ? this._results[key].maxPrice : this.maxPrice;
        }
      }
    }
    this.data = [];
    this._services = {};
    this._names = [];
    this.stars = {};
    _ref = this._results;
    for (key in _ref) {
      result = _ref[key];
      this.data.push(result);
      this._names.push(result.hotelName);
      this.stars[result.stars] = 1;
      if (result.hasHotelServices) {
        _ref1 = result.hotelServices;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          service = _ref1[_k];
          this._services[service] = 1;
        }
      }
    }
    this.allFilters = {};
    this.allFilters['starsFilter'] = new HotelStarsFilter();
    this.allFilters['servicesFilter'] = new HotelServicesFilter(this._services);
    this.allFilters['nameFilter'] = new HotelNameFilter(this._names);
    this.allFiltersActive = ko.computed(function() {
      var filterName, filterObject, _ref2;
      result = {};
      _ref2 = _this.allFilters;
      for (filterName in _ref2) {
        filterObject = _ref2[filterName];
        result[filterName] = filterObject.active();
      }
      return result;
    });
    this.allFiltersActive.subscribe(function(value) {
      return console.log("REFILTER");
    });
    this.data = _.sortBy(this.data, function(entry) {
      return entry.roomSets[0].price;
    });
  }

  return HotelsResultSet;

})();

HotelInfoParams = (function() {

  function HotelInfoParams() {
    this.cacheId = '';
    this.hotelId = '';
  }

  HotelInfoParams.prototype.url = function() {
    var result;
    result = 'http://api.voyanga/v1/hotel/search/info/' + this.cacheId + '/' + this.hotelId + '/';
    return result;
  };

  HotelInfoParams.prototype.key = function() {
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

  HotelInfoParams.prototype.getHash = function() {
    var hash;
    hash = 'avia/search/' + [this.dep(), this.arr(), this.date, this.adults(), this.children(), this.infants()].join('/') + '/';
    window.voyanga_debug("Generated hash for avia search", hash);
    return hash;
  };

  HotelInfoParams.prototype.fromList = function(data) {
    this.cacheId(data[0]);
    return this.hotelId(data[1]);
  };

  return HotelInfoParams;

})();
