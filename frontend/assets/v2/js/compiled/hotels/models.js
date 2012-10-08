// Generated by CoffeeScript 1.3.3
var HotelResult, HotelsResultSet, HotelsSearchParams, Room, RoomSet, STARS_VERBOSE,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five'];

Room = (function() {

  function Room(data) {
    this.name = data.showName;
    this.nameNemo = data.roomNemoName;
    if (!this.nameNemo || data.roomName) {
      this.nameNemo = data.roomName;
    }
    if (this.nameNemo !== '' && typeof this.nameNemo !== 'undefined') {
      this.haveNemoName = true;
    } else {
      this.haveNemoName = false;
      this.nameNemo = '';
    }
    this.meal = data.meal;
    if (data.mealName) {
      this.meal = data.mealName;
    }
    if (typeof this.meal === "undefined" || this.meal === '') {
      this.meal = 'Не известно';
    }
    this.hasMeal = this.meal !== 'Без питания' && this.meal !== 'Не известно';
  }

  return Room;

})();

RoomSet = (function() {

  function RoomSet(data, parent, duration) {
    var room, _i, _len, _ref,
      _this = this;
    this.parent = parent;
    if (duration == null) {
      duration = 1;
    }
    this.minusCount = __bind(this.minusCount, this);

    this.plusCount = __bind(this.plusCount, this);

    this.checkCount = __bind(this.checkCount, this);

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
    this.selectedCount = ko.observable(0);
    this.selectedCount.subscribe(function(newValue) {
      return _this.checkCount(newValue);
    });
    this.selectText = ko.computed(function() {
      if (!_this.parent.tours) {
        return "Забронировать";
      }
      if (_this.parent.activeResultId()) {
        return 'Выбран';
      } else {
        return 'Выбрать';
      }
    });
  }

  RoomSet.prototype.checkCount = function(newValue) {
    var count;
    count = parseInt(newValue);
    if (count < 0 || isNaN(count)) {
      return this.selectedCount(0);
    } else {
      return this.selectedCount(count);
    }
  };

  RoomSet.prototype.plusCount = function() {
    return this.selectedCount(this.selectedCount() + 1);
  };

  RoomSet.prototype.minusCount = function() {
    if (this.selectedCount() > 0) {
      return this.selectedCount(this.selectedCount() - 1);
    }
  };

  return RoomSet;

})();

