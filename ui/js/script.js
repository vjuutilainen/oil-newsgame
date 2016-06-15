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
      x = parseFloat(x);
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
    setPath: function () {
      if (location.href.match('http://yle.fi/')) {
        yleApp.path = 'http://yle.fi/plus/oil/';
        yleApp.php_path = 'http://alpha.yle.fi/plus/alpha/oil/';
      }
      else {
        yleApp.path = '/';
        yleApp.php_path = '/';
      }
    },
    initMediaUrls: function () {
      $.each($('.handle_img', esivis), function (i, el) {
        $(this).attr('src', yleApp.path + '' + $(this).attr('data-src'));
      });
    },
    fixHeights: function () {
      $('.container', esivis).height($(window).height());
    },
    initNumbers: function (element, stop, duration, ease) {
      var start = yleApp.roundNr(element.text(), 1);
      $({value: start}).animate({value: stop}, {
        duration: duration == undefined ? 1000 : duration,
        easing: ease == undefined ? 'swing' : ease,
        step: function () {
          element.text(yleApp.roundNr(this.value, 1));
          if (this.value > 0) {
            element.text('' + element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
          }
          else {
            element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
          } 
        },
        complete: function () {
          if (yleApp.roundNr(element.text(), 1) !== stop) {
            element.text(yleApp.roundNr(stop, 1));
            if (stop > 0) {
              element.text('' + element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
            }
            else {
              element.text(element.text().replace(/(\d)(?=(\d\d\d) + (?!\d))/g, '$1 '));
            }
          }
        }
      });
    },
    getCurrentPrice: function () {
      var price = yleApp.vis.getCurrentPrice();
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
          // console.log('Bought: ' + yleApp.var.lastPrice)
          // console.log('Sold: ' + current_price)
          // console.log('Assets: ' + yleApp.var.asset)
          yleApp.var.asset = yleApp.var.asset * ((current_price / yleApp.var.lastPrice) - 1) + yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Sell price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
          if (yleApp.var.eventIndex > 20) {
            $('.control', esivis).prop('disabled', true);
            yleApp.printResult();
          }
        }
        else if (action === 'buy') {
          // yleApp.var.asset = (yleApp.var.lastPrice / current_price) * yleApp.var.asset;
          $('<div>' + yleApp.var.eventIndex + '. Bought price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
        }
        yleApp.var.lastPrice = current_price;
        return yleApp.roundNr(yleApp.var.asset, 1);
      }
    },
    printResult: function () {
      var container = $('.result_wrapper', esivis).empty();
      yleApp.var.highscore.push(yleApp.var.asset);
      yleApp.var.highscore.sort().reverse();
      $('<h1>You multiplied your assets by ' + yleApp.roundNr(yleApp.var.asset, 1) + ' times.</h1>').appendTo(container);
      $('<p>Sed ultricies interdum nisi, non laoreet massa condimentum vitae. Ut at dignissim ligula. Nulla in vehicula turpis. Duis placerat erat vitae sapien interdum, at ornare lectus egestas. Suspendisse aliquam velit quis lacus mattis, vel pharetra erat euismod.</p>').appendTo(container);
      $('<h3>Top scores</h3>').appendTo(container);
      var list_container = $('<ol></ol>').appendTo(container);
      $.each(yleApp.var.highscore, function (i, highscore) {
        $('<li>' + yleApp.roundNr(highscore, 1) + ' times</li>').appendTo(list_container);
      });
      $('<button class="control play_again change_view button" data-show=".game_container" data-hide=".result_container"><div class="button_img_container"><img src="' + yleApp.path + 'ui/img/buy.png" class="button_img" /></div><div class="button_text">Play again</div></button>').appendTo(container);
      $('.game_container', esivis).fadeOut(500);
      $('.result_container', esivis).fadeIn(500);
    },
    counter: function () {
      $('.counter', esivis).text('3');
      $('.counter_container', esivis).show();
      setTimeout(function () {
        var interval = setInterval(function () {
          var value = parseInt($('.counter', esivis).text());
          if (value === 3) {
            $('.asset_container', esivis).fadeIn(500);
            $('.counter_text', esivis).text('Are you ready?');
            $('.counter', esivis).text(value - 1);
          }
          else if (value === 2) {
            $('.vis_container', esivis).fadeIn(500);
            $('.counter_text', esivis).text('Set!');
            $('.counter', esivis).text(value - 1);
          }
          else if (value === 1) {
            $('.controls_container .control', esivis).fadeIn(500);
            $('.counter_text', esivis).text('Buy!');
            $('.counter', esivis).text(value - 1);
          }
          else {
            clearInterval(interval);
            $('.counter', esivis).text('0');
            $('.counter_container', esivis).fadeOut(700);
            yleApp.vis.play();
          }
        }, 1500);
      }, 500);
    },
    getHighScores: function (update) {
      var get_parameter = (update === true) ? Date.now() / 1000 | 0 : '';
      $.ajax({
        dataType:'json',
        statusCode:{
          200: function (data) {
            yleApp.printHighScores(data);
          }
        },
        url:yleApp.php_path + 'php/get.php?timestamp=' + get_parameter,
        type:'GET'
      });
    },
    printHighScores: function (data) {
      var container = $('.highscores_wrapper', esivis).empty();
      $('<h3>All time high</h3>').appendTo(container);
      var list_container = $('<ol></ol>').appendTo(container);
      $.each(data, function (i, highscore) {
        $('<li>' + highscore.nickname + ': ' + yleApp.roundNr(highscore.score, 1) + ' times</li>').appendTo(list_container);
      });
    },
    postHighscore: function (data) {
      $.ajax({
        data:data,
        dataType:'json',
        statusCode:{
          200: function (data) {
            yleApp.getHighScores(true);
          }
        },
        url:yleApp.php_path + 'php/post.php',
        type:'POST'
      });
    },
    initEvents: function () {
      $(window).resize(function () {
        yleApp.getScale();
      });
      // Change view.
      esivis.on('click', '.control.change_view', function (event) {
        $($(this).data('hide'), esivis).fadeOut(500);
        $($(this).data('show'), esivis).fadeIn(1000);
      });
      // Init game.
      esivis.on('click', '.init_game', function (event) {
        yleApp.counter();
      });
      // Play again.
      esivis.on('click', '.play_again', function (event) {
        yleApp.destroy();
        yleApp.vis.restart();
        yleApp.counter();
      });
      // Sell event.
      esivis.on('click', '.control.buy', function (event) {
        yleApp.vis.sell();
        yleApp.calculateAsset('buy');
        $(this).removeClass('buy').addClass('sell').html('<div class="button_img_container"><img src="' + yleApp.path + 'ui/img/sell.png" class="button_img" /></div><div class="button_text">Sell oil</div>');
        event.preventDefault();
      });
      // Buy event.
      esivis.on('click', '.control.sell', function (event) {
        yleApp.vis.buy();
        yleApp.initNumbers($('.asset_value', esivis), yleApp.calculateAsset('sell'), 1000, 'swing');
        $(this).removeClass('sell').addClass('buy').html('<div class="button_img_container"><img src="' + yleApp.path + 'ui/img/buy.png" class="button_img" /></div><div class="button_text">Buy oil</div>');
        event.preventDefault();
      });
      esivis.on('click', '.submit', function (event) {
        yleApp.postHighscore({
          nickname:($('.nickname', esivis).val() === '') ? 'Anonymous' : $('.nickname', esivis).val(),
          score:yleApp.var.highscore.sort()[0]
        });
        $(this).prop('disabled', true).addClass('disabled');
        $(this).find('.button_text').text('Thank you!');
      });
    },
    destroy: function  (argument) {
      yleApp.var.asset = yleApp.roundNr(1, 1);
      yleApp.var.eventIndex = 0;
      yleApp.var.lastPrice = false;
      $('.container', esivis).scrollTop(0);
      $('.submit', esivis).prop('disabled', false).removeClass('disabled');
      $('.submit', esivis).find('.button_text').text('Submit score');
      $('.asset_value', esivis).text(yleApp.var.asset + '.0');
      $('.counter_text', esivis).text('On your mark!');
      $('.log_container', esivis).empty();
    },
    init: function () {
      yleApp.var = {};
      yleApp.var.highscore = [];
      yleApp.destroy();
      yleApp.initEvents();
      yleApp.setPath();
      yleApp.initMediaUrls();
      yleApp.fixHeights();
      yleApp.getHighScores();

      new Vis().init(function (vis) {
        yleApp.vis = vis;
      });
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
