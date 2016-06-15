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
    setPath: function () {
      if (location.href.match('http://yle.fi/plus/yle')) {
        yleApp.path = 'http://yle.fi/plus/yle/2016/' + yleApp.projectName + '/';
      }
      else if (location.href.match('http://dev.yle.fi')) {
        yleApp.path = '2016/' + yleApp.projectName + '/';
      }
      else if (location.href.match('yle.fi')) {
        yleApp.path = 'http://yle.fi/plus/2016/' + yleApp.projectName + '/';
      }
      else {
        yleApp.path = '2016/' + yleApp.projectName + '/';
      }
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
    initMediaUrls: function () {
      $.each($('.handle_img', esivis), function (i, el) {
        $(this).attr('src', yleApp.path + 'img/' + $(this).attr('data-src'));
      });
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
    },
    init: function () {
      yleApp.projectName = '';
      yleApp.setPath();
      yleApp.getScale();
      yleApp.initMediaUrls();
      yleApp.initEvents();
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
