var HotelPeopleSelector, Passengers, PeopleSelector, Roomers,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PeopleSelector = (function() {

  function PeopleSelector() {
    this.afterRender = __bind(this.afterRender, this);

    this.show = __bind(this.show, this);
    this.inside = false;
    this.inside2 = false;
    this.inside3 = false;
  }

  PeopleSelector.prototype.show = function(context, event) {
    var el,
      _this = this;
    el = $(event.currentTarget);
    if (!el.hasClass('active')) {
      $(document.body).mousedown(function() {
        if (_this.inside || _this.inside2 || _this.inside3) {
          return;
        }
        return _this.close();
      });
      $('.how-many-man .btn').addClass('active');
      $('.how-many-man .content').addClass('active');
      return $('.how-many-man').find('.popup').addClass('active');
    } else {
      return this.close();
    }
  };

  PeopleSelector.prototype.afterRender = function() {
    var _this = this;
    $('.how-many-man .popup').find('input').hover(function() {
      $(this).parent().find('.plusOne').show();
      return $(this).parent().find('.minusOne').show();
    });
    $('.adults,.childs,.small-childs').hover(null, function() {
      $(this).parent().find('.plusOne').hide();
      return $(this).parent().find('.minusOne').hide();
    });
    $('.plusOne').hover(function() {
      $(this).addClass('active');
      return $('.minusOne').addClass('active');
    }, function() {
      $(this).removeClass('active');
      return $('.minusOne').removeClass('active');
    });
    $('.minusOne').hover(function() {
      $(this).addClass('active');
      return $('.plusOne').addClass('active');
    }, function() {
      $(this).removeClass('active');
      return $('.plusOne').removeClass('active');
    });
    $('.how-many-man .popup').find('input').focus(function() {
      $(this).attr('rel', $(this).val());
      return $(this).val('');
    });
    $('.how-many-man .popup').find('input').blur(function() {
      if ($(this).val() === '') {
        $(this).val($(this).attr('rel'));
      }
      return $(this).trigger('change');
    });
    $('.how-many-man').find('.popup').hover(function() {
      return _this.inside = true;
    }, function() {
      return _this.inside = false;
    });
    $('.how-many-man .content').hover(function() {
      return _this.inside2 = true;
    }, function() {
      return _this.inside2 = false;
    });
    return $('.how-many-man .btn').hover(function() {
      return _this.inside3 = true;
    }, function() {
      return _this.inside3 = false;
    });
  };

  PeopleSelector.prototype.close = function() {
    $(document.body).unbind('mousedown');
    $('.how-many-man .btn').removeClass('active');
    $('.how-many-man .content').removeClass('active');
    return $('.how-many-man').find('.popup').removeClass('active');
  };

  return PeopleSelector;

})();

Passengers = (function(_super) {

  __extends(Passengers, _super);

  function Passengers() {
    this.balanceTravelers = __bind(this.balanceTravelers, this);

    var _this = this;
    this.template = 'passengers-template';
    this.adults = ko.observable(1).extend({
      integerOnly: 'adult'
    });
    this.children = ko.observable(0).extend({
      integerOnly: true
    });
    this.infants = ko.observable(0).extend({
      integerOnly: 'infant'
    });
    this.MAX_TRAVELERS = 9;
    this.MAX_CHILDREN = 8;
    this.children.subscribe(function(newValue) {
      if (newValue > _this.MAX_TRAVELERS - 1) {
        _this.children(_this.MAX_TRAVELERS - 1);
      }
      return _this.balanceTravelers(["adults", 'infants'], _this);
    });
    this.infants.subscribe(function(newValue) {
      if (newValue > _this.adults()) {
        _this.adults(_this.infants());
      }
      return _this.balanceTravelers(["children", 'adults'], _this);
    });
    this.sum_children = ko.computed(function() {
      return _this.children() * 1 + _this.infants() * 1;
    });
    this.overall = ko.computed(function() {
      return _this.adults() * 1 + _this.children() * 1 + _this.infants() * 1;
    });
    this.adults.subscribe(function(newValue) {
      if (_this.infants() > _this.adults()) {
        _this.infants(_this.adults());
      }
      if (newValue > _this.MAX_TRAVELERS) {
        _this.adults(_this.MAX_TRAVELERS);
      }
      return _this.balanceTravelers(["children", 'infants'], _this);
    });
  }

  /*
    Balances number of travelers, using those which was not affected by most recent user change
  */


  Passengers.prototype.balanceTravelers = function(others, model) {
    var delta, prop, _i, _len, _results;
    if (this.overall() > this.MAX_TRAVELERS) {
      delta = model.overall() - this.MAX_TRAVELERS;
      _results = [];
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        prop = others[_i];
        if (model[prop]() >= delta) {
          model[prop](model[prop]() - delta);
          break;
        } else {
          delta -= model[prop]();
          _results.push(model[prop](0));
        }
      }
      return _results;
    }
  };

  Passengers.prototype.plusOne = function(model, e) {
    var prop;
    prop = $(e.target).attr("rel");
    return model[prop](model[prop]() + 1);
  };

  Passengers.prototype.minusOne = function(model, e) {
    var prop;
    prop = $(e.target).attr("rel");
    return model[prop](model[prop]() - 1);
  };

  return Passengers;

})(PeopleSelector);

Roomers = (function() {

  function Roomers(room, index, length) {
    this.room = room;
    this.index = index;
    this.length = length;
    this.last = __bind(this.last, this);

    this.minusOne = __bind(this.minusOne, this);

    this.plusOne = __bind(this.plusOne, this);

    this.adults = this.room.adults;
    this.children = this.room.children;
    this.ages = this.room.ages;
  }

  Roomers.prototype.plusOne = function(context, event) {
    var target;
    target = $(event.currentTarget).attr('rel');
    return this[target](this[target]() + 1);
  };

  Roomers.prototype.minusOne = function(context, el) {
    var target;
    target = $(event.currentTarget).attr('rel');
    if (this[target]() > 0) {
      return this[target](this[target]() - 1);
    }
  };

  Roomers.prototype.last = function() {
    return this.index + 1 === this.length;
  };

  return Roomers;

})();

HotelPeopleSelector = (function(_super) {

  __extends(HotelPeopleSelector, _super);

  function HotelPeopleSelector(sp) {
    var _this = this;
    this.sp = sp;
    this.removeRoom = __bind(this.removeRoom, this);

    this.addRoom = __bind(this.addRoom, this);

    HotelPeopleSelector.__super__.constructor.apply(this, arguments);
    this.template = 'roomers-template';
    this.rawRooms = this.sp.rooms;
    this.roomsView = ko.computed(function() {
      var current, index, item, r, result, _i, _len, _ref;
      result = [];
      current = [];
      _ref = _this.sp.rooms();
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        if (current.length === 2) {
          result.push(current);
          current = [];
        }
        r = new Roomers(item, index, _this.sp.rooms().length);
        r.addRoom = _this.addRoom;
        r.removeRoom = _this.removeRoom;
        current.push(r);
      }
      result.push(current);
      return result;
    });
  }

  HotelPeopleSelector.prototype.addRoom = function() {
    if (this.sp.rooms().length === 4) {
      return;
    }
    return this.sp.rooms.push(new SpRoom());
  };

  HotelPeopleSelector.prototype.removeRoom = function(roomer) {
    if (this.sp.rooms().length === 1) {
      return;
    }
    return this.sp.rooms.splice(this.sp.rooms.indexOf(roomer.room), 1);
  };

  return HotelPeopleSelector;

})(PeopleSelector);
