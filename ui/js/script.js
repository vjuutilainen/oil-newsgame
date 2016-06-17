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
      yleApp.fixHeights();
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
          yleApp.var.asset = yleApp.var.asset * (current_price / yleApp.var.lastPrice);
          $('<div>' + yleApp.var.eventIndex + '. Sell price ' + current_price + ' €</div>').prependTo($('.log_container', esivis));
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
      var info_container = $('.vis_container .info', esivis).empty();
      yleApp.var.highscore.push(yleApp.var.asset);
      yleApp.var.highscore.sort().reverse();
      $('<h1>Assets multiplied by ' + yleApp.roundNr(yleApp.var.asset, 1) + ' times.</h1><p>This was the history of crude oil prices from 1960 to the present day.</p>').appendTo(info_container);
      $('<h3 style="margin-top: 5px;">Share your result</h3>').appendTo(container);
      $('<div class="share_container"><div><a href="" class="twitter" title="Share on Twitter" target="_blank"><i class="fa fa-yle-some fa-twitter"></i></a></div></div>').appendTo(container);
      yleApp.updateSomeLinks(yleApp.var.highscore.sort().reverse()[0]);
      $('<h3>Your top 5 scores</h3>').appendTo(container);
      var list_container = $('<ol class="center"></ol>').appendTo(container);
      $.each(yleApp.var.highscore, function (i, highscore) {
        $('<li>' + yleApp.roundNr(highscore, 1) + ' times</li>').appendTo(list_container);
      });
      $('<button class="control play_again change_view button" data-show=".game_container" data-hide=".result_container"><div class="button_img_container"><img src="' + yleApp.path + 'ui/img/buy.png" class="button_img" /></div><div class="button_text">Play again</div></button>').appendTo(container);
      $('.controls_container, .feedback_container', esivis).hide();
      $('.result_container', esivis).fadeIn(500);
    },
    updateSomeLinks: function (highscore) {
      var url = window.location.href;

      // Twitter share.
      var twtext = 'I multiplied my assets by ' + yleApp.roundNr(highscore, 1) + ' times in the oil market! Try it yourself!';
      $('.twitter', '#esi-vis').attr({href: 'https://twitter.com/share?url=' + encodeURIComponent(url) + '&hashtags=' + encodeURIComponent('gensummit,oil') + '&text=' + encodeURIComponent(twtext)});
    },
    counter: function (restart) {
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
            $('.counter_text', esivis).text('Get set!');
            $('.counter', esivis).text(value - 1);
          }
          else if (value === 1) {
            $('.controls_container, .pause_container, .reload_container', esivis).fadeIn(500);
            $('.counter_text', esivis).text('Start buying!');
            $('.counter', esivis).text(value - 1);
          }
          else {
            clearInterval(interval);
            $('.counter', esivis).text('0');
            $('.counter_container', esivis).fadeOut(700);
            if (restart === true) {
              yleApp.vis.restart();
              yleApp.vis.play();
            }
            else {
              yleApp.vis.play();
            }
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
      $('<h3>All-time high scores</h3>').appendTo(container);
      var list_container = $('<ol class="center"></ol>').appendTo(container);
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
        yleApp.counter(false);
      });
      // Play again.
      esivis.on('click', '.play_again', function (event) {
        yleApp.destroy();
        yleApp.counter(true);
      });
      // Buy event.
      esivis.on('click', '.control.buy', function (event) {
        yleApp.var.buy = true;
        yleApp.vis.buy();
        yleApp.previousBuy = {
          date:yleApp.vis.getCurrentYear(),
          price:yleApp.vis.getCurrentPrice()
        }
        yleApp.calculateAsset('buy');
        $(this).removeClass('buy').addClass('sell').html('<div class="button_img_container"><img src="' + yleApp.path + 'ui/img/sell.png" class="button_img" /></div><div class="button_text">Sell oil</div>');
        event.preventDefault();
      });
      // Sell event.
      esivis.on('click', '.control.sell', function (event) {
        yleApp.var.buy = false;
        yleApp.vis.sell();
        yleApp.handleSell();
        yleApp.vis.stop();
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
      esivis.on('click', '.pause_container a', function (event) {
        if (!$(this).hasClass('disabled')) {
          if ($(this).hasClass('stop')) {
            $(this).addClass('play').removeClass('stop').html('<i class="fa fa-play"></i>');
            yleApp.vis.stop();
          }
          else {
            $(this).addClass('stop').removeClass('play').html('<i class="fa fa-pause"></i>');
            yleApp.vis.play();
          }          
        }
        event.preventDefault();
      });
    },
    handleSell: function () {
      var container = $('.feedback_container', esivis).empty().show().height($('.vis_container', esivis).height());
      $('.control', esivis).prop('disabled', true);
      $('.pause_container a, .reload_container a', esivis).addClass('disabled');
      var month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      if (yleApp.vis.getCurrentPrice() > yleApp.previousBuy.price) {
        $('<div><h1>Good job!</h1></div>').appendTo(container);
      }
      else {
        $('<div><h1>Scheiße!</h1></div>').appendTo(container);
      }
      $('<div><p>Bought at <span class="price">$' + yleApp.roundNr(yleApp.previousBuy.price, 1) + '</span><br />Sold at <span class="price">$' + yleApp.roundNr(yleApp.vis.getCurrentPrice(), 1) + '</span></p></div>').appendTo(container);
      setTimeout(function () {
        $('.feedback_container', esivis).fadeOut(300);
        $('.control', esivis).prop('disabled', false);
        $('.pause_container a, .reload_container a', esivis).removeClass('disabled');
        yleApp.vis.play();
      }, 3000);
    },
    handleEnd: function () {
      $('.pause_container, .reload_container', esivis).hide();
      $('.control', esivis).prop('disabled', true);
      if (yleApp.var.buy === true) {
        yleApp.vis.sell();
        yleApp.vis.stop();
        yleApp.initNumbers($('.asset_value', esivis), yleApp.calculateAsset('sell'), 1000, 'swing');
      }
      yleApp.printResult();
    },
    destroy: function  (argument) {
      yleApp.var.asset = yleApp.roundNr(1, 1);
      yleApp.var.eventIndex = 0;
      yleApp.var.lastPrice = false;
      $('.container', esivis).scrollTop(0);
      $('.control', esivis).prop('disabled', false);
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

      new Vis({
        onEnd:yleApp.handleEnd
      }).init(function (vis) {
        yleApp.vis = vis;
      });
    }
  };
  $(document).ready(function () {
    yleApp.init();
  });
})(jQuery);
