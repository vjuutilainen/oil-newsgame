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
          element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
        },
        complete: function () {
          if (parseInt(element.text()) !== stop) {
            element.text(stop);
            element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
          }
        }
      });
    },
    getCurrentPrice: function () {
      var price = yleApp.getRandomInt(50, 150)
      return price;
    },
    calculateAsset: function (action) {
      yleApp.var.eventIndex++;
      // First action.
      var current_price = yleApp.getCurrentPrice();
      if (yleApp.var.lastPrice === false) {
        yleApp.var.lastPrice = current_price;
        $('<div>' + yleApp.var.eventIndex + '. First bought price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
      }
      // Rest of the actions.
      else {
        if (action === 'sell') {
          yleApp.var.asset = yleApp.var.asset * (((current_price / yleApp.var.lastPrice) - 1)) + yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Sell price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
        }
        else if (action === 'buy') {
          // yleApp.var.asset = (yleApp.var.lastPrice / current_price) * yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Bought price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
        }
        yleApp.var.lastPrice = current_price;
        return parseInt(yleApp.var.asset);
      }
    },
    initAsset: function () {
      $('.result_value', esivis).text(yleApp.var.asset);
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
      // Start event.
      esivis.on('click', '.control.start', function (event) {
        $($(this).data('hide'), esivis).fadeOut(500);
        $($(this).data('show'), esivis).fadeIn(1000);
      });
      // Sell event.
      esivis.on('click', '.control.buy', function (event) {
        yleApp.initNumbers($('.result_value', esivis), yleApp.calculateAsset('buy'), 1000, 'swing');
        $(this).removeClass('buy').addClass('sell').text('sell');
        event.preventDefault();
      });
      // Buy event.
      esivis.on('click', '.control.sell', function (event) {
        yleApp.initNumbers($('.result_value', esivis), yleApp.calculateAsset('sell'), 1000, 'swing');
        $(this).removeClass('sell').addClass('buy').text('buy');
        event.preventDefault();
      });
    },
    init: function () {
      yleApp.var = {};
      yleApp.var.asset = 100;
      yleApp.var.eventIndex = 0;
      yleApp.var.lastPrice = false;
      yleApp.initEvents();
      yleApp.fixHeights();
      yleApp.initAsset();
      new Vis().init();
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