HotelResult = (function() {

  function HotelResult(data, parent, duration) {
    var elements, groupName, _ref,
      _this = this;
    if (duration == null) {
      duration = 1;
    }
    this.smallMapUrl = __bind(this.smallMapUrl, this);

    this.select = __bind(this.select, this);

    this.back = __bind(this.back, this);

    this.combinationClick = __bind(this.combinationClick, this);

    this.getFullInfo = __bind(this.getFullInfo, this);

    this.initFullInfo = __bind(this.initFullInfo, this);

    this.showMap = __bind(this.showMap, this);

    this.showMapInfo = __bind(this.showMapInfo, this);

    this.showMapDetails = __bind(this.showMapDetails, this);

    this.showDetails = __bind(this.showDetails, this);

    this.showPhoto = __bind(this.showPhoto, this);

    _.extend(this, Backbone.Events);
    this.tours = parent.tours;
    this.hotelId = data.hotelId;
    this.activeResultId = ko.observable(0);
    this.hotelName = data.hotelName;
    this.address = data.address;
    this.description = data.description;
    this.photos = data.images;
    this.numPhotos = 0;
    this.parent = parent;
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
    if (this.rating === '-') {
      this.rating = 0;
    }
    this.lat = data.latitude / 1;
    this.lng = data.longitude / 1;
    this.distanceToCenter = Math.ceil(data.centerDistance / 1000);
    if (this.distanceToCenter > 30) {
      this.distanceToCenter = 30;
    }
    this.duration = duration;
    console.log('duration:' + duration);
    this.haveFullInfo = ko.observable(false);
    this.selectText = ko.computed(function() {
      if (!_this.tours) {
        return "Забронировать";
      }
      if (_this.activeResultId()) {
        return 'Выбран';
      } else {
        return 'Выбрать';
      }
    });
    this.hasHotelServices = data.hotelServices ? true : false;
    this.hotelServices = data.hotelServices;
    this.hasHotelGroupServices = data.hotelGroupServices ? true : false;
    this.hotelGroupServices = [];
    if (data.hotelGroupServices) {
      _ref = data.hotelGroupServices;
      for (groupName in _ref) {
        elements = _ref[groupName];
        this.hotelGroupServices.push({
          groupName: groupName,
          elements: elements
        });
      }
    }
    this.hasRoomAmenities = data.roomAmenities ? true : false;
    this.roomAmenities = data.roomAmenities;
    this.roomSets = [];
    this.visible = ko.observable(true);
    this.push(data);
  }

  HotelResult.prototype.push = function(data) {
    var set;
    set = new RoomSet(data, this, this.duration);
    set.resultId = data.resultId;
    if (this.roomSets.length === 0) {
      this.cheapest = set.price;
      this.cheapestSet = set;
      this.minPrice = set.pricePerNight;
      this.maxPrice = set.pricePerNight;
    } else {
      this.cheapest = set.price < this.cheapest ? set.price : this.cheapest;
      this.cheapestSet = set.price < this.cheapest ? set : this.cheapestSet;
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

  HotelResult.prototype.showDetails = function(data, event) {
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

  HotelResult.prototype.showMapDetails = function(data, event) {
    this.showDetails(data, event);
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

  HotelResult.prototype.initFullInfo = function() {
    var _this = this;
    this.roomCombinations = ko.observableArray([]);
    this.combinedPrice = ko.computed(function() {
      var res, roomSet, _i, _len, _ref;
      res = 0;
      _ref = _this.roomCombinations();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        roomSet = _ref[_i];
        if (roomSet.selectedCount()) {
          res += roomSet.selectedCount() * roomSet.price;
        }
      }
      return res;
    });
    return this.combinedButtonLabel = ko.computed(function() {
      if (_this.combinedPrice() > 0) {
        return _this.selectText();
      } else {
        return 'Не выбраны номера';
      }
    });
  };

  HotelResult.prototype.getFullInfo = function() {
    var api, url,
      _this = this;
    if (!this.haveFullInfo()) {
      api = new HotelsAPI;
      url = 'hotel/search/info/?hotelId=' + this.hotelId;
      url += '&cacheId=' + this.parent.cacheId;
      console.log(this.parent.cacheId);
      return api.search(url, function(data) {
        var ind, roomSet, set, _ref;
        window.voyanga_debug('searchInfo', data);
        _this.initFullInfo();
        _ref = data.hotel.details;
        for (ind in _ref) {
          roomSet = _ref[ind];
          set = new RoomSet(roomSet, _this, _this.duration);
          set.resultId = roomSet.resultId;
          _this.roomCombinations.push(set);
        }
        _this.haveFullInfo(true);
        return console.log(_this.roomCombinations());
      });
    }
  };

  HotelResult.prototype.combinationClick = function() {
    return console.log('combination click');
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
    if (this.tours) {
      this.activeResultId(room.resultId);
    }
    return this.trigger('select', {
      roomSet: room,
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
    var checkIn, checkOut, duration, hotel, key, result, _i, _j, _len, _len1, _ref,
      _this = this;
    this.searchParams = searchParams;
    this.postFilters = __bind(this.postFilters, this);

    this.postInit = __bind(this.postInit, this);

    this.selectHotel = __bind(this.selectHotel, this);

    this.sortByRating = __bind(this.sortByRating, this);

    this.sortByPrice = __bind(this.sortByPrice, this);

    this.getDateInterval = __bind(this.getDateInterval, this);

    this.select = __bind(this.select, this);

    this._results = {};
    this.tours = false;
    this.checkIn = moment(this.searchParams.checkIn);
    this.checkOut = moment(this.checkIn).add('days', this.searchParams.duration);
    window.voyanga_debug('checkOut', this.checkOut);
    this.city = 0;
    if (this.searchParams.duration) {
      duration = this.searchParams.duration;
    }
    if (duration === 0 || typeof duration === 'undefined') {
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
          console.log('yes set');
        }
        break;
      }
    }
    console.log('MainDuration:' + duration);
    this.minPrice = false;
    this.maxPrice = false;
    for (_j = 0, _len1 = rawHotels.length; _j < _len1; _j++) {
      hotel = rawHotels[_j];
      key = hotel.hotelId;
      if (!this.city) {
        this.city = hotel.city;
      }
      if (this._results[key]) {
        this._results[key].push(hotel);
        this.minPrice = this._results[key].minPrice < this.minPrice ? this._results[key].minPrice : this.minPrice;
        this.maxPrice = this._results[key].maxPrice > this.maxPrice ? this._results[key].maxPrice : this.maxPrice;
      } else {
        result = new HotelResult(hotel, this, duration);
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
    this.data = ko.observableArray();
    this.numResults = ko.observable(0);
    _ref = this._results;
    for (key in _ref) {
      result = _ref[key];
      this.data.push(result);
    }
    this.sortBy = ko.observable('minPrice');
    this.sortByPriceClass = ko.computed(function() {
      var ret;
      ret = 'hotel-sort-by-item';
      if (_this.sortBy() === 'minPrice') {
        ret += ' active';
      }
      return ret;
    });
    this.sortByRatingClass = ko.computed(function() {
      var ret;
      ret = 'hotel-sort-by-item';
      if (_this.sortBy() === 'rating') {
        ret += ' active';
      }
      return ret;
    });
    this.data.sort(function(left, right) {
      if (left.minPrice < right.minPrice) {
        return -1;
      }
      if (left.minPrice > right.minPrice) {
        return 1;
      }
      return 0;
    });
  }

  HotelsResultSet.prototype.select = function(hotel, event) {
    var _this = this;
    window.voyanga_debug(' i wonna get hotel for you', hotel);
    hotel.off('back');
    hotel.on('back', function() {
      return window.app.render({
        results: ko.observable(_this)
      }, 'results');
    });
    hotel.getFullInfo();
    return window.app.render(hotel, 'info-template');
  };

  HotelsResultSet.prototype.getDateInterval = function() {
    return dateUtils.formatDayMonthInterval(this.checkIn._d, this.checkOut._d);
  };

  HotelsResultSet.prototype.sortByPrice = function() {
    if (this.sortBy() !== 'minPrice') {
      this.sortBy('minPrice');
      return this.data.sort(function(left, right) {
        if (left.minPrice < right.minPrice) {
          return -1;
        }
        if (left.minPrice > right.minPrice) {
          return 1;
        }
        return 0;
      });
    }
  };

  HotelsResultSet.prototype.sortByRating = function() {
    if (this.sortBy() !== 'rating') {
      this.sortBy('rating');
      return this.data.sort(function(left, right) {
        if (left.rating > right.rating) {
          return -1;
        }
        if (left.rating < right.rating) {
          return 1;
        }
        return 0;
      });
    }
  };

  HotelsResultSet.prototype.selectHotel = function(hotel, event) {
    return this.select(hotel, event);
  };

  HotelsResultSet.prototype.postInit = function() {
    return this.filters = new HotelFiltersT(this);
  };

  HotelsResultSet.prototype.postFilters = function() {
    var data;
    console.log('post filters');
    data = _.filter(this.data(), function(el) {
      return el.visible();
    });
    this.numResults(data.length);
    console.log(this.data);
    return ko.processAllDeferredBindingUpdates();
  };

  return HotelsResultSet;

})();
