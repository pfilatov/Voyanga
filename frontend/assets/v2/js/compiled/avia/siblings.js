// Generated by CoffeeScript 1.4.0
var Sibling, Siblings,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Sibling = (function() {

  function Sibling(graphHeight, parent, price, date, isActive) {
    var _this = this;
    this.graphHeight = graphHeight;
    this.parent = parent;
    this.price = price;
    if (isActive == null) {
      isActive = false;
    }
    this.rawDate = date;
    this.date = date.format('D');
    this.dow = date.format('dd');
    this.month = date.format('MMM');
    this.data = [];
    this.nodata = false;
    this.isActive = ko.observable(isActive);
    this.initialActive = isActive;
    if (this.price !== false) {
      if (this.parent.price) {
        this.price = this.price * 2 - this.parent.price;
      }
    }
    this.scaledHeight = ko.computed(function() {
      var ratio, spacing;
      if (_this.price === false) {
        return 0;
      }
      spacing = 10;
      ratio = _this.height / _this.absDelta;
      ratio = ratio * 0.6;
      if (isNaN(ratio)) {
        ratio = 0;
      }
      if (ratio > 0) {
        if (ratio < 0.1) {
          true;
        }
      }
      return ratio * (_this.graphHeight() - spacing) + spacing - 5;
    });
  }

  Sibling.prototype.columnValue = function() {
    return this.price;
  };

  Sibling.prototype.background = function() {
    if (this.nodata) {
      return "center " + this.graphHeight() + "px";
    }
    return "center " + this.scaledHeight() + "px";
  };

  return Sibling;

})();

Siblings = (function() {

  function Siblings(siblings, roundTrip, todayDate, rtTodayDate) {
    this.roundTrip = roundTrip;
    this.populate = __bind(this.populate, this);

    this.search = __bind(this.search, this);

    this.handleSearch = __bind(this.handleSearch, this);

    this.priceDisplay = __bind(this.priceDisplay, this);

    this.showPrice = __bind(this.showPrice, this);

    this.showControls = __bind(this.showControls, this);

    this.select = __bind(this.select, this);

    this.data = [];
    this.graphHeight = ko.observable(50);
    this.populate(this, siblings, todayDate, rtTodayDate);
    this.active = ko.observable(this.data[3]);
    this.selection = ko.observable(false);
  }

  Siblings.prototype.select = function(sibling) {
    var entry, sib, _i, _j, _len, _len1, _ref, _ref1;
    if (sibling.data.length) {
      this.active(sibling);
      _ref = sibling.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sib = _ref[_i];
        if (sib.isActive()) {
          this.selection(sib);
          break;
        }
      }
    } else {
      this.selection(sibling);
    }
    _ref1 = sibling.parent.data;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      entry = _ref1[_j];
      entry.isActive(false);
    }
    return sibling.isActive(true);
  };

  Siblings.prototype.showControls = function() {
    if (!this.selection()) {
      return false;
    }
    if (this.active().initialActive && this.selection().initialActive) {
      return false;
    }
    if (this.active().nonsearchable || this.selection().nonsearchable) {
      return false;
    }
    return true;
  };

  Siblings.prototype.showPrice = function() {
    if (!this.selection()) {
      return false;
    }
    if (this.active().nodata || this.selection().nodata) {
      return false;
    }
    return true;
  };

  Siblings.prototype.priceDisplay = function() {
    if (!this.showPrice()) {
      return '';
    }
    if (this.roundTrip) {
      return this.active().price + this.selection().price;
    } else {
      return this.selection().price;
    }
  };

  Siblings.prototype.handleSearch = function(date, rtDate) {
    var app, panel;
    if (rtDate == null) {
      rtDate = false;
    }
    app = window.app;
    panel = app.fakoPanel();
    panel.sp.date(date.toDate());
    if (rtDate !== false) {
      panel.sp.rtDate(rtDate.toDate());
    }
    return app.navigate(panel.sp.getHash(), {
      trigger: true
    });
  };

  Siblings.prototype.search = function() {
    if (this.roundTrip) {
      this.handleSearch(this.active().rawDate, this.selection().rawDate);
      return;
    }
    return this.handleSearch(this.selection().rawDate);
  };

  Siblings.prototype.populate = function(root, siblings, todayDate, rtTodayDate, rec) {
    var absDelta, date, index, isActive, item, maxPrice, minPrice, newsib, prevMonth, showMonth, sib, siblingPrice, todayPrice, _i, _j, _len, _len1, _ref, _results;
    if (rec == null) {
      rec = false;
    }
    todayPrice = _.filter(siblings, function(item) {
      return item.price !== false;
    });
    if (todayPrice.length === 0) {
      todayPrice = 1;
    } else {
      todayPrice = todayPrice[0].price;
    }
    for (index = _i = 0, _len = siblings.length; _i < _len; index = ++_i) {
      sib = siblings[index];
      siblingPrice = sib.price;
      date = todayDate.clone().subtract('days', 3 - index);
      showMonth = false;
      if (index === 0) {
        showMonth = true;
        prevMonth = date.month();
      }
      if (prevMonth !== date.month()) {
        showMonth = true;
        prevMonth = date.month();
      }
      if (index === 3) {
        isActive = true;
      } else {
        isActive = false;
      }
      newsib = new Sibling(this.graphHeight, root, siblingPrice, date, isActive);
      if (sib.price === false) {
        newsib.nodata = true;
      }
      if (rec && (date < rtTodayDate)) {
        newsib.nonsearchable = true;
      }
      newsib.showMonth = showMonth;
      root.data.push(newsib);
      if (sib.siblings.length) {
        this.populate(newsib, sib.siblings, rtTodayDate, date, true);
      }
    }
    minPrice = _.min(root.data, function(item) {
      if (item.price === false) {
        return todayPrice;
      } else {
        return item.price;
      }
    });
    maxPrice = _.max(root.data, function(item) {
      if (item.price === false) {
        return todayPrice;
      } else {
        return item.price;
      }
    });
    if (maxPrice.price === false) {
      maxPrice = {
        price: todayPrice
      };
    }
    if (minPrice.price === false) {
      minPrice = {
        price: todayPrice
      };
    }
    absDelta = maxPrice.price - minPrice.price;
    _ref = root.data;
    _results = [];
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      item = _ref[_j];
      if (item.price === false) {
        item.height = 0;
      } else {
        item.height = maxPrice.price - item.price;
      }
      _results.push(item.absDelta = absDelta);
    }
    return _results;
  };

  return Siblings;

})();
