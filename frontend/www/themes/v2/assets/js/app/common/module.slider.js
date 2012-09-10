var Slider,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Slider = (function() {

  function Slider() {
    this.handler = __bind(this.handler, this);

    this.click = __bind(this.click, this);

    this.init = __bind(this.init, this);
    this.speed = 400;
    this.plannerWidth = [143, 0];
    this.aviaticketsWidth = [135, 155];
    this.hotelWidth = [95, 295];
    this.finishStagesWidth = [148, 403];
  }

  Slider.prototype.init = function() {
    var activeLI, activeLIindex;
    activeLI = $('.slide-turn-mode ul').find('.active');
    activeLIindex = activeLI.index();
    if (activeLIindex === -1) {
      activeLIindex = 1;
    }
    this.switchSlide = $('.slide-turn-mode').find('.switch');
    this.valueWidth = [this.plannerWidth, this.aviaticketsWidth, this.hotelWidth, this.finishStagesWidth];
    this.switchSlide.css('width', this.valueWidth[activeLIindex][0] + 'px').css('left', this.valueWidth[activeLIindex][1] + 'px');
    return this.switchSlide.find('.c').css('width', (this.valueWidth[activeLIindex][0] - 27) + 'px');
  };

  Slider.prototype.click = function(scope, event) {
    event.preventDefault();
    return window.app.navigate($(event.currentTarget).find('a').attr('href'), {
      'trigger': true
    });
  };

  Slider.prototype.handler = function(newValue) {
    var activeLI, activeLIindex;
    activeLI = $('#h-' + newValue + '-slider');
    activeLIindex = activeLI.index();
    $('.btn').removeClass('active');
    this.switchSlide.animate({
      width: this.valueWidth[activeLIindex][0] + 'px',
      left: this.valueWidth[activeLIindex][1] + 'px'
    }, this.speed, function() {
      return activeLI.addClass('active');
    });
    return this.switchSlide.find('.c').animate({
      width: (this.valueWidth[activeLIindex][0] - 27) + 'px'
    }, this.speed);
  };

  return Slider;

})();
