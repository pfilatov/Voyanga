// Generated by CoffeeScript 1.3.3
/*
SEARCH controller, should be splitted once we will get more actions here
*/

var AviaController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

AviaController = (function() {

  function AviaController(searchParams) {
    this.searchParams = searchParams;
    this.indexAction = __bind(this.indexAction, this);

    this.handleResults = __bind(this.handleResults, this);

    this.search = __bind(this.search, this);

    this.searchAction = __bind(this.searchAction, this);

    this.api = new AviaAPI;
    this.routes = {
      '/search/:from/:to/:when/:adults/:children/:infants/:rtwhen/': this.searchAction,
      '/search/:from/:to/:when/:adults/:children/:infants/': this.searchAction,
      '': this.indexAction
    };
    _.extend(this, Backbone.Events);
  }

  AviaController.prototype.searchAction = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    window.voyanga_debug("AVIA: Invoking searchAction", args);
    this.searchParams.fromList(args);
    return this.search();
  };

  AviaController.prototype.search = function() {
    return this.api.search(this.searchParams.url(), this.handleResults);
  };

  AviaController.prototype.handleResults = function(data) {
    var stacked;
    window.voyanga_debug("searchAction: handling results", data);
    try {
      stacked = new AviaResultSet(data.flights.flightVoyages, data.siblings);
      stacked.injectSearchParams(data.searchParams);
      stacked.postInit();
    } catch (err) {
      if (err === '404') {
        new ErrorPopup('e404');
        return;
      }
      new ErrorPopup('e500');
      return;
    }
    this.render('results', {
      results: ko.observable(stacked)
    });
    return ko.processAllDeferredBindingUpdates();
  };

  AviaController.prototype.indexAction = function() {
    window.voyanga_debug("AVIA: invoking indexAction");
    return this.render("index", {});
  };

  AviaController.prototype.render = function(view, data) {
    return this.trigger("viewChanged", view, data);
  };

  return AviaController;

})();
