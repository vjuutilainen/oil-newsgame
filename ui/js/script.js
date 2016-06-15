(function ($) {
  var esivis = $('#esi-vis');
  var yleApp = {
    formatNr: function (x, addComma) {
      x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
      x = x.replace('.', ',');
      if (addComma === true && x.indexOf(',') === -1) {
        x = x + ',0';
      }
      return (x === '') ? 0 : x;
    },
    roundNr: function (x, d) {
      return parseFloat(x.toFixed(d));
    },
    getScale: function () {
      var width = esivis.width();
      if (width >= 578) {
        esivis.addClass('wide');
        return true;
      }
      if (width < 578) {
        esivis.removeClass('wide');
        return false;
      }
    },
    fixHeights: function () {
      $('.container', esivis).height($(window).height());
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    initNumbers: function (element, stop, duration, ease) {
      var start = parseInt(element.text().replace(/,/g, ''));
      $({value: start}).animate({value: stop}, {
        duration: duration == undefined ? 1000 : duration,
        easing: ease == undefined ? 'swing' : ease,
        step: function () {
          element.text(Math.floor(this.value));
          element.text(element.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 '));
        },
        complete: function () {
          if (parseInt(element.text()) !== stop) {
            element.text(stop);
            element.text(element.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 '));
          }
        }
      });
    },
    calculateAsset: function () {

      return yleApp.getRandomInt(50, 150); 
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
      // Start event.
      esivis.on('click', '.control.start', function (event) {
        $('.init_container', esivis).fadeOut(500);
        $('.game_container', esivis).fadeIn(1000);
      });
      // Sell event.
      esivis.on('click', '.control.buy', function (event) {
        yleApp.initNumbers($('.result_value', esivis), yleApp.calculateAsset(), 1000, 'swing');
        event.preventDefault();
      });
      // Buy event.
      esivis.on('click', '.control.sell', function (event) {
        yleApp.initNumbers($('.result_value', esivis), yleApp.calculateAsset(), 1000, 'swing');
        event.preventDefault();
      });
    },
    init: function () {
      yleApp.var = {};
      yleApp.var.asset = 1;
      yleApp.initEvents();
      yleApp.fixHeights();
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
