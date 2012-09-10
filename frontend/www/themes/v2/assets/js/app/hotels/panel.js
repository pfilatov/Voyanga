var HotelsPanel, PanelRoom;

PanelRoom = (function() {

  function PanelRoom() {
    this.adults = ko.observable(1);
    this.children = ko.observable(0);
  }

  return PanelRoom;

})();

HotelsPanel = (function() {

  function HotelsPanel() {
    this.rooms = ko.observableArray([[new PanelRoom]]);
  }

  return HotelsPanel;

})();
